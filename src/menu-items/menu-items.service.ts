import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MenuItem } from './entity/menu_items.entity';
import { MenuCategory } from 'src/menu-categories/entities/menu-categories.entity';
import { CreateMenuItemDto } from './dtos/create-menu-item.dto';
import { UpdateMenuItemDto } from './dtos/update-menu-item.dto';

@Injectable()
export class MenuItemsService {
  constructor(
    @InjectRepository(MenuItem)
    private menuItemRepo: Repository<MenuItem>,

    @InjectRepository(MenuCategory)
    private categoryRepo: Repository<MenuCategory>,
  ) {}

  async findByCategory(categoryId: string) {
    return this.menuItemRepo.find({
      where: { category: { id: categoryId } },
      relations: ['category'],
    });
  }

  async create(dto: CreateMenuItemDto): Promise<MenuItem> {
    const category = await this.categoryRepo.findOne({
      where: { id: dto.categoryId },
    });

    const item = this.menuItemRepo.create({
      ...dto,
      category,
    });

    return this.menuItemRepo.save(item);
  }

  findAll(): Promise<MenuItem[]> {
    return this.menuItemRepo.find({ relations: ['category'] });
  }

  findOne(id: string): Promise<MenuItem> {
    return this.menuItemRepo.findOne({
      where: { id },
      relations: ['category'],
    });
  }

  async update(id: string, dto: UpdateMenuItemDto): Promise<MenuItem> {
    const existing = await this.menuItemRepo.findOne({ where: { id } });
    if (dto.categoryId) {
      const category = await this.categoryRepo.findOne({
        where: { id: dto.categoryId },
      });
      existing.category = category;
    }
    Object.assign(existing, dto);
    return this.menuItemRepo.save(existing);
  }

  async remove(id: string): Promise<void> {
    await this.menuItemRepo.delete(id);
  }
}
