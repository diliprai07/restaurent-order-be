import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  ForbiddenException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { EndpointService } from 'src/endpoint/endpoint.service';
import { PermissionsService } from 'src/permissions/permissions.service';

@Injectable()
export class RoleInterceptor implements NestInterceptor {
  constructor(
    private endpointService: EndpointService,
    private permissionService: PermissionsService,
  ) {}

  async intercept(context: ExecutionContext, next: CallHandler) {
    const request = context.switchToHttp().getRequest();
    const {
      route: { path },
      method,
      currentUser,
    } = request;
    if (!currentUser) return next.handle();
    console.log(`Checking permissions for user: ${currentUser.username}, path: ${path}, method: ${method}`);
    // const endpoint = await this.endpointService.findOne(path, method);
    // const permission = await this.permissionService.findOne(
    //   currentUser.roleName,
    //   endpoint.id,
    // );

    // if (!permission.isAllow)
    //   throw new ForbiddenException('You cannot perform this action');

    return next.handle();
  }
}
