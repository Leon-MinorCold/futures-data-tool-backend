import { createZodDto } from 'nestjs-zod/dto';
import { dateSchema, paginationSchema } from './common';
import { z } from 'zod';
import { futuresSchema } from './futures';

const FuturesTransactionProfitEnum = z
  .enum(['m1', 'm2', 'm3', 'sum'])
  .default('m1');
const FuturesTransactionEntryEnum = z.enum(['long', 'long']).default('long');

export const FuturesTransactionMetaSchema = futuresSchema
  .pick({
    name: true,
    minPriceTick: true,
    size: true,
  })
  .extend({
    commission: z.number().nonnegative(),
  });

export type FuturesTransactionMeta = z.infer<
  typeof FuturesTransactionMetaSchema
>;

// 基础风险控制配置
const futuresTransactionBasisSchema = z.object({
  totalCapital: z
    .number()
    .nonnegative('总资金必须大于等于0')
    .default(0)
    .describe('总资金'),
  capitalRatio: z
    .number()
    .nonnegative('资金比例必须大于等于0')
    .default(0)
    .describe('资金比例'),
  margin: z.number().nonnegative('保证金必须大于等于0').describe('保证金'),
});

export type FuturesTransactionBasis = z.infer<
  typeof futuresTransactionBasisSchema
>;

export const DEFAULT_FUTURES_TRANSACTION_BASIS: FuturesTransactionBasis = {
  totalCapital: 0,
  capitalRatio: 0,
  margin: 0,
};

// 开仓控制工具（做空or做多）
const futuresTransactionMSchema = z.object({
  entrySwing: z
    .number()
    .nonnegative('开仓波动价格必须大于等于0')
    .default(0)
    .describe('开仓波动价格'),
  positionRatio: z
    .number()
    .nonnegative('仓位百分比必须大于等于0')
    .default(0)
    .describe('仓位百分比'),
  stopLossSwing: z
    .number()
    .nonnegative('止损价格波动必须大于等于0')
    .default(0)
    .describe('止损价格波动'),
  breakevenSwing: z
    .number()
    .nonnegative('保本价格波动必须大于等于0')
    .default(0)
    .describe('保本价格波动'),
});

export type FuturesTransactionM = z.infer<typeof futuresTransactionMSchema>;

export const DEFAULT_FUTURES_TRANSACTION_M: FuturesTransactionM = {
  entrySwing: 0,
  positionRatio: 0,
  stopLossSwing: 0,
  breakevenSwing: 0,
};

const futuresTransactionEntrySchema = z.object({
  entryPrice: z
    .number()
    .nonnegative('开仓波动价格必须大于等于0')
    .default(0)
    .describe('开仓价格'),
  entryType: FuturesTransactionEntryEnum.describe(
    '交易类型：做空(short)or做多(long)',
  ),
  profitType: FuturesTransactionProfitEnum.describe('浮盈计算方式'),
  m1: futuresTransactionMSchema.default(DEFAULT_FUTURES_TRANSACTION_M),
  m2: futuresTransactionMSchema.default(DEFAULT_FUTURES_TRANSACTION_M),
  m3: futuresTransactionMSchema.default(DEFAULT_FUTURES_TRANSACTION_M),
});

export type FuturesTransactionEntry = z.infer<
  typeof futuresTransactionEntrySchema
>;

export const DEFAULT_FUTURES_TRANSACTION_ENTRY: FuturesTransactionEntry = {
  entryPrice: 0,
  entryType: 'long',
  profitType: 'm1',
};

// 浮盈管理工具
export const futuresTransactionProfitSchema = z.object({
  avgPrice: z
    .number()
    .nonnegative('平均价格必须大于等于0')
    .default(0)
    .describe('平均价格'),
  marketPrice: z
    .number()
    .nonnegative('当前价格必须大于等于0')
    .default(0)
    .describe('当前市场价格'),
  exitLotPrice: z
    .number()
    .nonnegative('出仓价格必须大于等于0')
    .default(0)
    .describe('出仓价格'),
  exitLotRatio: z
    .number()
    .nonnegative('出仓比例必须大于等于0')
    .default(0)
    .describe('出仓比例'),
  current20EMA: z
    .number()
    .nonnegative('当前20EMA价格必须大于等于0')
    .default(0)
    .describe('当前20EMA价格'),
});

export type FuturesTransactionProfit = z.infer<
  typeof futuresTransactionProfitSchema
>;

export const DEFAULT_FUTURES_TRANSACTION_PROFIT: FuturesTransactionProfit = {
  avgPrice: 0,
  marketPrice: 0,
  exitLotPrice: 0,
  exitLotRatio: 0,
  current20EMA: 0,
};

export const futuresTransactionSchema = z
  .object({
    id: z.string(),
    futuresId: z.string(),
    futuresMeta: FuturesTransactionMetaSchema,
    description: z.string().optional(),

    basis: futuresTransactionBasisSchema.default(
      DEFAULT_FUTURES_TRANSACTION_BASIS,
    ),
    entry: futuresTransactionEntrySchema.default(
      DEFAULT_FUTURES_TRANSACTION_ENTRY,
    ),
    profit: futuresTransactionProfitSchema.default(
      DEFAULT_FUTURES_TRANSACTION_PROFIT,
    ),
  })
  .merge(dateSchema);

export const createFuturesTransactionSchema = futuresTransactionSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const updateFuturesTransactionSchema =
  futuresTransactionSchema.partial();

export const getFuturesTransactionSchema = z.object({}).merge(paginationSchema);

export class FuturesTransaction extends createZodDto(
  futuresTransactionSchema,
) {}

export class GetFuturesTransactionDto extends createZodDto(
  getFuturesTransactionSchema,
) {}

export class CreateFuturesTransactionDto extends createZodDto(
  createFuturesTransactionSchema,
) {}

export class UpdateFuturesTransactionDto extends createZodDto(
  updateFuturesTransactionSchema,
) {}
