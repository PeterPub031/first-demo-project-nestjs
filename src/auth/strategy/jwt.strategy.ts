import { ExtractJwt, Strategy } from "passport-jwt";

import { ConfigService } from '@nestjs/config';
import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { PrismaService } from "src/prisma/prisma.service";
import { UserService } from "src/user/user.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt'){
    constructor(
        configService: ConfigService, 
        public prismaService: PrismaService,
        public userService: UserService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: configService.get('JWT_SECRET')
        })
    }
    
    async validate(payload: {sub: number}) {
        const user = await this.prismaService.user.findUnique({
            where: {
                id: payload.sub
            }
        })
        delete user.hashedPassword
        return user;
    }

    async validateForGetAllUsers() {
        return this.userService.getAllUsers();
    }

    async validateForDeleteUser(id: number){
        return this.userService.deleteUser(id);
    }
}

// @Injectable()
// export class JwtStrategy_2 extends PassportStrategy(Strategy, 'jwt-2'){
//     constructor(configService: ConfigService, public prismaService: PrismaService) {
//         super({
//             jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//             secretOrKey: configService.get('JWT_SECRET')
//         })
//     }
    
//     async validate() {
//         const user = await this.prismaService.user.findMany();
//         return user;
//     }
// }