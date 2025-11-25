import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI } from '@google/generative-ai';

@Injectable()
export class AiService {
  private genAI: GoogleGenerativeAI;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('GOOGLE_API_KEY');
    if (!apiKey) {
      throw new Error('Missing required environment variable: GOOGLE_API_KEY');
    }
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  async generateResponse(
    prompt: string,
    model: string = 'gemini-1.5-pro',
  ): Promise<{
    text: string;
    tokenCount: number;
  }> {
    try {
      const geminiModel = this.genAI.getGenerativeModel({ model });

      const result = await geminiModel.generateContent(prompt);
      const response = result.response;
      const text = response.text();

      // Gemini provides token usage in metadata
      const tokenCount =
        (response.usageMetadata?.promptTokenCount || 0) +
        (response.usageMetadata?.candidatesTokenCount || 0);

      return {
        text,
        tokenCount,
      };
    } catch (error) {
      console.error('Gemini API Error:', error);
      throw new Error(`AI generation failed: ${error.message}`);
    }
  }

  buildPrompt(
    stepPrompt: string,
    formData: Record<string, any>,
    previousOutputs: Array<{ stepNumber: number; output: string }>,
  ): string {
    let prompt = stepPrompt;

    // Replace form field variables: {field_name}
    Object.keys(formData).forEach((key) => {
      const regex = new RegExp(`\\{${key}\\}`, 'g');
      prompt = prompt.replace(regex, formData[key]);
    });

    // Replace {all_fields}
    const allFieldsText = Object.entries(formData)
      .map(([key, value]) => `${key}: ${value}`)
      .join('\n');
    prompt = prompt.replace(/\{all_fields\}/g, allFieldsText);

    // Replace step output variables: {step_1_output}, {step_2_output}, etc.
    previousOutputs.forEach(({ stepNumber, output }) => {
      const regex = new RegExp(`\\{step_${stepNumber}_output\\}`, 'g');
      prompt = prompt.replace(regex, output);
    });

    return prompt;
  }
}