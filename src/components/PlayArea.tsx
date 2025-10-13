"use client";
import { Player, Game } from "@/generated/prisma";
import { useState, useEffect } from "react";
import { PlayerCard } from "@/components/PlayerCard";

interface Props {
  initialState: Game;
  player: Player;
  opponent: Player;
}

export function PlayArea({ initialState, player, opponent }: Props) {
  const [board, setBoard] = useState<string[][]>(
    JSON.parse(initialState.board),
  );
  const [pieces, setPieces] = useState<number>(0);
  const [opponentPieces, setOpponentPieces] = useState<number>(0);

  useEffect(() => {
    const playerPiece = player.color === "BLACK" ? "B" : "W";
    const opponentPiece = opponent.color === "BLACK" ? "W" : "B";
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
  }, [board, player, opponent]);

  return (
    <>
      <div className={"flex flex-row justify-center items-center gap-10"}>
        <div className={"flex flex-col items-center space-y-3"}>
          <PlayerCard name={player.name} color={player.color} pieces={pieces} />
          <PlayerCard
            name={opponent.name}
            color={opponent.color}
            pieces={opponentPieces}
          />
        </div>
      </div>
    </>
  );
}
