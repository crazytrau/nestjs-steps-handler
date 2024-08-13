// app.module.ts
import { Module } from '@nestjs/common';
import { QueueModule } from './bullmq/queue.module';

@Module({
  imports: [QueueModule],
  providers: [],
})
export class AppModule {}
