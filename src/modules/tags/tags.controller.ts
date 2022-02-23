import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { TagDTO } from 'src/types/dto';
import { TagsService } from './tags.service';

@Controller('tags')
export class TagsController {
    constructor(private tagsService: TagsService) { }

    @Get()
    async getAll() {
        return await this.tagsService.getAll();
    }

    @Post()
    async add(@Body() type: TagDTO) {
        return await this.tagsService.add(type);
    }

    @Patch(':id')
    async patch(@Param('id') id: string, @Body() type: TagDTO) {
        return await this.tagsService.update(+id, type);
    }

    @Delete(':id')
    async delete(@Param('id') id: string) {
        return await this.tagsService.delete(+id);
    }


}
