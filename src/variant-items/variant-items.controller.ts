import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { API_VERSION } from 'src/_cores/constants/app.constant';
import { TransformDTO } from 'src/_cores/interceptors/transform-dto.interceptor';
import { CreateVariantItemDto } from './dto/create-variant-item.dto';
import { ResponseVariantItemDto } from './dto/response-variant-item.dto';
import { VariantItemsService } from './variant-items.service';
import { AuthGuard } from 'src/_cores/guards/auth.guard';

@Controller(`${API_VERSION}/variant-items`)
@TransformDTO(ResponseVariantItemDto)
export class VariantItemsController {
  constructor(private readonly variantItemsService: VariantItemsService) {}

  @Post()
  @UseGuards(AuthGuard)
  create(@Body() createVariantItemDto: CreateVariantItemDto) {
    return this.variantItemsService.create(createVariantItemDto);
  }

  @Get('/:variantId/variant')
  findAll(@Param('variantId', ParseIntPipe) variantId: number) {
    return this.variantItemsService.findAll(variantId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.variantItemsService.findOne(+id);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.variantItemsService.remove(id);
  }
}
