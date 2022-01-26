import { Controller, ForbiddenException, Get, Request } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) { }

    @Get('me')
    async getMe(@Request() req) {
        if (!req.user?.username) {
            throw new ForbiddenException();
        }
        const me = await this.usersService.getUserByUsername(req.user.username);
        delete me.password;
        return me;
    }

    @Get('roles')
    async getRoles() {
        return await this.usersService.getRoles();
    }

}
