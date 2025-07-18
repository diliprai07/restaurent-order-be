import { API_VERSION } from 'src/_cores/constants/app.constant';
import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Put,
  Delete,
} from '@nestjs/common';
import { FoodOrdersService } from './food-orders.service';
import { CreateOrderDto } from './dtos/create-food-order.dto';
import { Order } from './entity/food-orders.entity';
import { UpdateOrderDto } from './dtos/update-food-order.dto';

@Controller(`${API_VERSION}/food/orders`)
export class FoodOrdersController {
  constructor(private readonly ordersService: FoodOrdersService) {}

  @Get('/by-table/:tableId')
  findByTableId(@Param('tableId') tableId: string): Promise<Order[]> {
    return this.ordersService.findByTableId(tableId);
  }

  @Post()
  create(@Body() dto: CreateOrderDto): Promise<Order> {
    return this.ordersService.create(dto);
  }

  @Get()
  findAll(): Promise<Order[]> {
    return this.ordersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Order> {
    return this.ordersService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateOrderDto): Promise<Order> {
    return this.ordersService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.ordersService.remove(id);
  }
}
