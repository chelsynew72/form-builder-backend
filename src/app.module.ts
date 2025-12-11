import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { BullModule } from '@nestjs/bull';

import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { FormsModule } from './forms/forms.module';
import { PipelinesModule } from './pipelines/pipelines.module';
import { SubmissionsModule } from './submissions/submissions.module';
import { AiModule } from './ai/ai.module';
import { QueueModule } from './queue/queue.module';
import { EmailModule } from './email/email.module';

@Module({
  imports: [
    // Global Config
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // MongoDB
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI')!,
      }),
      inject: [ConfigService],
    }),

    // Bull / Redis Cloud (Non-TLS)
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        redis: {
          host: configService.get<string>('REDIS_HOST')!,
          port: Number(configService.get<string>('REDIS_PORT')!),
          password: configService.get<string>('REDIS_PASSWORD')!,
         
        },
      }),
      inject: [ConfigService],
    }),

    // App Modules
    AuthModule,
    UsersModule,
    FormsModule,
    PipelinesModule,
    SubmissionsModule,
    AiModule,
    QueueModule,
    EmailModule,
  ],
})
export class AppModule {}
