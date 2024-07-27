import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisService } from './redis.service';
import { JobProcessor } from './job.processor';
import { JobController } from './job.controller';
import { JobService } from './job.service';

@Module({
  controllers: [JobController],
  imports: [
    ConfigModule.forRoot(),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        redis: {
          host: configService.get<string>('REDIS_HOST'),
          port: configService.get<number>('REDIS_PORT'),
        },
      }),
    }),
    BullModule.registerQueue({
      name: 'jobQueue',
    }),
  ],
  providers: [JobProcessor, RedisService, JobService],
  exports: [RedisService, JobService],
})
export class CrtBullModule {}
