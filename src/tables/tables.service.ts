// src/modules/tables/tables.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RestaurantTable } from './entities/tables.entity';
import { CreateTableDto } from './dto/create-user.dto';

@Injectable()
export class TablesService {
  constructor(
    @InjectRepository(RestaurantTable)
    private tableRepo: Repository<RestaurantTable>,
  ) {}

  findAll(): Promise<RestaurantTable[]> {
    return this.tableRepo.find();
  }

  findOne(id: string): Promise<RestaurantTable> {
    return this.tableRepo.findOne({ where: { id } });
  }

  create(data: CreateTableDto) {
    const newTable = this.tableRepo.create(data);
    return this.tableRepo.save(newTable);
  }

  async updateStatus(id: string, status: string): Promise<RestaurantTable> {
    const table = await this.tableRepo.findOne({ where: { id } });
    table.status = status as any;
    return this.tableRepo.save(table);
  }
}
