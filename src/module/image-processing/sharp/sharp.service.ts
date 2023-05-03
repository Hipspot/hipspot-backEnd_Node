import { Injectable } from '@nestjs/common';
import * as Sharp from 'sharp';

@Injectable()
export class SharpService {
  async resizeImage(
    buffer: Buffer,
    width: number,
    height: number,
  ): Promise<Buffer> {
    return Sharp(buffer).resize(width, height).jpeg().toBuffer();
  }
}
