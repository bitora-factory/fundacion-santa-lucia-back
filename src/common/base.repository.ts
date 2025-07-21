import { ObjectLiteral, Repository } from "typeorm";

export class BaseRepository<T extends ObjectLiteral> {
    constructor(protected readonly repository: Repository<T>) { }

    findAll(): Promise<T[]> {
        return this.repository.find();
    }

    findOne(id: number): Promise<T | null> {
        return this.repository.findOneBy({ id } as any);
    }

    create(data: Partial<T>): Promise<T> {
        const entity = this.repository.create(data as T);
        return this.repository.save(entity);
    }

    async update(id: number, data: Partial<T>): Promise<T | null> {
        await this.repository.update(id, data as any);
        return this.findOne(id);
    }

    delete(id: number): Promise<any> {
        return this.repository.delete(id);
    }
}