import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Request, Response } from 'express';

import { UserService } from '../user/user.service';
import { LoginDto, LoginResponseDto } from './auth.dto';

@Injectable()
export class AuthService {
  private readonly SECRET = process.env.JWT_SECRET;
  private readonly REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async login(
    loginDto: LoginDto,
    response: Response,
  ): Promise<LoginResponseDto> {
    const { username, password } = loginDto;
    const user = await this.userService.findByUsername(username);

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new HttpException(
        'Invalid username or password',
        HttpStatus.UNAUTHORIZED,
      );
    }

    if (!user.isActive) {
      throw new HttpException('Account is disabled', HttpStatus.UNAUTHORIZED);
    }

    const { id, firstName, lastName, role } = user;

    const accessToken = await this.jwtService.signAsync(
      { username, firstName, lastName, role },
      { subject: id, expiresIn: '15m', secret: this.SECRET },
    );

    /* Generates a refresh token and stores it in a httponly cookie */
    const refreshToken = await this.jwtService.signAsync(
      { username, firstName, lastName, role },
      { subject: id, expiresIn: '1y', secret: this.REFRESH_SECRET },
    );

    await this.userService.setRefreshToken(id, refreshToken);

    response.cookie('refresh-token', refreshToken, { httpOnly: true });

    return { token: accessToken, user };
  }

  /* Because JWT is a stateless authentication, this function removes the refresh token from the cookies and the database */
  async logout(request: Request, response: Response): Promise<boolean> {
    const userId = request.user['userId'];
    await this.userService.setRefreshToken(userId, null);
    response.clearCookie('refresh-token');
    return true;
  }

  async refresh(
    refreshToken: string,
    response: Response,
  ): Promise<LoginResponseDto> {
    if (!refreshToken) {
      throw new HttpException('Refresh token required', HttpStatus.BAD_REQUEST);
    }

    const decoded = this.jwtService.decode(refreshToken);
    const user = await this.userService.findById(decoded['sub']);
    const { firstName, lastName, username, id, role } = user;

    if (!(await bcrypt.compare(refreshToken, user.refreshToken))) {
      response.clearCookie('refresh-token');
      throw new HttpException(
        'Refresh token is not valid',
        HttpStatus.FORBIDDEN,
      );
    }

    try {
      await this.jwtService.verifyAsync(refreshToken, {
        secret: this.REFRESH_SECRET,
      });
      const accessToken = await this.jwtService.signAsync(
        { username, firstName, lastName, role },
        { subject: id, expiresIn: '15m', secret: this.SECRET },
      );

      return { token: accessToken, user };
    } catch (error) {
      response.clearCookie('refresh-token');
      await this.userService.setRefreshToken(id, null);
      throw new HttpException(
        'Refresh token is not valid',
        HttpStatus.FORBIDDEN,
      );
    }
  }
}
