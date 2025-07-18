import { Expose, Type } from 'class-transformer';
import { ResponseMenuItemDto } from 'src/menu-items/dtos/response-menu-item.dto';

export class ResponseMenuCategoryDto {
  @Expose()
  id: number;
  @Expose()
  name: string;
  @Expose()
  description: string;
  @Expose()
  image_url: string;

  @Expose()
  @Type(() => ResponseMenuItemDto)
  menu_items: ResponseMenuItemDto[];
}
