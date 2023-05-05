import { Test, TestingModule } from '@nestjs/testing';
import { MapboxService } from './mapbox.service';
import { HttpService } from '@nestjs/axios';
import { getModelToken } from '@nestjs/mongoose';
import { Geojson } from 'src/domain/map/schemas/Geojson.schemas';

describe('MapboxService', () => {
  let service: MapboxService;
  let httpService: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MapboxService,
        { provide: HttpService, useValue: { get: jest.fn() } },
        { provide: getModelToken(Geojson.name), useValue: {} },
      ],
    }).compile();

    service = module.get<MapboxService>(MapboxService);
    httpService = module.get<HttpService>(HttpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(httpService).toBeDefined();
  });
});
