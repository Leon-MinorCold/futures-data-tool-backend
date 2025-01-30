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
} from '@nestjs/common';
import { UsersService } from './users.service';
import {
  safeUserSchema,
  CreateUserDto,
  UpdateUserDto,
  updateUserSchema,
} from '../types/user';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { ApiResponse } from '../lib/response';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(JwtGuard)
  async findAllUsers() {
    return (await this.usersService.findAll()).map((item) =>
      safeUserSchema.parse(item),
    );
  }

  @Get(':id')
  @UseGuards(JwtGuard)
  async findUserById(@Param('id') id: string) {
    return safeUserSchema.parse(await this.usersService.findOneById(id));
  }

  @Post()
  @UseGuards(JwtGuard)
  async createUser(@Body() userData: CreateUserDto) {
    return await this.usersService.create(userData);
  }

  @Put(':id')
  @UseGuards(JwtGuard)
  async updateUser(@Param('id') id: string, @Body() updateData: UpdateUserDto) {
    const parsedData = updateUserSchema.parse(updateData);
    const updatedUser = await this.usersService.update(id, parsedData);
    if (!updatedUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return updatedUser;
  }

  @Delete(':id')
  @UseGuards(JwtGuard)
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
