import { FaCircle } from "react-icons/fa6";

interface Props {
  board: ("B" | "W" | null)[][];
  place: (coord: string) => void;
}

const columns = ["A", "B", "C", "D", "E", "F", "G", "H"];

export function Board({ board, place }: Props) {
  return (
    <div className="grid grid-cols-8 gap-1 size-3/4 w-full">
      {board.map((row, rowIdx) =>
        row.map((cell, colIdx) => {
          const coord = `${columns[colIdx]}${rowIdx + 1}`;
          return (
            <button
              key={coord}
              className="w-18 h-18 flex items-center justify-center bg-green-700 rounded hover:bg-green-800 border border-green-900"
              onClick={() => place(coord)}
            >
              {cell === "B" && <FaCircle className="text-black size-10/12" />}
              {cell === "W" && <FaCircle className="text-white size-10/12" />}
            </button>
          );
        }),
      )}
    </div>
  );
}
