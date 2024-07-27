import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue, Job } from 'bull';
import { RedisService } from './redis.service';

@Injectable()
export class JobProcessor {
  private redisClient = this.redisService.getClient();

  constructor(
    @InjectQueue('jobQueue') private readonly jobQueue: Queue,
    private readonly redisService: RedisService,
  ) {}

  async processJob(job: Job<any>) {
    const { id, data } = job;

    const jobState = await this.redisClient.hget(`job:${id}`, 'state');

    if (jobState === 'completed') {
      return;
    }

    try {
      console.log(`Processing job ${id} with data:`, data);

      // Implement your job logic here
      if (Math.random() < 0.5) {
        throw new Error('Random failure');
      }

      await this.redisClient.hset(`job:${id}`, 'state', 'completed');
    } catch (error) {
      console.error(`Job ${id} failed:`, error);

      const retryCount =
        parseInt(await this.redisClient.hget(`job:${id}`, 'retries')) || 0;
      await this.redisClient.hset(`job:${id}`, 'retries', retryCount + 1);
      await this.redisClient.hset(`job:${id}`, 'state', 'failed');

      if (retryCount < 3) {
        await this.jobQueue.add({ id, data }, { delay: 60000 }); // Retry after 1 minute
      }
    }
  }
}
