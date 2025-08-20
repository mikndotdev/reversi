export type PieceType = 'white' | 'black' | 'empty';

export type GameStatus = 'completed' | 'in_progress';

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