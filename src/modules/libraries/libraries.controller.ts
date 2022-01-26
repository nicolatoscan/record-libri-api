import { Body, Controller, Get, Post } from '@nestjs/common';
import { LibraryDTO } from 'src/types/dto';
import { LibrariesService } from './libraries.service';

@Controller('libraries')
export class LibrariesController {
    constructor(private librariesService: LibrariesService) { }

    @Get()
    async getAll() {
        return this.librariesService.getAll();
    }

    @Post()
    async add(@Body() l: LibraryDTO) {
        console.log(l);
        return 'ciao';
    }

}
