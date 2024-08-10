import { Controller, Get, Logger } from '@nestjs/common';
import { JobProducerService } from './job-producer.service';

@Controller('/bullmq')
export class BullController {
  private readonly logger = new Logger(BullController.name);
  constructor(private readonly jobProducerService: JobProducerService) {}

  @Get()
  addJob(): void {
    if (process.env.MASTER) {
      [...Array(1)].forEach((e, i) => {
        const data = {
          role: 'child',
          index: i,
        };
        this.logger.debug({
          data,
          log: `💀 ${new Date().toISOString()} ~ file: job-producer.service.ts:21 ~ JobProducerService ~ [...Array ~ data:`,
        });
        this.jobProducerService.addJob(data);
      });
    }
  }

  @Get('/parent')
  addParentJob(): void {
    if (process.env.MASTER) {
      [...Array(1)].forEach((e, i) => {
        const data = {
          role: 'parent',
          some: i,
        };
        this.logger.debug({
          log: `💀 ${new Date().toISOString()} ~ file: job-producer.service.ts:21 ~ JobProducerService ~ [...Array ~ data:`,
          data,
        });
        this.jobProducerService.addParentJob(data);
      });
    }
  }
}
