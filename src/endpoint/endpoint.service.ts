import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEndpointDto } from './dto/create-endpoint.dto';
import { UpdateEndpointDto } from './dto/update-endpoint.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Endpoint, HttpMethod } from './entities/endpoint.entity';
import { Repository } from 'typeorm';

@Injectable()
export class EndpointService {
  constructor(
    @InjectRepository(Endpoint)
    private endpointRepository: Repository<Endpoint>,
  ) {}

  create(createEndpointDto: CreateEndpointDto) {
    const endpoint = new Endpoint();

    Object.assign(endpoint, createEndpointDto);

    return this.endpointRepository.save(endpoint);
  }

  async findOne(path: string, method: HttpMethod) {
    const endpoint = await this.endpointRepository.findOne({
      where: { url: path, method },
    });

    if (!endpoint) throw new NotFoundException(`Not found endpoint`);

    return endpoint;
  }
}
