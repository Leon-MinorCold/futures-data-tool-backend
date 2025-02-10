import { Body, Controller, Get, Post, UseGuards, Query } from '@nestjs/common';
import { BaseController } from '../common/base.controller';
import { CreateFuturesDto, Futures, UpdateFuturesDto } from '../types/futures';
import { FuturesService } from '../futures/futures.service';
import { JwtGuard } from '../auth/guards/jwt.guard';

@Controller('futures')
export class FuturesController extends BaseController<
  Futures,
  UpdateFuturesDto
> {
  constructor(private readonly futuresService: FuturesService) {
    super(futuresService);
  }

  @Get()
  @UseGuards(JwtGuard)
  async all(
    @Query() query: { page?: string; pageSize?: string },
  ): Promise<Futures[]> {
    const page = query.page ? +query.page : 1;
    const pageSize = query.pageSize ? +query.pageSize : 10;
    return this.futuresService.findAll({ page, pageSize });
  }

  @Post()
  @UseGuards(JwtGuard)
  async create(@Body() data: CreateFuturesDto): Promise<Futures> {
    return this.futuresService.create(data);
  }
}
