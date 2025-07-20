import { Body, Controller, Get, Post } from '@nestjs/common';

import { HomeService } from '@proj/services/home.service';
import { NowRequest } from '@proj/dto/ctrls.dto';
import { createLogger } from '@proj/core';

const logger = createLogger('HomeController');

@Controller()
export class HomeController {
  constructor(private readonly homeService: HomeService) {}

  @Get('/')
  getRoot() {
    return { message: this.homeService.getWelcomeMessage() };
  }

  @Post('/')
  getRootWithDate(@Body() nowRequest: NowRequest) {
    logger.info(`Received POST request with date: ${nowRequest.now}`);
    const now = new Date(nowRequest.now);
    return { message: this.homeService.getWelcomeMessage(now) };
  }
}
