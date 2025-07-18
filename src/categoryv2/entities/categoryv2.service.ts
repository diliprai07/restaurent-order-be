import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryV2 } from './categoryv2.entity';
import { IsNull, Repository } from 'typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { CreateCategoryV2Dto } from '../dto/create-categoryv2.dto';
import { Cache } from 'cache-manager';
import { UpdateCategoryV2Dto } from '../dto/update-categoryv2.dto';
@Injectable()
export class Categoryv2Service {
  private cacheKey: string = 'categoriesv2';

  constructor(
    @InjectRepository(CategoryV2)
    private categoryRepository: Repository<CategoryV2>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async create(createCategoryDto: CreateCategoryV2Dto) {
    let parentCategoryV2 = null;

    if (createCategoryDto.parentId)
      parentCategoryV2 = await this.findOne(createCategoryDto.parentId);

    const category = new CategoryV2();
    category.parent = parentCategoryV2;

    Object.assign(category, createCategoryDto);

    await this.clearCache(category.id);

    return this.categoryRepository.save(category);
  }

  async findAll() {
    const categoriesCached = await this.cacheManager.get<CategoryV2[]>(
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
    const categoryCached = await this.cacheManager.get<CategoryV2>(
      `${this.cacheKey}: ${id}`,
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

    if (!category) {
      throw new NotFoundException(`Category ${id} not found`);
    }

    await this.cacheManager.set(`${this.cacheKey}:${id}`, category);

    return category;
  }

  private async clearCache(id: number) {
    // Clear cache
    await this.cacheManager.del(this.cacheKey);
    await this.cacheManager.del(`${this.cacheKey}:${id}`);
  }

  async update(id: number, updateCategoryDto: UpdateCategoryV2Dto) {
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
}
