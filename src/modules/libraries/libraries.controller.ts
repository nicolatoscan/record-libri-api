import { Body, Controller, Get, Post } from '@nestjs/common';
import { LibrariesService } from './libraries.service';

@Controller('libraries')
export class LibrariesController {
    constructor(private librariesService: LibrariesService) { }

    @Get()
    async getAll() {
        return this.librariesService.getAll();
    }

    @Post()
    async add(@Body('code') code: string) {
        return this.librariesService.add(code, code);
    }

}
