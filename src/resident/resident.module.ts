import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Resident } from "./resident.entity";
import { ResidentService } from "./resident.service";
import { ResidentController } from './resident.controller';


@Module({
    imports: [TypeOrmModule.forFeature([Resident])],
    controllers: [ResidentController],
    providers: [ResidentService],
})
export class ResidentModule { }