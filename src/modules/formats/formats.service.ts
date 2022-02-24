import { Injectable } from '@nestjs/common';
import prisma from '../../common/prisma';
import { APIService } from '../api.service';
import * as Joi from 'joi';
import { FormatDTO } from 'src/types/dto';

@Injectable()
export class FormatsService extends APIService {

    private validate(r: FormatDTO, throwError = false): string | null {
        const schema = Joi.object({
            id: Joi.number().integer().min(1),
            name: Joi.string().required().min(1).max(50),
        });
        return this.validateSchema(schema, r, throwError);
    }

    async getAll(): Promise<FormatDTO[]> {
        return await this.prismaHandler(async () => {
            return prisma.formats.findMany();
        });
    }

    async add(type: FormatDTO) {
        this.validate(type, true);

        return await this.prismaHandler(async () => {
            const t = await prisma.formats.create({ data: { name: type.name } });
            return t.id;
        });
    }

    async update(id: number, type: FormatDTO) {
        this.validate(type, true);
        return await this.prismaHandler(async () => {
            const t = await prisma.formats.update({
                where: { id: id },
                data: { name: type.name }
            });
            return t.id;
        });
    }

    async delete(id: number) {
        return await this.prismaHandler(async () => {
            const t = await prisma.formats.delete({ where: { id: id }});
            return t.id;
        });
    }

}
