import { Injectable } from '@nestjs/common';
import { Role } from 'src/auth/role.enum';

export type User = {
    userId: number;
    username: string;
    password: string;
    role: Role;
}

@Injectable()
export class UsersService {
    private readonly users: User[] = [
        {
            userId: 1,
            username: 'john',
            password: 'changeme',
            role: Role.Admin,
        },
        {
            userId: 2,
            username: 'maria',
            password: 'guess',
            role: Role.User,
        },
    ];

    async findOne(username: string): Promise<User | undefined> {
        return this.users.find(user => user.username === username);
    }
}
