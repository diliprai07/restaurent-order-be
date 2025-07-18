import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from 'src/_cores/decorators/current-user.decorator';
import { AuthGuard } from 'src/_cores/guards/auth.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserPayload } from './interfaces/user-payload.interface';
import { UserService } from './user.service';
import { API_VERSION } from 'src/_cores/constants/app.constant';
import { TransformDTO } from 'src/_cores/interceptors/transform-dto.interceptor';
import { ResponseUserDto } from './dto/response-user.dto';
import { ChangePwdUserDto } from './dto/change-pwd-user.dto';

@Controller(`${API_VERSION}/users`)
@UseGuards(AuthGuard)
@TransformDTO(ResponseUserDto)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get('/me')
  getCurrentUser(@CurrentUser() user: UserPayload) {
    return user;
  }

  @Post('/change-password')
  changeMyPassword(
    @Body() changePwdUserDto: ChangePwdUserDto,
    @CurrentUser() user: UserPayload,
  ) {
    return this.userService.changeMyPassword(changePwdUserDto, user);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findOne(id);
  }

  @Patch('/me')
  updateMe(
    @CurrentUser() user: UserPayload,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.updateMe(user, updateUserDto);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.userService.remove(id);
  }
}
