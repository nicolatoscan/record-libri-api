import { RecordType, NCGroup } from '@prisma/client';

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

export interface RecordTypeDTO {
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
    libraryId: number;
    typeId: number;
    authorName?: string;
    fly: boolean;
    recordType: RecordType;
    addedById: number;
    dateAdded: Date;
}

export interface NonCompliancesDTO {
    id?: number;
    recordId: number;
    userId: number;
    libraryId: number;
    recordTypeId: number;
    tagId: number;
    language: string;
    description: string;
    group: NCGroup;
    dateAdded?: Date;

    recordNumber?: number;
    libraryName?: string;
    recordTypeName?: string;
    tagName?: string;
    dateRecord?: string;
}