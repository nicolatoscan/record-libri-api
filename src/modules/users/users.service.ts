import { Injectable } from '@nestjs/common';
import { Role } from '../auth/role.enum';
import * as bcrypt from 'bcrypt';
import prisma from '../../common/prisma';
import { Users } from '@prisma/client';

@Injectable()
export class UsersService {

    private async getHashedPassword(password: string): Promise<string> {
        return await bcrypt.hash(password, 10);
    }

    async getUsers(): Promise<Users[]> {
        return prisma.users.findMany();
    }

    async getUserByUsername(username: string): Promise<Users> {
        return prisma.users.findFirst({ where: { username: username }})
    }

    async add(username: string, password: string, role: Role) {
        const r = await prisma.users.create({
            data: {
                username: username,
                password: await this.getHashedPassword(password),
                role: role,
            }
        });
        return r.id;
    }

    getRoles(): { [id: string]: number } {
        return {
            'User':  Role.User,
            'Supervisor':  Role.Supervisor,
            'Admin':  Role.Admin,
            'SuperAdmin':  Role.SuperAdmin,
        };
    }

    // async getUsers(): Promise<User[]> {
    //     return [
    //         {
    //             userId: 1,
    //             username: 'admin',
    //             password: await this.getPassword('admin'),
    //             role: Role.Admin,
    //         },
    //         {
    //             userId: 2,
    //             username: 'user',
    //             password: await this.getPassword('user'),
    //             role: Role.User,
    //         },
    //     ];
    // }
}
