import {
  Body,
  Controller,
  InternalServerErrorException,
  Logger,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { jwtPayloadSchema, RegisterDto } from '../types/auth';
import { safeUserSchema, User, UserRole } from '../types/user';
import { getCookieOptions } from './utils/cookie';
import { LocalGuard } from './guards/local.guard';
import { UseUser } from '../users/decorators/user.decorator';
import { JwtGuard } from './guards/jwt.guard';
import { RefreshGuard } from './guards/refresh.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  private async exchangeToken({
    id,
    email,
    role,
  }: {
    id: string;
    email: string;
    role: UserRole;
  }) {
    try {
      const payload = jwtPayloadSchema.parse({
        id,
        email,
        role,
      });
      const accessToken = this.authService.generateToken('access', payload);
      const refreshToken = this.authService.generateToken('refresh', payload);

      await this.authService.updateRefreshToken(email, refreshToken);

      return {
        accessToken,
        refreshToken,
      };
    } catch (e) {
      Logger.error(e);
      throw new InternalServerErrorException();
    }
  }

  private async handleAuthorization(user: User, response: Response) {
    const { id, role, email } = user;

    const { accessToken, refreshToken } = await this.exchangeToken({
      id,
      email,
      role,
    });

    response.cookie('access_token', accessToken, getCookieOptions('access'));
    response.cookie('refresh_token', refreshToken, getCookieOptions('refresh'));

    const responseData = safeUserSchema.parse(user);
    return responseData;
  }

  @Post('login')
  @UseGuards(LocalGuard)
  async login(
    @UseUser() user: User,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.handleAuthorization(user, response);
  }

  @Post('register')
  async register(
    @Body() data: RegisterDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const user = await this.authService.register(data);
    return this.handleAuthorization(user, response);
  }

  @Post('logout')
  @UseGuards(JwtGuard)
  async logout(
    @UseUser() user: User,
    @Res({ passthrough: true }) response: Response,
  ) {
    await this.authService.updateRefreshToken(user.email, null);
    response.clearCookie('access_token');
    response.clearCookie('refresh_token');

    return {
      message: 'Logged out successfully',
    };
  }

  @Post('refresh')
  @UseGuards(RefreshGuard)
  async refresh(
    @UseUser() user: User,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.handleAuthorization(user, response);
  }
}
