import { Body, Post, Controller, UseGuards } from '@nestjs/common';
import { BaseController } from '../common/base.controller';
import {
  CreateFuturesTradeHistoryDto,
  FuturesTradeHistory,
  UpdateFuturesTradeHistoryDto,
} from '../types/futures-trade-history';
import { FuturesTradeHistoryService } from './futures-trade-history.service';

@Controller('futures-trade-history')
export class FuturesTradeHistoryController extends BaseController<
  FuturesTradeHistory,
  UpdateFuturesTradeHistoryDto
> {
  constructor(
    private readonly futuresTradeHistoryService: FuturesTradeHistoryService,
  ) {
    super(futuresTradeHistoryService);
  }

  @Post()
  @UseGuards()
  async create(
    @Body() data: CreateFuturesTradeHistoryDto,
  ): Promise<FuturesTradeHistory> {
    return this.futuresTradeHistoryService.create(data);
  }
}
