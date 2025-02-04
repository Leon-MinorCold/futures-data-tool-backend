import { createZodDto } from 'nestjs-zod/dto';
// Zod 验证 schema
import { z } from 'zod';

export const futuresSchema = z.object({
  id: z.string(),
  contractCode: z
    .string()
    .min(1, '品种代码不能为空')
    .max(20, '品种代码不能超过20个字符'),
  contractName: z
    .string()
    .min(1, '品种名称不能为空')
    .max(50, '品种名称不能超过50个字符'),
  minPriceTick: z.number().positive('最小变动单位必须大于0'),
  tickValue: z.number().positive('每跳波动价值必须大于0'),
  tradingFee: z.number().min(0, '手续费不能为负'),
  exchange: z
    .string()
    .min(1, '交易所不能为空')
    .max(50, '交易所名称不能超过50个字符'),
  contractUnit: z.number().positive('合约单位必须大于0'),
});

export const createFuturesSchema = futuresSchema.pick({
  contractCode: true,
  contractName: true,
  minPriceTick: true,
  tickValue: true,
  tradingFee: true,
  exchange: true,
  contractUnit: true,
});

export const updateFuturesSchema = futuresSchema.partial();

export class CreateFuturesDto extends createZodDto(createFuturesSchema) {}
export class UpdateFuturesDto extends createZodDto(updateFuturesSchema) {}
