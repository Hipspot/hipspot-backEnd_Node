import { Test, TestingModule } from '@nestjs/testing';
import { ImageListService } from './image-list.service';

describe('ImageListService', () => {
  let service: ImageListService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ImageListService],
    }).compile();

    service = module.get<ImageListService>(ImageListService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
