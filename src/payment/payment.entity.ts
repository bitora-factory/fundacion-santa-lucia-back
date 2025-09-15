import { Resident } from "src/resident/resident.entity";
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";

@Entity()
export class Payment {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    receiptNumber: number;

    @Column('decimal', { precision: 10, scale: 2 })
    totalAmount: number;

    @Column()
    date: Date;

    // Relación Many-to-One con Resident
    @ManyToOne(() => Resident, (resident) => resident.id)
    @JoinColumn({ name: 'residentId' })
    resident: Resident;

    @Column()
    residentId: number; // Clave foránea
}
