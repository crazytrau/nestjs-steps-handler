import { Controller, Get } from '@nestjs/common';
import { JobProducerService } from './job-producer.service';

@Controller('/bullmq')
export class BullController {
  constructor(private readonly jobProducerService: JobProducerService) {}

  @Get()
  getHello(): void {
    if (process.env.MASTER) {
      [...Array(10)].forEach((e, i) => {
        const data = {
          index: i,
        };
        console.debug(
          data,
          `💀 ${new Date().toISOString()} ~ file: job-producer.service.ts:21 ~ JobProducerService ~ [...Array ~ data:`,
        );
        this.jobProducerService.addJob(data);
      });
    }
  }
}
