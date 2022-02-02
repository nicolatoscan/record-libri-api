import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { LibraryDTO } from 'src/types/dto';
import { Public } from '../auth/public.decorator';
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
        console.log(l);
        const code = await this.librariesService.add(l);
        return { code };
    }

    @Patch(':code')
    async patch(@Param('code') code: string, @Body() l: LibraryDTO) {
        const newCode = await this.librariesService.patch(code, l);
        return { code: newCode };
    }

    @Delete(':code')
    async delete(@Param('code') code: string) {
        const deleted = await this.librariesService.delete(code);
        return { code: deleted };
    }


}
