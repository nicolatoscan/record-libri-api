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
    async add(@Body() tag: TagDTO) {
        return await this.tagsService.add(tag);
    }

    @Patch(':id')
    async patch(@Param('id') id: string, @Body() tag: TagDTO) {
        return await this.tagsService.update(+id, tag);
    }

    @Delete(':id')
    async delete(@Param('id') id: string) {
        return await this.tagsService.delete(+id);
    }


}
