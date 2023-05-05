import { Test, TestingModule } from '@nestjs/testing';
import { MapController } from './map.controller';
import { MapService } from './map.service';
import { getModelToken } from '@nestjs/mongoose';

describe('MapController', () => {
  let controller: MapController;
  let service: MapService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MapController],
      providers: [
        MapService,
        {
          provide: getModelToken('Geojson'),
          useValue: {}, // 모의 객체를 반환값.
        },
      ],
    }).compile();

    controller = module.get<MapController>(MapController);
    service = module.get<MapService>(MapService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });
});
