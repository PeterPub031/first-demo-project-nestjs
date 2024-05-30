import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient{
    constructor(configService: ConfigService){
        super({
            datasources: {
                db:{
                    // url: 'postgresql://postgres:123@localhost:5434/testdb?schema=public'
                    url: configService.get('DATABASE_URL')
                }
            }
        })
        console.log(configService.get('DATABASE_URL'))
    }
    cleanDatabase(){
        //In a 1 - N relation, delete N firstly, then delete "1"
        console.log('cleanDatabase')
        return this.$transaction([
            this.note.deleteMany(),
            this.user.deleteMany()
        ])
        
    }
}
