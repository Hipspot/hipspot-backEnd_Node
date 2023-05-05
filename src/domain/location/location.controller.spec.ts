import { Test, TestingModule } from '@nestjs/testing';
import { LocationController } from './location.controller';
import { LocationService } from './location.service';
import { getModelToken } from '@nestjs/mongoose';
import { Location } from './schemas/location.schemas';
import { LocationRepository } from './location.repository';
import { HttpService } from '@nestjs/axios';
import { Logger } from '@nestjs/common';

describe('LocationController', () => {
  let controller: LocationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LocationController],
      providers: [
        LocationService,
        LocationRepository,
        { provide: getModelToken(Location.name), useValue: {} },
        { provide: HttpService, useValue: { get: jest.fn() } },
        {
          provide: Logger,
          useValue: { log: jest.fn(), warn: jest.fn(), error: jest.fn() },
        },
      ],
    }).compile();

    controller = module.get<LocationController>(LocationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
