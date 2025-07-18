import { ApiProperty } from '@nestjs/swagger';

export class SignInAuthDto {
  @ApiProperty({ required: true })
  email: string;

  @ApiProperty({ required: true })
  password: string;
}
