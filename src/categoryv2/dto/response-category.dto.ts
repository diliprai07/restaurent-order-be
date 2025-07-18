import { Expose, Type } from 'class-transformer';

export class ResponseCategoryV2Dto {
  @Expose()
  id: string;
  @Expose()
  name: string;
  @Expose()
  description: string;
  @Expose()
  slug: string;

  @Expose()
  @Type(() => ResponseCategoryV2Dto)
  children: ResponseCategoryV2Dto[];
}
