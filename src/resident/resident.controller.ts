import { BaseController } from "src/common/base.controller";
import { Resident } from "./resident.entity";
import { ResidentService } from "./resident.service";
import { Controller, Get } from "@nestjs/common";

@Controller('resident')
export class ResidentController extends BaseController<Resident> {
    constructor(private readonly residentService: ResidentService) {
        super(residentService);
    }
    @Get()
    findAll(): Promise<Resident[]> {
        return this.residentService.findAllWithMonths();
    }
    
    @Get(':id')
    findOne(id: number): Promise<Resident | null> {
        return this.residentService.findOneWithMonths(id);
    }
}