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

    [...Array(10)].forEach((e, i) => {
      const data = {
        index: i,
      };
      console.debug(
        data,
        `💀 ${new Date().toISOString()} ~ file: job-producer.service.ts:21 ~ JobProducerService ~ [...Array ~ data:`,
      );
      this.addJob(data);
    });
  }

  async addJob(data: any) {
    await this.queue.add('job', data, {
      attempts: 5, // Retry up to 5 times
      backoff: 5000, // Retry after 5 seconds
    });
  }
}
