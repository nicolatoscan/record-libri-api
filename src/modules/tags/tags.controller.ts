import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { TagDTO } from 'src/types/dto';
import { Role } from '../auth/role.enum';
import { Roles } from '../auth/roles.decorator';
import { TagsService } from './tags.service';

@Controller('tags')
export class TagsController {
    constructor(private tagsService: TagsService) { }

    @Get()
    async getAll() {
        return await this.tagsService.getAll();
    }

    @Post()
    @Roles(Role.Admin)
    async add(@Body() tag: TagDTO) {
        return await this.tagsService.add(tag);
    }
    
    @Patch(':id')
    @Roles(Role.Admin)
    async patch(@Param('id') id: string, @Body() tag: TagDTO) {
        return await this.tagsService.update(+id, tag);
    }
    
    @Delete(':id')
    @Roles(Role.Admin)
    async delete(@Param('id') id: string) {
        return await this.tagsService.delete(+id);
    }


}
