import { Body, Controller, Get, Post, UseGuards, Query } from '@nestjs/common';
import { BaseController } from '../common/base.controller';
import {
  CreateFuturesDto,
  Futures,
  UpdateFuturesDto,
  GetFuturesDto,
} from '../types/futures';
import { FuturesService } from '../futures/futures.service';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { PaginatedResponse } from '../types/common';

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
  async paginated(
    @Query() query: { page?: string; pageSize?: string },
  ): Promise<PaginatedResponse<Futures>> {
    const page = query.page ? +query.page : 1;
    const pageSize = query.pageSize ? +query.pageSize : 10;
    const [list, total] = await Promise.all([
      this.futuresService.findPaginated({ page, pageSize }),
      this.futuresService.getTotalCount(),
    ]);
    return {
      list,
      pagination: {
        page,
        pageSize,
        total,
      },
    };
  }

  @Get('/all')
  @UseGuards(JwtGuard)
  async all(@Query() query: GetFuturesDto): Promise<{ list: Futures[] }> {
    const list = await this.futuresService.findAll(query);
    return {
      list,
    };
  }

  @Post()
  @UseGuards(JwtGuard)
  async create(@Body() data: CreateFuturesDto): Promise<Futures> {
    return this.futuresService.create(data);
  }
}
