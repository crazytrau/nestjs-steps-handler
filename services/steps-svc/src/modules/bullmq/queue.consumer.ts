import { Injectable } from '@nestjs/common';
import { Job, Worker, Queue, QueueScheduler } from 'bullmq';

@Injectable()
export class QueueConsumer {
  constructor() {
    const worker = new Worker(
      'myQueue',
      async (job: Job) => {
        // Job processing logic
        console.log('Processing job:', job.data);
      },
      {
        connection: {
          host: process.env.REDIS_URL.split(':')[1].replace('//', ''),
          port: parseInt(process.env.REDIS_URL.split(':')[2]),
        },
      },
    );

    const scheduler = new QueueScheduler('myQueue', {
      connection: {
        host: process.env.REDIS_URL.split(':')[1].replace('//', ''),
        port: parseInt(process.env.REDIS_URL.split(':')[2]),
      },
    });

    worker.on('completed', (job: Job) => {
      console.log(`Job ${job.id} completed!`);
    });
  }
}
