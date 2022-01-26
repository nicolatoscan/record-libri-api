import { Controller, ForbiddenException, Get, Post, Request, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) { }

    @Get('me')
    async getMe(@Request() req) {
        if (!req.user?.username) {
            throw new ForbiddenException();
        }
        const x = await this.usersService.getUserByUsername(req.user.username);
        return x;
    }

}
