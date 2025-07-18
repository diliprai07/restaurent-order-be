import { Module } from '@nestjs/common';
import { MenuItemsService } from './menu-items.service';
import { MenuItemsController } from './menu-items.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MenuItem } from './entity/menu_items.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { MenuCategoriesModule } from 'src/menu-categories/menu-categories.module';
import { MenuCategory } from 'src/menu-categories/entities/menu-categories.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([MenuItem, MenuCategory]),
    JwtModule,
    ConfigModule,
  ],
  providers: [MenuItemsService],
  controllers: [MenuItemsController],
})
export class MenuItemsModule {}
