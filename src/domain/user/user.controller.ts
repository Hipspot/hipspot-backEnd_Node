import { Controller, Delete, Get, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guard/jwt-guard';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('')
  @UseGuards(JwtAuthGuard)
  async userData(@Req() req) {
    return await this.userService.findOne({ userId: req.user.userId });
  }

  @Delete('')
  @UseGuards(JwtAuthGuard)
  async deleteUser(@Req() req) {
    return await this.userService.unRegister(req.user.userId);
  }
}
