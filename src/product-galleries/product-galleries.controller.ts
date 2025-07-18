import {
  Controller,
  Delete,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { ProductGalleriesService } from './product-galleries.service';
import { API_VERSION } from 'src/_cores/constants/app.constant';
import { AuthGuard } from 'src/_cores/guards/auth.guard';

@Controller(`${API_VERSION}/product-galleries`)
export class ProductGalleriesController {
  constructor(
    private readonly productGalleriesService: ProductGalleriesService,
  ) {}

  @Delete(':id')
  @UseGuards(AuthGuard)
  remove(@Param('id', ParseIntPipe) id: number) {
    this.productGalleriesService.remove(id);

    return { message: 'success' };
  }
}
