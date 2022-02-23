import { Body, Controller, Delete, Get, Param, Patch, Post, Request } from '@nestjs/common';
import { NonCompliancesDTO } from 'src/types/dto';
import { NonCompliancesService } from './non-compliances.service';

@Controller('non-compliances')
export class NonCompliancesController {
    constructor(private nonCompliancesService: NonCompliancesService) { }

    @Get()
    async getAll() {
        return await this.nonCompliancesService.getAll();
    }

    @Post()
    async add(@Request() req, @Body() nc: NonCompliancesDTO) {
        return await this.nonCompliancesService.add(nc, req.user?.id);
    }

    @Patch(':id')
    async patch(@Param('id') id: string, @Body() nc: NonCompliancesDTO) {
        return await this.nonCompliancesService.update(+id, nc);
    }

    @Delete(':id')
    async delete(@Param('id') id: string) {
        return await this.nonCompliancesService.delete(+id);
    }


}
