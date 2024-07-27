import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CrtBullModule } from './bull/bull.module';

@Module({
  imports: [CrtBullModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
