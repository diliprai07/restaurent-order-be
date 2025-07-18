import { Expose } from 'class-transformer';

export class ResponseMenuItemDto {
  @Expose()
  id: number;
  @Expose()
  name: string;
  @Expose()
  price: number;
  @Expose()
  image_url: string;
  @Expose()
  created_at: Date;
  @Expose()
  updated_at: Date;
}
