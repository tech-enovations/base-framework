import { Transform, Type } from 'class-transformer';
import { IsNumber, IsObject, IsOptional } from 'class-validator';

export class BaseFilter {
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  skip: number;

  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  limit: number;
  @Transform(({ value }) => {
    try {
      return JSON.parse(value);
    } catch (err) {
      return false;
    }
  })
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  take: number;
  @Transform(({ value }) => {
    try {
      return JSON.parse(value);
    } catch (err) {
      return false;
    }
  })
  @IsObject({
    message: 'Invalid filter',
  })
  @IsOptional()
  filter: Record<string, any>;
  constructor(data?: Partial<BaseFilter>) {
    if (data) {
      const { skip = 0, limit, take = 10, ...filter } = data;
      delete filter.filter;
      this.skip = skip;
      this.limit = limit || take;
      this.filter = filter;
    }
  }
}
