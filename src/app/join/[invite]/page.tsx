import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { getSession } from "@/app/actions/auth";
import { JoinGame } from "@/components/JoinGame";
import { Lobby } from "@/components/Lobby";
import { db } from "@/lib/db";

export default async function Page({
  params,
}: {
  params: Promise<{ invite: string }>;
}) {
  const { invite } = await params;
  const cookieStore = await cookies();
  const token = cookieStore.get("GAME_SESSION");
  const gameData = await db.game.findUnique({
    where: { inviteId: invite },
    include: { player1: true, player2: true },
  });

  if (!gameData) {
    return notFound();
  }

  if (gameData.status !== "PENDING") {
    return redirect(`/play/${gameData.id}`);
  }

  if (token) {
    const session = await getSession(token?.value!);
    if (session && session.gameId === gameData.id) {
      return redirect(`/lobby/${gameData.id}`);
    }
  }

  return (
    <div className={"flex flex-col items-center justify-center min-h-screen"}>
      <h1 className={"text-4xl font-bold mb-5"}>Join game</h1>
      <JoinGame game={gameData} />
    </div>
  );
}
