import { Payment } from "src/payment/entities/payment.entity";
import { Column, Entity, PrimaryGeneratedColumn, OneToMany, AfterInsert } from "typeorm";

@Entity()
export class Resident {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ unique: true })
    dni: string;

    @Column({ nullable: true })
    accomodation: number;

    @Column({ nullable: true })
    guardian: string;

    @Column({ nullable: true })
    guardianDni: string;

    @Column({ nullable: true })
    address: string;

    @Column({ nullable: true })
    value: number;

    @Column({ nullable: true })
    entryDate: Date;

    @Column({ nullable: true })
    phone: string;

    @Column({ type: 'text', nullable: true })
    paymentMethod: string;

    @Column({ default: 1, nullable: true })
    status: number;

    @Column({ nullable: true })
    residentId: number;

    @Column({ nullable: true })
    relationship: number;
    
    // Relación One-to-Many con Payment
    @OneToMany(() => Payment, (payment) => payment.resident)
    payments: Payment[];
}