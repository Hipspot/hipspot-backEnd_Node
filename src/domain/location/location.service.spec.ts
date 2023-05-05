import { Test, TestingModule } from '@nestjs/testing';
import { LocationService } from './location.service';
import { LocationRepository } from './location.repository';
import { getModelToken } from '@nestjs/mongoose';
import { Location } from './schemas/location.schemas';
import { HttpService } from '@nestjs/axios';

describe('LocationService', () => {
  let service: LocationService;
  let httpService: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LocationService,
        { provide: HttpService, useValue: { get: jest.fn() } },
        LocationRepository,
        { provide: getModelToken(Location.name), useValue: {} },
      ],
    }).compile();

    service = module.get<LocationService>(LocationService);
    httpService = module.get<HttpService>(HttpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(httpService).toBeDefined();
  });
});
