import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

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

    @Column()
    guardian: string;

    @Column()
    guardianDni: string;

    @Column()
    address: string;

    @Column()
    value: number;

    @Column()
    entryDate: Date;

    @Column()
    phone: string;

    @Column()
    payment: number;

    @Column()
    status: number;
}