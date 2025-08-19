import { PrismaClient } from "@prisma/client";
import { PrismaD1 } from '@prisma/adapter-d1'
import { D1Database } from '@cloudflare/workers-types'

export const prisma = {
    async client(db: D1Database) {
        const adapter = new PrismaD1(db)
        const prisma = new PrismaClient({ adapter })
        return prisma
    },
}