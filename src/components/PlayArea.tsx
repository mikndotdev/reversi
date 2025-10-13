"use client";
import { useRealtime } from "@upstash/realtime/client";
import { Howl } from "howler";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { movePiece } from "@/app/actions/move";
import { Board } from "@/components/Board";
import { ConnectionState } from "@/components/ConnectionState";
import { PlayerCard } from "@/components/PlayerCard";
import type { Color, Game, Player } from "@/generated/prisma";
import { GetFlippedPieces, ValidateMove } from "@/lib/game";
import type { RealtimeEvents } from "@/lib/realtime";

interface Props {
  initialState: Game;
  player: Player;
  opponent: Player;
}

export function PlayArea({ initialState, player, opponent }: Props) {
  const [board, setBoard] = useState<("B" | "W" | null)[][]>(
    JSON.parse(initialState.board),
  );
  const [pieces, setPieces] = useState<number>(0);
  const [opponentPieces, setOpponentPieces] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [turn, setTurn] = useState<Color>(initialState.turn);
  const wrongSound = new Howl({ src: ["/sounds/wrong.mp3"] });
  const tapSound = new Howl({ src: ["/sounds/tap.mp3"] });

  // Listen for moves from opponent
  const { status } = useRealtime<RealtimeEvents>({
    channel: initialState.id,
    events: {
      place: {
        move: async (data) => {
          setTurn(data.color === "BLACK" ? "WHITE" : "BLACK");

          if (data.color === player.color) return;

          const playerPiece = data.color === "BLACK" ? "B" : "W";

          // Place the piece first
          setBoard((prevBoard) => {
            const newBoard = prevBoard.map((r) => [...r]);
            const col = data.coord[0].charCodeAt(0) - "A".charCodeAt(0);
            const row = parseInt(data.coord.slice(1), 10) - 1;
            newBoard[row][col] = playerPiece;
            return newBoard;
          });

          tapSound.play();

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

  useEffect(() => {
    const playerPiece = player.color === "BLACK" ? "B" : "W";
    const opponentPiece = player.color === "BLACK" ? "W" : "B";
    let playerCount = 0;
    let opponentCount = 0;

    board.forEach((row) => {
      row.forEach((cell) => {
        if (cell === playerPiece) playerCount++;
        if (cell === opponentPiece) opponentCount++;
      });
    });

    setPieces(playerCount);
    setOpponentPieces(opponentCount);
  }, [board, player.color]);

  const place = async (coord: string) => {
    if (isProcessing) return;
    if (turn !== player.color) {
      wrongSound.play();
    }

    if (!ValidateMove(player.color, board, coord)) {
      wrongSound.play();
      return;
    }

    setIsProcessing(true);

    try {
      // Get flipped pieces before making the move
      const flippedPieces = GetFlippedPieces(player.color, board, coord);

      await movePiece(initialState.id, coord);

      const playerPiece = player.color === "BLACK" ? "B" : "W";

      // Place the piece locally
      setBoard((prevBoard) => {
        const newBoard = prevBoard.map((r) => [...r]);
        const col = coord[0].charCodeAt(0) - "A".charCodeAt(0);
        const row = parseInt(coord.slice(1), 10) - 1;
        newBoard[row][col] = playerPiece;
        return newBoard;
      });

      tapSound.play();

      // Animate flipped pieces one by one
      for (const direction of flippedPieces) {
        for (const [row, col] of direction) {
          await new Promise((resolve) => setTimeout(resolve, 100));
          setBoard((prevBoard) => {
            const newBoard = prevBoard.map((r) => [...r]);
            newBoard[row][col] = playerPiece;
            return newBoard;
          });
        }
      }

      setTurn(player.color === "BLACK" ? "WHITE" : "BLACK");
      setIsProcessing(false);
    } catch (error) {
      wrongSound.play();
      toast.error(
        error instanceof Error ? error.message : "Failed to make move",
      );
      setIsProcessing(false);
    }
  };

  return (
    <>
      <div
        className={
          "flex flex-row justify-center items-center w-full p-15 space-x-20"
        }
      >
        <div className={"flex flex-col space-y-10 w-1/3"}>
          <PlayerCard
            name={opponent.name}
            color={opponent.color}
            pieces={opponentPieces}
            isPlayer={false}
            isTurn={turn === opponent.color}
          />
          <PlayerCard
            name={player.name}
            color={player.color}
            pieces={pieces}
            isPlayer
            isTurn={turn === player.color}
          />
        </div>
        <div className="mt-8 flex justify-center">
          <Board board={board} place={place} />
        </div>
      </div>
      <div className={"mb-5"}>
        <ConnectionState status={status} />
      </div>
    </>
  );
}
