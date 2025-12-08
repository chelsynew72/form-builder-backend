import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI } from '@google/generative-ai';

@Injectable()
export class AiService {
  private genAI: GoogleGenerativeAI;
  private defaultModel: string;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('GOOGLE_API_KEY');
    if (!apiKey) {
      throw new Error('Missing required environment variable: GOOGLE_API_KEY');
    }
    
    // Use the latest free flash model
    this.defaultModel = this.configService.get<string>('GEMINI_MODEL') || 'gemini-2.5-flash';
    console.log(`🤖 AI Service initialized with model: ${this.defaultModel}`);
    
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  async generateResponse(
    prompt: string,
    model?: string,
  ): Promise<{
    text: string;
    tokenCount: number;
  }> {
    const modelToUse = model || this.defaultModel;
    
    try {
      console.log(`🤖 Using model: ${modelToUse}`);
      const geminiModel = this.genAI.getGenerativeModel({ model: modelToUse });

      const result = await geminiModel.generateContent(prompt);
      const response = result.response;
      const text = response.text();

      const tokenCount =
        (response.usageMetadata?.promptTokenCount || 0) +
        (response.usageMetadata?.candidatesTokenCount || 0);

      console.log(`✅ AI response generated (${tokenCount} tokens)`);

      return {
        text,
        tokenCount,
      };
    } catch (error) {
      console.error('❌ Gemini API Error:', error);
      throw new Error(`AI generation failed: ${error.message}`);
    }
  }

  buildPrompt(
    stepPrompt: string,
    formData: Record<string, any>,
    previousOutputs: Array<{ stepNumber: number; output: string }>,
  ): string {
    let prompt = stepPrompt;

    Object.keys(formData).forEach((key) => {
      const regex = new RegExp(`\\{${key}\\}`, 'g');
      prompt = prompt.replace(regex, formData[key]);
    });

    const allFieldsText = Object.entries(formData)
      .map(([key, value]) => `${key}: ${value}`)
      .join('\n');
    prompt = prompt.replace(/\{all_fields\}/g, allFieldsText);

    previousOutputs.forEach(({ stepNumber, output }) => {
      const regex = new RegExp(`\\{step_${stepNumber}_output\\}`, 'g');
      prompt = prompt.replace(regex, output);
    });

    return prompt;
  }
}