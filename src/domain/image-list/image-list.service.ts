import { Injectable } from '@nestjs/common';
import { ProjectionType } from 'mongoose';
import { ImageListRepository } from './image-list.repository';
import { ImageList } from './image-list.schemas';

@Injectable()
export class ImageListService {
  constructor(private readonly imagetListRepository: ImageListRepository) {}
  async getImageList(cafeId?: string, projection?: ProjectionType<ImageList>) {
    const imageList = await this.imagetListRepository.find(
      cafeId ? { cafeId } : {},
      projection || {},
    );
    return imageList;
  }
}
