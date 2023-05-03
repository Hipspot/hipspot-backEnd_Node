import { Logger, Module } from '@nestjs/common';
import { ImageProcessingService } from './image-processing.service';
import { SharpModule } from './sharp/sharp.module';
import { HttpModule } from '@nestjs/axios';
import { ImageProcessingController } from './image-processing.controller';
import { AwsS3Module } from '../aws-s3/aws-s3.module';

@Module({
  imports: [AwsS3Module, SharpModule, HttpModule],
  controllers: [ImageProcessingController],
  providers: [ImageProcessingService, Logger],
  exports: [ImageProcessingService, SharpModule],
})
export class ImageProcessingModule {}
