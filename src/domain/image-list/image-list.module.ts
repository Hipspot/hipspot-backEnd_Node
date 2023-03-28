import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ImageListService } from './image-list.service';
import { ImageList, ImageListSchema } from './image-list.schemas';
import { ImageListRepository } from './image-list.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ImageList.name, schema: ImageListSchema },
    ]),
  ],
  providers: [ImageListService, ImageListRepository],
  exports: [ImageListService, ImageListRepository],
})
export class ImageListModule {}
