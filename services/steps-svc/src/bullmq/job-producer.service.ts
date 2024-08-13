// job-producer.service.ts
import { InjectQueue } from '@nestjs/bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { Queue, QueueEvents } from 'bullmq';

@Injectable()
export class JobProducerService {
  private readonly logger = new Logger(JobProducerService.name);
  private queueEvents: QueueEvents;

  constructor(@InjectQueue('jobs') private readonly queue: Queue) {
    this.queueEvents = new QueueEvents('jobs', {
      connection: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT, 10) || 6379,
      },
    });
  }

  async onModuleInit() {
    // Wait for the parent job to complete
    if (process.env.MASTER) {
      this.queueEvents.on(
        'completed',
        async (
          args: {
            jobId: string;
            returnvalue: string;
            prev?: string;
          },
          id: string,
        ) => {
          this.logger.error(
            { args, id },
            `💀 ${new Date().toISOString()} ~ file: job-producer.service.ts:45 ~ JobProducerService ~ this.queueEvents.on ~ jobId:`,
          );
          const { jobId } = args;
          const parentJob = await this.queue.getJob(jobId);
          if (
            parentJob &&
            parentJob.name === 'parentJob' &&
            parentJob.id === '2'
          ) {
            switch (parentJob.id) {
              case '2':
                this.logger.debug(`Parent job ${2} completed successfully`);

                // Add child jobs only after the parent job completes
                await Promise.allSettled(
                  [...Array(100)].map((_, childIndex) =>
                    this.queue.add(
                      'childJob',
                      {
                        parentId: 2,
                        childId: `${2}-${childIndex + 1}`,
                        parentJob,
                      },
                      {
                        attempts: 5,
                        backoff: 5000,
                      },
                    ),
                  ),
                );

                this.logger.debug(
                  `Child jobs added successfully for parent job ${2}`,
                );

                this.queue.getJob('1').then(async (job1) => {
                  this.logger.debug(
                    { job1 },
                    `💀 ${new Date().toISOString()} SYNCCCCCC`,
                  );
                  job1.remove();
                });
                break;

              default:
                break;
            }
          }
        },
      );
    }
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
    } catch (error) {
      this.logger.error({
        log: `Failed to add parent and child jobs with data: ${JSON.stringify(data)}. Error: ${error.message}`,
        name: error.name,
        message: error.message,
      });
    }
  }
}
