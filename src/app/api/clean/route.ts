import { db } from "@/lib/db";

export const POST = async (req: Request) => {
  const auth = req.headers.get("Authorization");
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const oldGames = await db.game.findMany({
    where: { updatedAt: { lt: cutoff } },
    select: { id: true, player1Id: true, player2Id: true },
  });

  const gameIds = oldGames.map((g) => g.id);
  const playerIds = [
    ...oldGames.map((g) => g.player1Id),
    ...oldGames.map((g) => g.player2Id).filter(Boolean),
  ] as string[];

  await db.token.deleteMany({ where: { gameId: { in: gameIds } } });
  await db.player.deleteMany({ where: { id: { in: playerIds } } });
  await db.game.deleteMany({ where: { id: { in: gameIds } } });

  return new Response("Cleanup complete", { status: 200 });
};
