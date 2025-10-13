import { FaCircle } from "react-icons/fa";
import { Color } from "@/generated/prisma";

interface Props {
  name: string;
  color: Color;
  pieces: number;
}

export function PlayerCard({ name, color, pieces }: Props) {
  return (
    <div className="card w-60 bg-base-300 shadow-md">
      <div className="card-body flex-row items-center">
        <FaCircle
          className="size-1/3"
          color={color === "BLACK" ? "black" : "white"}
        />
        <div className="flex flex-col justify-center ml-4">
          <h2 className="card-title">{name}</h2>
          <p className="text-lg font-semibold">Pieces: {pieces}</p>
        </div>
      </div>
    </div>
  );
}
