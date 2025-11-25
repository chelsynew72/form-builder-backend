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
exports.StepOutputSchema = exports.StepOutput = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let StepOutput = class StepOutput {
    submissionId;
    stepNumber;
    stepName;
    prompt;
    output;
    tokenCount;
    duration;
    model;
    executedAt;
};
exports.StepOutput = StepOutput;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Submission', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], StepOutput.prototype, "submissionId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], StepOutput.prototype, "stepNumber", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], StepOutput.prototype, "stepName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], StepOutput.prototype, "prompt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, type: String }),
    __metadata("design:type", String)
], StepOutput.prototype, "output", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], StepOutput.prototype, "tokenCount", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], StepOutput.prototype, "duration", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], StepOutput.prototype, "model", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: Date.now }),
    __metadata("design:type", Date)
], StepOutput.prototype, "executedAt", void 0);
exports.StepOutput = StepOutput = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], StepOutput);
exports.StepOutputSchema = mongoose_1.SchemaFactory.createForClass(StepOutput);
exports.StepOutputSchema.index({ submissionId: 1, stepNumber: 1 });
//# sourceMappingURL=step-output.schema.js.map