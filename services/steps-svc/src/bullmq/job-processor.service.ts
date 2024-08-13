// job-processor.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { Worker, Job } from 'bullmq';

@Injectable()
export class JobProcessorService {
  private readonly logger = new Logger(JobProcessorService.name);
  private worker: Worker;

  constructor() {
    this.worker = new Worker(
      'jobs',
      
      async (job: Job) => {
        this.logger.debug({
          job,
          log: `💀 ${new Date().toISOString()} ~ file: job-processor.service.ts:14 ~ JobProcessorService ~ job:`,
        });
        const ctx = {
          svcName: process.env.NAME,
          id: job.id,
          data: job.data,
        };
        try {
          // Differentiate between parent and child jobs
          if (job.name === 'parentJob') {
            this.logger.debug({
              ctx,
              log: `Processing parent job ${job.id} with data:`,
            });
            // Logic for processing parent job
            // Optionally create child jobs here if needed
            return await new Promise<any>((resolve) =>
              setTimeout(() => {
                console.debug(
                  `💀 ${new Date().toISOString()} ~ file: job-processor.service.ts:25 ~ JobProcessorService ~ 'Processing job', job.id, job.data:`,
                  'Processing job',
                  process.env.NAME,
                  job.id,
                  job.data,
                );
                return resolve({
                  log: `return parentJob`,
                  id: job.id,
                  svc: process.env.NAME,
                });
              }, 10000),
            );
          } else if (job.name === 'childJob') {
            this.logger.debug({
              ctx,
              log: `Processing child job ${job.id} with data:`,
            });
            // Logic for processing child job
            return await new Promise<any>((resolve) =>
              setTimeout(() => {
                console.debug(
                  `💀 ${new Date().toISOString()} ~ file: job-processor.service.ts:25 ~ JobProcessorService ~ 'Processing job', job.id, job.data:`,
                  'Processing job',
                  process.env.NAME,
                  job.id,
                  job.data,
                );
                return resolve({
                  log: `return childJob`,
                  id: job.id,
                  svc: process.env.NAME,
                });
              }, 5000),
            );
          } else if (job.name === 'job') {
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
              throw new Error(`Error Test ${job.id}.${job.data?.index}`);
            }
          } else {
            throw new Error(`Unknown job type: ${job.name}`);
          }
        } catch (error) {
          this.logger.error({ log: 'Job failed', ctx, error });
          throw error; // Rethrow to trigger retries
        }
      },
      {
        connection: {
          host: process.env.REDIS_HOST,
          port: parseInt(process.env.REDIS_PORT),
        },
        concurrency: 20,
      },
    );
  }
}
