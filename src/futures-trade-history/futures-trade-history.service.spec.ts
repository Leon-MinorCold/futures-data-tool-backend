import { Test, TestingModule } from '@nestjs/testing';
import { FuturesTradeHistoryService } from './futures-trade-history.service';

describe('FuturesTradeHistoryService', () => {
  let service: FuturesTradeHistoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FuturesTradeHistoryService],
    }).compile();

    service = module.get<FuturesTradeHistoryService>(FuturesTradeHistoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
