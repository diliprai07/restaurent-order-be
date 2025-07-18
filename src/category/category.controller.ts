import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { API_VERSION } from 'src/_cores/constants/app.constant';
import { AuthGuard } from 'src/_cores/guards/auth.guard';
import { TransformDTO } from 'src/_cores/interceptors/transform-dto.interceptor';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { ResponseCategoryDto } from './dto/respones-category.dto';
import { ResponseCategoryNotChildrenDto } from './dto/response-category-not-children';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller(`${API_VERSION}/categories`)
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @UseGuards(AuthGuard)
  @TransformDTO(ResponseCategoryNotChildrenDto)
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }

  @Get()
  @TransformDTO(ResponseCategoryDto)
  findAll() {
    return this.categoryService.findAll();
  }

  @Get(':id')
  @TransformDTO(ResponseCategoryDto)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.categoryService.findOne(id);
  }

  @Patch(':id')
  @TransformDTO(ResponseCategoryNotChildrenDto)
  @UseGuards(AuthGuard)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoryService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.categoryService.remove(id);
  }
}
