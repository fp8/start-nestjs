import { Injectable } from '@nestjs/common';
import { ConfigData } from '@proj/dto/config.dto';

@Injectable()
export class HomeService {
  constructor(private readonly configData: ConfigData) {}

  getWelcomeMessage(input?: Date): string {
    const now = input || new Date();
    const appName = this.configData.app.name;
    return `Welcome to the ${appName} app. The time is now ${now.toISOString()}`;
  }
}
