import { Injectable } from '@nestjs/common';
import prisma from '../../common/prisma';
import { APIService } from '../api.service';
import * as Joi from 'joi';
import { TagDTO } from '../../types/dto';

@Injectable()
export class TagsService extends APIService {

    private validate(r: TagDTO, throwError = false): string | null {
        const schema = Joi.object({
            id: Joi.number().integer().min(1),
            name: Joi.string().required().min(1).max(50),
        });
        return this.validateSchema(schema, r, throwError);
    }

    async getAll(): Promise<TagDTO[]> {
        return await this.prismaHandler(async () => {
            return prisma.tags.findMany();
        });
    }

    async add(tag: TagDTO) {
        this.validate(tag, true);

        return await this.prismaHandler(async () => {
            const t = await prisma.tags.create({ data: { name: tag.name } });
            return t.id;
        });
    }

    async update(id: number, tag: TagDTO) {
        this.validate(tag, true);
        return await this.prismaHandler(async () => {
            const t = await prisma.tags.update({
                where: { id: id },
                data: { name: tag.name }
            });
            return t.id;
        });
    }

    async delete(id: number) {
        return await this.prismaHandler(async () => {
            const t = await prisma.tags.delete({ where: { id: id }});
            return t.id;
        });
    }

}
