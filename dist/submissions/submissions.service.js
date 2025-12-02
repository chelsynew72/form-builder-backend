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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubmissionsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const bull_1 = require("@nestjs/bull");
const submission_schema_1 = require("./schemas/submission.schema");
const step_output_schema_1 = require("./schemas/step-output.schema");
let SubmissionsService = class SubmissionsService {
    submissionModel;
    stepOutputModel;
    pipelineQueue;
    constructor(submissionModel, stepOutputModel, pipelineQueue) {
        this.submissionModel = submissionModel;
        this.stepOutputModel = stepOutputModel;
        this.pipelineQueue = pipelineQueue;
    }
    async create(createSubmissionDto) {
        const submission = new this.submissionModel({
            ...createSubmissionDto,
            status: 'pending',
            submittedAt: new Date(),
        });
        const savedSubmission = await submission.save();
        console.log('✅ Submission created:', savedSubmission._id);
        await this.pipelineQueue.add('process-pipeline', {
            submissionId: savedSubmission._id.toString(),
            formId: savedSubmission.formId.toString(),
        });
        return savedSubmission;
    }
    async findAll(formId, query) {
        const { page = 1, limit = 20, status, search } = query;
        console.log('🔍 Finding submissions for formId:', formId);
        const filter = {
            formId: new mongoose_2.Types.ObjectId(formId)
        };
        if (status) {
            filter.status = status;
        }
        if (search) {
            filter.$or = [
                { 'data': { $regex: search, $options: 'i' } }
            ];
        }
        console.log('🔍 Query filter:', filter);
        const total = await this.submissionModel.countDocuments(filter);
        console.log('📊 Total submissions found:', total);
        const data = await this.submissionModel
            .find(filter)
            .sort({ submittedAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .exec();
        console.log('📊 Submissions returned:', data.length);
        return { data, total };
    }
    async findOne(id) {
        const submission = await this.submissionModel.findById(id).exec();
        if (!submission) {
            throw new common_1.NotFoundException('Submission not found');
        }
        const outputs = await this.stepOutputModel
            .find({ submissionId: new mongoose_2.Types.ObjectId(id) })
            .sort({ stepNumber: 1 })
            .exec();
        return { submission, outputs };
    }
    async updateStatus(id, status, errorMessage) {
        const update = { status };
        if (status === 'completed' || status === 'failed') {
            update.processedAt = new Date();
        }
        if (errorMessage) {
            update.errorMessage = errorMessage;
        }
        await this.submissionModel.updateOne({ _id: id }, update).exec();
    }
    async createStepOutput(stepOutput) {
        const output = new this.stepOutputModel(stepOutput);
        return output.save();
    }
    async delete(id) {
        await this.submissionModel.deleteOne({ _id: id }).exec();
        await this.stepOutputModel.deleteMany({ submissionId: new mongoose_2.Types.ObjectId(id) }).exec();
    }
};
exports.SubmissionsService = SubmissionsService;
exports.SubmissionsService = SubmissionsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(submission_schema_1.Submission.name)),
    __param(1, (0, mongoose_1.InjectModel)(step_output_schema_1.StepOutput.name)),
    __param(2, (0, bull_1.InjectQueue)('pipeline-processing')),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model, Object])
], SubmissionsService);
//# sourceMappingURL=submissions.service.js.map