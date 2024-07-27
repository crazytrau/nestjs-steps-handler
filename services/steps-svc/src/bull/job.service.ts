import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { connect } from 'amqplib';
import { RedisService } from './redis.service';

@Injectable()
export class JobService {
  private rabbitMqChannel: any;

  constructor(
    @InjectQueue('jobQueue') private readonly jobQueue: Queue,
    private readonly redisService: RedisService,
  ) {
    this.connectRabbitMq();
  }

  private async connectRabbitMq() {
    const connection = await connect(
      `amqp://${process.env.RABBITMQ_DEFAULT_USER}:${process.env.RABBITMQ_DEFAULT_PASS}@${process.env.RABBITMQ_HOST}`,
    );
    this.rabbitMqChannel = await connection.createChannel();
    await this.rabbitMqChannel.assertQueue('jobQueue');
  }

  async enqueueJob(data: any) {
    const jobId = `job-${Date.now()}`;

    const redisClient = this.redisService.getClient();
    await redisClient.hset(`job:${jobId}`, 'state', 'pending');

    await this.jobQueue.add({ id: jobId, data });
    console.log(`Job ${jobId} enqueued`);

    // Optionally, send a message to RabbitMQ
    this.rabbitMqChannel.sendToQueue(
      'jobQueue',
      Buffer.from(JSON.stringify({ id: jobId, data })),
    );
  }
}
