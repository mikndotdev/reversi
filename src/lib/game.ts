import type { Color } from "@/generated/prisma";

// Helper to convert coordinate like "A3" to [row, col] indices
function coordToIndex(coord: string): [number, number] {
  const colLetter = coord[0].toUpperCase();
  const rowNumber = parseInt(coord.slice(1), 10);
  const col = colLetter.charCodeAt(0) - "A".charCodeAt(0);
  const row = rowNumber - 1;
  return [row, col];
}

export function ValidateMove(
  color: Color,
  board: ("B" | "W" | null)[][],
  coord: string,
): boolean {
  const [row, col] = coordToIndex(coord);
  if (row < 0 || row > 7 || col < 0 || col > 7) return false;
  if (board[row][col]) return false; // must be empty

  const playerPiece = color === "BLACK" ? "B" : "W";
  const opponentPiece = color === "BLACK" ? "W" : "B";
  const directions = [
    [-1, 0],
    [1, 0], // vertical
    [0, -1],
    [0, 1], // horizontal
    [-1, -1],
    [-1, 1],
    [1, -1],
    [1, 1], // diagonal
  ];

  for (const [dx, dy] of directions) {
    let x = row + dx;
    let y = col + dy;
    let foundOpponent = false;
    let foundPlayer = false;
    let steps = 0;
    while (x >= 0 && x < 8 && y >= 0 && y < 8) {
      const cell = board[x][y];
      if (cell === opponentPiece) {
        foundOpponent = true;
      } else if (cell === playerPiece) {
        foundPlayer = foundOpponent; // only valid if at least one opponent in between
        break;
      } else {
        break;
      }
      x += dx;
      y += dy;
      steps++;
    }
    if (foundPlayer) return true;
  }
  return false;
}

// Get all pieces that would be flipped by a move, organized by direction
export function GetFlippedPieces(
  color: Color,
  board: ("B" | "W" | null)[][],
  coord: string,
): [number, number][][] {
  const [row, col] = coordToIndex(coord);
  const playerPiece = color === "BLACK" ? "B" : "W";
  const opponentPiece = color === "BLACK" ? "W" : "B";
  const directions = [
    [-1, 0],
    [1, 0], // vertical
    [0, -1],
    [0, 1], // horizontal
    [-1, -1],
    [-1, 1],
    [1, -1],
    [1, 1], // diagonal
  ];

  const flippedByDirection: [number, number][][] = [];

  for (const [dx, dy] of directions) {
    let x = row + dx;
    let y = col + dy;
    const toFlip: [number, number][] = [];

    while (x >= 0 && x < 8 && y >= 0 && y < 8) {
      const cell = board[x][y];
      if (cell === opponentPiece) {
        toFlip.push([x, y]);
      } else if (cell === playerPiece) {
        if (toFlip.length > 0) {
          flippedByDirection.push(toFlip);
        }
        break;
      } else {
        break;
      }
      x += dx;
      y += dy;
    }
  }

  return flippedByDirection;
}

// Process a move and return the new board state
export function ProcessMove(
  color: Color,
  board: ("B" | "W" | null)[][],
  coord: string,
): ("B" | "W" | null)[][] {
  const [row, col] = coordToIndex(coord);
  const newBoard = board.map((r) => [...r]);
  const playerPiece = color === "BLACK" ? "B" : "W";

  // Place the piece
  newBoard[row][col] = playerPiece;

  // Flip all affected pieces
  const flippedPieces = GetFlippedPieces(color, board, coord);
  for (const direction of flippedPieces) {
    for (const [r, c] of direction) {
      newBoard[r][c] = playerPiece;
    }
  }

  return newBoard;
}
