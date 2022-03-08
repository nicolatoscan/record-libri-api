import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { LibraryDTO } from 'src/types/dto';
import { LibrariesService } from './libraries.service';

@Controller('libraries')
export class LibrariesController {
    constructor(private librariesService: LibrariesService) { }

    @Get()
    async getAll() {
        return await this.librariesService.getAll();
    }

    @Post()
    async add(@Body() l: LibraryDTO) {
        return await this.librariesService.add(l);
    }

    @Patch(':id')
    async patch(@Param('id') id: string, @Body() l: LibraryDTO) {
        return await this.librariesService.update(+id, l);
    }

    @Delete(':id')
    async delete(@Param('id') id: string) {
        return await this.librariesService.delete(+id);
    }


}
