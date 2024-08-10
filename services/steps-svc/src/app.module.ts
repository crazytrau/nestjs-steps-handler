// app.module.ts
import { Module } from '@nestjs/common';
import { JobProducerService } from './bullmq/job-producer.service';
import { QueueModule } from './bullmq/queue.module';

@Module({
  imports: [QueueModule],
  providers: [JobProducerService],
})
export class AppModule {}
