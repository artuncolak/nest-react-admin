import { Module } from '@nestjs/common';
import { PasswordEncoder } from 'src/shared/password-encoder/password.encoder';

import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  controllers: [UserController],
  providers: [UserService, PasswordEncoder],
  exports: [UserService],
})
export class UserModule {}
