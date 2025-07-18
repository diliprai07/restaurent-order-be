import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { API_VERSION } from 'src/_cores/constants/app.constant';
import { CurrentUser } from 'src/_cores/decorators/current-user.decorator';
import { AuthGuard } from 'src/_cores/guards/auth.guard';
import { TransformDTO } from 'src/_cores/interceptors/transform-dto.interceptor';
import { UserPayload } from 'src/user/interfaces/user-payload.interface';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { ResponseCartDto } from './dto/response-cart.dto';

@Controller(`${API_VERSION}/carts`)
@UseGuards(AuthGuard)
@TransformDTO(ResponseCartDto)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('/add-to-cart')
  addToCart(
    @Body() addToCartDto: AddToCartDto,
    @CurrentUser() user: UserPayload,
  ) {
    return this.cartService.addItemToCart(addToCartDto, user);
  }

  @Get('/me')
  getMyCart(@CurrentUser() user: UserPayload) {
    return this.cartService.findCart(user.id);
  }

  @Delete('/item/:cartItemId')
  deleteItemFormCart(
    @Param('cartItemId', ParseIntPipe) cartItemId: number,
    @CurrentUser() user: UserPayload,
  ) {
    return this.cartService.removeItemFromCart(cartItemId, user);
  }
}
