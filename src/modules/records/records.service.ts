import { Injectable } from '@nestjs/common';
import prisma from '../../common/prisma';
import { Records, RecordType } from '@prisma/client';
import { APIService } from '../api.service';
import * as Joi from 'joi';
import { RecordDTO } from 'src/types/dto';


@Injectable()
export class RecordsService extends APIService {

    private recordTypesList = Object.keys(RecordType);

    private validate(r: RecordDTO, throwError = false): string | null {
        const schema = Joi.object({
            id: Joi.number().integer().min(1),
            number: Joi.number().integer().min(1).required(),
            libraryId: Joi.number().integer().min(1).required(),
            typeId: Joi.number().integer().min(1).required(),
            authorName: Joi.string().min(2).max(250),
            fly: Joi.boolean().required(),
            recordType: Joi.string().required().valid(...this.recordTypesList)
        });

        r.number = +r.number;
        return this.validateSchema(schema, r, throwError);
    }

    private mapRecordToDTO(r: Records): RecordDTO {
        return {
            id: r.id,
            number: r.number,
            libraryId: r.libraryId,
            typeId: r.typeId,
            authorName: r.authorName,
            fly: r.fly,
            recordType: r.recordType,
            addedById: r.addedById,
            dateAdded: r.dateAdded,
        };
    }

    private mapDTOToRecord(record: RecordDTO) {
        return {
            number: record.number,
            fly: record.fly,
            authorName: record.authorName ?? null,
            recordType: record.recordType ?? null,
            libraryId: record.libraryId,
            typeId: record.typeId,
        }
    }

    getTypes(): string[] {
        return [ ...this.recordTypesList ];
    }

    async getAll(): Promise<RecordDTO[]> {
        const records = await this.prismaHandler(async () => {
            return prisma.records.findMany();
        });
        return records.map(r => this.mapRecordToDTO(r));
    }

    async getMine(userId: number): Promise<RecordDTO[]> {
        if (!userId || userId <= 0) return [];

        const records = await this.prismaHandler(async () => {
            return await prisma.records.findMany({
                where: { addedById: userId }
            });
        });
        return records.map(r => this.mapRecordToDTO(r));
    }

    async getById(id: number): Promise<RecordDTO> {
        const record = await this.prismaHandler(async () => {
            return await prisma.records.findUnique({ where: { id: id } });
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
