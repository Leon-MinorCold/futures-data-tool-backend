import {
  Controller,
  Get,
  Body,
  Post,
  Param,
  Delete,
  Put,
  NotFoundException,
  UseGuards,
  forwardRef,
  Inject,
} from '@nestjs/common';
import { UsersService } from './users.service';
import {
  SafeUser,
  CreateUserDto,
  UpdateUserDto,
  updateUserSchema,
  safeUserSchema,
} from '../types/user';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { ApiResponse } from '../lib/response';
import { UseUser } from './decorators/user.decorator';
import { AuthService } from '../auth/auth.service';
import { createRoleGuard } from '../auth/guards/role.guard';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
  ) {}

  @Get()
  @UseGuards(JwtGuard)
  async findAllUsers() {
    return (await this.usersService.findAll()).map((item) =>
      safeUserSchema.parse(item),
    );
  }

  @Get('me')
  @UseGuards(JwtGuard)
  getMe(@UseUser() user: SafeUser) {
    return user;
  }

  @Get(':id')
  @UseGuards(JwtGuard)
  async findUserById(@Param('id') id: string) {
    return safeUserSchema.parse(await this.usersService.findOneById(id));
  }

  @Post()
  @UseGuards(JwtGuard, createRoleGuard(['admin']))
  async createUser(@Body() userData: Omit<CreateUserDto, 'salt'>) {
    const salt = await this.authService.generateSalt();
    const hashedPassword = await this.authService.hash(userData.password, salt);
    const data = {
      ...userData,
      salt,
      password: hashedPassword,
    };

    return safeUserSchema.parse(await this.usersService.create(data));
  }

  @Put(':id')
  @UseGuards(JwtGuard)
  async updateUser(@Param('id') id: string, @Body() updateData: UpdateUserDto) {
    const parsedData = updateUserSchema.parse(updateData);
    const updatedUser = await this.usersService.update(id, parsedData);
    if (!updatedUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return safeUserSchema.parse(updatedUser);
  }

  @Delete(':id')
  @UseGuards(JwtGuard, createRoleGuard(['admin']))
  async deleteUser(@Param('id') id: string) {
    const deletedUser = await this.usersService.delete(id);

    if (!deletedUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return ApiResponse.success(
      safeUserSchema.parse(deletedUser),
      'User deleted successfully',
    );
  }
}
