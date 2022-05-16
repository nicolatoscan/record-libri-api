import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { LibraryDTO } from 'src/types/dto';
import { Role } from '../auth/role.enum';
import { Roles } from '../auth/roles.decorator';
import { LibrariesService } from './libraries.service';

@Controller('libraries')
export class LibrariesController {
    constructor(private librariesService: LibrariesService) { }

    @Get()
    async getAll() {
        return await this.librariesService.getAll();
    }

    @Post()
    @Roles(Role.Admin)
    async add(@Body() l: LibraryDTO) {
        return await this.librariesService.add(l);
    }

    @Patch(':id')
    @Roles(Role.Admin)
    async patch(@Param('id') id: string, @Body() l: LibraryDTO) {
        return await this.librariesService.update(+id, l);
    }

    @Patch(':id/budget')
    @Roles(Role.Admin)
    async patchBudget(@Param('id') id: string, @Body() b: { budget: string }) {
        return await this.librariesService.updateBudget(+id, +b.budget);
    }

    @Delete(':id')
    @Roles(Role.Admin)
    async delete(@Param('id') id: string) {
        return await this.librariesService.delete(+id);
    }

    @Get('budget-used')
    @Roles(Role.Admin)
    async getRecordsDone() {
        return await this.librariesService.getBudgetUsed();
    }
}
