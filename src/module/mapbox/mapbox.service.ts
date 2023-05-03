import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { MapboxPedastrianAPIDto } from './dto/mapbox-direction-api.dto';

@Injectable()
export class MapboxService {
  constructor(private readonly httpService: HttpService) {}

  async getPedastrianRoutes(pedestrianDto: MapboxPedastrianAPIDto) {
    const { startLng, startLat, endLat, endLng } = pedestrianDto;

    const response = await this.httpService.axiosRef({
      method: 'GET',
      url: `https://api.mapbox.com/directions/v5/mapbox/walking/${startLng}%2C${startLat}%3B${endLng}%2C${endLat}?access_token=${process.env.MAPBOX_TOKEN}`,
    });

    if (!response.data.routes.length)
      throw new HttpException(response.data.message, HttpStatus.OK);

    const { distance, duration } = response.data.routes[0];

    return { distance, duration };
  }
}
