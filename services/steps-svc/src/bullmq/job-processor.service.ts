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
          // Simulate work
          if (Math.random() < 0.5) {
            await new Promise<void>((resolve) =>
              setTimeout(() => {
                console.debug(
                  `💀 ${new Date().toISOString()} ~ file: job-processor.service.ts:25 ~ JobProcessorService ~ 'Processing job', job.id, job.data:`,
                  'Processing job',
                  process.env.NAME,
                  job.id,
                  job.data,
                );
                return resolve();
              }, 5000),
            );
          } else {
            throw new Error(`Test ${job.id}.${job.data?.index}`);
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
