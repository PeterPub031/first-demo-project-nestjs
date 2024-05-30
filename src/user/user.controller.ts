import { Controller, Get, UseGuards, Req, Delete, Param } from '@nestjs/common';

import { AuthGuard } from '@nestjs/passport';
import { UserService } from './user.service';
import { Request } from 'express';
import { MyJwtGuard } from '../auth/guard/myjwt.guard'
import { GetUser } from '../auth/decorator/user.decorator';
import { User } from '@prisma/client';
import { JwtStrategy } from 'src/auth/strategy';

@Controller('users')
export class UserController {
    constructor(
        private userService: UserService,
        private jwtStrategy: JwtStrategy
    ){}
    // @UseGuards(AuthGuard('jwt'))
    @UseGuards(MyJwtGuard) //This is my custom decorator
    @Get('detail')
    getDetail(@GetUser() user: User) {
        // console.log(request.user);
        return user;
    }

    @UseGuards(MyJwtGuard)
    @Get()
    getAllUsers() {
        return this.jwtStrategy.validateForGetAllUsers();
    }

    @UseGuards(MyJwtGuard)
    @Delete(':id')
    deleteUser(@Param('id') id: string) {
        const userId = Number(id)
        const k = Array(userId)
        return this.jwtStrategy.validateForDeleteUser(userId);

    }
}
