import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseBoolPipe,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { API_VERSION } from 'src/_cores/constants/app.constant';
import { TransformDTO } from 'src/_cores/interceptors/transform-dto.interceptor';
import { CreateShippingRuleDto } from './dto/create-shipping-rule.dto';
import { ResponseShippingRuleDto } from './dto/response-shipping-rule.dto';
import { UpdateShippingRuleDto } from './dto/update-shipping-rule.dto';
import { ShippingRuleService } from './shipping-rule.service';
import { AuthGuard } from 'src/_cores/guards/auth.guard';

@Controller(`${API_VERSION}/shipping-rules`)
@UseGuards(AuthGuard)
@TransformDTO(ResponseShippingRuleDto)
export class ShippingRuleController {
  constructor(private readonly shippingRuleService: ShippingRuleService) {}

  @Post()
  create(@Body() createShippingRuleDto: CreateShippingRuleDto) {
    return this.shippingRuleService.create(createShippingRuleDto);
  }

  @Get()
  findAll() {
    return this.shippingRuleService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.shippingRuleService.findOne(id);
  }

  @Patch(':id/:status')
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Param('status', ParseBoolPipe) status: boolean,
  ) {
    return this.shippingRuleService.updateStatus(id, status);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateShippingRuleDto: UpdateShippingRuleDto,
  ) {
    return this.shippingRuleService.update(id, updateShippingRuleDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.shippingRuleService.remove(id);
  }
}
