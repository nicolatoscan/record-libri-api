import { Injectable } from '@nestjs/common';
import prisma from '../../common/prisma';
import { Library } from '@prisma/client';
import Joi from 'joi';

@Injectable()
export class LibrariesService {

    getAll() {
        return prisma.library.findMany();
    }

    async add(code: string, name: string) {

        Joi.string().required().min(2).max(100).validate(name);

        const l = await prisma.library.create({ data: { code: code, name: name } });
        return l.code;
    }



}
