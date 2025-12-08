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
exports.SubmissionsController = void 0;
const common_1 = require("@nestjs/common");
const submissions_service_1 = require("./submissions.service");
const forms_service_1 = require("../forms/forms.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const query_submissions_dto_1 = require("./dto/query-submissions.dto");
let SubmissionsController = class SubmissionsController {
    submissionsService;
    formsService;
    constructor(submissionsService, formsService) {
        this.submissionsService = submissionsService;
        this.formsService = formsService;
    }
    test() {
        return { message: 'Submissions controller is working!' };
    }
    async create(createSubmissionDto, ip, userAgent) {
        console.log('📝 Received submission:', createSubmissionDto);
        try {
            const form = await this.formsService.findByPublicId(createSubmissionDto.formId);
            console.log('✅ Form found:', form._id);
            const submission = await this.submissionsService.create({
                formId: form._id,
                data: createSubmissionDto.data,
                ipAddress: ip,
                userAgent,
            });
            console.log('✅ Submission created:', submission._id);
            await this.formsService.incrementSubmissionCount(form._id.toString());
            return {
                success: true,
                data: {
                    submissionId: submission._id.toString(),
                },
                message: 'Form submitted successfully. Processing started.'
            };
        }
        catch (error) {
            console.error('❌ Submission error:', error);
            throw error;
        }
    }
    findAll(formId, query) {
        console.log('📥 Received request for formId:', formId);
        return this.submissionsService.findAll(formId, query);
    }
    findOne(id) {
        return this.submissionsService.findOne(id);
    }
    delete(id) {
        return this.submissionsService.delete(id);
    }
};
exports.SubmissionsController = SubmissionsController;
__decorate([
    (0, common_1.Get)('test'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SubmissionsController.prototype, "test", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Ip)()),
    __param(2, (0, common_1.Headers)('user-agent')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], SubmissionsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('form/:formId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('formId')),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, query_submissions_dto_1.QuerySubmissionsDto]),
    __metadata("design:returntype", void 0)
], SubmissionsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SubmissionsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SubmissionsController.prototype, "delete", null);
exports.SubmissionsController = SubmissionsController = __decorate([
    (0, common_1.Controller)('submissions'),
    __metadata("design:paramtypes", [submissions_service_1.SubmissionsService,
        forms_service_1.FormsService])
], SubmissionsController);
//# sourceMappingURL=submissions.controller.js.map