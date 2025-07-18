import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Put,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { MenuItemsService } from './menu-items.service';
import { CreateMenuItemDto } from './dtos/create-menu-item.dto';
import { MenuItem } from './entity/menu_items.entity';
import { UpdateMenuItemDto } from './dtos/update-menu-item.dto';
import { API_VERSION } from 'src/_cores/constants/app.constant';
import { AuthGuard } from 'src/_cores/guards/auth.guard';

@Controller(`${API_VERSION}/menu-items`)
export class MenuItemsController {
  constructor(private readonly menuItemsService: MenuItemsService) {}

  @Get('/byCategory')
  findAllByCategory(@Query('categoryId') categoryId?: string) {
    if (categoryId) {
      return this.menuItemsService.findByCategory(categoryId);
    }
    return this.menuItemsService.findAll(); // Optional: get all if no query param
  }

  @Post()
  @UseGuards(AuthGuard)
  create(@Body() dto: CreateMenuItemDto): Promise<MenuItem> {
    return this.menuItemsService.create(dto);
  }

  @Get()
  findAll(): Promise<MenuItem[]> {
    return this.menuItemsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<MenuItem> {
    return this.menuItemsService.findOne(id);
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  update(
    @Param('id') id: string,
    @Body() dto: UpdateMenuItemDto,
  ): Promise<MenuItem> {
    return this.menuItemsService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.menuItemsService.remove(id);
  }
}
