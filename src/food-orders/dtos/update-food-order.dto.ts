import { PartialType } from '@nestjs/mapped-types';
import { CreateOrderDto } from './create-food-order.dto';

export class UpdateOrderDto extends PartialType(CreateOrderDto) {}
