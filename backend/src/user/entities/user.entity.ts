import { Column, Entity, Index, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Reservation } from "./reservation.entity";
import { IsDate, IsEmail, IsEnum, IsNotEmpty, isNotEmpty, IsOptional, IsString, MinLength } from "class-validator";

@Entity()
@Index(['email'])
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    email: string;

    @Column({nullable: true})
    password: string;

    @Column()
    firstName: string;
    @Column({nullable:true})
    refreshToken: string;

    @Column()
    lastName: string;

    @Column({ nullable: true })
    picture: string;

    @Column({ nullable: true })
    phone: string;

    @Column({ type: 'enum', enum: ['Barber', 'Customer'], default: 'Customer' })
    userType: string;

    // Barber-specific fields
    @Column({ type: 'time', nullable: true })
    startTime: string;

    @Column({ type: 'time', nullable: true })
    endTime: string;

    @Column({ nullable: true })
    dayOff: string;

    @Column({ default: true })
    isActive: boolean;
    
    @OneToMany(() => Reservation, (reservation) => reservation.barber, { cascade: true })
    reservations: Reservation[];
}


export class CreateUserDto {

    @IsNotEmpty()
    @IsEmail()
    email:string;
    

    @IsString()
    @IsNotEmpty()
    firstName:string;


    @IsString()
    @IsNotEmpty()
    lastName:string;
    @IsString()
    picture:string;
}




