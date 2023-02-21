import { Controller, Get, Param } from '@nestjs/common';
import { CafeService } from './cafe.service';

@Controller('/cafe')
export class CafeController {
  constructor(private readonly cafeService: CafeService) {}

  @Get('/info')
  find() {
    return this.cafeService.find();
  }

  @Get('/:cafeId')
  findOne(@Param('cafeId') id: string) {
    console.log(id);
    return this.cafeService.findOne(id);
  }
}
