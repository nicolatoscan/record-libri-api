import { Injectable } from '@nestjs/common';
import prisma from '../../common/prisma';
import * as Joi from 'joi';
import { LibraryDTO } from 'src/types/dto';
import { APIService } from '../api.service';

@Injectable()
export class LibrariesService extends APIService {

    private validate(l: LibraryDTO, throwError = false): string | null {
        const schema = Joi.object({
            code: Joi.string().required().min(2).max(50),
            name: Joi.string().required().min(2).max(100)
        });
        return this.validateSchema(schema, l, throwError);
    }

    async getAll() {
        return await prisma.library.findMany();
    }

    async add(l: LibraryDTO): Promise<string | null> {
        this.validate(l, true);

        return await this.prismaHandler(async () => {
            const r = await prisma.library.create({ data: { code: l.code, name: l.name } });
            return r.code;
        })
    }

    async patch(code: string, l: LibraryDTO): Promise<string | null> {
        this.validate(l, true);

        return await this.prismaHandler(async () => {
            const r = await prisma.library.update({
                where: { code: code },
                data: { code: l.code, name: l.name }
            });
            return r.code;
        })
    }

    async delete(code: string): Promise<boolean> {
        return await this.prismaHandler(async () => {
            const r = await prisma.library.delete({ where: { code: code } });
            return r.code === code;
        })
    }

}
