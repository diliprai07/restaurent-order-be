import { ApiProperty } from '@nestjs/swagger';

export class SignUpAuthDTO {
  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;

  @ApiProperty()
  phone: string;

  role: string;
}
