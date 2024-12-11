import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto, User } from './entities/user.entity';
import * as argon2 from 'argon2';


@Injectable()
export class UserService {
    constructor(@InjectRepository(User) private readonly usersRepository:Repository<User>){}

    
  async create(createUserDto: CreateUserDto) {
    const user = this.usersRepository.create(createUserDto);
    console.log(user);
    return await this.usersRepository.save(user);
  }
  async findOneByEmail(email:string): Promise<User>{
    return await this.usersRepository.findOneBy({email:email});
  }
  async findOneById(id:number){
    return await  this.usersRepository.findOneBy({id:id});
  }

  async verifyRefreshToken(token: string, hashedToken: string) {
    return await argon2.verify(hashedToken, token);
  }

  async updateRefreshToken(userId: number, refreshToken: string) {
    const user =await  this.findOneById(userId);
    if (user) {
      user.refreshToken = refreshToken;
    }
  }
  async findAllBarbers(): Promise<User[]> {
    return this.usersRepository.find({
      where: { userType: 'Barber' }, // Filter by userType
    });
  }

}
