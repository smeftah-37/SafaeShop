import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserService } from 'src/user/user.service';
import { JwtModule } from '@nestjs/jwt';

import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { ConfigModule } from '@nestjs/config';
import { GoogleStrategy } from './google.strategie';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [ TypeOrmModule.forFeature([User]),
  JwtModule.registerAsync({
    useFactory: async () => ({
      secret: process.env.ACCESS_TOKEN_SECRET,
      signOptions: { expiresIn: '1h' },

    }),
  }),
  forwardRef(() => UserModule),
],
  providers: [AuthService,GoogleStrategy],
  controllers: [AuthController],
  exports: [AuthService],

})
export class AuthModule {}
