import { createZodDto } from "@anatine/zod-nestjs"
import { z } from "zod"

export const NoteZ = z.object({
    title: z.string(),
    description: z.string(),
    url: z.string()
})

// export class NoteDTO extends createZodDto(NoteZ) {}
export class InsertNoteDTO extends createZodDto(NoteZ) {}

export const UpdateNoteZ = z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    url: z.string().optional()
})
export class UpdateNoteDTO extends createZodDto(UpdateNoteZ) {}

// id          Int      @id @default(autoincrement())
//   title       String
//   description String
//   url         String
//   createdAt   DateTime @default(now())
//   updatedAt   DateTime @updatedAt
//   user        User?    @relation(fields: [userId], references: [id])
//   userId      Int?

//   @@map("notes")