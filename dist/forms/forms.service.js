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
exports.FormsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const form_schema_1 = require("./schemas/form.schema");
const nanoid_1 = require("nanoid");
let FormsService = class FormsService {
    formModel;
    constructor(formModel) {
        this.formModel = formModel;
    }
    async create(userId, createFormDto) {
        const publicId = (0, nanoid_1.nanoid)(10);
        const form = new this.formModel({
            ...createFormDto,
            userId,
            publicId,
        });
        return form.save();
    }
    async findAll(userId) {
        return this.formModel.find({ userId }).sort({ createdAt: -1 }).exec();
    }
    async findOne(id, userId) {
        const form = await this.formModel.findOne({ _id: id, userId }).exec();
        if (!form) {
            throw new common_1.NotFoundException('Form not found');
        }
        return form;
    }
    async findByPublicId(publicId) {
        const form = await this.formModel.findOne({ publicId, isActive: true }).exec();
        if (!form) {
            throw new common_1.NotFoundException('Form not found');
        }
        return form;
    }
    async update(id, userId, updateFormDto) {
        const form = await this.formModel
            .findOneAndUpdate({ _id: id, userId }, updateFormDto, { new: true })
            .exec();
        if (!form) {
            throw new common_1.NotFoundException('Form not found');
        }
        return form;
    }
    async delete(id, userId) {
        const result = await this.formModel.deleteOne({ _id: id, userId }).exec();
        if (result.deletedCount === 0) {
            throw new common_1.NotFoundException('Form not found');
        }
    }
    async incrementSubmissionCount(formId) {
        await this.formModel.updateOne({ _id: formId }, { $inc: { submissionCount: 1 } }).exec();
    }
};
exports.FormsService = FormsService;
exports.FormsService = FormsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(form_schema_1.Form.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], FormsService);
//# sourceMappingURL=forms.service.js.map