import { Test, TestingModule } from '@nestjs/testing';
import { FavoriteController } from './favorite.controller';
import { FavoriteService } from './favorite.service';
import { MapService } from '../map/map.service';
import { getModelToken } from '@nestjs/mongoose';
import { Favorite } from './favorite.schema';
import { Logger } from '@nestjs/common';

describe('FavoriteController', () => {
  let controller: FavoriteController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FavoriteController],
      providers: [
        FavoriteService,
        { provide: getModelToken(Favorite.name), useValue: {} },
        {
          provide: MapService,
          useValue: {
            getGeojsonOne: jest.fn(),
          },
        },
        {
          provide: Logger,
          useValue: { log: jest.fn(), warn: jest.fn(), error: jest.fn() },
        },
      ],
    }).compile();

    controller = module.get<FavoriteController>(FavoriteController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
