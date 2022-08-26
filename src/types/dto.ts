import { RecordType, NCGroup, Founds } from '@prisma/client';

export interface LibraryDTO {
    id: number;
    name: string;
    budget: number | null;
}

export interface UserDTO {
    id: number;
    username: string;
    password?: string;
    role: number;
    libraryId?: number;
    token?: string;
}

export interface FormatDTO {
    id: number;
    name: string;
}

export interface TagDTO {
    id: number;
    name: string;
}

export interface RecordDTO {
    id?: number;
    number: number;
    authorName: string | null;
    recordType: RecordType;
    found: Founds;
    dateAdded: Date;
    
    addedById: number;
    libraryId: number;
    formatId: number;

    libraryName?: string;
    formatName?: string;
}

export interface NonCompliancesDTO {
    id?: number;
    recordNumber: number;
    userId: number;
    libraryId: number;
    formatId: number;
    tagId: number;
    language: string;
    description: string;
    group: NCGroup;
    dateAdded?: Date;

    username?: string;
    libraryName?: string;
    formatName?: string;
    tagName?: string;
    dateRecord?: string;
}

export interface RecordFilterDTO {
    startDate?: string;
    endDate?: string;
    userId?: number;
    libraryId?: number;
}

export interface BudgetUsedDTO {
    libraryId: number,
    budgetUsed: number
}