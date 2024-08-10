import { Module } from '@nestjs/common';
import { AmqpConnection, AmqpModule } from '@nestjs-plus/amqp';
import { RabbitMQService } from './rabbitmq.service';

@Module({
  imports: [
    AmqpModule.forRoot({
      uri: process.env.RABBITMQ_URL,
    }),
  ],
  providers: [RabbitMQService],
  exports: [RabbitMQService],
})
export class RabbitMQModule {}
