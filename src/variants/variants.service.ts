import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateVariantDto } from './dto/create-variant.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Variant } from './entities/variant.entity';
import { Repository } from 'typeorm';
import { ProductService } from 'src/product/product.service';

@Injectable()
export class VariantsService {
  constructor(
    @InjectRepository(Variant) private variantRepository: Repository<Variant>,
    private productService: ProductService,
  ) {}

  async create(createVariantDto: CreateVariantDto) {
    const product = await this.productService.findOne(
      createVariantDto.productId,
    );
    const variant = new Variant();
    variant.product = product;

    Object.assign(variant, {
      ...createVariantDto,
      name: createVariantDto.name.toLowerCase(),
    });
    return this.variantRepository.save(variant);
  }

  async findAll(productId: number) {
    const product = await this.productService.findOne(productId);

    return this.variantRepository.find({ where: { product } });
  }

  async findOne(id: number) {
    const variant = await this.variantRepository.findOne({ where: { id } });

    if (!variant) throw new NotFoundException(`Variant ${id} not found`);

    return variant;
  }

  async remove(id: number) {
    const variant = await this.findOne(id);

    this.variantRepository.remove(variant);
  }
}
