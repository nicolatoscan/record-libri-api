import { Injectable, NotFoundException } from '@nestjs/common';
import prisma from '../../common/prisma';
import { APIService } from '../api.service';
import * as Joi from 'joi';
import { NCFilterDTO, NonCompliancesDTO, UserDTO } from '../../types/dto';
import { NCGroup, NonCompliances } from '@prisma/client';
import { Role } from '../auth/role.enum';

@Injectable()
export class NonCompliancesService extends APIService {

    private groupsList = Object.keys(NCGroup);
    private languagesList = [ 'ITA', 'GER', 'ENG' ];

    private getIncludeFields() {
        return {
            Libraries: { select: { name: true } },
            Formats: { select: { name: true } },
            Tags: { select: { name: true } },
            Users: { select: { username: true } },
        }
    }

    private validate(nc: NonCompliancesDTO, throwError = false): string | null {
        const schema = Joi.object({
            id: Joi.number().integer().min(1),
            recordNumber: Joi.number().integer().min(1).required(),
            userId: Joi.number().integer().min(1).required(),
            libraryId: Joi.number().integer().min(1).required(),
            formatId: Joi.number().integer().min(1).required(),
            tagId: Joi.number().integer().min(1).required(),
            language: Joi.string().length(3).required(),
            description: Joi.string().required().min(1).max(10000),
            group: Joi.string().required().valid(...this.groupsList),
            dateAdded: Joi.date(),

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
            recordNumber: nc.recordNumber,
            userId: nc.userId,
            libraryId: nc.libraryId,
            formatId: nc.formatId,
            tagId: nc.tagId,
            language: nc.language,
            description: nc.description,
            dateAdded: nc.dateAdded,
            group: nc.group,

            username: (nc as any).Users.username ?? '',
            libraryName: (nc as any).Libraries?.name ?? '',
            formatName: (nc as any).Formats?.name ?? '',
            tagName: (nc as any).Tags?.name ?? '',
            dateRecord: (nc as any).Records?.dateAdded ?? '',
        }
    }

    private mapDTOToNC(nc: NonCompliancesDTO) {
        return {
            recordNumber: nc.recordNumber,
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

    async getThisYear(): Promise<NonCompliancesDTO[]> {
        const res = await this.prismaHandler(async () => {
            return prisma.nonCompliances.findMany({
                include: this.getIncludeFields(),
                where: { dateAdded: { gte: new Date(new Date().getFullYear(), 0, 1) } }
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

    async getFiltredRecords(filters: NCFilterDTO, user: UserDTO): Promise<NonCompliancesDTO[]> {

        switch (user.role) {
            case Role.Commitente:
                if (filters.libraryId !== user.libraryId) return [];
                break;
            
            case Role.User:
                if (filters.userId !== user.id) return [];
                break;

            case Role.Admin:
                break;

            default:
                return [];
        }

        const where = {} as any;

        if (filters.userId)
            where.userId = filters.userId;

        if (filters.libraryId) {
            where.libraryId = filters.libraryId;
        }

        if (filters.startDate || filters.endDate) {
            where.dateAdded = {};
            if (filters.startDate)
                where.dateAdded.gte = new Date(filters.startDate);
            if (filters.endDate)
                where.dateAdded.lte = new Date(filters.endDate);
        }

        const ncs = await this.prismaHandler(async () => {
            return await prisma.nonCompliances.findMany({
                where: where,
                include: this.getIncludeFields(),
                orderBy: { dateAdded: 'desc' },
                take: 10000,
            });
        });
        return ncs.map(r => this.mapNCToDTO(r));
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
