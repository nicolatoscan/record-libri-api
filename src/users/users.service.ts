import { Injectable } from '@nestjs/common';
import { Role } from 'src/auth/role.enum';
import * as bcrypt from 'bcrypt';
import prisma from '../common/prisma';
import { Users, Roles } from '@prisma/client';

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

    async addUser(username: string, password: string, role: Roles) {
        const r = await prisma.users.create({
            data: {
                username: username,
                password: await this.getHashedPassword(password),
                role: role,
            }
        });
        return r.id;
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
