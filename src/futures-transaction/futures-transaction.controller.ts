import { Body, Post, Controller, UseGuards, Get, Query } from '@nestjs/common';
import { BaseController } from '../common/base.controller';
import {
  CreateFuturesTransactionDto,
  FuturesTransaction,
  UpdateFuturesTransactionDto,
} from '../types/futures-transaction';
import { FuturesTransactionService } from './futures-transaction.service';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { PaginatedResponse } from '../types/common';

@Controller('futures-transaction')
export class FuturesTransactionController extends BaseController<
  FuturesTransaction,
  UpdateFuturesTransactionDto
> {
  constructor(
    private readonly futuresTransactionService: FuturesTransactionService,
  ) {
    super(futuresTransactionService);
  }

  @Get()
  @UseGuards(JwtGuard)
  async all(
    @Query() query: { page?: string; pageSize?: string },
  ): Promise<PaginatedResponse<FuturesTransaction>> {
    const page = query.page ? +query.page : 1;
    const pageSize = query.pageSize ? +query.pageSize : 10;
    const [list, total] = await Promise.all([
      this.futuresTransactionService.findAll({ page, pageSize }),
      this.futuresTransactionService.getTotalCount(),
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
    @Body() data: CreateFuturesTransactionDto,
  ): Promise<UpdateFuturesTransactionDto> {
    return this.futuresTransactionService.create(data);
  }
}
