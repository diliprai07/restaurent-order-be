import { Module } from '@nestjs/common';
import { FoodOrdersController } from './food-orders.controller';
import { FoodOrdersService } from './food-orders.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RestaurantTable } from 'src/tables/entities/tables.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { Order } from './entity/food-orders.entity';
import { MenuItem } from 'src/menu-items/entity/menu_items.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, MenuItem, RestaurantTable]),
    JwtModule,
    ConfigModule,
  ],
  controllers: [FoodOrdersController],
  providers: [FoodOrdersService],
})
export class FoodOrdersModule {}
