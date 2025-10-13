import { notFound } from "next/navigation";
import { SpectateArea } from "@/components/SpectateArea";
import { db } from "@/lib/db";

export async function generateMetadata({
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
        return {
            title: "Game not found",
            description: "The game you are looking for does not exist.",
        };
    }

    if (gameData.status === "PENDING") {
        return {
            title: "Game has not started",
            description: "The game you are trying to spectate has not started yet.",
        };
    }

    return {
        title: `Spectate - ${gameData.player1.name} vs ${gameData.player2?.name}`,
        description: `Watch the game between ${gameData.player1.name} and ${gameData.player2?.name}.`,
    };
}

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
