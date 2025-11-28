import React, { useState, useEffect, useCallback } from 'react';
import { Chess } from 'chess.js';
import { HashRouter, Routes, Route, useNavigate, useParams } from 'react-router-dom';
import ChessBoard from './components/ChessBoard';
import { firebaseService } from './services/firebaseService';
import { getChessAnalysis } from './services/gemini';
import { PlayerColor, FirebaseConfig, OnlineGameData } from './types';

// --- Components defined in file ---

const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'danger' | 'ghost' }> = ({ className, variant = 'primary', ...props }) => {
  const baseStyle = "px-6 py-2 rounded font-semibold transition-all duration-200 transform active:scale-95 shadow-md flex items-center justify-center gap-2";
  const variants = {
    primary: "bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white border border-transparent",
    secondary: "bg-slate-700 hover:bg-slate-600 text-slate-200 border border-slate-600",
    danger: "bg-red-500 hover:bg-red-400 text-white border border-transparent",
    ghost: "bg-transparent hover:bg-slate-800 text-slate-400 border border-transparent"
  };
  return <button className={`${baseStyle} ${variants[variant]} ${className}`} {...props} />;
};

const SetupScreen: React.FC<{ onStartLocal: () => void, onConnectFirebase: (config: FirebaseConfig) => void }> = ({ onStartLocal, onConnectFirebase }) => {
  const [configStr, setConfigStr] = useState('');
  const [showConfig, setShowConfig] = useState(false);

  const handleJsonSubmit = () => {
    try {
      const config = JSON.parse(configStr);
      onConnectFirebase(config);
    } catch (e) {
      alert("Invalid JSON configuration. Please check the format.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#0B0F19] text-white">
      <div className="max-w-md w-full text-center space-y-8 animate-fade-in-up">
        <div className="space-y-2">
          <h1 className="text-6xl font-black bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 drop-shadow-lg">
            CHESS
          </h1>
          <p className="text-slate-400 text-lg tracking-wide">
            Master the board. Challenge your friends.
          </p>
        </div>

        <div className="space-y-4 pt-8">
          <Button onClick={onStartLocal} className="w-full text-lg py-4 shadow-indigo-500/20">
            Play Locally (Offline)
          </Button>
          
          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-800"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase tracking-widest">
              <span className="px-2 bg-[#0B0F19] text-slate-600">Online Multiplayer</span>
            </div>
          </div>

          {!showConfig ? (
             <Button variant="secondary" onClick={() => setShowConfig(true)} className="w-full">
               Connect with Firebase
             </Button>
          ) : (
            <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl text-left space-y-4 border border-slate-700 shadow-xl">
              <div className="flex justify-between items-center">
                 <label className="text-sm font-medium text-slate-300">
                   Firebase Config (JSON)
                 </label>
                 <a href="https://firebase.google.com/docs/web/setup" target="_blank" rel="noreferrer" className="text-xs text-indigo-400 hover:underline">
                   How to get this?
                 </a>
              </div>
              <textarea 
                className="w-full h-32 bg-slate-900/80 text-slate-300 p-3 rounded-lg text-xs font-mono border border-slate-700 focus:border-indigo-500 outline-none transition-colors"
                placeholder='{ "apiKey": "AIza...", "authDomain": "..." }'
                value={configStr}
                onChange={(e) => setConfigStr(e.target.value)}
              />
              <div className="flex gap-2">
                 <Button variant="ghost" onClick={() => setShowConfig(false)} className="flex-1">Cancel</Button>
                 <Button onClick={handleJsonSubmit} className="flex-1">Connect</Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const UsernameScreen: React.FC<{ onSetUsername: (name: string) => void }> = ({ onSetUsername }) => {
  const [name, setName] = useState('');

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#0B0F19] text-white">
       <div className="bg-slate-800 p-8 rounded-xl shadow-2xl max-w-sm w-full space-y-6 border border-slate-700">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold">Create Profile</h2>
            <p className="text-slate-400 text-sm">Choose a name to represent you on the board.</p>
          </div>
          <input 
            type="text" 
            placeholder="e.g. Grandmaster Flash" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-white outline-none focus:border-indigo-500 text-center text-lg placeholder-slate-600 transition-colors"
            onKeyDown={(e) => e.key === 'Enter' && name.trim() && onSetUsername(name)}
            autoFocus
          />
          <Button onClick={() => name.trim() && onSetUsername(name)} className="w-full py-3" disabled={!name.trim()}>
            Enter Lobby
          </Button>
       </div>
    </div>
  );
};

const Lobby: React.FC<{ username: string }> = ({ username }) => {
  const [gameId, setGameId] = useState('');
  const navigate = useNavigate();

  const handleCreate = async () => {
    const newId = Math.random().toString(36).substring(2, 8).toUpperCase();
    await firebaseService.createGame(newId, new Chess().fen(), username);
    navigate(`/game/${newId}`);
  };

  const handleJoin = async () => {
    if (!gameId) return;
    const success = await firebaseService.joinGame(gameId, username);
    if (success) {
      navigate(`/game/${gameId}`);
    } else {
      alert("Game not found or full!");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0B0F19] text-white p-4">
       <div className="bg-slate-800 p-8 rounded-xl shadow-2xl max-w-md w-full space-y-8 border border-slate-700 relative overflow-hidden">
          
          {/* Decorative blur */}
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-500/20 blur-3xl rounded-full"></div>
          
          <div className="text-center">
             <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
               Welcome, {username}
             </h2>
             <p className="text-slate-400 mt-2">Ready to play?</p>
          </div>

          <div className="space-y-3">
             <Button onClick={handleCreate} className="w-full py-4 text-lg">
               Start New Game
             </Button>
             <p className="text-center text-xs text-slate-500 uppercase tracking-widest my-2">- OR -</p>
             <div className="flex gap-2">
               <input 
                 type="text" 
                 placeholder="ENTER CODE" 
                 value={gameId}
                 onChange={(e) => setGameId(e.target.value.toUpperCase())}
                 className="flex-1 bg-slate-900 border border-slate-600 rounded px-4 py-2 text-white outline-none focus:border-indigo-500 text-center tracking-widest font-mono"
                 maxLength={6}
               />
               <Button onClick={handleJoin} variant="secondary">Join</Button>
             </div>
          </div>
          
          <div className="text-center pt-4">
            <button onClick={() => navigate('/')} className="text-slate-500 hover:text-slate-300 text-xs hover:underline">
              Disconnect
            </button>
          </div>
       </div>
    </div>
  );
};

const GameRoom: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [game, setGame] = useState(new Chess());
  const [fen, setFen] = useState(game.fen());
  const [orientation, setOrientation] = useState<PlayerColor>(PlayerColor.WHITE);
  const [gameData, setGameData] = useState<OnlineGameData | null>(null);
  const [aiTip, setAiTip] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);
  const [lastMove, setLastMove] = useState<{from: string, to: string} | undefined>(undefined);
  const isOnline = !!id;

  // Initialize online game listeners
  useEffect(() => {
    if (isOnline && id) {
      const unsubscribe = firebaseService.subscribeToGame(id, (data) => {
        if (data) {
           const safeGame = new Chess(data.fen);
           setGame(safeGame);
           setFen(data.fen);
           setGameData(data);
           
           // If we just joined and don't have an orientation set, try to auto-set
           // This requires knowing 'who' we are, which is stored in auth.currentUser.uid
           // But accessing that directly here is tricky without passing props or using context.
           // For now, we rely on manual flip or default white.
        }
      });
      return () => unsubscribe();
    }
  }, [id, isOnline]);

  const makeMove = useCallback(async (move: { from: string; to: string; promotion?: string }) => {
    try {
      const result = game.move(move);
      if (result) {
        const newFen = game.fen();
        const newHistory = game.history();
        setFen(newFen);
        setLastMove({ from: move.from, to: move.to });
        
        if (isOnline && id) {
          await firebaseService.updateGameState(id, newFen, newHistory);
        }
      }
    } catch (e) {
      console.error("Invalid move logic", e);
    }
  }, [game, id, isOnline]);

  const handleAiAssist = async () => {
    setLoadingAi(true);
    const tip = await getChessAnalysis(game.fen(), game.history());
    setAiTip(tip);
    setLoadingAi(false);
  };

  const copyInvite = () => {
     if (id) {
       navigator.clipboard.writeText(id);
       alert("Game Code copied to clipboard: " + id);
     }
  };

  // Player cards
  const PlayerCard = ({ name, color, isTurn }: { name: string, color: 'White' | 'Black', isTurn: boolean }) => (
    <div className={`flex items-center gap-3 p-3 rounded-lg border transition-all duration-300 ${isTurn ? 'bg-slate-700/80 border-indigo-400 shadow-lg shadow-indigo-500/10' : 'bg-slate-800/50 border-slate-700 opacity-80'}`}>
       <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${color === 'White' ? 'bg-slate-200 text-slate-900' : 'bg-slate-900 text-slate-200 border border-slate-600'}`}>
         {color[0]}
       </div>
       <div className="flex-1">
         <p className="text-sm font-bold text-white">{name}</p>
         <p className="text-xs text-slate-400">{color} Player</p>
       </div>
       {isTurn && <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white flex flex-col items-center py-6 px-4">
      
      {/* Header */}
      <div className="w-full max-w-5xl flex justify-between items-center mb-6 bg-slate-800/50 p-4 rounded-xl border border-slate-700 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 w-10 h-10 rounded-lg flex items-center justify-center font-black text-xl shadow-lg">
            G
          </div>
          <div>
            <h1 className="text-lg font-bold">Grandmaster Web</h1>
            {isOnline && (
              <div 
                className="flex items-center gap-2 text-xs text-slate-400 cursor-pointer hover:text-white transition-colors"
                onClick={copyInvite}
              >
                 <span className="w-2 h-2 rounded-full bg-green-500"></span>
                 Code: <span className="font-mono bg-slate-900 px-2 py-0.5 rounded border border-slate-600">{id}</span>
                 <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
              </div>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => setOrientation(o => o === PlayerColor.WHITE ? PlayerColor.BLACK : PlayerColor.WHITE)} className="text-xs px-3 py-1">
            Flip View
          </Button>
          <Button variant="danger" onClick={() => navigate('/')} className="text-xs px-3 py-1">
            Leave
          </Button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 w-full max-w-6xl justify-center items-start">
        
        {/* Main Board Area */}
        <div className="flex-1 flex flex-col gap-4 w-full max-w-[600px] mx-auto">
          {/* Top Player (Opponent usually) */}
          <PlayerCard 
            name={orientation === PlayerColor.WHITE ? (gameData?.blackPlayerName || 'Opponent') : (gameData?.whitePlayerName || 'Opponent')} 
            color={orientation === PlayerColor.WHITE ? 'Black' : 'White'}
            isTurn={game.turn() === (orientation === PlayerColor.WHITE ? 'b' : 'w')}
          />

          <ChessBoard 
            fen={fen} 
            onMove={makeMove} 
            orientation={orientation}
            isInteractive={true} 
            lastMove={lastMove}
          />

          {/* Bottom Player (You) */}
          <PlayerCard 
            name={orientation === PlayerColor.WHITE ? (gameData?.whitePlayerName || 'You') : (gameData?.blackPlayerName || 'You')} 
            color={orientation === PlayerColor.WHITE ? 'White' : 'Black'}
            isTurn={game.turn() === (orientation === PlayerColor.WHITE ? 'w' : 'b')}
          />
        </div>

        {/* Sidebar Controls */}
        <div className="w-full lg:w-80 space-y-4">
          
          {/* Game Info */}
          <div className="bg-slate-800/80 p-5 rounded-xl border border-slate-700">
             <div className="flex justify-between items-center mb-4">
                <span className="text-slate-400 font-bold text-xs uppercase tracking-widest">Game Status</span>
                <span className="text-green-400 text-xs font-mono animate-pulse">LIVE</span>
             </div>
             
             {game.isGameOver() && (
               <div className="p-4 bg-red-500/20 text-red-200 rounded-lg border border-red-500/30 text-center mb-4">
                 <p className="font-bold text-lg">Checkmate!</p>
                 <p className="text-sm opacity-80">{game.turn() === 'w' ? 'Black' : 'White'} wins</p>
               </div>
             )}

             {isOnline && gameData?.status === 'waiting' && (
                <div className="p-4 bg-blue-500/20 text-blue-200 rounded-lg border border-blue-500/30 text-center mb-4 text-sm">
                   Waiting for opponent...<br/>
                   <span className="font-mono text-xs opacity-75">Share Code: {id}</span>
                </div>
             )}
             
             <div className="grid grid-cols-2 gap-2">
               {!isOnline && <Button variant="secondary" onClick={() => { const g = new Chess(); setGame(g); setFen(g.fen()); }} className="text-xs">Reset</Button>}
               {!isOnline && <Button variant="secondary" onClick={() => { game.undo(); setFen(game.fen()); }} className="text-xs">Undo</Button>}
             </div>
          </div>

          {/* AI Assistant */}
          <div className="bg-gradient-to-br from-indigo-900/50 to-purple-900/50 p-1 rounded-xl shadow-lg border border-indigo-500/30">
            <div className="bg-slate-900/90 p-5 rounded-lg h-full">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold flex items-center gap-2 text-indigo-300">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                  AI Assistant
                </h3>
                <span className="text-[10px] bg-indigo-500/20 px-2 py-0.5 rounded text-indigo-300 border border-indigo-500/30">Gemini 2.5</span>
              </div>
              
              <div className="min-h-[80px] text-sm text-slate-300 mb-4 bg-slate-950/50 p-3 rounded border border-slate-800/50">
                {aiTip ? (
                  <span className="italic">"{aiTip}"</span>
                ) : (
                  <span className="text-slate-600">Request analysis to get strategic advice for the current position.</span>
                )}
              </div>

              <Button onClick={handleAiAssist} disabled={loadingAi} className="w-full relative overflow-hidden group">
                 <span className="relative z-10">{loadingAi ? 'Analyzing...' : 'Ask Coach'}</span>
                 <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </Button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

const MainApp: React.FC = () => {
  const navigate = useNavigate();
  const [firebaseConfigured, setFirebaseConfigured] = useState(false);
  const [username, setUsername] = useState('');

  const startLocal = () => {
    navigate('/game/local');
  };

  const connectFirebase = async (config: FirebaseConfig) => {
    try {
      firebaseService.init(config);
      await firebaseService.signIn();
      setFirebaseConfigured(true);
    } catch (e) {
      alert("Failed to connect to Firebase. Please check your config.");
    }
  };

  return (
    <Routes>
      <Route path="/" element={
        !firebaseConfigured 
          ? <SetupScreen onStartLocal={startLocal} onConnectFirebase={connectFirebase} />
          : !username 
            ? <UsernameScreen onSetUsername={setUsername} />
            : <Lobby username={username} />
      } />
      <Route path="/lobby" element={
        firebaseConfigured && username ? <Lobby username={username} /> : <div/> 
      } />
      <Route path="/game/local" element={<GameRoom />} />
      <Route path="/game/:id" element={<GameRoom />} />
    </Routes>
  );
};

export default function App() {
  return (
    <HashRouter>
      <MainApp />
    </HashRouter>
  );
}