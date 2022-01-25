import { Injectable } from '@nestjs/common';
import { Role } from 'src/auth/role.enum';
import * as bcrypt from 'bcrypt';

export type User = {
    userId: number;
    username: string;
    password: string;
    role: Role;
}



@Injectable()
export class UsersService {
    private users: User[] = [ ];

    async getPassword(password: string): Promise<string> {
        return await bcrypt.hash(password, 10);
    }

    async getUsers(): Promise<User[]> {
        return [
            {
                userId: 1,
                username: 'john',
                password: await this.getPassword('changeme'),
                role: Role.Admin,
            },
            {
                userId: 2,
                username: 'maria',
                password: await this.getPassword('guess'),
                role: Role.User,
            },
        ];
    }

    constructor() {
        new Promise(async () => {
            this.users = await this.getUsers();
            console.log(this.users);
        })
    }


    async findOne(username: string): Promise<User | undefined> {
        return this.users.find(user => user.username === username);
    }
}
