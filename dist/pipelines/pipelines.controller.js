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
exports.PipelinesController = void 0;
const common_1 = require("@nestjs/common");
const pipelines_service_1 = require("./pipelines.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const create_pipeline_dto_1 = require("./dto/create-pipeline.dto");
const update_pipeline_dto_1 = require("./dto/update-pipeline.dto");
let PipelinesController = class PipelinesController {
    pipelinesService;
    constructor(pipelinesService) {
        this.pipelinesService = pipelinesService;
    }
    createOrUpdate(createPipelineDto) {
        return this.pipelinesService.createOrUpdate(createPipelineDto);
    }
    findByFormId(formId) {
        return this.pipelinesService.findByFormId(formId);
    }
    update(formId, updatePipelineDto) {
        return this.pipelinesService.update(formId, updatePipelineDto);
    }
    delete(formId) {
        return this.pipelinesService.delete(formId);
    }
};
exports.PipelinesController = PipelinesController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_pipeline_dto_1.CreatePipelineDto]),
    __metadata("design:returntype", void 0)
], PipelinesController.prototype, "createOrUpdate", null);
__decorate([
    (0, common_1.Get)('form/:formId'),
    __param(0, (0, common_1.Param)('formId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PipelinesController.prototype, "findByFormId", null);
__decorate([
    (0, common_1.Put)('form/:formId'),
    __param(0, (0, common_1.Param)('formId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_pipeline_dto_1.UpdatePipelineDto]),
    __metadata("design:returntype", void 0)
], PipelinesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)('form/:formId'),
    __param(0, (0, common_1.Param)('formId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PipelinesController.prototype, "delete", null);
exports.PipelinesController = PipelinesController = __decorate([
    (0, common_1.Controller)('pipelines'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [pipelines_service_1.PipelinesService])
], PipelinesController);
//# sourceMappingURL=pipelines.controller.js.map