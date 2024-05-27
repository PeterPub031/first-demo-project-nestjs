import * as argon from 'argon2';

import { ForbiddenException, Injectable } from "@nestjs/common";
import { Note, User } from "@prisma/client";

import { AuthDTO } from "./dto";
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from "../prisma/prisma.service";

@Injectable({})
export class AuthService {
    constructor(
        private prismaService: PrismaService,
        private jwtService: JwtService,
        private configService: ConfigService
    ){}
    
    async register(authDTO: AuthDTO){
        //convert raw password to hashed password
        const hashedPassword = await argon.hash(authDTO.password);
        try { 
            //insert data to database
            const user = await this.prismaService.user.create({
                data: {
                    email: authDTO.email,
                    hashedPassword: hashedPassword,
                    firstName: '',
                    lastName: ''
                },
                //set to view only 3 following fields
                select: {
                    id: true,
                    email: true,
                    createdAt: true
                }
            })
            return await this.convertToJwtString(user.id, user.email)
        } catch(error){
            if(error.code == 'P2002'){
                throw new ForbiddenException('User with this email already exists');
            }
        }  
    }

    async login(authDTO: AuthDTO){
        const user = await this.prismaService
                        .user.findUnique({
                            where: {
                                email: authDTO.email
                            }
                         })
        if(!user){
            throw new ForbiddenException(
                'User not found'
            )
        }
        const passwordMatched = await argon.verify(
            user.hashedPassword,
            authDTO.password
        )
        if(!passwordMatched){
            throw new ForbiddenException(
                'Incorrect password '
            )
        }
        delete user.hashedPassword
        // return user
        return await this.convertToJwtString(user.id, user.email)
    }

    async convertToJwtString(userId: number, email: string)
    :Promise<{accessToken: string }>{
        const payload = {
            sub: userId,
            email
        }

        const jwtString = await this.jwtService.signAsync(payload, {
            expiresIn: '10m',
            secret: this.configService.get('JWT_SECRET')
        })

        return {
            accessToken: jwtString,
        }
    }
}
