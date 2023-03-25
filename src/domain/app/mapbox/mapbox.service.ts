import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { MapboxPedastrianAPIDto } from './dto/mapbox-direction-api.dto';

@Injectable()
export class MapboxService {
  constructor(private readonly httpService: HttpService) {}

  async getPedastrianRoutes(pedestrianDto: MapboxPedastrianAPIDto) {
    const { startX, startY, endX, endY } = pedestrianDto;

    const response = await this.httpService.axiosRef({
      method: 'GET',
      url: `https://api.mapbox.com/directions/v5/mapbox/walking/${startX}%2C${startY}%3B${endX}%2C${endY}?alternatives=false&annotations=duration&continue_straight=true&geometries=geojson&language=ko&overview=full&steps=false&access_token=${process.env.MAPBOX_TOKEN}`,
    });

    const { distance, duration } = response.data.routes[0];

    return { distance, duration };
  }
}
