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
exports.PipelinesService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const pipeline_schema_1 = require("./schemas/pipeline.schema");
let PipelinesService = class PipelinesService {
    pipelineModel;
    constructor(pipelineModel) {
        this.pipelineModel = pipelineModel;
    }
    async createOrUpdate(createPipelineDto) {
        const { formId, ...pipelineData } = createPipelineDto;
        const pipeline = await this.pipelineModel.findOneAndUpdate({ formId: new mongoose_2.Types.ObjectId(formId) }, { formId: new mongoose_2.Types.ObjectId(formId), ...pipelineData }, {
            new: true,
            upsert: true,
        }).exec();
        console.log('✅ Pipeline saved for formId:', formId);
        return pipeline;
    }
    async findByFormId(formId) {
        console.log('🔍 Finding pipeline for formId:', formId);
        const pipeline = await this.pipelineModel
            .findOne({ formId: new mongoose_2.Types.ObjectId(formId) })
            .exec();
        console.log('📋 Pipeline found:', pipeline ? 'YES' : 'NO');
        return pipeline;
    }
    async update(formId, updatePipelineDto) {
        const pipeline = await this.pipelineModel
            .findOneAndUpdate({ formId: new mongoose_2.Types.ObjectId(formId) }, updatePipelineDto, { new: true, upsert: true })
            .exec();
        return pipeline;
    }
    async delete(formId) {
        await this.pipelineModel
            .deleteOne({ formId: new mongoose_2.Types.ObjectId(formId) })
            .exec();
    }
};
exports.PipelinesService = PipelinesService;
exports.PipelinesService = PipelinesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(pipeline_schema_1.Pipeline.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], PipelinesService);
//# sourceMappingURL=pipelines.service.js.map