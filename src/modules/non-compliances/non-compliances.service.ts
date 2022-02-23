import { Injectable } from '@nestjs/common';
import prisma from '../../common/prisma';
import { APIService } from '../api.service';
import * as Joi from 'joi';
import { NonCompliancesDTO } from '../../types/dto';
import { NCGroup, NonCompliances } from '@prisma/client';

@Injectable()
export class NonCompliancesService extends APIService {

    private groupsList = Object.keys(NCGroup);

    private validate(nc: NonCompliancesDTO, throwError = false): string | null {
        const schema = Joi.object({
            id: Joi.number().integer().min(1),
            recordId: Joi.number().integer().min(1).required(),
            userId: Joi.number().integer().min(1).required(),
            libraryId: Joi.number().integer().min(1).required(),
            recordTypeId: Joi.number().integer().min(1).required(),
            tagId: Joi.number().integer().min(1).required(),
            language: Joi.string().length(3).required(),
            description: Joi.string().required().min(1).max(10000),
            group: Joi.string().required().valid(...this.groupsList),
            dateAdded: Joi.date(),
        });
        return this.validateSchema(schema, nc, throwError);
    }

    private mapNCToDTO(nc: NonCompliances): NonCompliancesDTO {
        return {
            id: nc.id,
            recordId: nc.recordId,
            userId: nc.userId,
            libraryId: nc.libraryId,
            recordTypeId: nc.recordTypeId,
            tagId: nc.tagId,
            language: nc.language,
            description: nc.description,
            dateAdded: nc.dateAdded,
            group: nc.group,
        }
    }

    private mapDTOToNC(nc: NonCompliancesDTO) {
        return {
            recordId: nc.recordId,
            libraryId: nc.libraryId,
            recordTypeId: nc.recordTypeId,
            tagId: nc.tagId,
            language: nc.language,
            description: nc.description,
            group: nc.group,
        }
    }

    async getAll(): Promise<NonCompliancesDTO[]> {
        return await this.prismaHandler(async () => {
            return prisma.nonCompliances.findMany();
        });
    }

    async add(nc: NonCompliancesDTO, userId: number) {
        this.validate(nc, true);

        return await this.prismaHandler(async () => {
            const t = await prisma.nonCompliances.create({
                data: {
                    ...this.mapDTOToNC(nc),
                    userId: userId,
                    dateAdded: new Date()
                }
            });
            return t.id;
        });
    }

    async update(id: number, nc: NonCompliancesDTO) {
        this.validate(nc, true);

        return await this.prismaHandler(async () => {
            const t = await prisma.nonCompliances.update({
                where: { id: id },
                data: this.mapDTOToNC(nc),
            });
            return t.id;
        });
    }

    async delete(id: number) {
        return await this.prismaHandler(async () => {
            const t = await prisma.nonCompliances.delete({ where: { id: id }});
            return t.id;
        });
    }

}
