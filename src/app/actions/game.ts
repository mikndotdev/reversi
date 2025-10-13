"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getSession } from "@/app/actions/auth";
import { Color } from "@/generated/prisma";
import { db } from "@/lib/db";
import { ValidateMove } from "@/lib/game";
import { realtime } from "@/lib/realtime";

export const movePiece = async (coord: string) => {
  const cookieStore = await cookies();
  const token = cookieStore.get("GAME_SESSION")?.value;

  const session = await getSession(token!);

  if (!session) {
    throw new Error("Not authenticated");
  }

  const game = await db.game.findUnique({
    where: { id: session.gameId },
    include: { player1: true, player2: true },
  });

  if (!game) {
    throw new Error("Game not found");
  }

  if (game.status !== "IN_PROGRESS") {
    throw new Error("Game is not ongoing");
  }

  if (session.player.color !== game.turn) {
    throw new Error("Not your turn");
  }

  const valid = ValidateMove(
    session.player.color,
    game.board as unknown as ("B" | "W" | null)[][],
    coord,
  );

  if (!valid) {
    throw new Error("Invalid move");
  }
};
