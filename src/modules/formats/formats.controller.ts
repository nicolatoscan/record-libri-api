import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { FormatDTO } from 'src/types/dto';
import { Role } from '../auth/role.enum';
import { Roles } from '../auth/roles.decorator';
import { FormatsService } from './formats.service';

@Controller('formats')
export class FormatsController {
    constructor(private formatsService: FormatsService) { }
    
    @Get()
    async getAll() {
        return await this.formatsService.getAll();
    }
    
    @Post()
    @Roles(Role.Admin)
    async add(@Body() type: FormatDTO) {
        return await this.formatsService.add(type);
    }
    
    @Patch(':id')
    @Roles(Role.Admin)
    async patch(@Param('id') id: string, @Body() type: FormatDTO) {
        return await this.formatsService.update(+id, type);
    }
    
    @Delete(':id')
    @Roles(Role.Admin)
    async delete(@Param('id') id: string) {
        return await this.formatsService.delete(+id);
    }

}
