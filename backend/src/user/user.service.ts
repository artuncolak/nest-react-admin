import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Role } from 'src/enums/role.enum';
import { PasswordEncoder } from 'src/shared/password-encoder/password.encoder';

import { CreateUserDto, UpdateUserDto } from './user.dto';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(private readonly passwordEncoder: PasswordEncoder) {}

  async save(createUserDto: CreateUserDto): Promise<void> {
    const user = await this.findByUsername(createUserDto.username);

    if (user) {
      throw new HttpException(
        `User with username ${createUserDto.username} is already exists`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const { password } = createUserDto;
    createUserDto.password = await this.passwordEncoder.encode(password);
    User.create(createUserDto).save();
  }

  async findAll(): Promise<User[]> {
    return User.find({ where: [{ role: Role.User }, { role: Role.Editor }] });
  }

  async findById(id: string): Promise<User> {
    const user = await User.findOne(id);

    if (!user) {
      throw new HttpException(
        `Could not find user with matching id ${id}`,
        HttpStatus.NOT_FOUND,
      );
    }

    return user;
  }

  async findByUsername(username: string): Promise<User> {
    return User.findOne({ where: { username } });
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<void> {
    const { password, username } = updateUserDto;

    if (password) {
      updateUserDto.password = await this.passwordEncoder.encode(password);
    }

    if (username) {
      if (await this.findByUsername(username)) {
        throw new HttpException(
          `User with username ${username} is already exists`,
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    User.update(id, { ...updateUserDto });
  }

  async delete(id: string): Promise<void> {
    User.delete(await this.findById(id));
  }

  async count(): Promise<number> {
    return await User.count();
  }

  async setRefreshToken(id: string, refreshToken: string): Promise<void> {
    const user = await this.findById(id);
    await User.update(user, {
      refreshToken: refreshToken
        ? await this.passwordEncoder.encode(refreshToken)
        : null,
    });
  }
}
