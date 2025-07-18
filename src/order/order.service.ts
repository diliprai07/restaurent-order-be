import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { DataSource, Repository } from 'typeorm';
import { OrderDetail } from './entities/order-detail.entity';
import { CartService } from 'src/cart/cart.service';
import { UserPayload } from 'src/user/interfaces/user-payload.interface';
import { ProcessOrderDto } from './dto/process.order.dto';
import { ShippingAddressService } from 'src/shipping-address/shipping-address.service';
import { ShippingRuleService } from 'src/shipping-rule/shipping-rule.service';
import { ChangeOrderStatusDto } from './dto/change-order-status.dto';
import { User } from 'src/user/entities/user.entity';
import { EmailService } from 'src/email/email.service';
import { NotificationService } from 'src/notification/notification.service';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order) private orderRepository: Repository<Order>,
    @InjectRepository(OrderDetail)
    private orderDetailRepository: Repository<OrderDetail>,
    private cartService: CartService,
    private shippingAddressService: ShippingAddressService,
    private shippingRuleService: ShippingRuleService,
    private dataSource: DataSource,
    private emailService: EmailService,
    private notificationService: NotificationService,
  ) {}

  async process(currentUser: UserPayload, processOrderDto: ProcessOrderDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      // Shipping Address
      const shippingAddress = await this.shippingAddressService.findOne(
        processOrderDto.shippingAddressId,
      );

      if (shippingAddress.user.id !== currentUser.id)
        throw new BadRequestException(`Please use another address`);

      const shippingAddressInfo = {
        id: shippingAddress.id,
        value: shippingAddress.value,
        shippingAddress: shippingAddress.phoneNumber,
      };

      // Shipping Rule
      const shippingRule = await this.shippingRuleService.findOne(
        processOrderDto.shippingRuleId,
      );

      // User
      const user = await queryRunner.manager.findOne(User, {
        where: { id: currentUser.id },
      });

      const cart = await this.cartService.findCart(currentUser.id);

      const order = new Order();
      order.shippingAddress = JSON.stringify(shippingAddressInfo);
      order.shippingMethod = JSON.stringify(shippingRule);
      order.user = user;
      const newOrder = await queryRunner.manager.save(order);

      for (const cartItem of cart.items) {
        const newOrderDetails = new OrderDetail();
        newOrderDetails.order = newOrder;
        newOrderDetails.product = cartItem.product;
        newOrderDetails.productName = cartItem.product.name;
        newOrderDetails.productPrice = cartItem.product.price;
        newOrderDetails.quantity = cartItem.quantity;
        newOrderDetails.variant = cartItem.variant;
        newOrderDetails.totalPrice = cartItem.totalPrice;

        await queryRunner.manager.save(newOrderDetails);
      }

      const updatedOrder = await queryRunner.manager.findOne(Order, {
        where: { id: newOrder.id },
        relations: { orderDetails: true },
      });

      const totalOrderPrice = updatedOrder?.orderDetails?.reduce(
        (acc, curr) => acc + parseFloat(`${curr.totalPrice}`),
        0,
      );
      updatedOrder.totalPrice = totalOrderPrice;
      await queryRunner.manager.save(updatedOrder);
      // remove cart items
      await this.cartService.clearAllMyItems(currentUser);
      // Send email
      await this.emailService.sendEmail({
        to: user.email,
        subject: 'Order successfully',
        html: `<h3>Hi ${user.firstName} Your order has been successfully checkout</h3>`,
      });
      // Send notification to client
      await this.notificationService.sendNotification({
        type: 'order',
        message: `Order ${order.id} has been successfully checkout`,
      });

      await queryRunner.commitTransaction();
    } catch (error) {
      console.log('check error', error);
      await queryRunner.rollbackTransaction();
      throw new BadRequestException('Something not expected');
    } finally {
      await queryRunner.release();
    }
  }

  async findOrder(id) {
    const order = await this.orderRepository.findOne({ where: { id } });
    if (!order) throw new NotFoundException(`Order: ${id} not found`);

    return order;
  }

  async updateStatus(id: number, changeOrderStatus: ChangeOrderStatusDto) {
    const order = await this.findOrder(id);
    order.orderStatus = changeOrderStatus.status;

    await this.orderRepository.save(order);
  }

  async findAll() {
    const orders = await this.orderRepository.find({
      relations: { user: true },
    });
    return orders;
  }

  async findMyOrders(currentUser: UserPayload) {
    const orders = await this.orderRepository.find({
      where: { user: { id: currentUser.id } },
    });
    return orders;
  }

  async findOrderDetail(orderId: number) {
    const orderDetails = await this.orderDetailRepository.find({
      where: { order: { id: orderId } },
    });

    return orderDetails;
  }
}
