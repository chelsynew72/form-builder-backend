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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var PipelineProcessor_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PipelineProcessor = void 0;
const bull_1 = require("@nestjs/bull");
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const ai_service_1 = require("../ai.service");
const submissions_service_1 = require("../../submissions/submissions.service");
const pipelines_service_1 = require("../../pipelines/pipelines.service");
const email_service_1 = require("../../email/email.service");
const submission_schema_1 = require("../../submissions/schemas/submission.schema");
const form_schema_1 = require("../../forms/schemas/form.schema");
const user_schema_1 = require("../../users/schemas/user.schema");
let PipelineProcessor = PipelineProcessor_1 = class PipelineProcessor {
    aiService;
    submissionsService;
    pipelinesService;
    emailService;
    submissionModel;
    formModel;
    userModel;
    logger = new common_1.Logger(PipelineProcessor_1.name);
    constructor(aiService, submissionsService, pipelinesService, emailService, submissionModel, formModel, userModel) {
        this.aiService = aiService;
        this.submissionsService = submissionsService;
        this.pipelinesService = pipelinesService;
        this.emailService = emailService;
        this.submissionModel = submissionModel;
        this.formModel = formModel;
        this.userModel = userModel;
    }
    async handlePipelineProcessing(job) {
        const { submissionId, formId } = job.data;
        this.logger.log(`Processing pipeline for submission: ${submissionId}`);
        let form;
        let user;
        try {
            await this.submissionsService.updateStatus(submissionId, 'processing');
            const submission = await this.submissionModel.findById(submissionId).exec();
            form = await this.formModel.findById(formId).exec();
            user = await this.userModel.findById(form.userId).exec();
            if (!submission) {
                throw new Error(`Submission not found: ${submissionId}`);
            }
            if (!form) {
                throw new Error(`Form not found: ${formId}`);
            }
            if (user && user.email) {
                const dashboardUrl = `${process.env.FRONTEND_URL || 'https://form-builder-client-pi.vercel.app/'}/forms/${formId}/submissions/${submissionId}`;
                await this.emailService.sendNewSubmissionNotification(user.email, form.name, submissionId, submission.data, dashboardUrl);
            }
            const pipeline = await this.pipelinesService.findByFormId(formId);
            if (!pipeline || !pipeline.steps || pipeline.steps.length === 0) {
                this.logger.warn(`No pipeline found or pipeline has no steps for form: ${formId}`);
                await this.submissionsService.updateStatus(submissionId, 'completed');
                if (user && user.email) {
                    const dashboardUrl = `${process.env.FRONTEND_URL || 'https://form-builder-client-pi.vercel.app/'}/forms/${formId}/submissions/${submissionId}`;
                    await this.emailService.sendProcessingCompleteNotification(user.email, form.name, submissionId, 0, dashboardUrl);
                }
                return;
            }
            const previousOutputs = [];
            for (const step of pipeline.steps) {
                const startTime = Date.now();
                this.logger.log(`Executing step ${step.stepNumber} for submission ${submissionId}`);
                const prompt = this.aiService.buildPrompt(step.prompt, submission.data, previousOutputs);
                const { text, tokenCount } = await this.aiService.generateResponse(prompt, step.model || 'gemini-1.5-pro');
                const duration = Date.now() - startTime;
                await this.submissionsService.createStepOutput({
                    submissionId: new mongoose_2.Types.ObjectId(submissionId),
                    stepNumber: step.stepNumber,
                    stepName: step.name,
                    prompt: prompt,
                    output: text,
                    tokenCount,
                    duration,
                    model: step.model || 'gemini-1.5-pro',
                    executedAt: new Date(),
                });
                previousOutputs.push({
                    stepNumber: step.stepNumber,
                    output: text,
                });
                this.logger.log(`Completed step ${step.stepNumber} in ${duration}ms`);
            }
            await this.submissionsService.updateStatus(submissionId, 'completed');
            this.logger.log(`Pipeline processing completed for submission: ${submissionId}`);
            if (user && user.email) {
                const dashboardUrl = `${process.env.FRONTEND_URL || 'https://form-builder-client-pi.vercel.app/'}/forms/${formId}/submissions/${submissionId}`;
                await this.emailService.sendProcessingCompleteNotification(user.email, form.name, submissionId, pipeline.steps.length, dashboardUrl);
            }
        }
        catch (error) {
            this.logger.error(`Pipeline processing failed for submission ${submissionId}:`, error);
            await this.submissionsService.updateStatus(submissionId, 'failed', error.message);
            if (user && user.email) {
                const dashboardUrl = `${process.env.FRONTEND_URL || 'https://form-builder-client-pi.vercel.app/'}/forms/${formId}/submissions/${submissionId}`;
                await this.emailService.sendProcessingFailedNotification(user.email, form.name, submissionId, error.message, dashboardUrl);
            }
            throw error;
        }
    }
};
exports.PipelineProcessor = PipelineProcessor;
__decorate([
    (0, bull_1.Process)('process-pipeline'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PipelineProcessor.prototype, "handlePipelineProcessing", null);
exports.PipelineProcessor = PipelineProcessor = PipelineProcessor_1 = __decorate([
    (0, bull_1.Processor)('pipeline-processing'),
    (0, common_1.Injectable)(),
    __param(4, (0, mongoose_1.InjectModel)(submission_schema_1.Submission.name)),
    __param(5, (0, mongoose_1.InjectModel)(form_schema_1.Form.name)),
    __param(6, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [ai_service_1.AiService,
        submissions_service_1.SubmissionsService,
        pipelines_service_1.PipelinesService,
        email_service_1.EmailService,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], PipelineProcessor);
//# sourceMappingURL=pipeline.processor.js.map