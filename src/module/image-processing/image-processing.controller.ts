import { Controller } from '@nestjs/common';
import { AwsS3Service } from '../aws-s3/aws-s3.service';
import { SharpService } from './sharp/sharp.service';
import { ImageProcessingService } from './image-processing.service';

@Controller('image-processing')
export class ImageProcessingController {
  constructor(
    private readonly imageProcessingService: ImageProcessingService,
    private readonly awsS3Service: AwsS3Service,
    private readonly sharpService: SharpService,
  ) {}

  // @Get('test')
  // async testUploadThumbNailImage(@Query('url') url: string) {
  //   const imageBuffer = await this.imageProcessingService.downloadImageFromUrl(
  //     url,
  //   );

  //   const resized = await this.sharpService.resizeImage(imageBuffer, 80, 80);
  //   const uploadResult = await this.awsS3Service.uploadImageToS3Bucket(
  //     resized,
  //     '1/test.123',
  //   );
  //   return uploadResult;
  // }
}
