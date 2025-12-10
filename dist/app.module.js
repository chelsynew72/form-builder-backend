"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const mongoose_1 = require("@nestjs/mongoose");
const bull_1 = require("@nestjs/bull");
const auth_module_1 = require("./auth/auth.module");
const users_module_1 = require("./users/users.module");
const forms_module_1 = require("./forms/forms.module");
const pipelines_module_1 = require("./pipelines/pipelines.module");
const submissions_module_1 = require("./submissions/submissions.module");
const ai_module_1 = require("./ai/ai.module");
const queue_module_1 = require("./queue/queue.module");
const email_module_1 = require("./email/email.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            mongoose_1.MongooseModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: async (configService) => ({
                    uri: configService.get('MONGODB_URI'),
                }),
                inject: [config_1.ConfigService],
            }),
            bull_1.BullModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: async (configService) => {
                    const redisUrl = configService.get('REDIS_URL');
                    if (redisUrl) {
                        console.log('🔴 Connecting to Redis via REDIS_URL');
                        return {
                            redis: redisUrl,
                        };
                    }
                    const host = configService.get('REDIS_HOST', 'localhost');
                    const port = parseInt(configService.get('REDIS_PORT', '6379'));
                    const password = configService.get('REDIS_PASSWORD');
                    const useTLS = configService.get('REDIS_TLS') === 'true';
                    console.log(`🔴 Connecting to Redis at ${host}:${port} (TLS: ${useTLS})`);
                    return {
                        redis: {
                            host,
                            port,
                            password,
                            tls: useTLS ? {} : undefined,
                        },
                    };
                },
                inject: [config_1.ConfigService],
            }),
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            forms_module_1.FormsModule,
            pipelines_module_1.PipelinesModule,
            submissions_module_1.SubmissionsModule,
            ai_module_1.AiModule,
            queue_module_1.QueueModule,
            email_module_1.EmailModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map