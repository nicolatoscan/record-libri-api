import { Body, Controller, Delete, Get, Param, Patch, Post, Request } from '@nestjs/common';
import { RecordDTO, RecordFilterDTO } from 'src/types/dto';
import { Role } from '../auth/role.enum';
import { Roles } from '../auth/roles.decorator';
import { RecordsService } from './records.service';

@Controller('records')
export class RecordsController {
    constructor(private recordsService: RecordsService) { }

    @Get()
    @Roles(Role.Admin)
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
    @Roles(Role.User)
    async getMine(@Request() req) {
        return await this.recordsService.getMine(req.user?.id);
    }

    @Get('numbers')
    @Roles(Role.User)
    async getAllNumbers() {
        return await this.recordsService.getAllNumbers();
    }

    @Get(':id')
    @Roles(Role.User)
    async getById(@Param('id') id: string) {
        return await this.recordsService.getById(+id);
    }

    @Post()
    @Roles(Role.User)
    async add(@Request() req, @Body() record: RecordDTO) {
        return await this.recordsService.add(record, req.user?.id);
    }

    @Post('filters')
    async getFiltred(@Body() filters: RecordFilterDTO) {
        return await this.recordsService.getFiltredRecords(filters);
    }

    @Patch(':id')
    @Roles(Role.User)
    async patch(@Param('id') id: string, @Body() record: RecordDTO) {
        return await this.recordsService.update(+id, record);
    }

    @Delete(':id')
    @Roles(Role.User)
    async delete(@Param('id') id: string) {
        return await this.recordsService.delete(+id);
    }

}
