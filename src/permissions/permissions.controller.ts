import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { AllowPermissionDto } from './dto/allow-permission.dto';
import { API_VERSION } from 'src/_cores/constants/app.constant';
import { AuthGuard } from 'src/_cores/guards/auth.guard';

@Controller(`${API_VERSION}/permissions`)
// @UseGuards(AuthGuard)
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Post()
  allow(@Body() requestBody: AllowPermissionDto) {
    return true;
    // return this.permissionsService.allow(requestBody);
  }
}
