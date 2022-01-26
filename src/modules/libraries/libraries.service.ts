import { BadRequestException, Injectable } from '@nestjs/common';
import prisma from '../../common/prisma';
import { Library } from '@prisma/client';
import Joi from 'joi';
import { LibraryDTO } from 'src/types/dto';

@Injectable()
export class LibrariesService {

x
    private validate(l: LibraryDTO) {
        const schema = Joi.object({
            code: Joi.string().required().min(2).max(50),
            name: Joi.string().required().min(2).max(100)
        });
        const res = schema.validate(l);
        if (res.error) {
            throw new BadRequestException(res.error);
        }
    }

    getAll() {
        return prisma.library.findMany();
    }

    async add(l: LibraryDTO) {
        this.validate(l);

        const r = await prisma.library.create({ data: { code: l.code, name: l.name } });
        return r.code;
    }



}
