import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InsertNoteDTO, UpdateNoteDTO } from './dto';

import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class NoteService {
    constructor(private prismaService: PrismaService) {}
    async getNotes(userId: number) {
        const notes = await this.prismaService.note.findMany({
            where: {
                userId: userId
            }
        })
        return notes;
    }

    async getNoteById(noteId: number) {
        const note = await this.prismaService.note.findUnique({
            where: {
                id: noteId
            }
        })
        return note;
    }

    async insertNote(userId: number, insertNoteDTO: InsertNoteDTO) {
        console.log(insertNoteDTO)
        const note = await this.prismaService.note.create({
            data: {
                title: insertNoteDTO.title,
                description: insertNoteDTO.description,
                url: insertNoteDTO.url,
                userId: userId
            }
        })
        return note;
    }

    //Just try a own way but may not be corrected
    async updateNoteById(userId:number, noteId: number, updateNoteDto: UpdateNoteDTO) {
        const note = await this.prismaService.note.findUnique({
            where: {
                id: noteId,
                userId: userId
            }
        })
        if(!note) {
            throw new ForbiddenException('Cannot find Note to update');
        }
        return await this.prismaService.note.update({
            where: {
                id: noteId,
                userId: userId
            },
            data: {
                ...updateNoteDto
            }
        })
    }

    async deleteNoteById(noteId: number) {
        await Promise.all([
            this.prismaService.note.findFirstOrThrow({
                where: {
                    id: noteId
                }
            }).catch(err => {
                throw new BadRequestException(err.message)
            }),
            this.prismaService.note.delete({
                where: {
                    id: noteId
                }
            })
        ])
    }
}
