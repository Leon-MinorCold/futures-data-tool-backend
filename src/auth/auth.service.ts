import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  Logger,
  forwardRef,
  Inject,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Config } from '../config/schema';
import * as bcrypt from 'bcryptjs';
import { randomBytes } from 'crypto';
import { JwtPayload, RegisterDto, LoginDto } from '../types/auth';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService<Config>,
  ) {}

  // generate hashed password
  private hash(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }

  public generateSalt(rounds: number = 10): Promise<string> {
    return bcrypt.genSalt(rounds);
  }

  // compare plain password and hashed password
  private compare(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  private async checkPassword(password: string, hashedPassword: string) {
    const isValid = await this.compare(password, hashedPassword);
    if (!isValid) {
      throw new BadRequestException('Invalid Credentials');
    }
  }

  generateToken(
    type: 'access' | 'refresh' | 'verificationToken',
    payload?: JwtPayload,
  ) {
    switch (type) {
      case 'access':
        if (!payload)
          throw new InternalServerErrorException('Invalid JwtPayload');
        return this.jwtService.sign(payload, {
          secret: this.configService.getOrThrow('ACCESS_TOKEN_SECRET'),
          expiresIn: '15m', // 15 minutes
        });
      case 'refresh':
        if (!payload)
          throw new InternalServerErrorException('Invalid JwtPayload');
        return this.jwtService.sign(payload, {
          secret: this.configService.getOrThrow('REFRESH_TOKEN_SECRET'),
          expiresIn: '2d', // 2 days
        });
      case 'verificationToken': {
        return randomBytes(32).toString('base64url');
      }

      default:
        throw new InternalServerErrorException('InvalidGrantType: ' + type);
    }
  }

  async register({ username, password, email }: RegisterDto) {
    const salt = await this.generateSalt();
    try {
      const existingUser = await this.usersService.findOneByIdentifier(
        email,
        false,
      );

      if (existingUser) {
        throw new ConflictException('Email already exists');
      }

      const hashedPassword = await this.hash(password, salt);
      const user = await this.usersService.create({
        username,
        password: hashedPassword,
        email,
        salt,
        role: 'user',
      });

      return user;
    } catch (error) {
      Logger.error(error);
      throw new ConflictException(error.message || 'Register failed');
    }
  }

  // check user
  async authenticate({ identifier, password }: LoginDto) {
    try {
      const user = await this.usersService.findOneByIdentifier(identifier);
      if (!user) {
        throw new BadRequestException('User not found');
      }

      await this.checkPassword(password, user.password);

      return user;
    } catch (e: any) {
      throw new BadRequestException(e.message || 'Invalid Credentials');
    }
  }

  async updateRefreshToken(email: string, token: string | null) {
    return this.usersService.updateByEmail(email, {
      refreshToken: token,
      lastSignedIn: token ? new Date() : undefined,
    });
  }

  async validateRefreshToken(payload: JwtPayload, token: string) {
    const user = await this.usersService.findOneById(payload.id);
    const userToken = user.refreshToken;

    if (!userToken || userToken !== token) {
      throw new ForbiddenException('Invalid RefreshToken');
    }
    return user;
  }
}
