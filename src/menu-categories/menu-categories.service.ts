// src/modules/menu_categories/menu_categories.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MenuCategory } from './entities/menu-categories.entity';
import { CreateMenuCategoryDto } from './dto/create-menu-categories.dto';

@Injectable()
export class MenuCategoriesService {
  constructor(
    @InjectRepository(MenuCategory)
    private readonly menuCategoryRepo: Repository<MenuCategory>,
  ) {}

  async create(data: CreateMenuCategoryDto): Promise<MenuCategory> {
    const category = this.menuCategoryRepo.create(data);
    return this.menuCategoryRepo.save(category);
  }

  async findAll(): Promise<MenuCategory[]> {
    return this.menuCategoryRepo.find();
  }

  async findWithMenuItems(): Promise<MenuCategory[]> {
    return this.menuCategoryRepo.find({ relations: ['menu_items'] });
  }

  async findOne(id: string): Promise<MenuCategory> {
    return this.menuCategoryRepo.findOne({
      where: { id },
      relations: ['menu_items'],
    });
  }

  async update(id: string, data: Partial<MenuCategory>): Promise<MenuCategory> {
    await this.menuCategoryRepo.update(id, data);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.menuCategoryRepo.delete(id);
  }
}
