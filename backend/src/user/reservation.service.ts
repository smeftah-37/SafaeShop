import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reservation } from './entities/reservation.entity';
import { User } from './entities/user.entity';
import { QRCodeService } from 'src/utils/qr-code.service';
import { NodemailerService } from 'src/utils/sendMail.service';

@Injectable()
export class ReservationService {
  constructor(
    @InjectRepository(Reservation)
    private readonly reservationRepository: Repository<Reservation>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly qrCodeService: QRCodeService,
    private readonly emailService: NodemailerService,


  ) {}
  async sendReservationQRCode(email: string, reservationId: number) {
    // Generate the QR code
    const qrCode = await this.qrCodeService.generateQRCode(reservationId);
    const confirmationUrl = `http://localhost/user/validateReservation/${reservationId}`;

    // Compose the email
    const emailHtml = `
      <p>Dear Customer,</p>
      <p>Thank you for your reservation. Please find your QR code and confirm your reservation below:</p>
      <img src="${qrCode}" alt="QR Code" />
      <p><a href="${confirmationUrl}" style="padding: 10px 20px; background-color: #007bff; color: #fff; text-decoration: none; border-radius: 5px;">Confirm Reservation</a></p>
    `;

    // Send the email
    await this.emailService.sendMail(
      email,
      'Your Reservation QR Code',
      emailHtml,
    );
  }
  async createReservation(fullName:string, barberId: number, date: string, time: string,email: string, number:string ): Promise<Reservation> {
    // Verify the user exists
  

    // Verify the barber exists and is of type 'Barber'
    const barber = await this.userRepository.findOneBy({ id: barberId, userType: 'Barber' });
    if (!barber) {
      throw new NotFoundException(`Barber with ID ${barberId} not found or is not a barber`);
    }

    // Create the reservation
    const reservation = this.reservationRepository.create({
      number,
      emailOfTheUser: email,
      barber,
      date,
      time,
      fullName,
    });
    const reservationSave =   await this.reservationRepository.save(reservation);

    await this.sendReservationQRCode(email,reservationSave.id);

    setTimeout(async () => {

      if (reservationSave && !reservationSave.status) {
        await this.reservationRepository.delete(reservationSave.id);
      } 
    }, 15 * 60 * 1000); 

    
    return reservationSave;
  }

  async updateStatus(reservId: number)
  {
    const existingReservation = await this.reservationRepository.findOne({where : {id: reservId}});
    if(existingReservation)
    {
      existingReservation.status = true;
      await this.reservationRepository.save(existingReservation);
    }


  }


  async isBarberAvailable(barberId: number, date: string, time: string): Promise<boolean> {
    // Check if a reservation exists for the barber at the given date and time
    const existingReservation = await this.reservationRepository.findOne({
      where: { barber: { id: barberId }, date, time },
    });

    return !existingReservation; // If no reservation, barber is available
  }
  async getAllReservationsSorted(): Promise<Reservation[]> {
    return this.reservationRepository.find({
      order: {
        date: 'DESC', // Sort by date descending
        time: 'DESC', // Sort by time descending
      },
    });
  }
}
