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
        uri: configService.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),

    // Redis / Bull Queue
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const redisUrl = configService.get('REDIS_URL');

        // If REDIS_URL exists — use it (good for Upstash, Redis Cloud, Vercel)
        if (redisUrl) {
          console.log('🔴 Connecting to Redis via REDIS_URL');
          return {
            redis: redisUrl,
          };
        }

        // Otherwise use host/port/password
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
