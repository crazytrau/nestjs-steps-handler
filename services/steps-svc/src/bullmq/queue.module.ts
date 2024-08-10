// queue.module.ts
import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { JobProcessorService } from './job-processor.service';
import { BullController } from './bullmq.controller';
import { JobProducerService } from './job-producer.service';

@Module({
  controllers: [BullController],
  imports: [
    BullModule.forRoot({
      connection: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT),
      },
    }),
    BullModule.registerQueue({
      name: 'jobs',
    }),
  ],
  providers: [JobProcessorService, JobProducerService],
})
export class QueueModule {}
