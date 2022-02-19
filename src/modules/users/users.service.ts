import { Injectable } from '@nestjs/common';
import { Role } from '../auth/role.enum';
import * as bcrypt from 'bcrypt';
import prisma from '../../common/prisma';
import { Users } from '@prisma/client';
import { APIService } from '../api.service';
import * as Joi from 'joi';
import { UserDTO } from 'src/types/dto';

@Injectable()
export class UsersService extends APIService {

    private validate(l: UserDTO, isUpdate: boolean, throwError = false): string | null {
        const roles = Object.values(this.getRoles());
        const schema = Joi.object({
            id: isUpdate ? Joi.number().integer().min(1) : Joi.number().integer().min(1).required(),
            username: Joi.string().required().min(2).max(120),
            password: isUpdate ? Joi.string().min(8).max(120) : Joi.string().min(8).max(120).required(),
            role: Joi.number().integer().required().valid(...roles),
        });
        return this.validateSchema(schema, l, throwError);
    }

    getRoles(): { [id: string]: number } {
        return {
            'User':  Role.User,
            'Supervisor':  Role.Supervisor,
            'Admin':  Role.Admin,
            'SuperAdmin':  Role.SuperAdmin,
        };
    }

    private async getHashedPassword(password: string): Promise<string> {
        return await bcrypt.hash(password, 10);
    }

    async getUsers(): Promise<Users[]> {
        return await this.prismaHandler(async () => {
            return prisma.users.findMany();
        });
    }

    async getUserByUsername(username: string): Promise<Users> {
        return await this.prismaHandler(async () => {
            return prisma.users.findFirst({ where: { username: username }})
        });
    }

    async getUserById(id: number): Promise<Users> {
        return await this.prismaHandler(async () => {
            return prisma.users.findFirst({ where: { id: id }})
        });
    }

    async add(user: UserDTO) {
        this.validate(user, false, true);

        return await this.prismaHandler(async () => {
            const r = await prisma.users.create({
                data: {
                    username: user.username,
                    password: await this.getHashedPassword(user.password),
                    role: user.role,
                }
            });
            return r.id;
        });
    }

    async update(id: number, user: UserDTO) {
        this.validate(user, true, true);
        return await this.prismaHandler(async () => {
            const u = await prisma.users.update({
                where: { id: id },
                data: {
                    username: user.username,
                    role: user.role,
                }
            });
            return u.id;
        });
    }

    async updatePassword(id: number, password: string) {
        const schema = Joi.object({ password: Joi.string().required().min(8).max(120) });
        this.validateSchema(schema, { password: password }, true);

        return await this.prismaHandler(async () => {
            const u = await prisma.users.update({
                where: { id: id },
                data: { password: await this.getHashedPassword(password) }
            });
            return u.id;
        });
    }

    async delete(id: number) {
        return await this.prismaHandler(async () => {
            const u = await prisma.users.delete({ where: { id: id }});
            return u.id;
        });
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
