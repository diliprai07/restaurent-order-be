import { Injectable } from '@nestjs/common';
import { ProductGalleriesService } from 'src/product-galleries/product-galleries.service';
import { ProductService } from 'src/product/product.service';

@Injectable()
export class UploadService {
  constructor(
    private productService: ProductService,
    private galleryService: ProductGalleriesService,
  ) {}

  async upload(type: string, entityId: number, file: Express.Multer.File) {
    if (type === 'products') {
      const product = await this.productService.findOne(entityId);
      product.image = file.filename;
      console.log(file.filename);

      await this.productService.save(product);
    }
  }

  async uploadMany(files: Array<Express.Multer.File>, productId: number) {
    const product = await this.productService.findOne(productId);

    for (const file of files) {
      await this.galleryService.create(file.filename, product);
    }
  }
}
