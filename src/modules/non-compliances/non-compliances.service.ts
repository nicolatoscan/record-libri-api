import { Injectable, NotFoundException } from '@nestjs/common';
import prisma from '../../common/prisma';
import { APIService } from '../api.service';
import * as Joi from 'joi';
import { NonCompliancesDTO, UserDTO } from '../../types/dto';
import { NCGroup, NonCompliances } from '@prisma/client';
import { Role } from '../auth/role.enum';

@Injectable()
export class NonCompliancesService extends APIService {

    private groupsList = Object.keys(NCGroup);
    private languagesList = [ 'ITA', 'GER', 'ENG' ];

    private getIncludeFields() {
        return {
            Records: { select: { number: true, dateAdded: true } },
            Libraries: { select: { name: true } },
            Formats: { select: { name: true } },
            Tags: { select: { name: true } },
            Users: { select: { username: true } },
        }
    }

    private validate(nc: NonCompliancesDTO, throwError = false): string | null {
        const schema = Joi.object({
            id: Joi.number().integer().min(1),
            recordId: Joi.number().integer().min(1).required(),
            userId: Joi.number().integer().min(1).required(),
            libraryId: Joi.number().integer().min(1).required(),
            formatId: Joi.number().integer().min(1).required(),
            tagId: Joi.number().integer().min(1).required(),
            language: Joi.string().length(3).required(),
            description: Joi.string().required().min(1).max(10000),
            group: Joi.string().required().valid(...this.groupsList),
            dateAdded: Joi.date(),

            recordNumber: Joi.number(),
            libraryName: Joi.string(),
            formatName: Joi.string(),
            tagName: Joi.string(),
            dateRecord: Joi.string(),
        });
        return this.validateSchema(schema, nc, throwError);
    }

    private mapNCToDTO(nc: NonCompliances): NonCompliancesDTO {
        return {
            id: nc.id,
            recordId: nc.recordId,
            userId: nc.userId,
            libraryId: nc.libraryId,
            formatId: nc.formatId,
            tagId: nc.tagId,
            language: nc.language,
            description: nc.description,
            dateAdded: nc.dateAdded,
            group: nc.group,

            username: (nc as any).Users.username ?? '',
            recordNumber: (nc as any).Records?.number ?? 0,
            libraryName: (nc as any).Libraries?.name ?? '',
            formatName: (nc as any).Formats?.name ?? '',
            tagName: (nc as any).Tags?.name ?? '',
            dateRecord: (nc as any).Records?.dateAdded ?? '',
        }
    }

    private mapDTOToNC(nc: NonCompliancesDTO) {
        return {
            recordId: nc.recordId,
            libraryId: nc.libraryId,
            formatId: nc.formatId,
            tagId: nc.tagId,
            language: nc.language,
            description: nc.description,
            group: nc.group,
        }
    }

    getGroups(): string[] {
        return [ ...this.groupsList ];
    }

    getLanguages(): string[] {
        return [ ...this.languagesList ];
    }

    async getAll(): Promise<NonCompliancesDTO[]> {
        const res = await this.prismaHandler(async () => {
            return prisma.nonCompliances.findMany({
                include: this.getIncludeFields()
            });
        });
        return res.map(x => this.mapNCToDTO(x));
    }

    async getMine(userId: number): Promise<NonCompliancesDTO[]> {
        const res = await this.prismaHandler(async () => {
            return prisma.nonCompliances.findMany({
                where: { userId: userId },
                include: this.getIncludeFields()
            });
        });
        return res.map(x => this.mapNCToDTO(x));
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

    async update(id: number, nc: NonCompliancesDTO, user: UserDTO) {
        this.validate(nc, true);

        return await this.prismaHandler(async () => {
            const t = await prisma.nonCompliances.updateMany({
                where: {
                    id: id,
                    ...(user.role === Role.Admin ? {} : {addedById: user.id})
                },
                data: this.mapDTOToNC(nc),
            });
            if (t.count < 1) {
                throw new NotFoundException();
            }
            return id;
        });
    }

    async delete(id: number, user: UserDTO) {
        return await this.prismaHandler(async () => {
            const t = await prisma.nonCompliances.deleteMany({
                where: {
                    id: id,
                    ...(user.role === Role.Admin ? {} : {addedById: user.id})
                }
            });
            if (t.count < 1) {
                throw new NotFoundException();
            }
            return id;
        });
    }

}
