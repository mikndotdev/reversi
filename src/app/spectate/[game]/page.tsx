"use client";
import { notFound } from "next/navigation";
import { useEffect, useState } from "react";
import { Board } from "@/components/Board";
import { PlayerCard } from "@/components/PlayerCard";
import { useRealtime } from "@upstash/realtime/client";
import type { Color, Player } from "@/generated/prisma";
import { db } from "@/lib/db";
import type { RealtimeEvents } from "@/lib/realtime";

interface SpectateProps {
  params: { game: string };
}

export default function SpectatePage({ params }: SpectateProps) {
  const [board, setBoard] = useState<("B" | "W" | null)[][]>([]);
  const [turn, setTurn] = useState<Color>("BLACK");
  const [player1, setPlayer1] = useState<Player | null>(null);
  const [player2, setPlayer2] = useState<Player | null>(null);
  const [status, setStatus] = useState<string>("");

  useEffect(() => {
    async function fetchGame() {
      const gameData = await db.game.findUnique({
        where: { id: params.game },
        include: { player1: true, player2: true },
      });
      if (!gameData || gameData.status === "PENDING") {
        setStatus("notFound");
        return;
      }
      setBoard(JSON.parse(gameData.board));
      setPlayer1(gameData.player1);
      setPlayer2(gameData.player2);
      setTurn(gameData.turn);
    }
    fetchGame();
  }, [params.game]);

  useRealtime<RealtimeEvents>({
    channel: params.game,
    events: {
      place: {
        move: async (data) => {
          setTurn(data.color === "BLACK" ? "WHITE" : "BLACK");
          const playerPiece = data.color === "BLACK" ? "B" : "W";
          // Place the piece first
          setBoard((prevBoard) => {
            const newBoard = prevBoard.map((r) => [...r]);
            const col = data.coord[0].charCodeAt(0) - "A".charCodeAt(0);
            const row = parseInt(data.coord.slice(1), 10) - 1;
            newBoard[row][col] = playerPiece;
            return newBoard;
          });
          // Animate flipped pieces one by one
          for (const direction of data.flippedPieces) {
            for (const [row, col] of direction) {
              await new Promise((resolve) => setTimeout(resolve, 100));
              setBoard((prevBoard) => {
                const newBoard = prevBoard.map((r) => [...r]);
                newBoard[row][col] = playerPiece;
                return newBoard;
              });
            }
          }
        },
      },
    },
  });

  if (status === "notFound" || !player1) return notFound();

  const getPieceCount = (color: Color) => {
    const piece = color === "BLACK" ? "B" : "W";
    let count = 0;
    board.forEach((row) => {
      row.forEach((cell) => {
        if (cell === piece) count++;
      });
    });
    return count;
  };

  // No-op place function for spectate
  const place = () => {};

  return (
    <div className={"flex flex-col items-center justify-center min-h-screen"}>
      <div
        className={
          "flex flex-row justify-center items-center w-full p-15 space-x-20"
        }
      >
        <div className={"flex flex-col space-y-10 w-1/3"}>
          <PlayerCard
            name={player2?.name ?? "Waiting..."}
            color={player2?.color ?? "WHITE"}
            pieces={getPieceCount(player2?.color ?? "WHITE")}
            isPlayer={false}
            isTurn={turn === player2?.color}
          />
          <PlayerCard
            name={player1.name}
            color={player1.color}
            pieces={getPieceCount(player1.color)}
            isPlayer
            isTurn={turn === player1.color}
          />
        </div>
        <div className="mt-8 flex justify-center">
          <Board board={board} place={place} />
        </div>
      </div>
    </div>
  );
}
