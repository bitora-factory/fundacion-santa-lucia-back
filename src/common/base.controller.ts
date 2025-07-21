/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Body, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { BaseRepository } from './base.repository';
import { ObjectLiteral } from 'typeorm';

export abstract class BaseController<T extends ObjectLiteral> {
    constructor(private readonly service: BaseRepository<T>) { }

    /**
     * Base endpoints for CRUD operations.
     * These can be overridden or extended in derived controllers.
     */

    @Get()
    async findAll() {
        return this.service.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: number) {
        return this.service.findOne(id);
    }

    @Post()
    async create(@Body() createDto: Partial<T>) {
        return this.service.create(createDto);
    }

    @Put(':id')
    async update(@Param('id') id: number, @Body() updateDto: Partial<T>) {
        return this.service.update(id, updateDto);
    }

    @Delete(':id')
    async remove(@Param('id') id: number): Promise<T | null> {
        return this.service.delete(id);
    }
}