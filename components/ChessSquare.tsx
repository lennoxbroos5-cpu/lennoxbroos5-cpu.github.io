import React from 'react';
import { PIECE_IMAGES } from '../constants';

interface ChessSquareProps {
  isBlack: boolean;
  piece: { type: string; color: string } | null;
  isSelected: boolean;
  isValidMove: boolean;
  isLastMoveFrom: boolean;
  isLastMoveTo: boolean;
  onClick: () => void;
  rankLabel?: string;
  fileLabel?: string;
}

const ChessSquare: React.FC<ChessSquareProps> = ({ 
  isBlack, piece, isSelected, isValidMove, isLastMoveFrom, isLastMoveTo, onClick, rankLabel, fileLabel
}) => {
  // Base background color
  let bgColor = isBlack ? 'bg-slate-600' : 'bg-slate-300';
  
  // Highlight overrides
  if (isSelected) bgColor = 'bg-yellow-200';
  else if (isLastMoveFrom || isLastMoveTo) bgColor = 'bg-yellow-100/50';

  // Text color for coordinates
  const textColor = isBlack ? 'text-slate-300' : 'text-slate-600';

  return (
    <div 
      className={`w-full h-full flex items-center justify-center relative ${bgColor} select-none cursor-pointer`}
      onClick={onClick}
    >
      {/* Coordinates */}
      {rankLabel && (
        <span className={`absolute top-0.5 left-0.5 text-[10px] font-bold ${textColor}`}>
          {rankLabel}
        </span>
      )}
      {fileLabel && (
        <span className={`absolute bottom-0 right-1 text-[10px] font-bold ${textColor}`}>
          {fileLabel}
        </span>
      )}

      {/* Valid Move Indicator */}
      {isValidMove && !piece && (
        <div className="absolute w-3 h-3 bg-black/20 rounded-full"></div>
      )}
      
      {/* Valid Capture Indicator */}
      {isValidMove && piece && (
        <div className="absolute w-full h-full border-4 border-black/20 rounded-full"></div>
      )}

      {/* Piece Image */}
      {piece && (
        <img 
          src={PIECE_IMAGES[piece.color][piece.type]} 
          alt={`${piece.color}${piece.type}`} 
          className="w-[85%] h-[85%] object-contain pointer-events-none select-none drop-shadow-md z-10" 
        />
      )}
    </div>
  );
};

export default ChessSquare;