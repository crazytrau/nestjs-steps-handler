import { Injectable } from '@nestjs/common';
import { AmqpConnection } from '@nestjs-plus/amqp';

@Injectable()
export class RabbitMQService {
  constructor(private readonly amqpConnection: AmqpConnection) {}

  async publishMessage(queue: string, message: any) {
    this.amqpConnection.publish(queue, '', message);
  }
}
