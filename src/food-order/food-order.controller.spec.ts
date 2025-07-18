import { Test, TestingModule } from '@nestjs/testing';
import { FoodOrderController } from './food-order.controller';
import { FoodOrderService } from './food-order.service';

describe('FoodOrderController', () => {
  let controller: FoodOrderController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FoodOrderController],
      providers: [FoodOrderService],
    }).compile();

    controller = module.get<FoodOrderController>(FoodOrderController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
