import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class BarberSeederService implements OnModuleInit {
  constructor(
    @InjectRepository(User)
    private readonly barberRepository: Repository<User>,
  ) {}

  async onModuleInit() {
    await this.seed();
  }

  async seed(): Promise<void> {
    const barbers = [
      {
        email: 'remidisafae@gmail.com',
        firstName: 'John',
        lastName: 'Doe',
        password: 'password1',
        picture: 'http://example.com/barber1.jpg',
        phone: '1234567890',
        startTime: '09:00',
        endTime: '18:00',
        dayOff: 'Sunday',
        isActive: true,
      },
      {
        email: 'safae.menani8@gmail.com',
        firstName: 'Jane',
        lastName: 'Smith',
        password: 'password2',
        picture: 'http://example.com/barber2.jpg',
        phone: '9876543210',
        startTime: '10:00',
        endTime: '19:00',
        dayOff: 'Monday',
        isActive: true,
      },
      {
        email: 'barber3@example.com',
        firstName: 'Chris',
        lastName: 'Johnson',
        password: 'password3',
        picture: 'http://example.com/barber3.jpg',
        phone: '5647382910',
        startTime: '08:00',
        endTime: '17:00',
        dayOff: 'Tuesday',
        isActive: true,
      },
      {
        email: 'barber4@example.com',
        firstName: 'Alex',
        lastName: 'Lee',
        password: 'password4',
        picture: 'http://example.com/barber4.jpg',
        phone: '4820394756',
        startTime: '09:30',
        endTime: '18:30',
        dayOff: 'Wednesday',
        isActive: true,
      },
    ];

    for (const barber of barbers) {
      const exists = await this.barberRepository.findOneBy({ email: barber.email });
      if (!exists) {
        // Hash the password before saving
        const saltRounds = 10;
        barber.password = await bcrypt.hash(barber.password, saltRounds);

        await this.barberRepository.save(barber);
        console.log(`Barber ${barber.firstName} ${barber.lastName} added.`);
      } else {
        console.log(`Barber ${barber.firstName} ${barber.lastName} already exists.`);
      }
    }
  }
}
