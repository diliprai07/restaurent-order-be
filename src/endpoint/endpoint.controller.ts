import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { Request as ExpressRequest, Router } from 'express';
import { getAllRoutes } from 'src/_utils/app.util';
import { EndpointService } from './endpoint.service';
import { API_VERSION } from 'src/_cores/constants/app.constant';
import { AuthGuard } from 'src/_cores/guards/auth.guard';

@Controller(`${API_VERSION}/endpoints`)
@UseGuards(AuthGuard)
export class EndpointController {
  constructor(private readonly endpointService: EndpointService) {}

  @Get('/all')
  root(@Request() req: ExpressRequest) {
    const router = req.app._router as Router;

    return getAllRoutes(router);
  }
}
