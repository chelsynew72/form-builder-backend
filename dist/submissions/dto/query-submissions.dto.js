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
exports.QuerySubmissionsDto = exports.SubmissionStatus = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
var SubmissionStatus;
(function (SubmissionStatus) {
    SubmissionStatus["PENDING"] = "pending";
    SubmissionStatus["PROCESSING"] = "processing";
    SubmissionStatus["COMPLETED"] = "completed";
    SubmissionStatus["FAILED"] = "failed";
})(SubmissionStatus || (exports.SubmissionStatus = SubmissionStatus = {}));
class QuerySubmissionsDto {
    page = 1;
    limit = 20;
    status;
    search;
    startDate;
    endDate;
    sortBy = 'submittedAt';
    sortOrder = 'desc';
}
exports.QuerySubmissionsDto = QuerySubmissionsDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], QuerySubmissionsDto.prototype, "page", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], QuerySubmissionsDto.prototype, "limit", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(SubmissionStatus),
    __metadata("design:type", String)
], QuerySubmissionsDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], QuerySubmissionsDto.prototype, "search", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], QuerySubmissionsDto.prototype, "startDate", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], QuerySubmissionsDto.prototype, "endDate", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(['submittedAt', 'processedAt', 'status']),
    __metadata("design:type", String)
], QuerySubmissionsDto.prototype, "sortBy", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(['asc', 'desc']),
    __metadata("design:type", String)
], QuerySubmissionsDto.prototype, "sortOrder", void 0);
//# sourceMappingURL=query-submissions.dto.js.map