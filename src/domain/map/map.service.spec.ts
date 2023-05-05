import { Test, TestingModule } from '@nestjs/testing';
import { MapService } from './map.service';
import { getModelToken } from '@nestjs/mongoose';
import { Geojson } from './schemas/Geojson.schemas';

describe('MapService', () => {
  let service: MapService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MapService,
        { provide: getModelToken(Geojson.name), useValue: {} },
      ],
    }).compile();

    service = module.get<MapService>(MapService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
