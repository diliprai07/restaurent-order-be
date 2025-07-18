import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FoodOrderService } from './food-order.service';
import { CreateFoodOrderDto } from './dto/create-food-order.dto';
import { UpdateFoodOrderDto } from './dto/update-food-order.dto';

@Controller('food-order')
export class FoodOrderController {
  constructor(private readonly foodOrderService: FoodOrderService) {}

  @Post()
  create(@Body() createFoodOrderDto: CreateFoodOrderDto) {
    return this.foodOrderService.create(createFoodOrderDto);
  }

  @Get()
  findAll() {
    return this.foodOrderService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.foodOrderService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFoodOrderDto: UpdateFoodOrderDto) {
    return this.foodOrderService.update(+id, updateFoodOrderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.foodOrderService.remove(+id);
  }
}
