import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI } from '@google/generative-ai';

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private genAI: GoogleGenerativeAI;
  private defaultModel: string;
  
  // Model fallback chain - from fastest/cheapest to most capable
  private readonly modelFallbackChain = [
    'gemini-2.0-flash-exp',
    'gemini-1.5-flash',
    'gemini-1.5-flash-8b',
    'gemini-1.5-pro',
  ];

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('GOOGLE_API_KEY');
    if (!apiKey) {
      throw new Error('Missing required environment variable: GOOGLE_API_KEY');
    }
    
    this.defaultModel = this.configService.get<string>('GEMINI_MODEL') || 'gemini-2.0-flash-exp';
    this.logger.log(`🤖 AI Service initialized with default model: ${this.defaultModel}`);
    
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  /**
   * Generate AI response with automatic retry and model fallback
   */
  async generateResponse(
    prompt: string,
    model?: string,
  ): Promise<{
    text: string;
    tokenCount: number;
    modelUsed: string;
    retries: number;
  }> {
    const requestedModel = model || this.defaultModel;
    
    // Try requested model first with retries
    const result = await this.generateWithRetryAndFallback(prompt, requestedModel);
    
    return result;
  }

  /**
   * Core method that implements retry logic with exponential backoff and model fallback
   */
  private async generateWithRetryAndFallback(
    prompt: string,
    initialModel: string,
  ): Promise<{
    text: string;
    tokenCount: number;
    modelUsed: string;
    retries: number;
  }> {
    // Build fallback chain starting with requested model
    const modelsToTry = [
      initialModel,
      ...this.modelFallbackChain.filter(m => m !== initialModel)
    ];

    let lastError: Error | null = null;
    let totalRetries = 0;

    // Try each model in the fallback chain
    for (const modelToUse of modelsToTry) {
      const maxRetriesPerModel = 3;
      
      for (let attempt = 0; attempt < maxRetriesPerModel; attempt++) {
        try {
          this.logger.log(`🤖 Attempting model: ${modelToUse} (attempt ${attempt + 1}/${maxRetriesPerModel})`);
          
          const geminiModel = this.genAI.getGenerativeModel({ model: modelToUse });
          const result = await geminiModel.generateContent(prompt);
          const response = result.response;
          const text = response.text();

          const tokenCount =
            (response.usageMetadata?.promptTokenCount || 0) +
            (response.usageMetadata?.candidatesTokenCount || 0);

          this.logger.log(`✅ Success with ${modelToUse} (${tokenCount} tokens, ${totalRetries} total retries)`);

          return {
            text,
            tokenCount,
            modelUsed: modelToUse,
            retries: totalRetries,
          };

        } catch (error) {
          totalRetries++;
          lastError = error;
          
          const isRetryable = this.isRetryableError(error);
          const isLastAttempt = attempt === maxRetriesPerModel - 1;
          const isLastModel = modelToUse === modelsToTry[modelsToTry.length - 1];

          this.logger.warn(
            `❌ Attempt ${attempt + 1} failed for ${modelToUse}: ${error.message} ` +
            `(Status: ${error.status}, Retryable: ${isRetryable})`
          );

          // If it's a retryable error and not the last attempt for this model, wait and retry
          if (isRetryable && !isLastAttempt) {
            const delayMs = this.calculateBackoff(attempt);
            this.logger.log(`⏳ Waiting ${delayMs}ms before retry...`);
            await this.sleep(delayMs);
            continue;
          }

          // If not retryable or last attempt, move to next model
          if (!isLastModel) {
            this.logger.log(`🔄 Switching to fallback model...`);
            break;
          }
        }
      }
    }

    // All models and retries exhausted
    this.logger.error(`💥 All models exhausted after ${totalRetries} total retries`);
    throw new Error(
      `AI generation failed after trying ${modelsToTry.length} models with ${totalRetries} retries. ` +
      `Last error: ${lastError?.message || 'Unknown error'}`
    );
  }

  /**
   * Determine if an error is retryable
   */
  private isRetryableError(error: any): boolean {
    // Retry on 503 (service unavailable/overloaded)
    if (error.status === 503) return true;
    
    // Retry on 429 (rate limit)
    if (error.status === 429) return true;
    
    // Retry on 500 (internal server error)
    if (error.status === 500) return true;
    
    // Retry on network/timeout errors
    if (error.message?.includes('timeout')) return true;
    if (error.message?.includes('ECONNREFUSED')) return true;
    if (error.message?.includes('ETIMEDOUT')) return true;
    
    // Don't retry on 400 (bad request) or 401/403 (auth issues)
    return false;
  }

  /**
   * Calculate exponential backoff delay with jitter
   */
  private calculateBackoff(attempt: number): number {
    // Base delay: 1s, 2s, 4s
    const baseDelay = Math.min(1000 * Math.pow(2, attempt), 10000);
    
    // Add jitter (±20%) to prevent thundering herd
    const jitter = baseDelay * 0.2 * (Math.random() - 0.5);
    
    return Math.floor(baseDelay + jitter);
  }

  /**
   * Sleep utility
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Build prompt with form data and previous outputs
   */
  buildPrompt(
    stepPrompt: string,
    formData: Record<string, any>,
    previousOutputs: Array<{ stepNumber: number; output: string }>,
  ): string {
    let prompt = stepPrompt;

    // Replace individual field placeholders
    Object.keys(formData).forEach((key) => {
      const regex = new RegExp(`\\{${key}\\}`, 'g');
      prompt = prompt.replace(regex, String(formData[key] || ''));
    });

    // Replace {all_fields} placeholder
    const allFieldsText = Object.entries(formData)
      .map(([key, value]) => `${key}: ${value}`)
      .join('\n');
    prompt = prompt.replace(/\{all_fields\}/g, allFieldsText);

    // Replace previous step outputs
    previousOutputs.forEach(({ stepNumber, output }) => {
      const regex = new RegExp(`\\{step_${stepNumber}_output\\}`, 'g');
      prompt = prompt.replace(regex, output);
    });

    return prompt;
  }
}