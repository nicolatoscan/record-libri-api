export interface LibraryDTO {
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