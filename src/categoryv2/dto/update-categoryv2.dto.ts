import { PartialType } from '@nestjs/mapped-types';
import { CreateCategoryV2Dto } from './create-categoryv2.dto';

export class UpdateCategoryV2Dto extends PartialType(CreateCategoryV2Dto) {}
