import { Body, Post, Controller, UseGuards, Get, Query } from '@nestjs/common';
import { BaseController } from '../common/base.controller';
import {
  CreateFuturesTransactionHistoryDto,
  FuturesTransactionHistory,
  UpdateFuturesTransactionHistoryDto,
} from '../types/futures-transaction-history';
import { FuturesTransactionHistoryService } from './futures-transaction-history.service';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { PaginatedResponse } from '../types/common';

@Controller('futures-transaction-history')
export class FuturesTransactionHistoryController extends BaseController<
  FuturesTransactionHistory,
  UpdateFuturesTransactionHistoryDto
> {
  constructor(
    private readonly futuresTransactionHistoryService: FuturesTransactionHistoryService,
  ) {
    super(futuresTransactionHistoryService);
  }

  @Get()
  @UseGuards(JwtGuard)
  async all(
    @Query() query: { page?: string; pageSize?: string },
  ): Promise<PaginatedResponse<FuturesTransactionHistory>> {
    const page = query.page ? +query.page : 1;
    const pageSize = query.pageSize ? +query.pageSize : 10;
    const [list, total] = await Promise.all([
      this.futuresTransactionHistoryService.findAll({ page, pageSize }),
      this.futuresTransactionHistoryService.getTotalCount(),
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

  @Post()
  @UseGuards()
  async create(
    @Body() data: CreateFuturesTransactionHistoryDto,
  ): Promise<UpdateFuturesTransactionHistoryDto> {
    return this.futuresTransactionHistoryService.create(data);
  }
}
