import React, { useState, useEffect } from 'react';
import { Chess, Square } from 'chess.js';
import ChessSquare from './ChessSquare';
import { PlayerColor } from '../types';

interface ChessBoardProps {
  fen: string;
  onMove: (move: { from: string; to: string; promotion?: string }) => void;
  orientation: PlayerColor;
  isInteractive: boolean;
  lastMove?: { from: string; to: string };
}

const ChessBoard: React.FC<ChessBoardProps> = ({ fen, onMove, orientation, isInteractive, lastMove }) => {
  const [game, setGame] = useState(new Chess(fen));
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
  const [validMoves, setValidMoves] = useState<string[]>([]);

  // Sync internal game state when FEN changes from props (e.g. from Firebase)
  useEffect(() => {
    try {
      const newGame = new Chess(fen);
      setGame(newGame);
    } catch (e) {
      console.error("Invalid FEN", fen);
    }
  }, [fen]);

  const getValidMovesForSquare = (square: Square) => {
    return game.moves({ square, verbose: true }).map(m => m.to);
  };

  const onSquareClick = (square: Square) => {
    if (!isInteractive) return;

    // If we click the same square, deselect
    if (selectedSquare === square) {
      setSelectedSquare(null);
      setValidMoves([]);
      return;
    }

    // Attempt to make a move
    if (selectedSquare) {
      try {
        const moveAttempt = {
          from: selectedSquare,
          to: square,
          promotion: 'q' // Always promote to queen for simplicity in this version
        };

        const result = game.move(moveAttempt); // Validate locally first
        
        if (result) {
          // If valid, trigger prop callback
          // Note: we undo immediately locally because the prop update will drive the visual state
          game.undo(); 
          onMove(moveAttempt);
          setSelectedSquare(null);
          setValidMoves([]);
          return;
        }
      } catch (e) {
        // Invalid move, ignore
      }
    }

    // Select a piece
    const piece = game.get(square);
    if (piece) {
       // Only allow selecting own pieces
       const turnColor = game.turn();
       if (piece.color === turnColor) {
         setSelectedSquare(square);
         setValidMoves(getValidMovesForSquare(square));
         return;
       }
    }
    
    // Clicked empty square or enemy piece without valid move
    setSelectedSquare(null);
    setValidMoves([]);
  };

  const renderBoard = () => {
    const squares = [];
    const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];
    
    // Adjust if orientation is black
    const displayRanks = orientation === PlayerColor.WHITE ? ranks : [...ranks].reverse();
    const displayFiles = orientation === PlayerColor.WHITE ? files : [...files].reverse();

    for (let r = 0; r < 8; r++) {
      for (let f = 0; f < 8; f++) {
        const rank = displayRanks[r];
        const file = displayFiles[f];
        const squareId = `${file}${rank}` as Square;
        
        const piece = game.get(squareId);
        const isBlackSquare = (r + f) % 2 === 1;
        const isSelected = selectedSquare === squareId;
        const isValid = validMoves.includes(squareId);
        const isLastMoveFrom = lastMove?.from === squareId;
        const isLastMoveTo = lastMove?.to === squareId;

        // Determine if we should show labels
        // Rank label on the left-most file (visual index 0)
        const showRank = f === 0 ? rank : undefined;
        // File label on the bottom-most rank (visual index 7)
        const showFile = r === 7 ? file : undefined;

        squares.push(
          <ChessSquare 
            key={squareId}
            isBlack={isBlackSquare}
            piece={piece}
            isSelected={isSelected}
            isValidMove={isValid}
            isLastMoveFrom={isLastMoveFrom}
            isLastMoveTo={isLastMoveTo}
            onClick={() => onSquareClick(squareId)}
            rankLabel={showRank}
            fileLabel={showFile}
          />
        );
      }
    }
    return squares;
  };

  return (
    <div className="w-full max-w-[600px] aspect-square grid grid-cols-8 border-4 border-slate-700 shadow-2xl rounded-sm overflow-hidden bg-slate-800">
      {renderBoard()}
    </div>
  );
};

export default ChessBoard;