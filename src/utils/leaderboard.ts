// utils/leaderboard.ts
export type LeaderboardEntry = {
    name: string;
    score: number;
    createdAt: number; // epoch ms
  };
  
  const KEY = "aimlab:leaderboard";
  
  function readAll(): LeaderboardEntry[] {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return [];
      const arr = JSON.parse(raw);
      return Array.isArray(arr) ? arr : [];
    } catch {
      return [];
    }
  }
  
  function writeAll(entries: LeaderboardEntry[]) {
    localStorage.setItem(KEY, JSON.stringify(entries));
  }
  
  export function saveScore(entry: LeaderboardEntry) {
    const all = readAll();
    all.push(entry);

    all.sort((a, b) => (b.score - a.score) || (a.createdAt - b.createdAt));
    
    writeAll(all);
  }
  
  export function getLeaderboard(): LeaderboardEntry[] {
    return readAll();
  }
  
  export function clearLeaderboard() {
    writeAll([]);
  }
  