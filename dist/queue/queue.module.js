"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueueModule = void 0;
const common_1 = require("@nestjs/common");
const bull_1 = require("@nestjs/bull");
const mongoose_1 = require("@nestjs/mongoose");
const pipeline_processor_1 = require("../ai/processors/pipeline.processor");
const ai_module_1 = require("../ai/ai.module");
const submissions_module_1 = require("../submissions/submissions.module");
const pipelines_module_1 = require("../pipelines/pipelines.module");
const email_module_1 = require("../email/email.module");
const submission_schema_1 = require("../submissions/schemas/submission.schema");
const form_schema_1 = require("../forms/schemas/form.schema");
const user_schema_1 = require("../users/schemas/user.schema");
let QueueModule = class QueueModule {
};
exports.QueueModule = QueueModule;
exports.QueueModule = QueueModule = __decorate([
    (0, common_1.Module)({
        imports: [
            bull_1.BullModule.registerQueue({
                name: 'pipeline-processing',
            }),
            mongoose_1.MongooseModule.forFeature([
                { name: submission_schema_1.Submission.name, schema: submission_schema_1.SubmissionSchema },
                { name: form_schema_1.Form.name, schema: form_schema_1.FormSchema },
                { name: user_schema_1.User.name, schema: user_schema_1.UserSchema },
            ]),
            ai_module_1.AiModule,
            submissions_module_1.SubmissionsModule,
            pipelines_module_1.PipelinesModule,
            email_module_1.EmailModule,
        ],
        providers: [pipeline_processor_1.PipelineProcessor],
        exports: [bull_1.BullModule],
    })
], QueueModule);
//# sourceMappingURL=queue.module.js.map