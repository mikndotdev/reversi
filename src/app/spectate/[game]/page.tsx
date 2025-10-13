import { notFound } from "next/navigation";
import { SpectateArea } from "@/components/SpectateArea";
import { db } from "@/lib/db";

export default async function SpectatePage({
  params,
}: {
  params: Promise<{ game: string }>;
}) {
  const { game } = await params;

  const gameData = await db.game.findUnique({
    where: { id: game },
    include: { player1: true, player2: true },
  });

  if (!gameData) {
    return notFound();
  }

  if (gameData.status === "PENDING") {
    return notFound();
  }

  return (
    <SpectateArea
      initialState={gameData}
      player1={gameData.player1}
      player2={gameData.player2}
    />
  );
}
