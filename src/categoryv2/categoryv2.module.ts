import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryV2 } from './entities/categoryv2.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { Categoryv2Controller } from './entities/categoryv2.controller';
import { Categoryv2Service } from './entities/categoryv2.service';

@Module({
  imports: [TypeOrmModule.forFeature([CategoryV2]), JwtModule, ConfigModule],
  controllers: [Categoryv2Controller],
  providers: [Categoryv2Service],
})
export class Categoryv2Module {}
