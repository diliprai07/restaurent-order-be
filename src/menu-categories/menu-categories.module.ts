import { Global, Module } from '@nestjs/common';
import { MenuCategoriesController } from './menu-categories.controller';
import { MenuCategoriesService } from './menu-categories.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MenuCategory } from './entities/menu-categories.entity';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
@Global()
@Module({
  imports: [TypeOrmModule.forFeature([MenuCategory]), JwtModule, ConfigModule],
  controllers: [MenuCategoriesController],
  providers: [MenuCategoriesService],
  exports: [MenuCategoriesService],
})
export class MenuCategoriesModule {}
