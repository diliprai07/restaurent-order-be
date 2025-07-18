import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { IsNull, Repository } from 'typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class CategoryService {
  private cacheKey: string = 'categories';

  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async create(createCategoryDto: CreateCategoryDto) {
    let parentCategory: Category = null;

    if (createCategoryDto.parentId)
      parentCategory = await this.findOne(createCategoryDto.parentId);

    const category = new Category();
    category.parent = parentCategory;

    Object.assign(category, createCategoryDto);

    await this.clearCache(category.id);

    return this.categoryRepository.save(category);
  }

  async findAll() {
    const categoriesCached = await this.cacheManager.get<Category[]>(
      this.cacheKey,
    );

    if (categoriesCached) {
      return categoriesCached;
    }

    const categories = await this.categoryRepository.find({
      where: { parent: IsNull() },
      relations: {
        children: true,
      },
    });

    await this.cacheManager.set(this.cacheKey, categories);

    return categories;
  }

  async findOne(id: number) {
    const categoryCached = await this.cacheManager.get<Category>(
      `${this.cacheKey}:${id}`,
    );

    if (categoryCached) {
      return categoryCached;
    }

    const category = await this.categoryRepository.findOne({
      where: { id },
      relations: {
        children: true,
      },
    });
    if (!category) throw new NotFoundException(`Category ${id} not found`);

    await this.cacheManager.set(`${this.cacheKey}:${id}`, category);

    return category;
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.findOne(id);

    Object.assign(category, updateCategoryDto);
    await this.clearCache(id);

    return this.categoryRepository.save(category);
  }

  async remove(id: number) {
    const category = await this.findOne(id);

    await this.clearCache(id);

    await this.categoryRepository.softRemove(category);
  }

  private async clearCache(id: number) {
    // Clear cache
    await this.cacheManager.del(this.cacheKey);
    await this.cacheManager.del(`${this.cacheKey}:${id}`);
  }
}

// Parent Category -> [ category1, category2,  category3]
