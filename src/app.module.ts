import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { NoteModule } from './note/note.module';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    AuthModule, 
    UserModule,
    NoteModule, 
    PrismaModule, 
    ConfigModule.forRoot({
      isGlobal: true,
    })
  ],
  
})
export class AppModule {}
