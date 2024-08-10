import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { QueueService } from './queue.service';
import { QueueConsumer } from './queue.consumer';

@Module({
  imports: [
    BullModule.forRoot({
      connection: {
        host: process.env.REDIS_URL.split(':')[1].replace('//', ''),
        port: parseInt(process.env.REDIS_URL.split(':')[2]),
      },
    }),
    BullModule.registerQueue({
      name: 'myQueue',
    }),
  ],
  providers: [QueueService, QueueConsumer],
})
export class BullMQModule {}
