import { Controller, Post, Body } from '@nestjs/common';
import { JobService } from './job.service';

@Controller('jobs')
export class JobController {
  constructor(private readonly jobService: JobService) {}

  @Post('enqueue')
  async enqueueJob(@Body() data: any) {
    await this.jobService.enqueueJob(data);
    return 'Job enqueued';
  }
}
