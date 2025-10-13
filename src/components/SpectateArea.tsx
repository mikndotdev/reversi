"use client";
import { useState } from "react";
import { useRealtime } from "@upstash/realtime/client";
import { Board } from "@/components/Board";
import { PlayerCard } from "@/components/PlayerCard";
import type { Color, Game, Player } from "@/generated/prisma";
import type { RealtimeEvents } from "@/lib/realtime";

interface Props {
  initialState: Game;
  player1: Player;
  player2: Player | null;
}

export function SpectateArea({ initialState, player1, player2 }: Props) {
  const [board, setBoard] = useState<("B" | "W" | null)[][]>(
    JSON.parse(initialState.board),
  );
  const [turn, setTurn] = useState<Color>(initialState.turn);

  useRealtime<RealtimeEvents>({
    channel: initialState.id,
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
      skip: {
        turn: (data) => {
          const skippedPlayerName =
            data.skippedColor === player1.color
              ? player1.name
              : player2?.name ?? "Player 2";
          console.log(`${skippedPlayerName} has no valid moves. Turn skipped!`);
          setTurn(data.nextColor);
        },
      },
    },
  });

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
            isPlayer={false}
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
