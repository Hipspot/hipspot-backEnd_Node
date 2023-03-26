import { IsNumber } from 'class-validator';

export class MapboxPedastrianAPIDto {
  @IsNumber()
  startLng: number;
  @IsNumber()
  startLat: number;
  @IsNumber()
  endLng: number;
  @IsNumber()
  endLat: number;
}
