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
exports.FormSchema = exports.Form = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let Form = class Form extends mongoose_2.Document {
    userId;
    name;
    description;
    fields;
    publicId;
    isActive;
    submissionCount;
    createdAt;
    updatedAt;
};
exports.Form = Form;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Form.prototype, "userId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Form.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Form.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [Object], default: [] }),
    __metadata("design:type", Array)
], Form.prototype, "fields", void 0);
__decorate([
    (0, mongoose_1.Prop)({ unique: true, required: true }),
    __metadata("design:type", String)
], Form.prototype, "publicId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], Form.prototype, "isActive", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Form.prototype, "submissionCount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: Date.now }),
    __metadata("design:type", Date)
], Form.prototype, "createdAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: Date.now }),
    __metadata("design:type", Date)
], Form.prototype, "updatedAt", void 0);
exports.Form = Form = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Form);
exports.FormSchema = mongoose_1.SchemaFactory.createForClass(Form);
//# sourceMappingURL=form.schema.js.map