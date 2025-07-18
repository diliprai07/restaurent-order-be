import { Injectable, NotFoundException } from '@nestjs/common';
import { AllowPermissionDto } from './dto/allow-permission.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Permission } from './entities/permission.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>,
  ) {}

  async allow(allowPermissionDto: AllowPermissionDto) {
    const permission = await this.permissionRepository.findOne({
      where: {
        roleName: allowPermissionDto.roleName,
        endpointId: allowPermissionDto.endpointId,
      },
    });

    if (!permission) throw new NotFoundException(`Not found permission`);

    permission.isAllow = allowPermissionDto.isAllow;

    return this.permissionRepository.save(permission);
  }

  async findOne(roleName: string, endpointId: number) {
    const permission = await this.permissionRepository.findOne({
      where: { roleName, endpointId },
    });

    if (!permission) throw new NotFoundException(`Permission not found`);

    return permission;
  }
}
