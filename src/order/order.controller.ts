import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { CurrentUser } from 'src/_cores/decorators/current-user.decorator';
import { UserPayload } from 'src/user/interfaces/user-payload.interface';
import { API_VERSION } from 'src/_cores/constants/app.constant';
import { AuthGuard } from 'src/_cores/guards/auth.guard';
import { TransformDTO } from 'src/_cores/interceptors/transform-dto.interceptor';
import { ResponseOrderDto } from './dto/response-order.dto';
import { ProcessOrderDto } from './dto/process.order.dto';
import { ChangeOrderStatusDto } from './dto/change-order-status.dto';

@Controller(`${API_VERSION}/orders`)
@UseGuards(AuthGuard)
@TransformDTO(ResponseOrderDto)
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  process(
    @Body() processOrderDto: ProcessOrderDto,
    @CurrentUser() user: UserPayload,
  ) {
    return this.orderService.process(user, processOrderDto);
  }

  @Post('/:id')
  changeStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() changeOrderStatusDto: ChangeOrderStatusDto,
  ) {
    return this.orderService.updateStatus(id, changeOrderStatusDto);
  }

  @Get()
  findAll() {
    return this.orderService.findAll();
  }

  @Get('/me')
  findMyOrders(@CurrentUser() user: UserPayload) {
    return this.orderService.findMyOrders(user);
  }

  @Get('/detail/:orderId')
  findOrderDetails(@Param('orderId', ParseIntPipe) orderId: number) {
    return this.orderService.findOrderDetail(orderId);
  }
}
