import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserPayload } from 'src/user/interfaces/user-payload.interface';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { CreateShippingAddressDto } from './dto/create-shipping-address.dto';
import { UpdateShippingAddressDto } from './dto/update-shipping-address.dto';
import { ShippingAddress } from './entities/shipping-address.entity';

@Injectable()
export class ShippingAddressService {
  constructor(
    @InjectRepository(ShippingAddress)
    private addressRepository: Repository<ShippingAddress>,
    private userService: UserService,
  ) {}

  async create(
    createShippingAddressDto: CreateShippingAddressDto,
    currentUser: UserPayload,
  ) {
    const user = await this.userService.findOne(currentUser.id);

    const shippingAddress = new ShippingAddress();
    shippingAddress.user = user;
    shippingAddress.value = createShippingAddressDto.value;
    shippingAddress.phoneNumber = createShippingAddressDto.phoneNumber;

    return this.addressRepository.save(shippingAddress);
  }

  async findAll() {
    const addresses = await this.addressRepository.find({
      relations: { user: true },
    });

    return addresses;
  }

  async findMyAddresses(currentUser: UserPayload) {
    const addresses = await this.addressRepository.find({
      where: { user: { id: currentUser.id } },
      relations: { user: true },
    });

    return addresses;
  }

  async findOne(id: number) {
    const address = await this.addressRepository.findOne({
      where: { id },
      relations: { user: true },
    });
    if (!address) throw new NotFoundException(`The address ${id} not found`);

    return address;
  }

  async update(id: number, updateShippingAddressDto: UpdateShippingAddressDto) {
    const { value, phoneNumber } = updateShippingAddressDto;
    const address = await this.findOne(id);

    address.value = value ? value : address.value;
    address.phoneNumber = phoneNumber ? phoneNumber : address.phoneNumber;

    return this.addressRepository.save(address);
  }

  async remove(id: number) {
    const address = await this.findOne(id);

    this.addressRepository.remove(address);
  }
}
