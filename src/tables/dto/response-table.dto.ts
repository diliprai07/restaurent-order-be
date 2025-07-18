import { Expose, Transform } from 'class-transformer';

export class ResponseUserDto {
  @Expose()
  id: number;
  @Expose()
  table_number: string;
}
