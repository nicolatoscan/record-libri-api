import { Injectable } from '@nestjs/common';
import prisma from '../../common/prisma';
import * as Joi from 'joi';
import { LibraryDTO } from 'src/types/dto';
import { APIService } from '../api.service';

@Injectable()
export class LibrariesService extends APIService {

    private validate(l: LibraryDTO, throwError = false): string | null {
        const schema = Joi.object({
            id: Joi.number().integer().min(1),
            code: Joi.string().required().min(1).max(50),
            name: Joi.string().required().min(1).max(100)
        });
        return this.validateSchema(schema, l, throwError);
    }

    async getAll() {
        return await prisma.libraries.findMany();
    }

    async add(l: LibraryDTO): Promise<string | null> {
        this.validate(l, true);

        return await this.prismaHandler(async () => {
            const r = await prisma.libraries.create({ data: { code: l.code, name: l.name } });
            return r.id;
        })
    }

    async update(id: number, l: LibraryDTO): Promise<string | null> {
        this.validate(l, true);

        return await this.prismaHandler(async () => {
            const r = await prisma.libraries.update({
                where: { id: id },
                data: { code: l.code, name: l.name }
            });
            return r.id;
        })
    }

    async delete(id: number): Promise<boolean> {
        return await this.prismaHandler(async () => {
            const r = await prisma.libraries.delete({ where: { id: id } });
            return r.id === id;
        })
    }

}
