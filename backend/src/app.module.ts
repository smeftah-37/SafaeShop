import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/entities/user.entity';
import { Reservation } from './user/entities/reservation.entity';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
@Module({
  imports: [     ConfigModule.forRoot(), // Load environment variables globally
  TypeOrmModule.forRoot({
    type: 'postgres',
    host: `${process.env.DB_HOST}`,
    port: Number(`${process.env.DB_PORT}`),
    username: `${process.env.POSTGRES_USER}`,
    password: `${process.env.POSTGRES_PASSWORD}`,
    database: `${process.env.POSTGRES_DB}`,
    entities: [User,Reservation],
    synchronize: true,

  })
  
  ,AuthModule,UserModule,],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
