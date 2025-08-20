export enum PieceType {
  WHITE = 'white',
  BLACK = 'black',
  EMPTY = 'empty',
}

export enum GameStatus {
  COMPLETED = 'completed',
  IN_PROGRESS = 'in_progress',
}

export interface Player {
  id: string;
  name: string;
  pieceType: PieceType;
}

export interface GameState {
  id: string;
  board: PieceType[][];
  currentPlayer: Player;
  status: GameStatus;
  winner?: PieceType;
  createdAt: Date;
  updatedAt: Date;
}
