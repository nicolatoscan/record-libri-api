import { Body, Controller, Delete, Get, Param, Patch, Post, Request } from '@nestjs/common';
import { NCFilterDTO, NonCompliancesDTO } from 'src/types/dto';
import { Role } from '../auth/role.enum';
import { Roles } from '../auth/roles.decorator';
import { NonCompliancesService } from './non-compliances.service';

@Controller('non-compliances')
export class NonCompliancesController {
    constructor(private nonCompliancesService: NonCompliancesService) { }

    @Get('groups')
    async getRoles() {
        return this.nonCompliancesService.getGroups();
    }

    @Get('languages')
    async getLanguages() {
        return this.nonCompliancesService.getLanguages();
    }

    @Get()
    @Roles(Role.User)
    async getAll() {
        return await this.nonCompliancesService.getAll();
    }

    @Get('year')
    @Roles(Role.User)
    async getThisYear() {
        return await this.nonCompliancesService.getThisYear();
    }

    @Get('mine')
    @Roles(Role.User)
    async getMine(@Request() req) {
        return await this.nonCompliancesService.getMine(req.user?.id);
    }

    @Post()
    @Roles(Role.User)
    async add(@Request() req, @Body() nc: NonCompliancesDTO) {
        return await this.nonCompliancesService.add(nc, req.user?.id);
    }

    @Post('filters')
    async getFiltred(@Request() req, @Body() filters: NCFilterDTO) {
        return await this.nonCompliancesService.getFiltredRecords(filters, req.user);
    }

    @Patch(':id')
    @Roles(Role.User)
    async patch(@Request() req, @Param('id') id: string, @Body() nc: NonCompliancesDTO) {
        return await this.nonCompliancesService.update(+id, nc, req.user);
    }

    @Delete(':id')
    @Roles(Role.User)
    async delete(@Request() req, @Param('id') id: string) {
        return await this.nonCompliancesService.delete(+id, req.user);
    }


}
