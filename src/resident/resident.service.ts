import { InjectRepository } from "@nestjs/typeorm";
import { BaseRepository } from "src/common/base.repository";
import { Repository } from "typeorm";
import { Resident } from "./resident.entity";
import { ResidentRelationDto } from "./resident.dto";
import { log } from "console";

export class ResidentService extends BaseRepository<Resident> {
    constructor(
        @InjectRepository(Resident)
        private residentRepository: Repository<Resident>
    ) {
        super(residentRepository);
    }

    async create(data: Partial<Resident>): Promise<Resident> {
        // 1. Crear entidad en memoria
        let resident = this.residentRepository.create(data);

        // 2. Guardar en DB para que genere el id
        resident = await this.residentRepository.save(resident);

        // 3. Asignar residentId = id (si no tiene)
        if (!resident.residentId) {
            resident.residentId = resident.id;
            resident = await this.residentRepository.save(resident);
        }

        return resident;
    }

    async createResidentRelation(data: Partial<ResidentRelationDto>): Promise<Resident[]> {
        const { id, name, dni, name2, dni2, ...common } = data;
        const residents = [
            { name, dni, ...common },
            { name: name2, dni: dni2, ...common }
        ];

        const createdResidents: Resident[] = [];
        for (const residentData of residents) {
            const created = await this.residentRepository.create(residentData);
            createdResidents.push(created);
        }

        const savedResidents: Resident[] = [];
        for (const resident of createdResidents) {
            const saved = resident.id ? await this.residentRepository.save(resident) :
                await this.residentRepository.save(resident);
            savedResidents.push(saved);
        }

        createdResidents[0].residentId = createdResidents[0].id;
        createdResidents[1].residentId = createdResidents[0].id;
        createdResidents[0].relationship = createdResidents[1].id;
        createdResidents[1].relationship = createdResidents[0].id;

        for (const resident of createdResidents) {
            const saved = await this.residentRepository.save(resident);
            savedResidents.push(saved);
        }

        return savedResidents;

    }

    async updateResidentRelation(data: Partial<ResidentRelationDto>): Promise<Resident[]> {
        const { name, dni, name2, dni2, ...common } = data;

        // Asegurar que common no arrastre accidentalmente un id
        const { id, relationship, ...safeCommon } = common;

        const existing1 = await this.residentRepository.findOne({ where: { dni } });
        const existing2 = await this.residentRepository.findOne({ where: { dni: dni2 } });

        log('Existing residents for update:', { existing1, existing2 });

        const residents = [
            {
                id: existing1?.id,
                name: name || existing1?.name,
                dni,
                relationship: existing2?.id,
                ...safeCommon,
            },
            {
                id: existing2?.id,
                name: name2 || existing2?.name,
                dni: dni2,
                relationship: existing1?.id,
                ...safeCommon,
            },
        ];

        log('Updating residents:', residents);

        return this.residentRepository.save(residents);
    }

    async deleteResidentRelation(data: Partial<ResidentRelationDto>): Promise<Resident[]> {
        const existing1 = await this.residentRepository.findOne({ where: { dni: data.dni } });
        const existing2 = await this.residentRepository.findOne({ where: { dni: data.dni2 } });

        if (!existing1 && !existing2) {
            throw new Error('Ningún residente encontrado con los DNIs proporcionados');
        }
        const residents = [
            {
                ...existing1,
                relationship: null,
                residentId: existing1?.id,
            },
            {
                ...existing2,
                relationship: null,
                residentId: existing2?.id,
            },
        ];

        return this.residentRepository.save(residents as any);
    }


    monthsSinceEntry(entryDate: Date): number {
        const now = new Date();
        let months = (now.getFullYear() - entryDate.getFullYear()) * 12;
        months += now.getMonth() - entryDate.getMonth();

        // Si aún no pasó el día del mes actual, restamos uno
        if (now.getDate() < entryDate.getDate()) {
            months--;
        }

        return months;
    }

    async findAllWithMonthsAndRelationships(): Promise<Resident[]> {
        const residents = await this.findAll();
        const result = residents.map(resident => {
            const related = residents.find(r => r.id === resident.relationship);
            return {
                ...resident,
                months: this.monthsSinceEntry(resident.entryDate),
                dni2: related?.dni,
                name2: related?.name
            };
        });

        //     return ({
        //         ...resident,
        //         months: this.monthsSinceEntry(resident.entryDate),
        //         dni2: resident2?.dni,
        //         name2: resident2?.name
        //     });
        // }));
        return result.sort((a, b) => a.residentId - b.residentId);
    }

    async findOneWithMonths(id: number) {
        const resident = await this.residentRepository.findOne({ where: { id } });

        if (!resident) return null;

        return {
            ...resident,
            months: this.monthsSinceEntry(resident.entryDate)
        };
    }

    async findOneByDni(dni: string): Promise<Resident | null> {
        return this.residentRepository.findOne({ where: { dni } });
    }

    async getNextResidentId(): Promise<number> {
        const lastResident = await this.residentRepository
            .createQueryBuilder('resident')
            .orderBy('resident.residentId', 'DESC')
            .getOne();

        return lastResident ? lastResident.residentId + 1 : 1;
    }

    async findOneByResidentId(residentId: number): Promise<Resident | null> {
        return this.residentRepository.findOne({
            where: { residentId: residentId }
        });
    }

    async resetIdSequence(): Promise<{ message: string, currentMax: number, newSequence: number }> {
        // Obtener el ID máximo actual
        const result = await this.residentRepository
            .createQueryBuilder('resident')
            .select('MAX(resident.id)', 'maxId')
            .getRawOne();

        const currentMaxId = result.maxId || 0;
        const newSequenceValue = currentMaxId + 1;

        // Resetear la secuencia de PostgreSQL
        await this.residentRepository.query(
            `SELECT setval(pg_get_serial_sequence('resident', 'id'), $1, false)`,
            [newSequenceValue]
        );

        return {
            message: 'Secuencia resetada exitosamente',
            currentMax: currentMaxId,
            newSequence: newSequenceValue
        };
    }

}