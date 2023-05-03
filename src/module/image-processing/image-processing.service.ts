import { Injectable } from '@nestjs/common';
import { SharpService } from './sharp/sharp.service';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class ImageProcessingService {
  constructor(
    private readonly sharpService: SharpService,
    private readonly httpService: HttpService,
  ) {}

  async downloadImageFromUrl(url: string): Promise<Buffer> {
    try {
      const response = await this.httpService.axiosRef({
        method: 'GET',
        url,
        responseType: 'arraybuffer',
      });

      return Buffer.from(response.data, 'binary');
    } catch (error) {
      console.error(`Error downloading image from URL: ${url}`);
      throw error;
    }
  }

  async resizeImage(
    buffer: Buffer,
    width: number,
    height: number,
  ): Promise<Buffer> {
    try {
      const resizedImageBuffer = await this.sharpService.resizeImage(
        buffer,
        width,
        height,
      );
      console.log(resizedImageBuffer);
      return resizedImageBuffer;
    } catch (error) {
      console.error(`Error resizing image: ${error}`);
    }
  }
}
