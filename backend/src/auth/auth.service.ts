import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';
import { PasswordEncoder } from 'src/shared/password-encoder/password.encoder';
import { UserService } from 'src/user/user.service';

import { LoginDto, LoginResponseDto } from './auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly passwordEncoder: PasswordEncoder,
  ) {}

  async login(
    loginDto: LoginDto,
    response: Response,
  ): Promise<LoginResponseDto> {
    const { username, password } = loginDto;
    const user = await this.userService.findByUsername(username);

    console.log(process.env.JWT_SECRET_KEY);

    if (
      !user ||
      !(await this.passwordEncoder.isMatch(password, user.password))
    ) {
      throw new HttpException(
        'Invalid username or password',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const { id, firstName, lastName, role } = user;

    const accessToken = await this.jwtService.signAsync(
      { username, firstName, lastName, role },
      { subject: id, expiresIn: '15m', secret: process.env.JWT_SECRET_KEY },
    );

    const refreshToken = await this.jwtService.signAsync(
      { username, firstName, lastName, role },
      { subject: id, expiresIn: '1y', secret: process.env.JWT_SECRET_KEY },
    );

    await this.userService.setRefreshToken(id, refreshToken);

    response.cookie('refresh-token', refreshToken, { httpOnly: true });

    return { token: accessToken, user };
  }

  async logout(request: Request, response: Response): Promise<void> {
    const userId = request.user['userId'];
    await this.userService.setRefreshToken(userId, null);
    response.clearCookie('refresh-token');
  }

  async refresh(refreshToken: string): Promise<LoginResponseDto> {
    if (!refreshToken) {
      throw new HttpException('Refresh token required', HttpStatus.BAD_REQUEST);
    }

    const decodedAccess = await this.jwtService.decode(refreshToken);
    const user = await this.userService.findById(decodedAccess['id']);
    const { firstName, lastName, username, id, role } = user;

    if (
      !(await this.passwordEncoder.isMatch(refreshToken, user.refreshToken))
    ) {
      throw new UnauthorizedException('Refresh token is not valid');
    }

    try {
      await this.jwtService.verifyAsync(refreshToken, {
        secret: process.env.JWT_SECRET_KEY,
      });
    } catch (error) {
      await this.userService.setRefreshToken(id, null);
      throw new UnauthorizedException('Refresh token is not valid');
    }

    const accessToken = await this.jwtService.signAsync(
      { username, firstName, lastName, role },
      { subject: id, expiresIn: '15m', secret: process.env.JWT_SECRET_KEY },
    );

    await this.userService.setRefreshToken(id, refreshToken);

    return { token: accessToken, user };
  }
}
