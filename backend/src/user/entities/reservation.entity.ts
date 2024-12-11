import { Column, Entity, Index, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

@Entity()
// @Index(['email'])
export class Reservation {

    @PrimaryGeneratedColumn()
    id: number;
  
    @Column()
    date: string; 
  
    @Column()
    time: string;
    @Column()
    fullName: string;

    @Column()
    emailOfTheUser: string;

    @Column({default:false})
    status: boolean;

    @Column()
    number: string

    @Column({ type: 'enum', enum: ['', 'Customer'], default: 'Customer' })
    serviceType: string;
 
    @ManyToOne(() => User, { nullable: false, onDelete: 'CASCADE' })
    barber: User; 




}