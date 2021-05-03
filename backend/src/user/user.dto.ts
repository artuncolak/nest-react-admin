import {
  IsAlphanumeric,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

import { Role } from '../enums/role.enum';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsNotEmpty()
  @IsAlphanumeric()
  username: string;

  @IsNotEmpty()
  @MinLength(6)
  @IsAlphanumeric()
  password: string;

  @IsEnum(Role)
  role: Role;
}

export class UpdateUserDto {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsAlphanumeric()
  username?: string;

  @IsOptional()
  @IsNotEmpty()
  @MinLength(6)
  @IsAlphanumeric()
  password?: string;

  @IsOptional()
  @IsEnum(Role)
  role?: Role;

  @IsOptional()
  @IsNotEmpty()
  @IsBoolean()
  isActive?: boolean;
}
