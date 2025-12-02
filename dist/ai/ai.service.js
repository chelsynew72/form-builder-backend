"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const generative_ai_1 = require("@google/generative-ai");
let AiService = class AiService {
    configService;
    genAI;
    defaultModel;
    constructor(configService) {
        this.configService = configService;
        const apiKey = this.configService.get('GOOGLE_API_KEY');
        if (!apiKey) {
            throw new Error('Missing required environment variable: GOOGLE_API_KEY');
        }
        this.defaultModel = this.configService.get('GEMINI_MODEL') || 'gemini-2.5-flash';
        console.log(`🤖 AI Service initialized with model: ${this.defaultModel}`);
        this.genAI = new generative_ai_1.GoogleGenerativeAI(apiKey);
    }
    async generateResponse(prompt, model) {
        const modelToUse = model || this.defaultModel;
        try {
            console.log(`🤖 Using model: ${modelToUse}`);
            const geminiModel = this.genAI.getGenerativeModel({ model: modelToUse });
            const result = await geminiModel.generateContent(prompt);
            const response = result.response;
            const text = response.text();
            const tokenCount = (response.usageMetadata?.promptTokenCount || 0) +
                (response.usageMetadata?.candidatesTokenCount || 0);
            console.log(`✅ AI response generated (${tokenCount} tokens)`);
            return {
                text,
                tokenCount,
            };
        }
        catch (error) {
            console.error('❌ Gemini API Error:', error);
            throw new Error(`AI generation failed: ${error.message}`);
        }
    }
    buildPrompt(stepPrompt, formData, previousOutputs) {
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
};
exports.AiService = AiService;
exports.AiService = AiService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], AiService);
//# sourceMappingURL=ai.service.js.map