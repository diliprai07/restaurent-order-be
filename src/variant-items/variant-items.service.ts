import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateVariantItemDto } from './dto/create-variant-item.dto';
import { UpdateVariantItemDto } from './dto/update-variant-item.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { VariantItem } from './entities/variant-item.entity';
import { Repository } from 'typeorm';
import { VariantsService } from 'src/variants/variants.service';

@Injectable()
export class VariantItemsService {
  constructor(
    @InjectRepository(VariantItem)
    private variantItemRepository: Repository<VariantItem>,
    private variantsService: VariantsService,
  ) {}

  async create(createVariantItemDto: CreateVariantItemDto) {
    const variant = await this.variantsService.findOne(
      createVariantItemDto.variantId,
    );
    const variantItem = new VariantItem();
    variantItem.variant = variant;
    Object.assign(variantItem, createVariantItemDto);

    return this.variantItemRepository.save(variantItem);
  }

  async findAll(variantId: number) {
    const variant = await this.variantsService.findOne(variantId);

    return this.variantItemRepository.find({ where: { variant } });
  }

  async findOne(id: number) {
    const variantItem = await this.variantItemRepository.findOne({
      where: { id },
      relations: { variant: true },
    });

    if (!variantItem)
      throw new BadRequestException(`Variant item ${id} not found`);

    return variantItem;
  }

  async remove(id: number) {
    const variant = await this.findOne(id);

    await this.variantItemRepository.remove(variant);
  }
}
