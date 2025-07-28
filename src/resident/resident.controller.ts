import { BaseController } from "src/common/base.controller";
import { Resident } from "./resident.entity";
import { ResidentService } from "./resident.service";
import { Body, Controller, Get, Post, Param, ConflictException, BadRequestException } from "@nestjs/common";

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
    findOne(@Param('id') id: number): Promise<Resident | null> {
        return this.residentService.findOneWithMonths(id);
    }

    @Post()
    async create(@Body() createDto: Partial<Resident>) {
        if (!createDto.dni) {
            throw new BadRequestException('El DNI es requerido');
        }

        const exist = await this.residentService.findOneByDni(createDto.dni);
        if (exist && !createDto.id) {
            throw new ConflictException('Ya existe un residente con esta cédula');
        }

        return this.residentService.create(createDto);
    }
}