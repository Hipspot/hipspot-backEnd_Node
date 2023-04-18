import { IsEnum, IsString } from 'class-validator';

export class FavoitePatchDto {
  @IsEnum({ add: 'add', remove: 'remove' })
  type: string;

  @IsString()
  cafeId: string;
}
