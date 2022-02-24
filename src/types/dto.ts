import { RecordType, NCGroup, Founds } from '@prisma/client';

export interface LibraryDTO {
    id: number;
    code: string;
    name: string;
}

export interface UserDTO {
    id: number;
    username: string;
    password?: string;
    role: number;
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
    authorName?: string;
    isAuthority: boolean;
    englishUNI: boolean;
    fly: boolean;
    recordType: RecordType;
    found: Founds;

    dateAdded: Date;

    addedById: number;

    libraryId: number;
    formatId: number;
}

export interface NonCompliancesDTO {
    id?: number;
    recordId: number;
    userId: number;
    libraryId: number;
    formatId: number;
    tagId: number;
    language: string;
    description: string;
    group: NCGroup;
    dateAdded?: Date;

    recordNumber?: number;
    libraryName?: string;
    formatName?: string;
    tagName?: string;
    dateRecord?: string;
}