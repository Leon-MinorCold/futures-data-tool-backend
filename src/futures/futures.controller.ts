import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { BaseController } from '../common/base.controller';
import { CreateFuturesDto, Futures, UpdateFuturesDto } from '../types/futures';
import { FuturesService } from '../futures/futures.service';

@Controller('futures')
export class FuturesController extends BaseController<
  Futures,
  UpdateFuturesDto
> {
  constructor(private readonly futuresService: FuturesService) {
    super(futuresService);
  }

  @Post()
  @UseGuards()
  async create(@Body() data: CreateFuturesDto): Promise<Futures> {
    return this.futuresService.create(data);
  }
}
