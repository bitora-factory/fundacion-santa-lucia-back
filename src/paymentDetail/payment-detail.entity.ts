import { Payment } from "src/payment/payment.entity";
import { Resident } from "src/resident/resident.entity";
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";

@Entity()
export class PaymentDetail {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    code: string;

    @Column()
    detail: string;
    
    @Column({ nullable: true })
    units: number;
    
    @Column('decimal', { precision: 10, scale: 2, nullable: true })
    unitPrice: number;
    
    @Column('decimal', { precision: 10, scale: 2, nullable: true })
    total: number;
    
    // Relación Many-to-One con Resident
    @ManyToOne(() => Payment, (payment) => payment.id)
    @JoinColumn({ name: 'paymentId' })
    payment: Payment;

    @Column()
    paymentId: number; // Clave foránea
}
