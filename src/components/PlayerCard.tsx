import { FaCircle } from "react-icons/fa";
import type { Color } from "@/generated/prisma";

interface Props {
  name: string;
  color: Color;
  pieces: number;
  isPlayer: boolean;
  isTurn: boolean;
}

export function PlayerCard({ name, color, pieces, isPlayer, isTurn }: Props) {
  return (
    <div className="card w-full bg-base-300 shadow-md">
      <div className="card-body flex-row items-center">
        <div className={"flex jusstify-between items-center w-full"}>
          <FaCircle
            className="size-1/6"
            color={color === "BLACK" ? "black" : "white"}
          />
          <div className="flex flex-col justify-center ml-4">
            <h2 className="card-title text-5xl">{name}</h2>
            <div className={"flex flex-row space-x-2"}>
              {isPlayer && (
                <span className="badge badge-lg badge-primary mt-2">You</span>
              )}
              {isTurn && (
                <span className="badge badge-lg badge-secondary mt-2">
                  Turn
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="ml-auto">
          <span className="text-8xl font-bold">{pieces}</span>
        </div>
      </div>
    </div>
  );
}
