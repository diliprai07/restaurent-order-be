import { Module } from '@nestjs/common';
import { VariantItemsController } from './variant-items.controller';
import { VariantItemsService } from './variant-items.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VariantItem } from './entities/variant-item.entity';
import { VariantsModule } from 'src/variants/variants.module';

@Module({
  imports: [TypeOrmModule.forFeature([VariantItem]), VariantsModule],
  controllers: [VariantItemsController],
  providers: [VariantItemsService],
  exports: [VariantItemsService],
})
export class VariantItemsModule {}
