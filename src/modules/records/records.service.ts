import { Injectable } from '@nestjs/common';
import prisma from '../../common/prisma';
import { Records, RecordType, Founds } from '@prisma/client';
import { APIService } from '../api.service';
import * as Joi from 'joi';
import { RecordDTO, RecordFilterDTO } from 'src/types/dto';


@Injectable()
export class RecordsService extends APIService {

    private recordTypesList = Object.keys(RecordType);
    private foundsList = Object.keys(Founds);

    private getIncludeFields() {
        return {
            Libraries: { select: { name: true } },
            Formats: { select: { name: true } },
        };
    }

    private validate(r: RecordDTO, throwError = false): string | null {
        const schema = Joi.object({
            id: Joi.number().integer().min(1),
            number: Joi.number().integer().min(1).required(),
            libraryId: Joi.number().integer().min(1).required(),
            formatId: Joi.number().integer().min(1).required(),
            authorName: [ Joi.string().max(250), Joi.allow(null) ],
            recordType: Joi.string().required().valid(...this.recordTypesList),
            found: Joi.string().required().valid(...this.foundsList),

            addedById: Joi.number().integer().min(1),
            
            dateAdded: Joi.string(),
            formatName: Joi.string(),
            libraryName: Joi.string(),
        });
        return this.validateSchema(schema, r, throwError);
    }

    private mapRecordToDTO(r: Records): RecordDTO {
        return {
            id: r.id,
            number: r.number,
            libraryId: r.libraryId,
            formatId: r.formatId,
            authorName: r.authorName,
            recordType: r.recordType,
            addedById: r.addedById,
            found: r.found,
            dateAdded: r.dateAdded,

            formatName: (r as any).Formats?.name ?? '',
            libraryName: (r as any).Libraries?.name ?? '',
        };
    }

    private mapDTOToRecord(r: RecordDTO) {
        return {
            number: +r.number,
            authorName: r.authorName,
            recordType: r.recordType,
            libraryId: r.libraryId,
            formatId: r.formatId,
            found: r.found,
        }
    }

    getTypes(): string[] {
        return [ ...this.recordTypesList ];
    }

    getFounds(): string[] {
        return [ ...this.foundsList ];
    }

    async getAll(): Promise<RecordDTO[]> {
        const records = await this.prismaHandler(async () => {
            return prisma.records.findMany({ include: this.getIncludeFields() });
        });
        return records.map(r => this.mapRecordToDTO(r));
    }

    async getMine(userId: number): Promise<RecordDTO[]> {
        if (!userId || userId <= 0) return [];

        const records = await this.prismaHandler(async () => {
            return await prisma.records.findMany({
                where: { addedById: userId },
                include: this.getIncludeFields(),
                orderBy: { id: 'desc' },
                take: 100,
            });
        });
        return records.map(r => this.mapRecordToDTO(r));
    }

    async getFiltredRecords(filters: RecordFilterDTO): Promise<RecordDTO[]> {
        const where = {} as any;
        if (filters.startDate || filters.endDate) {
            where.dateAdded = {};
            if (filters.startDate)
                where.dateAdded.gte = new Date(filters.startDate);
            if (filters.endDate)
                where.dateAdded.lte = new Date(filters.endDate);
        }
        if (filters.userId)
            where.addedById = filters.userId;

        const records = await this.prismaHandler(async () => {
            return await prisma.records.findMany({
                where: where,
                include: this.getIncludeFields(),
                orderBy: { dateAdded: 'desc' },
                take: 10000,
            });
        });
        return records.map(r => this.mapRecordToDTO(r));
    }

    async getById(id: number): Promise<RecordDTO> {
        const record = await this.prismaHandler(async () => {
            return await prisma.records.findUnique({
                where: { id: id },
                include: this.getIncludeFields() 
            });
        });
        return this.mapRecordToDTO(record);
    }

    async getAllNumbers(): Promise<{ id: number, number: number }[]> {
        return await this.prismaHandler(async () => {
            return await prisma.records.findMany({ select: { id: true, number: true } });
        });
    }

    async add(record: RecordDTO, userId: number) {
        this.validate(record, true);

        return await this.prismaHandler(async () => {
            const r = await prisma.records.create({
                data: {
                    ...this.mapDTOToRecord(record),
                    addedById: userId,
                    dateAdded: new Date(),
                }
            });
            return r.id;
        });
    }

    async update(id: number, record: RecordDTO) {
        this.validate(record, true);

        return await this.prismaHandler(async () => {
            const r = await prisma.records.update({
                where: { id: id },
                data:  this.mapDTOToRecord(record)
            });
            return r.id;
        });
    }

    async delete(id: number) {
        return await this.prismaHandler(async () => {
            const r = await prisma.records.delete({ where: { id: id }});
            return r.id;
        });
    }

}
