import { IsNumber } from 'class-validator';

export class MapboxPedastrianAPIDto {
  @IsNumber()
  startX: number;
  @IsNumber()
  startY: number;
  @IsNumber()
  endX: number;
  @IsNumber()
  endY: number;
}
