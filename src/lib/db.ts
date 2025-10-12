import { PrismaClient } from "@/generated/prisma/client";

const prisma = new PrismaClient();

export const db = prisma;
