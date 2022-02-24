import { Injectable } from '@nestjs/common';
import prisma from '../../common/prisma';
import { Records, RecordType, Founds } from '@prisma/client';
import { APIService } from '../api.service';
import * as Joi from 'joi';
import { RecordDTO } from 'src/types/dto';


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
            authorName: Joi.string().min(2).max(250),
            fly: Joi.boolean().required(),
            recordType: Joi.string().required().valid(...this.recordTypesList),
            englishUNI: Joi.boolean().required(),
            isAuthority: Joi.boolean().required(),
            found: Joi.string().required().valid(...this.foundsList),
        });

        r.number = +r.number;
        return this.validateSchema(schema, r, throwError);
    }

    private mapRecordToDTO(r: Records): RecordDTO {
        return {
            id: r.id,
            number: r.number,
            libraryId: r.libraryId,
            formatId: r.formatId,
            authorName: r.authorName,
            fly: r.fly,
            recordType: r.recordType,
            addedById: r.addedById,
            englishUNI: r.englishUNI,
            isAuthority: r.isAuthority,
            found: r.found,
            dateAdded: r.dateAdded,

            formatName: (r as any).Formats?.name ?? '',
            libraryName: (r as any).Libraries?.name ?? '',
        };
    }

    private mapDTOToRecord(r: RecordDTO) {
        return {
            number: r.number,
            fly: r.fly,
            authorName: r.authorName ?? null,
            recordType: r.recordType ?? null,
            libraryId: r.libraryId,
            formatId: r.formatId,
            englishUNI: r.englishUNI,
            isAuthority: r.isAuthority,
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
