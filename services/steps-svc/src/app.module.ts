import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RabbitMQModule } from './modules/bullmq/rabbitmq.module';
import { BullMQModule } from './modules/bullmq/bullmq.module';
import { QueueController } from './modules/bullmq/queue.controller';

@Module({
  imports: [BullMQModule, RabbitMQModule],
  controllers: [AppController, QueueController],
  providers: [AppService],
})
export class AppModule {}
