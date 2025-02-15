import { Test, TestingModule } from '@nestjs/testing';
import { FuturesTradeHistoryController } from './futures-trade-history.controller';

describe('FuturesTradeHistoryController', () => {
  let controller: FuturesTradeHistoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FuturesTradeHistoryController],
    }).compile();

    controller = module.get<FuturesTradeHistoryController>(
      FuturesTradeHistoryController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
