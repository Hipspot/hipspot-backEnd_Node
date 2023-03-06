import { Controller, Get, Inject, Req, Res, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/domain/user/user.service';
import { AuthService } from './auth.service';
import { ParsedGoogltAuthProfileType } from './dto/google-auth.dto';
import { GoogleAuthGuard } from './guard/google-auth-guard';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authService: AuthService,
    private jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  @Get('google/login')
  @UseGuards(GoogleAuthGuard)
  handleLogin(@Req() req) {
    return { msg: 'google', user: req.user };
  }

  //api/google/callback
  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  async handleRedirect(@Req() req, @Res() res) {
    const { email, photo, displayName } =
      req.user as ParsedGoogltAuthProfileType;

    const user = await this.authService.validateUser({
      email,
      image: photo,
      displayName,
    });
    const token: string = this.authService.jwtIssuance(user);
    return res.redirect(
      `http://localhost:5001/user?hipspot_access_token=${token}`,
    );
  }
}
