import { createZodDto } from 'nestjs-zod/dto';
import { dateSchema, paginationSchema } from './common';
import { z } from 'zod';

export const futuresSchema = z
  .object({
    id: z.string(),
    code: z
      .string()
      .min(1, '品种代码不能为空')
      .max(20, '品种代码不能超过20个字符'),
    name: z
      .string()
      .min(1, '品种名称不能为空')
      .max(50, '品种名称不能超过50个字符'),
    minPriceTick: z.number().positive('最小变动单位必须大于0'),
    fee: z.number().min(0, '手续费不能为负'),
    exchange: z
      .string()
      .min(1, '交易所不能为空')
      .max(50, '交易所名称不能超过50个字符'),
    size: z.number().positive('期货交易单位值必须大于0'),
    unit: z.string().min(1, '期货交易单位不能为空'),
  })
  .merge(dateSchema);

export const createFuturesSchema = futuresSchema.pick({
  code: true,
  name: true,
  minPriceTick: true,
  fee: true,
  exchange: true,
  size: true,
  unit: true,
});

export const updateFuturesSchema = futuresSchema.partial();

export const getFuturesSchema = z.object({
  exchange: z.string().optional(),
});

export class Futures extends createZodDto(futuresSchema) {}
export class CreateFuturesDto extends createZodDto(createFuturesSchema) {}
export class UpdateFuturesDto extends createZodDto(updateFuturesSchema) {}
export class GetFuturesDto extends createZodDto(getFuturesSchema) {}
export class GetPaginatedFuturesDto extends createZodDto(
  getFuturesSchema.merge(paginationSchema),
) {}
