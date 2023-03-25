import { Model, ProjectionType } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cafe } from './schemas/cafe.schema';
import { MapboxService } from '../mapbox/mapbox.service';

@Injectable()
export class CafeService {
  constructor(
    @InjectModel(Cafe.name) private cafeModel: Model<Cafe>, // @InjectModel(Cafe.name) private cafeModel: Model<CafeDocument>,
    private readonly MapboxService: MapboxService,
  ) {}

  async getCafe(cafeId?: string, projection?: ProjectionType<Cafe>) {
    const cafe = await this.cafeModel.find(
      cafeId ? { cafeId } : {},
      projection || {},
    );
    return cafeId ? cafe[0] : cafe;
  }

  async getNearbyCafeList() {
    const route = await this.MapboxService.getPedastrianRoutes({
      startX: 126.9246033,
      startY: 33.45241976,
      endX: 126.9041895,
      endY: 33.4048969,
    });
    return route;
  }

  async getHighRatedCafes() {
    return 'high-rated';
  }
  async getNewlyOpencafeList() {
    return 'newly-open';
  }
  async getPopularCafeList() {
    return 'popular';
  }
}
