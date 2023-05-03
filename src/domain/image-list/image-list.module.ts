import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ImageListService } from './image-list.service';
import { ImageList, ImageListSchema } from './image-list.schemas';
import { ImageListRepository } from './image-list.repository';
import { AwsS3Module } from 'src/module/aws-s3/aws-s3.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ImageList.name, schema: ImageListSchema },
    ]),
    AwsS3Module,
  ],
  providers: [ImageListService, ImageListRepository],
  exports: [ImageListService, ImageListRepository],
})
export class ImageListModule {}
