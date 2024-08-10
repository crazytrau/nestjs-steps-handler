// job-producer.service.ts
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';

@Injectable()
export class JobProducerService {
  private queue: Queue;

  constructor() {
    this.queue = new Queue('jobs', {
      connection: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT),
      },
    });
  }

  async addJob(data: any) {
    await this.queue.add('job', data, {
      attempts: 5, // Retry up to 5 times
      backoff: 5000, // Retry after 5 seconds
    });
  }
}
