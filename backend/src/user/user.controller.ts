import { Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { ReservationService } from './reservation.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { Reservation } from './entities/reservation.entity';
@ApiTags('users') // Group this controller under the "users" tag in Swagger
@Controller('user')
export class UserController {
constructor(private userService: UserService,private reservationService: ReservationService){}
  @UseGuards(AuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: number) {
    return  await this.userService.findOneById(id);
  }
  @Patch('validateReservation/:reservId')
  async validateTheReservation(@Param('reservId') id: number){
    return await this.reservationService.updateStatus(id);
  }
  @UseGuards(AuthGuard)
  @Get('barbers')
  @ApiOperation({ summary: 'Retrieve all barbers' })
  @ApiResponse({ status: 200, description: 'List of barbers' })
  async getAllBarbers(): Promise<User[]> {
    return await this.userService.findAllBarbers();
  }

  @UseGuards(AuthGuard)
  @Get('getAllReservations')
  @ApiOperation({ summary: 'Get all reservations sorted by the latest date and time' }) // Summary for the endpoint
  @ApiResponse({
    status: 200,
    description: 'Returns a list of reservations sorted by date and time',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async getAllReservations(): Promise<Reservation[]> {
    return this.reservationService.getAllReservationsSorted();
  }
}
