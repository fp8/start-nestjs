import { Type } from 'class-transformer';
import { IsNumber, IsString, ValidateNested } from 'class-validator';

export class AppConfig {
  @IsString()
  name!: string;

  @IsNumber()
  port!: number;

  /**
   * Return port to be used by the server from env PORT.  If that
   * is not provided, read from app config's .port property
   *
   * @returns
   */
  public getPort(): number {
    const envPortString = process.env.PORT;

    if (envPortString) {
      const envPort = parseInt(envPortString ?? '', 10);
      if (Number.isInteger(envPort)) {
        return envPort;
      } else {
        return this.port;
      }
    } else {
      return this.port;
    }
  }
}

export class ConfigData {
  @Type(() => AppConfig)
  @ValidateNested()
  app!: AppConfig;
}
