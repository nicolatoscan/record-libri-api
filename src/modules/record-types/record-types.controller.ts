import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { RecordTypeDTO } from 'src/types/dto';
import { RecordTypesService } from './record-types.service';

@Controller('record-types')
export class RecordTypesController {
    constructor(private recordTypesService: RecordTypesService) { }

    @Get()
    async getAll() {
        return await this.recordTypesService.getAll();
    }

    @Post()
    async add(@Body() type: RecordTypeDTO) {
        return await this.recordTypesService.add(type);
    }

    @Patch(':id')
    async patch(@Param('id') id: string, @Body() type: RecordTypeDTO) {
        return await this.recordTypesService.update(+id, type);
    }

    @Delete(':id')
    async delete(@Param('id') id: string) {
        return await this.recordTypesService.delete(+id);
    }


}
