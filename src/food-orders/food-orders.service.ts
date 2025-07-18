import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Order, OrderStatus } from './entity/food-orders.entity';
import { MenuItem } from 'src/menu-items/entity/menu_items.entity';
import { CreateOrderDto } from './dtos/create-food-order.dto';
import { UpdateOrderDto } from './dtos/update-food-order.dto';
import { RestaurantTable } from 'src/tables/entities/tables.entity';
@Injectable()
export class FoodOrdersService {
  constructor(
    @InjectRepository(Order)
    private orderRepo: Repository<Order>,

    @InjectRepository(MenuItem)
    private menuItemRepo: Repository<MenuItem>,

    @InjectRepository(RestaurantTable)
    private tableRepo: Repository<RestaurantTable>,
  ) {}

  async create(dto: CreateOrderDto): Promise<Order> {
    const table = await this.tableRepo.findOneBy({ id: dto.tableId });
    const items = await this.menuItemRepo.find({
      where: { id: In(dto.itemIds) },
    });

    const total = items.reduce((sum, item) => sum + Number(item.price), 0);

    const order = this.orderRepo.create({
      table,
      items,
      total,
      status: dto.status || OrderStatus.PENDING,
    });

    return this.orderRepo.save(order);
  }

  async findByTableId(tableId: string): Promise<Order[]> {
    return this.orderRepo.find({
      where: { table: { id: tableId } },
      relations: ['items', 'table'],
      order: { created_at: 'DESC' },
    });
  }

  findAll(): Promise<Order[]> {
    return this.orderRepo.find({ relations: ['items', 'table'] });
  }

  findOne(id: string): Promise<Order> {
    return this.orderRepo.findOne({
      where: { id },
      relations: ['items', 'table'],
    });
  }

  async update(id: string, dto: UpdateOrderDto): Promise<Order> {
    const order = await this.findOne(id);

    if (dto.itemIds) {
      order.items = await this.menuItemRepo.find({
        where: { id: In(dto.itemIds) },
      });
      order.total = order.items.reduce(
        (sum, item) => sum + Number(item.price),
        0,
      );
    }

    if (dto.status) order.status = dto.status;
    if (dto.tableId)
      order.table = await this.tableRepo.findOneBy({ id: dto.tableId });

    return this.orderRepo.save(order);
  }

  async remove(id: string): Promise<void> {
    await this.orderRepo.delete(id);
  }
}
