import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { MenuCategoriesService } from './menu-categories.service';
import { MenuCategory } from './entities/menu-categories.entity';
import { CreateMenuCategoryDto } from './dto/create-menu-categories.dto';
import { API_VERSION } from 'src/_cores/constants/app.constant';
import { TransformDTO } from 'src/_cores/interceptors/transform-dto.interceptor';
import { ResponseMenuCategoryDto } from './dto/response-menu-catgories.dto';
import { AuthGuard } from 'src/_cores/guards/auth.guard';

@Controller(`${API_VERSION}/menu-categories`)
@TransformDTO(ResponseMenuCategoryDto)
export class MenuCategoriesController {
  constructor(private readonly menuCategoriesService: MenuCategoriesService) {}

  @Get('/with-menu-items')
  findWithMenuItems(): Promise<MenuCategory[]> {
    return this.menuCategoriesService.findWithMenuItems();
  }

  @Post()
  @UseGuards(AuthGuard)
  create(@Body() data: CreateMenuCategoryDto): Promise<MenuCategory> {
    return this.menuCategoriesService.create(data);
  }

  @Get()
  findAll(): Promise<MenuCategory[]> {
    return this.menuCategoriesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<MenuCategory> {
    return this.menuCategoriesService.findOne(id);
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  update(
    @Param('id') id: string,
    @Body() data: Partial<MenuCategory>,
  ): Promise<MenuCategory> {
    return this.menuCategoriesService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.menuCategoriesService.remove(id);
  }
}
