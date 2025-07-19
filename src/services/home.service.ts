import { Injectable } from '@nestjs/common';

@Injectable()
export class HomeService {
  getWelcomeMessage(input?: Date): string {
    const now = input || new Date();
    return `Welcome to the Home Page. The time is now ${now.toISOString()}`;
  }
}
