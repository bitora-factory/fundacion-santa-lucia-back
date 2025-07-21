import { InjectRepository } from "@nestjs/typeorm";
import { BaseRepository } from "src/common/base.repository";
import { Repository } from "typeorm";
import { Resident } from "./resident.entity";

export class ResidentService extends BaseRepository<Resident> {
    constructor(
        @InjectRepository(Resident)
        private residentRepository: Repository<Resident>
    ) {
        super(residentRepository);
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

    async findAllWithMonths(): Promise<Resident[]> {
        const residents = await this.findAll();
        return residents.map(resident => ({
            ...resident,
            months: this.monthsSinceEntry(resident.entryDate)
        }));
    }

    async findOneWithMonths(id: number) {
        const resident = await this.residentRepository.findOne({ where: { id } });

        if (!resident) return null;

        return {
            ...resident,
            months: this.monthsSinceEntry(resident.entryDate)
        };
    }

}