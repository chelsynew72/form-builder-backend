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
exports.SubmissionSchema = exports.Submission = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let Submission = class Submission extends mongoose_2.Document {
    formId;
    data;
    status;
    ipAddress;
    userAgent;
    errorMessage;
    submittedAt;
    processedAt;
};
exports.Submission = Submission;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Form', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Submission.prototype, "formId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object, required: true }),
    __metadata("design:type", Object)
], Submission.prototype, "data", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        enum: ['pending', 'processing', 'completed', 'failed'],
        default: 'pending'
    }),
    __metadata("design:type", String)
], Submission.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Submission.prototype, "ipAddress", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Submission.prototype, "userAgent", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Submission.prototype, "errorMessage", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: Date.now }),
    __metadata("design:type", Date)
], Submission.prototype, "submittedAt", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Submission.prototype, "processedAt", void 0);
exports.Submission = Submission = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Submission);
exports.SubmissionSchema = mongoose_1.SchemaFactory.createForClass(Submission);
exports.SubmissionSchema.index({ formId: 1, submittedAt: -1 });
//# sourceMappingURL=submission.schema.js.map