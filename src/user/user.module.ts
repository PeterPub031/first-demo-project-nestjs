import { JwtStrategy } from 'src/auth/strategy';
import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  controllers: [UserController],
  providers: [UserService, JwtStrategy],
})
export class UserModule {}
