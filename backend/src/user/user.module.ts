import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { BarberSeederService } from './barber.seeder';
import { ReservationService } from './reservation.service';
import { Reservation } from './entities/reservation.entity';
import { QRCodeService } from 'src/utils/qr-code.service';
import { NodemailerService } from 'src/utils/sendMail.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([User,Reservation])],
  providers: [UserService,BarberSeederService,ReservationService,QRCodeService,NodemailerService,JwtService],
  controllers: [UserController],
  exports: [UserService]
})
export class UserModule {}
