import { MiddlewareConsumer, Module, NestModule, Res } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleInterceptor } from './_cores/interceptors/roles.interceptor';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CartModule } from './cart/cart.module';
import { CartItem } from './cart/entities/cart-item.entity';
import { Cart } from './cart/entities/cart.entity';
import { CategoryModule } from './category/category.module';
import { Category } from './category/entities/category.entity';
import { EmailModule } from './email/email.module';
import { EndpointModule } from './endpoint/endpoint.module';
import { Endpoint } from './endpoint/entities/endpoint.entity';
import { OrderDetail } from './order/entities/order-detail.entity';
import { Order } from './order/entities/order.entity';
import { OrderModule } from './order/order.module';
import { Order as FoodOrder } from './food-orders/entity/food-orders.entity';
import { Permission } from './permissions/entities/permission.entity';
import { PermissionsModule } from './permissions/permissions.module';
import { ProductGallery } from './product-galleries/entities/product-gallery.entity';
import { ProductGalleriesModule } from './product-galleries/product-galleries.module';
import { Product } from './product/entities/product.entity';
import { ProductModule } from './product/product.module';
import { Review } from './review/entities/review.entity';
import { ReviewModule } from './review/review.module';
import { Role } from './role/entities/role.entity';
import { RoleModule } from './role/role.module';
import { ShippingAddress } from './shipping-address/entities/shipping-address.entity';
import { ShippingAddressModule } from './shipping-address/shipping-address.module';
import { ShippingRule } from './shipping-rule/entities/shipping-rule.entity';
import { ShippingRuleModule } from './shipping-rule/shipping-rule.module';
import { UploadModule } from './upload/upload.module';
import { User } from './user/entities/user.entity';
import { UserModule } from './user/user.module';
import { VariantItem } from './variant-items/entities/variant-item.entity';
import { VariantItemsModule } from './variant-items/variant-items.module';
import { Variant } from './variants/entities/variant.entity';
import { VariantsModule } from './variants/variants.module';
import { NotificationGateway } from './notification/notification.gateway';
import { NotificationModule } from './notification/notification.module';
import { Notification } from './notification/entity/notification.entity';
import { CacheInterceptor, CacheModule } from '@nestjs/cache-manager';
import { ONE_HOUR } from './_cores/constants/cache.constant';
import { LoggerMiddleware } from './_cores/middlewares/logger.middleware';
import { Categoryv2Module } from './categoryv2/categoryv2.module';
import { CategoryV2 } from './categoryv2/entities/categoryv2.entity';
import { TablesModule } from './tables/tables.module';
import { RestaurantTable } from './tables/entities/tables.entity';
import { MenuCategoriesModule } from './menu-categories/menu-categories.module';
import { MenuCategory } from './menu-categories/entities/menu-categories.entity';
import { MenuItemsModule } from './menu-items/menu-items.module';
import { MenuItem } from './menu-items/entity/menu_items.entity';
import { FoodOrdersModule } from './food-orders/food-orders.module';
import { FoodOrderModule } from './food-order/food-order.module';

@Module({
  imports: [
    CacheModule.register({
      isGlobal: true,
      ttl: ONE_HOUR,
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: +configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        entities: [
          User,
          Role,
          Endpoint,
          Permission,
          Category,
          Product,
          ProductGallery,
          Variant,
          VariantItem,
          Cart,
          CartItem,
          ShippingAddress,
          ShippingRule,
          Order,
          OrderDetail,
          Review,
          Notification,
          CategoryV2,
          RestaurantTable,
          MenuCategory,
          MenuItem,
          FoodOrder,
        ],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    UserModule,
    AuthModule,
    RoleModule,
    EndpointModule,
    PermissionsModule,
    CategoryModule,
    ProductModule,
    UploadModule,
    ProductGalleriesModule,
    VariantsModule,
    VariantItemsModule,
    CartModule,
    ShippingAddressModule,
    ShippingRuleModule,
    OrderModule,
    EmailModule,
    ReviewModule,
    NotificationModule,
    Categoryv2Module,
    TablesModule,
    MenuCategoriesModule,
    MenuItemsModule,
    FoodOrdersModule,
    FoodOrderModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: RoleInterceptor,
    },
    NotificationGateway,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
