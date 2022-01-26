import { Controller, ForbiddenException, Get, Post, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) { }

    @UseGuards(JwtAuthGuard)
    @Get('me')
    async getMe(@Request() req) {
        if (!req.user?.username) {
            throw new ForbiddenException();
        }
        const me = await this.usersService.getUserByUsername(req.user.username);
        delete me.password;
        return me;
    }

    @UseGuards(JwtAuthGuard)
    @Get('roles')
    async getRoles() {
        return await this.usersService.getRoles();
    }

}
