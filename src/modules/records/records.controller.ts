import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { RecordDTO } from 'src/types/dto';
import { RecordsService } from './records.service';

@Controller('records')
export class RecordsController {
    constructor(private recordsService: RecordsService) { }

    @Get('types')
    async getRoles() {
        return await this.recordsService.getTypes();
    }

    @Get()
    async getAll() {
        return await this.recordsService.getAll();
    }

    @Get(':id')
    async getById(@Param('id') id: string) {
        return await this.recordsService.getById(+id);
    }

    @Post()
    async add(@Body() record: RecordDTO) {
        return await this.recordsService.add(record);
    }

    @Patch(':id')
    async patch(@Param('id') id: string, @Body() record: RecordDTO) {
        return await this.recordsService.update(+id, record);
    }

    @Delete(':id')
    async delete(@Param('id') id: string) {
        return await this.recordsService.delete(+id);
    }


}
