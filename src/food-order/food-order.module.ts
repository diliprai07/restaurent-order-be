import { Module } from '@nestjs/common';
import { FoodOrderService } from './food-order.service';
import { FoodOrderController } from './food-order.controller';

@Module({
  controllers: [FoodOrderController],
  providers: [FoodOrderService],
})
export class FoodOrderModule {}
