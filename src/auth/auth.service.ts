import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { SignUpAuthDTO } from './dto/sign-up-auth.dto';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { SignInAuthDto } from './dto/sign-in-auth.dto';
import * as bcrypt from 'bcrypt';
import { generateRefreshToken, generateToken } from 'src/_utils/token.util';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signUp(signUpAuthDTO: SignUpAuthDTO) {
    const existingUser = await this.usersRepository.findOne({
      where: { email: signUpAuthDTO.email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const user = await this.userService.create(signUpAuthDTO);

    const accessToken = await generateToken(user, this.jwtService);
    const refreshToken = await generateRefreshToken(user, this.jwtService);

    return { accessToken, refreshToken };
  }

  async signIn(signInAuthDTO: SignInAuthDto) {
    // 1) Find user by user's email
    const user = await this.userService.findByEmail(signInAuthDTO.email);

    if (!user) throw new BadRequestException('Bad Credentials');
    // 2) Compare password
    const isMatch = await bcrypt.compare(signInAuthDTO.password, user.password);
    if (!isMatch) {
      this.logger.error(`The user input wrong information`);
      throw new BadRequestException('Bad Credentials');
    }
    // 3) Issue accessToken
    const accessToken = await generateToken(user, this.jwtService);
    const refreshToken = await generateRefreshToken(user, this.jwtService);

    return { accessToken, refreshToken };
  }

  async refreshTokens({ refreshToken }: { refreshToken: string }) {
    try {
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: process.env.REFRESH_SECRET_KEY,
      });

      const user = await this.userService.findByEmail(payload.email);

      // Generate new accessToken, refreshToken

      // 3) Issue accessToken
      const newAccessToken = await generateToken(user, this.jwtService);
      const newRefreshToken = await generateRefreshToken(user, this.jwtService);

      return { accessToken: newAccessToken, refreshToken: newRefreshToken };
    } catch {
      throw new BadRequestException('RT already expired! please login again');
    }
  }
}
