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
        const code = await this.librariesService.add(l);
        return { code };
    }

    @Patch(':id')
    async patch(@Param('id') id: string, @Body() l: LibraryDTO) {
        const newCode = await this.librariesService.update(+id, l);
        return { code: newCode };
    }

    @Delete(':id')
    async delete(@Param('id') id: string) {
        const deleted = await this.librariesService.delete(+id);
        return { code: deleted };
    }


}
