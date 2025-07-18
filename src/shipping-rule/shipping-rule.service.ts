import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateShippingRuleDto } from './dto/create-shipping-rule.dto';
import { UpdateShippingRuleDto } from './dto/update-shipping-rule.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ShippingRule } from './entities/shipping-rule.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ShippingRuleService {
  constructor(
    @InjectRepository(ShippingRule)
    private shippingRuleRepository: Repository<ShippingRule>,
  ) {}

  create(createShippingRuleDto: CreateShippingRuleDto) {
    const shippingRule = new ShippingRule();
    shippingRule.type = createShippingRuleDto.type;
    shippingRule.cost = createShippingRuleDto.cost;
    shippingRule.estimateDay = createShippingRuleDto.estimateDay;

    return this.shippingRuleRepository.save(shippingRule);
  }

  findAll() {
    return this.shippingRuleRepository.find({ where: { status: true } });
  }

  async findOne(id: number) {
    const shippingRule = await this.shippingRuleRepository.findOne({
      where: {
        id,
      },
    });

    if (!shippingRule) throw new NotFoundException(`No shipping rule found`);

    return shippingRule;
  }

  async update(id: number, updateShippingRuleDto: UpdateShippingRuleDto) {
    const { cost, estimateDay } = updateShippingRuleDto;
    const shippingRule = await this.findOne(id);

    shippingRule.cost = cost ? cost : shippingRule.cost;
    shippingRule.estimateDay = estimateDay
      ? estimateDay
      : shippingRule.estimateDay;

    return this.shippingRuleRepository.save(shippingRule);
  }

  async updateStatus(id: number, status: boolean) {
    const shippingRule = await this.findOne(id);

    shippingRule.status = status;

    await this.shippingRuleRepository.save(shippingRule);
  }

  async remove(id: number) {
    const shippingRule = await this.findOne(id);

    await this.shippingRuleRepository.remove(shippingRule);
  }
}
