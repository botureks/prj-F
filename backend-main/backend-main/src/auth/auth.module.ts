import { Module } from '@nestjs/common';

import { JwtModule } from '../jwt/jwt.module';
import { UsersModule } from '../users/users.module';

import { AuthService } from './auth.service';

import { AuthResolver } from './auth.resolver';

@Module({
  imports: [UsersModule, JwtModule],
  providers: [AuthService, AuthResolver],
  exports: [AuthService]
})
export class AuthModule {}
