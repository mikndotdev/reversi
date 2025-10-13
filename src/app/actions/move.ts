"use server";
import { cookies } from "next/headers";
import { Color } from "@/generated/prisma";
import { db } from "@/lib/db";
import { GetFlippedPieces, ProcessMove, ValidateMove, HasValidMoves } from "@/lib/game";
import { realtime } from "@/lib/realtime";
import { getSession } from "./auth";

export const movePiece = async (gameId: string, coord: string) => {
  const cookieStore = await cookies();
  const token = cookieStore.get("GAME_SESSION");

  if (!token) {
    throw new Error("Not authenticated");
  }

  const session = await getSession(token.value);

  if (!session || session.gameId !== gameId) {
    throw new Error("Invalid session");
  }

  const game = await db.game.findUnique({
    where: { id: gameId },
    include: { player1: true, player2: true },
  });

  if (!game) {
    throw new Error("Game not found");
  }

  if (game.status !== "IN_PROGRESS") {
    throw new Error("Game is not in progress");
  }

  // Check if it's the player's turn
  if (game.turn !== session.player.color) {
    throw new Error("Not your turn");
  }

  const board: ("B" | "W" | null)[][] = JSON.parse(game.board);

  // Validate the move
  if (!ValidateMove(session.player.color, board, coord)) {
    throw new Error("Invalid move");
  }

  // Process the move
  const newBoard = ProcessMove(session.player.color, board, coord);

  // Get flipped pieces for animation
  const flippedPieces = GetFlippedPieces(session.player.color, board, coord);

  // Change turn
  let nextTurn = game.turn === Color.BLACK ? Color.WHITE : Color.BLACK;

  // Check if the next player has valid moves
  let turnSkipped = false;
  if (!HasValidMoves(nextTurn, newBoard)) {
    // Next player has no valid moves, skip their turn
    turnSkipped = true;
    const skippedColor = nextTurn;
    nextTurn = nextTurn === Color.BLACK ? Color.WHITE : Color.BLACK;

    // Broadcast the skip event
    const channel = realtime.channel(gameId);
    await channel.skip.turn.emit({
      skippedColor,
      nextColor: nextTurn,
    });
  }

  // Update the database
  await db.game.update({
    where: { id: gameId },
    data: {
      board: JSON.stringify(newBoard),
      turn: nextTurn,
    },
  });

  // Broadcast the move via realtime
  const channel = realtime.channel(gameId);
  await channel.place.move.emit({
    color: session.player.color,
    coord,
    flippedPieces,
  });

  return { success: true, turnSkipped };
};
