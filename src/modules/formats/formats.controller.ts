import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { FormatDTO } from 'src/types/dto';
import { FormatsService } from './formats.service';

@Controller('formats')
export class FormatsController {
    constructor(private formatsService: FormatsService) { }

    @Get()
    async getAll() {
        return await this.formatsService.getAll();
    }

    @Post()
    async add(@Body() type: FormatDTO) {
        return await this.formatsService.add(type);
    }

    @Patch(':id')
    async patch(@Param('id') id: string, @Body() type: FormatDTO) {
        return await this.formatsService.update(+id, type);
    }

    @Delete(':id')
    async delete(@Param('id') id: string) {
        return await this.formatsService.delete(+id);
    }


}
