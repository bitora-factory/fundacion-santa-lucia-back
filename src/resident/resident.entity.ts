import { Payment } from "src/payment/entities/payment.entity";
import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from "typeorm";

@Entity()
export class Resident {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ unique: true })
    dni: string;

    @Column()
    accomodation: number;

    @Column({ nullable: true })
    guardian: string;

    @Column({ nullable: true })
    guardianDni: string;

    @Column()
    address: string;

    @Column()
    value: number;

    @Column()
    entryDate: Date;

    @Column()
    phone: string;

    @Column({ nullable: true, default: 0 })
    payment: number;

    @Column({ default: 1 })
    status: number;

    // Relación One-to-Many con Payment
    @OneToMany(() => Payment, (payment) => payment.resident)
    payments: Payment[];
}