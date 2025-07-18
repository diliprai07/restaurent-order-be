import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';

import { DataSource } from 'typeorm';
import { getAllRoutes } from './_utils/app.util';
import { Endpoint, HttpMethod } from './endpoint/entities/endpoint.entity';
import { Role } from './role/entities/role.entity';
import { Permission } from './permissions/entities/permission.entity';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const log = new Logger('App');
  const app = await NestFactory.create(AppModule);

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: ['1'],
    prefix: 'api/v',
  });

  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());

  const config = new DocumentBuilder()
    .setTitle('eCommerce API')
    .setDescription('The eCommerce API description')
    .setVersion('1.0')
    .addTag('eCommerce')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  const port = 3000;
  await app.listen(port);
  log.log(`App running on port: ${port}`);

  // const server = app.getHttpServer();
  // const router = server._events.request._router;

  // const { routes } = getAllRoutes(router);

  // const dataSource = app.get(DataSource);
  // const queryRunner = dataSource.createQueryRunner();

  // try {
  //   await queryRunner.connect();
  //   await queryRunner.startTransaction();
  //   // DELETE ALL ROUTES
  //   await queryRunner.query('TRUNCATE endpoint RESTART IDENTITY CASCADE');
  //   await queryRunner.query('TRUNCATE permission RESTART IDENTITY CASCADE');

  //   console.log('truncate successfully!');

  //   // ADD ROUTES
  //   for (const route of routes) {
  //     const [method, url] = route.split(' ');

  //     queryRunner.manager
  //       .createQueryBuilder()
  //       .insert()
  //       .into(Endpoint)
  //       .values({ url, method: method as HttpMethod })
  //       .execute();
  //   }

  //   const roles = await queryRunner.manager
  //     .getRepository(Role)
  //     .createQueryBuilder('role')
  //     .where('role.isActive = :isActive', { isActive: true })
  //     .getMany();

  //   const endpoints = await queryRunner.manager
  //     .getRepository(Endpoint)
  //     .createQueryBuilder('endpoint')
  //     .getMany();

  //   for (const role of roles) {
  //     // Loop get all endpoints
  //     for (const endpoint of endpoints) {
  //       queryRunner.manager
  //         .createQueryBuilder()
  //         .insert()
  //         .into(Permission)
  //         .values({
  //           endpointId: endpoint.id,
  //           roleName: role.name,
  //           isAllow: role.name === 'admin' ? true : false,
  //         })
  //         .execute();
  //     }
  //   }

  //   await queryRunner.commitTransaction();
  //   console.log('Insert all routes into DB successfully!');
  // } catch (error) {
  //   await queryRunner.rollbackTransaction();
  //   console.log('Failed to truncate table', error);
  // } finally {
  //   await queryRunner.release();
  // }
}
bootstrap();
