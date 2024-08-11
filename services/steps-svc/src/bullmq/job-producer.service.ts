// job-producer.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { JobsOptions, Queue, QueueEvents } from 'bullmq';

@Injectable()
export class JobProducerService {
  private readonly logger = new Logger(JobProducerService.name);
  private queue: Queue;
  private queueEvents: QueueEvents;

  constructor() {
    this.queue = new Queue('jobs', {
      connection: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT),
      },
    });
    this.queueEvents = new QueueEvents('jobs', {
      connection: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT),
      },
    });
  }

  async addJob(data: any): Promise<void> {
    try {
      await this.queue.add('job', data, {
        attempts: 5,
        backoff: 5000,
      });
      this.logger.debug(
        `Job added successfully with data: ${JSON.stringify(data)}`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to add job with data: ${JSON.stringify(data)}. Error: ${error.message}`,
      );
      throw error;
    }
  }

  async addParentJob(data: any): Promise<void> {
    try {
      // Add parent job
      const parentJob = await this.queue.add('parentJob', data, {
        attempts: 5,
        backoff: 5000,
      });
      this.logger.debug(
        `Parent job added with ID: ${parentJob.id} and data: ${JSON.stringify(data)}`,
      );

      // Ensure the parent job is persisted and available
      await this.queue.getJob(parentJob.id); // Confirm the job exists

      // // Wait until the parent job is completed
      // const responseUntilFinish = await parentJob.waitUntilFinished(
      //   this.queueEvents,
      //   60000,
      // );
      // this.logger.debug({
      //   responseUntilFinish,
      //   log: `💀 ${new Date().toISOString()} ~ file: job-producer.service.ts:56 ~ JobProducerService ~ addParentJob ~ responseUntilFinish:`,
      // });

      // Check if the parent job exists in the queue
      const existingParentJob = await this.queue.getJob(parentJob.id);
      this.logger.debug({
        log: `💀 ${new Date().toISOString()} ~ file: job-producer.service.ts:69 ~ JobProducerService ~ addParentJob ~ existingParentJob:`,
        existingParentJob,
      });
      if (!existingParentJob) {
        throw new Error(`Parent job with ID ${parentJob.id} not found`);
      }

      // Add child job under the parent job
      await Promise.allSettled(
        [...Array(3)].map((_, childIndex) => {
          this.queue.add(
            'childJob',
            {
              parentId: parentJob.id,
              ...data,
              childId: `${parentJob.id}-${childIndex}`,
            },
            {
              attempts: 5,
              backoff: 5000,
            } as JobsOptions,
          );
        }),
      );

      this.logger.debug(
        `Parent and child jobs added successfully with data: ${JSON.stringify(data)}`,
      );
    } catch (error) {
      this.logger.error({
        log: `Failed to add parent and child jobs with data: ${JSON.stringify(data)}. Error: ${error.message}`,
        name: error.name,
        message: error.message,
      });
    }
  }
}
