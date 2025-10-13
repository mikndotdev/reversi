import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { getSession } from "@/app/actions/auth";
import { PlayArea } from "@/components/PlayArea";
import { db } from "@/lib/db";

export default async function Page({
  params,
}: {
  params: Promise<{ game: string }>;
}) {
  const { game } = await params;
  const cookieStore = await cookies();
  const token = cookieStore.get("GAME_SESSION");

  const gameData = await db.game.findUnique({
    where: { id: game },
    include: { player1: true, player2: true },
  });

  if (!gameData) {
    return notFound();
  }

  const session = await getSession(token?.value!);

  if (!session || session.gameId !== gameData.id) {
    return redirect(`/spectate/${gameData.id}`);
  }

  if (gameData.status === "PENDING") {
    if (session.player.id === gameData.player1Id) {
      return redirect(`/lobby/${gameData.id}`);
    }
    return notFound();
  }

  const opponentId =
    session.player.id === gameData.player1Id
      ? (gameData.player2Id ?? undefined)
      : (gameData.player1Id ?? undefined);

  const opponent = await db.player.findUnique({
    where: { id: opponentId },
  });

  if (!opponent) {
    return notFound();
  }

  return (
    <div className={"flex flex-col items-center justify-center min-h-screen"}>
      <PlayArea
        initialState={gameData}
        player={session.player}
        opponent={opponent}
      />
    </div>
  );
}
