import { db } from "@/lib/db";

export const getSession = async (token: string) => {
  const session = await db.token.findUnique({
    where: { id: token },
    include: { player: true, game: true },
  });
  return session;
};
