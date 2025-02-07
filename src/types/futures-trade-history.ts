import { createZodDto } from 'nestjs-zod/dto';
import { dateSchema } from './common';
import { z } from 'zod';

export const futuresTradeHistorySchema = z
  .object({
    id: z.string(),
    name: z
      .string()
      .min(1, '品种名不能为空')
      .max(20, '品种代码不能超过20个字符'),
    tradeDirection: z.enum(['long', 'short']),
    tradeAmount: z.number().positive('交易资金必须大于0'),
    entryPrice: z.number().positive('开仓价格必须大于0'),
    floatingProfit: z.number(),
    description: z.string().optional(),
  })
  .merge(dateSchema);

export const createFuturesTradeHistorySchema = futuresTradeHistorySchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const updateFuturesTradeHistorySchame =
  futuresTradeHistorySchema.partial();

export class FuturesTradeHistory extends createZodDto(
  futuresTradeHistorySchema,
) {}

export class CreateFuturesTradeHistoryDto extends createZodDto(
  createFuturesTradeHistorySchema,
) {}

export class UpdateFuturesTradeHistoryDto extends createZodDto(
  updateFuturesTradeHistorySchame,
) {}
