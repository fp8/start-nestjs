import { IJson } from 'jlog-facade';
import { BadRequestException } from '@nestjs/common';

export class ExceptionWithPayload extends BadRequestException {
  public readonly payload?: IJson;

  constructor(message: string, payload?: IJson) {
    super(message);
    this.payload = payload;
    Object.setPrototypeOf(this, ExceptionWithPayload.prototype);
  }
}
