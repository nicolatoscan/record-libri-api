import { Injectable } from '@nestjs/common';
import prisma from '../../common/prisma';
import { RecordType } from '@prisma/client';
import { APIService } from '../api.service';
import * as Joi from 'joi';
import { RecordTypeDTO } from 'src/types/dto';

@Injectable()
export class RecordTypesService extends APIService {

    private validate(r: RecordTypeDTO, throwError = false): string | null {
        const schema = Joi.object({
            id: Joi.number().integer().min(1),
            name: Joi.string().required().min(1).max(50),
        });
        return this.validateSchema(schema, r, throwError);
    }

    async getAll(): Promise<RecordTypeDTO[]> {
        return await this.prismaHandler(async () => {
            return prisma.recordTypes.findMany();
        });
    }

    async add(type: RecordTypeDTO) {
        this.validate(type, true);

        return await this.prismaHandler(async () => {
            const t = await prisma.recordTypes.create({ data: { name: type.name } });
            return t.id;
        });
    }

    async update(id: number, type: RecordTypeDTO) {
        this.validate(type, true);
        return await this.prismaHandler(async () => {
            const t = await prisma.recordTypes.update({
                where: { id: id },
                data: { name: type.name }
            });
            return t.id;
        });
    }

    async delete(id: number) {
        return await this.prismaHandler(async () => {
            const t = await prisma.recordTypes.delete({ where: { id: id }});
            return t.id;
        });
    }

}
