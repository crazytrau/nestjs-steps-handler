// job-processor.service.ts
import { Injectable } from '@nestjs/common';
import { Worker, Job } from 'bullmq';

@Injectable()
export class JobProcessorService {
  private worker: Worker;

  constructor() {
    this.worker = new Worker(
      'jobs',
      async (job: Job) => {
        try {
          console.log('Processing job', job.id, job.data);
          // Simulate work
          if (Math.random() < 0.5) {
            await new Promise((resolve) => setTimeout(resolve, 1000));
          } else {
            throw new Error(`Test ${job.id}.${job.data?.index}`)
          }
        } catch (error) {
          console.error('Job failed', job.id, error);
          throw error; // Rethrow to trigger retries
        }
      },
      {
        connection: {
          host: process.env.REDIS_HOST,
          port: parseInt(process.env.REDIS_PORT),
        },
      },
    );
  }
}
