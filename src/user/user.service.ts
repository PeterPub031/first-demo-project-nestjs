import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class UserService {
    constructor(private prismaService: PrismaService){}

    async getAllUsers() {
        const users = await this.prismaService.user.findMany();
        return users;
    }

    async deleteUser(userId: number){
        const userid = userId
        await this.prismaService.user.delete({
            where: {
                id: userid
            }
        })
    }
}
