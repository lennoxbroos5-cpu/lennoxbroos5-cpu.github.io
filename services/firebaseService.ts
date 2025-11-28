import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getFirestore, doc, setDoc, onSnapshot, getDoc, Firestore, updateDoc } from "firebase/firestore";
import { getAuth, Auth, signInAnonymously } from "firebase/auth";
import { FirebaseConfig, OnlineGameData } from "../types";

// We'll export a class or singleton to manage the dynamic config
class FirebaseService {
  private app: FirebaseApp | null = null;
  private db: Firestore | null = null;
  private auth: Auth | null = null;
  private initialized = false;

  isInitialized() {
    return this.initialized;
  }

  init(config: FirebaseConfig) {
    if (getApps().length === 0) {
      try {
        this.app = initializeApp(config);
        this.db = getFirestore(this.app);
        this.auth = getAuth(this.app);
        this.initialized = true;
        console.log("Firebase initialized successfully");
      } catch (e) {
        console.error("Firebase init error", e);
        this.initialized = false;
        throw e;
      }
    } else {
        // Already initialized
        this.app = getApps()[0];
        this.db = getFirestore(this.app);
        this.auth = getAuth(this.app);
        this.initialized = true;
    }
  }

  async signIn() {
    if (!this.auth) throw new Error("Firebase not initialized");
    return signInAnonymously(this.auth);
  }

  getDb() {
    return this.db;
  }

  async createGame(gameId: string, initialFen: string, playerName: string): Promise<string> {
    if (!this.db || !this.auth) throw new Error("Not connected");
    const userId = this.auth.currentUser?.uid;
    
    await setDoc(doc(this.db, "games", gameId), {
      fen: initialFen,
      whitePlayer: userId,
      whitePlayerName: playerName,
      blackPlayer: null,
      blackPlayerName: null,
      lastUpdated: Date.now(),
      status: 'waiting',
      history: []
    });
    return gameId;
  }

  async joinGame(gameId: string, playerName: string): Promise<boolean> {
    if (!this.db || !this.auth) throw new Error("Not connected");
    const userId = this.auth.currentUser?.uid;
    const gameRef = doc(this.db, "games", gameId);
    const snap = await getDoc(gameRef);

    if (snap.exists()) {
      const data = snap.data();
      // If I am already in the game, just return true
      if (data.whitePlayer === userId || data.blackPlayer === userId) {
        return true;
      }
      // Join as black if empty
      if (!data.blackPlayer) {
        await updateDoc(gameRef, {
          blackPlayer: userId,
          blackPlayerName: playerName,
          status: 'active'
        });
        return true;
      }
    }
    return false;
  }

  async updateGameState(gameId: string, fen: string, history: string[]) {
    if (!this.db) return;
    const gameRef = doc(this.db, "games", gameId);
    await updateDoc(gameRef, {
      fen,
      history,
      lastUpdated: Date.now()
    });
  }

  subscribeToGame(gameId: string, callback: (data: OnlineGameData) => void) {
    if (!this.db) return () => {};
    return onSnapshot(doc(this.db, "games", gameId), (doc) => {
      if (doc.exists()) {
        callback(doc.data() as OnlineGameData);
      }
    });
  }
}

export const firebaseService = new FirebaseService();