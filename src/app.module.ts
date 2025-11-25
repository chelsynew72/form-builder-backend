
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

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        redis: {
          host: configService.get<string>('REDIS_HOST'),
          port: configService.get<number>('REDIS_PORT'),
        },
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UsersModule,
    FormsModule,
    PipelinesModule,
    SubmissionsModule,
    AiModule,
    QueueModule,
  ],
})
export class AppModule {}