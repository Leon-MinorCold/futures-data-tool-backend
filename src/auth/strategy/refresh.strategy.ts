import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy, StrategyOptions } from 'passport-jwt';
import { AuthService } from '../auth.service';
import { ConfigService } from '@nestjs/config';
import { Config } from '@/config/schema';
import { Request } from 'express';
import { JwtPayload } from '@/types/auth';

@Injectable()
export class RefreshStrategy extends PassportStrategy(Strategy, 'refresh') {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService<Config>,
  ) {
    const extractors = [
      (request: Request) => request?.cookies?.['refresh_token'],
    ];
    super({
      secretOrKey: configService.get('REFRESH_TOKEN_SECRET'),
      jwtFromRequest: ExtractJwt.fromExtractors(extractors),
      passReqToCallback: true, // pass request param to validate
      ignoreExpiration: false,
    } as StrategyOptions);
  }

  async validate(request: Request, payload: JwtPayload) {
    const refreshToken = request?.cookies?.['refresh_token'];
    return await this.authService.validateRefreshToken(payload, refreshToken);
  }
}
