import {
  IsUUID,
  IsArray,
  IsEnum,
  IsOptional,
} from 'class-validator';
import { OrderStatus } from '../entity/food-orders.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderDto {
  @ApiProperty()
  @IsUUID()
  tableId: string;

  @ApiProperty()
  @IsArray()
  @IsUUID('all', { each: true })
  itemIds: string[];

  @ApiProperty()
  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;
}
