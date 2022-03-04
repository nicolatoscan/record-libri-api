import { Body, Controller, Delete, Get, Param, Patch, Post, Request } from '@nestjs/common';
import { RecordDTO, RecordFilterDTO } from 'src/types/dto';
import { RecordsService } from './records.service';

@Controller('records')
export class RecordsController {
    constructor(private recordsService: RecordsService) { }

    @Get()
    async getAll() {
        return await this.recordsService.getAll();
    }

    @Get('types')
    async getTypes() {
        return await this.recordsService.getTypes();
    }

    @Get('founds')
    async getRoles() {
        return await this.recordsService.getFounds();
    }

    @Get('mine')
    async getMine(@Request() req) {
        return await this.recordsService.getMine(req.user?.id);
    }

    @Get('numbers')
    async getAllNumbers() {
        return await this.recordsService.getAllNumbers();
    }

    @Get(':id')
    async getById(@Param('id') id: string) {
        return await this.recordsService.getById(+id);
    }

    @Post()
    async add(@Request() req, @Body() record: RecordDTO) {
        return await this.recordsService.add(record, req.user?.id);
    }

    @Post('filters')
    async getFiltred(@Body() filters: RecordFilterDTO) {
        return await this.recordsService.getFiltredRecords(filters);
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
