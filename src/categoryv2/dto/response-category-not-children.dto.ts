import { Expose } from 'class-transformer';

export class ResponseCategoryV2NotChildrenDto {
  @Expose()
  id: string;
  @Expose()
  name: string;
  @Expose()
  description: string;
  @Expose()
  slug: string;
}
