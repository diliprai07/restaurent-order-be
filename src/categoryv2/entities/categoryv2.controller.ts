import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { API_VERSION } from 'src/_cores/constants/app.constant';
import { Categoryv2Service } from './categoryv2.service';
import { ResponseCategoryV2NotChildrenDto } from '../dto/response-category-not-children.dto';
import { TransformDTO } from 'src/_cores/interceptors/transform-dto.interceptor';
import { CreateCategoryV2Dto } from '../dto/create-categoryv2.dto';
import { ResponseCategoryV2Dto } from '../dto/response-category.dto';
import { UpdateCategoryV2Dto } from '../dto/update-categoryv2.dto';
@Controller(`${API_VERSION}/categoriesv2`)
export class Categoryv2Controller {
  constructor(private readonly categoryService: Categoryv2Service) {}

  @Post()
  @TransformDTO(ResponseCategoryV2NotChildrenDto)
  create(@Body() createCategoryDto: CreateCategoryV2Dto) {
    return this.categoryService.create(createCategoryDto);
  }

  @Get()
  @TransformDTO(ResponseCategoryV2Dto)
  findAll() {
    return this.categoryService.findAll();
  }

  @Get(':id')
  @TransformDTO(ResponseCategoryV2Dto)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.categoryService.findOne(id);
  }

  @Patch(':id')
  @TransformDTO(ResponseCategoryV2NotChildrenDto)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCategoryDto: UpdateCategoryV2Dto,
  ) {
    return this.categoryService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.categoryService.remove(id);
  }
}
