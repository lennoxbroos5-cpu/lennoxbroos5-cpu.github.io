export enum GameMode {
  LOCAL = 'LOCAL',
  ONLINE = 'ONLINE'
}

export enum PlayerColor {
  WHITE = 'w',
  BLACK = 'b'
}

export interface GameState {
  fen: string;
  turn: PlayerColor;
  history: string[];
  isGameOver: boolean;
  winner?: PlayerColor | 'draw';
  lastMove?: { from: string; to: string };
}

export interface ChatMessage {
  id: string;
  sender: string;
  text: string;
  timestamp: number;
}

export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

export interface OnlineGameData {
  fen: string;
  whitePlayer: string | null;
  blackPlayer: string | null;
  whitePlayerName?: string;
  blackPlayerName?: string;
  lastUpdated: number;
  status: 'waiting' | 'active' | 'finished';
  winner?: string;
  history?: string[];
}