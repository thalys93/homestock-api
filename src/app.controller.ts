import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags("System Routes")
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get("/system-check")
  async getHello(): Promise<string> {
    return this.appService.systemCheck();
  }
}
