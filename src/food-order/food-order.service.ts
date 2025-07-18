import { Injectable } from '@nestjs/common';
import { CreateFoodOrderDto } from './dto/create-food-order.dto';
import { UpdateFoodOrderDto } from './dto/update-food-order.dto';

@Injectable()
export class FoodOrderService {
  create(createFoodOrderDto: CreateFoodOrderDto) {
    return 'This action adds a new foodOrder';
  }

  findAll() {
    return `This action returns all foodOrder`;
  }

  findOne(id: number) {
    return `This action returns a #${id} foodOrder`;
  }

  update(id: number, updateFoodOrderDto: UpdateFoodOrderDto) {
    return `This action updates a #${id} foodOrder`;
  }

  remove(id: number) {
    return `This action removes a #${id} foodOrder`;
  }
}
