import { Injectable } from '@nestjs/common';
import prisma from '../../common/prisma';
import * as Joi from 'joi';
import { BudgetUsedDTO, LibraryDTO } from 'src/types/dto';
import { APIService } from '../api.service';

@Injectable()
export class LibrariesService extends APIService {

    private validate(l: LibraryDTO, throwError = false): string | null {
        const schema = Joi.object({
            id: Joi.number().integer().min(1),
            name: Joi.string().required().min(1).max(100)
        });
        return this.validateSchema(schema, l, throwError);
    }

    async getAll() {
        return await prisma.libraries.findMany();
    }

    async add(l: LibraryDTO): Promise<string | null> {
        this.validate(l, true);

        return await this.prismaHandler(async () => {
            const r = await prisma.libraries.create({ data: { name: l.name } });
            return r.id;
        })
    }

    async update(id: number, l: LibraryDTO): Promise<string | null> {
        this.validate(l, true);

        return await this.prismaHandler(async () => {
            const r = await prisma.libraries.update({
                where: { id: id },
                data: { name: l.name }
            });
            return r.id;
        })
    }

    async updateBudget(id: number, budget: number): Promise<boolean> {
        if (typeof budget === 'number' && budget > 0) {
            return await this.prismaHandler(async () => {
                const r = await prisma.libraries.update({
                    where: { id },
                    data: { budget }
                });
                return r.id;
            })
        }
        return false;
    }

    async delete(id: number): Promise<boolean> {
        return await this.prismaHandler(async () => {
            const r = await prisma.libraries.delete({ where: { id: id } });
            return r.id === id;
        })
    }

    async getBudgetUsed(): Promise<BudgetUsedDTO> {
        return await this.prismaHandler(async () => {
            const budgetLUsed = await prisma.records.groupBy({
                by: [ 'libraryId' ],
                _count: { libraryId: true },
            });
            return budgetLUsed.map(bl => ({
                libraryId: bl.libraryId,
                budgetUsed: bl._count.libraryId
            }));
        })
    }

}
