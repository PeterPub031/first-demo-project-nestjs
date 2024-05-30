import {
    Body,
    Controller,
    Delete,
    Get,
    Patch,
    Post,
    Req,
    UseGuards,
    Param,
    UsePipes,
    ParseIntPipe,
    Query,
    HttpCode,
    HttpStatus
} from '@nestjs/common';

import { MyJwtGuard } from '../auth/guard';
import { NoteService } from './note.service';
import { GetUser } from 'src/auth/decorator';
import { ZodValidationPipe } from '@anatine/zod-nestjs';
import { InsertNoteDTO, UpdateNoteDTO } from './dto';
import { User } from '@prisma/client';

@UseGuards(MyJwtGuard)
@Controller('notes')
export class NoteController {
    constructor(private noteService: NoteService){}
    @Get()
    getNotes(@GetUser('id') userId: number) {
        return this.noteService.getNotes(userId);
    }

    @Get(':id') //notes/2
    getNoteById(@Param('id', ParseIntPipe) noteId: number) { //Need to add userId to get in future time
        return this.noteService.getNoteById(noteId);
    }

    @Post()
    @UsePipes(ZodValidationPipe)
    insertNote(
        @GetUser('id') userId: number,
        @Body() insertNoteDto: InsertNoteDTO
    ) {
        // console.log(typeof(userId))
        // console.log(insertNoteDto)
        // console.log(`userId: ${userId}, insertNoteDto: ${JSON.stringify(insertNoteDto)}`)
        // const id = Number(userId)
        return this.noteService.insertNote(userId, insertNoteDto);
    }

    @Patch(':id')
    @UsePipes(ZodValidationPipe)
    updateNoteById(
        @GetUser('id') userId: number,
        @Param('id', ParseIntPipe) noteId: number,
        @Body() updateNoteDto: UpdateNoteDTO
    ) {
        return this.noteService.updateNoteById(userId, noteId, updateNoteDto)
    }

    @HttpCode(HttpStatus.NO_CONTENT)
    @Delete(':id')
    deleteNoteById(@Param('id', ParseIntPipe) noteId: number) {
        return this.noteService.deleteNoteById(noteId)
    }
}
