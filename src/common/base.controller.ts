import { Get, Param, Body, Put, Delete, UseGuards } from '@nestjs/common';
import { BaseService } from './base.service'; // 假设你有一个 BaseService
import { JwtGuard } from '../auth/guards/jwt.guard';

export class BaseController<T, UpdateDto> {
  constructor(private readonly service: BaseService<T, UpdateDto>) {}

  @Get(':id')
  @UseGuards(JwtGuard)
  async findOne(@Param('id') id: string): Promise<T> {
    return this.service.findOneById(id);
  }

  @Put(':id')
  @UseGuards(JwtGuard)
  async update(@Param('id') id: string, @Body() data: UpdateDto): Promise<T> {
    return this.service.update(id, data);
  }

  @Delete(':id')
  @UseGuards(JwtGuard)
  async delete(@Param('id') id: string): Promise<T> {
    return this.service.delete(id);
  }
}
