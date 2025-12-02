import { ConfigService } from '@nestjs/config';
export declare class AiService {
    private configService;
    private genAI;
    private defaultModel;
    constructor(configService: ConfigService);
    generateResponse(prompt: string, model?: string): Promise<{
        text: string;
        tokenCount: number;
    }>;
    buildPrompt(stepPrompt: string, formData: Record<string, any>, previousOutputs: Array<{
        stepNumber: number;
        output: string;
    }>): string;
}
