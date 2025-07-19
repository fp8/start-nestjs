import { Controller, Get } from '@nestjs/common';
import { HomeService } from '@proj/services/home.service';

@Controller()
export class HomeController {
  constructor(private readonly homeService: HomeService) {}
  @Get('/')
  getRoot() {
    return { message: this.homeService.getWelcomeMessage() };
  }
}
