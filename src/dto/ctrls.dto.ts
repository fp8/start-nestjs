import { IsDateString } from 'class-validator';

export class NowRequest {
  @IsDateString()
  now!: string;
}
