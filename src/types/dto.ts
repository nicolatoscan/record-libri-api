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