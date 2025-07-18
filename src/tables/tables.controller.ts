// src/modules/tables/tables.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { TablesService } from './tables.service';
import { RestaurantTable, TableStatus } from './entities/tables.entity';
import { API_VERSION } from 'src/_cores/constants/app.constant';
import { AuthGuard } from 'src/_cores/guards/auth.guard';
import { CreateTableDto } from './dto/create-user.dto';
import { TransformDTO } from 'src/_cores/interceptors/transform-dto.interceptor';
import { ResponseUserDto } from './dto/response-table.dto';

@Controller(`${API_VERSION}/tables`)
// @UseGuards(AuthGuard)
@TransformDTO(ResponseUserDto)
export class TablesController {
  constructor(private readonly tablesService: TablesService) {}

  @Get()
  findAll(): Promise<RestaurantTable[]> {
    return this.tablesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<RestaurantTable> {
    return this.tablesService.findOne(id);
  }

  @Post()
  @UseGuards(AuthGuard)
  create(@Body() data: CreateTableDto): Promise<RestaurantTable> {
    return this.tablesService.create(data);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body('status') status: TableStatus,
  ): Promise<RestaurantTable> {
    return this.tablesService.updateStatus(id, status);
  }
}
