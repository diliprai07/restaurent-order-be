import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { RoleService } from 'src/role/role.service';
import { ChangePwdUserDto } from './dto/change-pwd-user.dto';
import { UserPayload } from './interfaces/user-payload.interface';
import { SALT } from 'src/_cores/constants/app.constant';
import { CartService } from 'src/cart/cart.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private roleService: RoleService,
    private cartService: CartService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const role = await this.roleService.getRole('user');
    const user = new User();
    const hashedPassword = await bcrypt.hash(createUserDto.password, SALT);
    Object.assign(user, { ...createUserDto, password: hashedPassword, role });

    const userSaved = await this.usersRepository.save(user);

    await this.cartService.create(userSaved);

    return userSaved;
  }

  async findByEmail(email: string) {
    const user = await this.usersRepository.findOne({
      where: {
        email,
      },
      relations: { role: true },
    });

    return user;
  }

  async findAll() {
    const users = await this.usersRepository.find({
      relations: { role: true },
    });
    return users;
  }

  async findOne(id: number) {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: { role: true, orders: { orderDetails: { product: true } } },
    });

    if (!user) throw new NotFoundException(`User ${id} not found`);

    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(id);

    user.firstName = updateUserDto.firstName
      ? updateUserDto.firstName
      : user.firstName;
    user.lastName = updateUserDto.lastName
      ? updateUserDto.lastName
      : user.lastName;

    return this.usersRepository.save(user);
  }

  async updateMe(currentUser: UserPayload, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(currentUser.id);

    user.firstName = updateUserDto.firstName
      ? updateUserDto.firstName
      : user.firstName;
    user.lastName = updateUserDto.lastName
      ? updateUserDto.lastName
      : user.lastName;

    return this.usersRepository.save(user);
  }

  async remove(id: number) {
    const user = await this.findOne(id);
    await this.usersRepository.softRemove(user);
  }

  async changeMyPassword(
    changePwdUserDto: ChangePwdUserDto,
    currentUser: UserPayload,
  ) {
    const user = await this.findOne(currentUser.id);

    const { currentPassword, newPassword, confirmPassword } = changePwdUserDto;

    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) throw new BadRequestException(`Wrong password`);
    if (newPassword !== confirmPassword)
      throw new BadRequestException(`Passwords are not same`);

    const hashedNewPassword = await bcrypt.hash(newPassword, SALT);
    user.password = hashedNewPassword;

    await this.usersRepository.save(user);
  }
}
