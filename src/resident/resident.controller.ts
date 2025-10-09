import { BaseController } from "src/common/base.controller";
import { Resident } from "./resident.entity";
import { ResidentService } from "./resident.service";
import { Body, Controller, Get, Post, Param, Put, ConflictException, BadRequestException } from "@nestjs/common";
import { log } from "console";
import { ResidentRelationDto } from "./resident.dto";

@Controller('resident')
export class ResidentController extends BaseController<Resident> {
    constructor(private readonly residentService: ResidentService) {
        super(residentService);
    }

    @Get()
    findAll(): Promise<Resident[]> {
        return this.residentService.findAllWithMonthsAndRelationships();
    }

    @Get(':id')
    findOne(@Param('id') id: number): Promise<Resident | null> {
        const resident = this.residentService.findOneWithMonths(id);
        if (!resident) {
            throw new BadRequestException('Residente no encontrado');
        }

        return resident;
    }

    @Post()
    async create(@Body() createDto: Partial<Resident>) {
        if (!createDto.dni) {
            throw new BadRequestException('El DNI es requerido');
        }

        const existingByDni = await this.residentService.findOneByDni(createDto.dni);

        if (existingByDni) {
            console.log('Bloqueando: residente base con DNI duplicado');
            throw new ConflictException('Ya existe un residente con esta cédula');
        }

        return this.residentService.create(createDto);
    }

    @Post('reset-sequence')
    async resetSequence() {
        return this.residentService.resetIdSequence();
    }

    @Put(':id')
    async update(@Param('id') id: number, @Body() updateDto: Partial<Resident>) {
        if (!updateDto.dni) {
            throw new BadRequestException('El DNI es requerido');
        }

        // Verificar si ya existe otro residente con este DNI (que no sea el mismo que se está actualizando)
        if (updateDto.dni) {
            const existingByDni = await this.residentService.findOneByDni(updateDto.dni);
            if (existingByDni && existingByDni.id !== Number(id)) {
                console.log('Edición bloqueada: DNI duplicado con otro residente', {
                    existingId: existingByDni.id,
                    existingDni: existingByDni.dni,
                    existingResidentId: existingByDni.residentId,
                    updatingId: id,
                    updatingDni: updateDto.dni
                });
                throw new ConflictException('Ya existe un residente con esta cédula');
            }
        }

        // Si se está cambiando el residentId, validar que el nuevo existe
        if (updateDto.residentId) {
            const baseResidentExists = await this.residentService.findOneByResidentId(updateDto.residentId);
            if (!baseResidentExists) {
                throw new BadRequestException('El residente base no existe');
            }
        }

        return this.residentService.update(id, updateDto);
    }

    @Post('relation')
    async createRelation(@Body() relationDto: ResidentRelationDto) {
        const { id, dni, dni2 } = relationDto;
        const existing1 = !id ? await this.residentService.findOneByDni(dni) : false;
        const existing2 = await this.residentService.findOneByDni(dni2);

        if (existing1) {
            throw new ConflictException(`Ya existe un residente con la cédula ${dni}`);
        }

        if (existing2 && existing2.relationship && !id) {
            throw new ConflictException(`Ya existe un residente con la cédula ${dni2} y ya tiene una relación asignada`);
        }

        if (existing2) {
            return this.residentService.updateResidentRelation(relationDto);
        }

        return this.residentService.createResidentRelation(relationDto);
    }

    @Post('delete-relation')
    async deleteResidentRelation(@Body() relationDto: ResidentRelationDto) {
        return this.residentService.deleteResidentRelation(relationDto);
    }
}