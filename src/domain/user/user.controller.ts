import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../app/auth/guard/jwt-guard';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('')
  @UseGuards(JwtAuthGuard)
  async userData(@Req() req) {
    return await this.userService.findOne({ userId: req.user.userId });
  }
}
