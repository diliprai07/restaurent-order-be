import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { CategoryService } from 'src/category/category.service';
import { Category } from 'src/category/entities/category.entity';
import {
  FilterOperator,
  FilterSuffix,
  Paginate,
  PaginateQuery,
  paginate,
  Paginated,
} from 'nestjs-paginate';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class ProductService {
  private readonly logger = new Logger(ProductService.name);

  private cacheKey: string = 'products';
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    private categoryService: CategoryService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async save(product: Product) {
    return this.productRepository.save(product);
  }

  async create(createProductDto: CreateProductDto) {
    const category = await this.categoryService.findOne(
      createProductDto.categoryId,
    );

    const product = new Product();
    product.category = category;

    Object.assign(product, createProductDto);
    return this.productRepository.save(product);
  }

  // async findAll() {
  //   const products = await this.productRepository.find();

  //   return products;
  // }

  public async findAll(query: PaginateQuery): Promise<Paginated<Product>> {
    this.logger.debug(`Get all products with query ${JSON.stringify(query)}`);

    const results = await paginate(query, this.productRepository, {
      sortableColumns: ['id', 'name', 'price'],
      defaultSortBy: [['price', 'DESC']],
      searchableColumns: ['name', 'shortDescription', 'longDescription'],
      filterableColumns: {
        name: [FilterOperator.EQ, FilterSuffix.NOT],
        shortDescription: [FilterOperator.EQ, FilterSuffix.NOT],
        longDescription: [FilterOperator.EQ, FilterSuffix.NOT],
      },
    });

    return results;
  }

  async findOne(id: number) {
    const productCached = await this.cacheManager.get<Product>(this.cacheKey);
    if (productCached) {
      console.log('get from cached');
      return productCached;
    }

    const product = await this.productRepository.findOne({
      where: { id },
    });

    if (!product)
      throw new NotFoundException(`Product with ID: ${id} not found`);

    await this.cacheManager.set(this.cacheKey, product);

    return product;
  }

  async findOneBySlug(slug: string) {
    const product = await this.productRepository.findOne({
      where: { slug },
      relations: { variants: { items: true } },
    });

    console.log(product);

    if (!product)
      throw new NotFoundException(`Product with slug: ${slug} not found`);

    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const product = await this.findOne(id);

    let category: Category = product.category;

    if (updateProductDto.categoryId)
      category = await this.categoryService.findOne(
        updateProductDto.categoryId,
      );

    product.category = category;

    Object.assign(product, updateProductDto);

    return this.productRepository.save(product);
  }

  async remove(id: number) {
    const product = await this.findOne(id);
    await this.productRepository.softRemove(product);
  }
}
