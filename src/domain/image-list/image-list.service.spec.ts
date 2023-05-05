import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { ImageListService } from './image-list.service';
import { ImageListRepository } from './image-list.repository';
import { getModelToken } from '@nestjs/mongoose';
import { ImageList } from './image-list.schemas';

describe('ImageListService', () => {
  let service: ImageListService;
  let model: Model<ImageList>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ImageListService,
        {
          provide: getModelToken(ImageList.name),
          useValue: {},
        },
        ImageListRepository,
      ],
    }).compile();

    service = module.get<ImageListService>(ImageListService);
    model = module.get<Model<ImageList>>(getModelToken(ImageList.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(model).toBeDefined();
  });
});
