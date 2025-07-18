import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpAuthDTO } from './dto/sign-up-auth.dto';
import { SignInAuthDto } from './dto/sign-in-auth.dto';
import { API_VERSION } from 'src/_cores/constants/app.constant';

@Controller(`${API_VERSION}/auth`)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/sign-up')
  async signUp(@Body() signUpAuthDTO: SignUpAuthDTO) {
    const accessToken = await this.authService.signUp(signUpAuthDTO);

    return {
      message: 'Sign up successfully',
      data: accessToken,
    };
  }

  @Post('/sign-in')
  @HttpCode(200)
  async signIn(@Body() SignInAuthDTO: SignInAuthDto) {
    const data = await this.authService.signIn(SignInAuthDTO);

    return {
      message: 'Sign in successfully',
      data,
    };
  }

  @Post('/refresh-token')
  @HttpCode(200)
  async refreshToken(@Body() body: { refreshToken: string }) {
    const data = await this.authService.refreshTokens(body);

    return {
      message: 'Sign in successfully',
      data,
    };
  }
}
