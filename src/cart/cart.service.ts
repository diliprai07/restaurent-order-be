import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductService } from 'src/product/product.service';
import { User } from 'src/user/entities/user.entity';
import { UserPayload } from 'src/user/interfaces/user-payload.interface';
import { VariantItemsService } from 'src/variant-items/variant-items.service';
import { Repository } from 'typeorm';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { CartItem } from './entities/cart-item.entity';
import { Cart } from './entities/cart.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart) private cartRepository: Repository<Cart>,
    @InjectRepository(CartItem)
    private cartItemRepository: Repository<CartItem>,
    private productService: ProductService,
    private variantItemsService: VariantItemsService,
  ) {}

  create(user: User) {
    const cart = new Cart();
    cart.user = user;
    return this.cartRepository.save(cart);
  }

  async findCart(userId: number) {
    const cart = await this.cartRepository.findOne({
      where: { user: { id: userId } },
      relations: { items: { product: true } },
    });

    if (!cart) throw new NotFoundException('No cart for this user');

    return cart;
  }

  async recalculateCartTotal(currentUser: UserPayload) {
    const cart = await this.findCart(currentUser.id);
    const cartItems = await this.cartItemRepository.find({ where: { cart } });

    const cartTotalPrice = cartItems.reduce(
      (acc, curr) => acc + parseFloat(`${curr.totalPrice}`),
      0,
    );
    cart.totalPrice = cartTotalPrice;
    await this.cartRepository.save(cart);
  }

  async addItemToCart(addToCartDto: AddToCartDto, currentUser: UserPayload) {
    const { quantity, variantItemId, productId } = addToCartDto;

    const product = await this.productService.findOne(productId);
    const variantItem = await this.variantItemsService.findOne(variantItemId);

    const variant = {
      itemId: variantItem.id,
      variant: variantItem.variant.name,
      value: variantItem.value,
      price: variantItem.price,
    };
    const totalPrice =
      product.price * quantity + parseFloat(`${variant.price}`) * quantity;

    const cartItemExisting = await this.cartItemRepository.findOne({
      where: {
        product,
      },
    });

    if (
      cartItemExisting &&
      JSON.parse(cartItemExisting.variant).itemId === variant.itemId
    ) {
      cartItemExisting.quantity = cartItemExisting.quantity + quantity;
      cartItemExisting.totalPrice =
        cartItemExisting.quantity *
        (product.price + parseFloat(`${variant.price}`));

      await this.cartItemRepository.save(cartItemExisting);
    } else {
      const cartItem = new CartItem();
      cartItem.product = product;
      cartItem.cart = await this.findCart(currentUser.id);
      cartItem.price = product.price;
      cartItem.quantity = quantity;
      cartItem.variant = JSON.stringify(variant);
      cartItem.totalPrice = totalPrice;

      await this.cartItemRepository.save(cartItem);
    }

    // Recalculate total price in cart
    await this.recalculateCartTotal(currentUser);
  }

  async findOneCartItem(cartitemId: number) {
    const cartItem = await this.cartItemRepository.findOne({
      where: { id: cartitemId },
    });

    if (!cartItem)
      throw new NotFoundException(`Cart item: ${cartitemId} not found`);

    return cartItem;
  }

  async removeItemFromCart(cartItemId: number, currentUser: UserPayload) {
    const cartItem = await this.findOneCartItem(cartItemId);

    await this.cartItemRepository.remove(cartItem);

    // Recalculate total price in cart
    await this.recalculateCartTotal(currentUser);
  }

  async clearAllMyItems(currentUser: UserPayload) {
    const cart = await this.findCart(currentUser.id);

    await this.cartItemRepository.delete({ cart: { id: cart.id } });
  }
}
