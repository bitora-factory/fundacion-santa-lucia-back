import {
    IsString,
    IsNumber,
    IsOptional,
    IsDateString,
    IsArray,
    IsNotEmpty,
    isString,
} from 'class-validator';
import { Type } from 'class-transformer';

export class ResidentRelationDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    dni: string;

    @IsOptional()
    @IsString()
    name2?: string;

    @IsString()
    dni2: string;

    @IsOptional()
    @IsNumber()
    accomodation?: number;

    @IsOptional()
    @IsString()
    guardian?: string;

    @IsString()
    @IsNotEmpty()
    guardianDni?: string;

    @IsOptional()
    @IsString()
    address?: string;

    @IsOptional()
    @IsNumber()
    value?: number;

    @IsOptional()
    @IsDateString()
    entryDate?: Date;

    @IsOptional()
    @IsString()
    phone?: string;

    @IsString()
    // @IsArray()
    @Type(() => String)
    paymentMethod?: string;

    // @IsOptional()
    @IsNumber()
    status: number;

    // @IsOptional()
    @IsNumber()
    residentId: number;

    // @IsOptional()
    @IsNumber()
    relationship: number;

    @IsOptional()
    @IsNumber()
    id: number;
}
