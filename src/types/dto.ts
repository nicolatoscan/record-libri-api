import { RecordType } from '@prisma/client';

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

export interface RecordDTO {
    id?: number;
    number: number;
    libraryId: number;
    typeId: number;
    authorName?: string;
    fly: boolean;
    recordType: RecordType
}