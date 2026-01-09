"use client";

import { useState } from "react";
import WelcomeScreen from "@/components/WelcomeScreen";
import TeamSelector from "@/components/TeamSelector";
import GameArena from "@/components/GameArena";
import CompetitionBar from "@/components/CompetitionBar"; // <--- 1. ייבוא
import { GameState, Player } from "@/types";
import { savePlayerScore } from "@/firebase/db"; // <--- 2. ייבוא פונקציית שמירה

export default function Home() {
  const [gameState, setGameState] = useState<GameState>("WELCOME");

  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);
  const [currentTeam, setCurrentTeam] = useState<"beer_sheva" | "eilat" | null>(null);
  const [finalScore, setFinalScore] = useState(0);

  const handleStartGame = () => {
    setGameState("SELECT_TEAM");
  };

  const handleJoinGame = (player: Player, team: "beer_sheva" | "eilat") => {
    setCurrentPlayer(player);
    setCurrentTeam(team);
    setGameState("PLAYING");
  };

  // פונקציית סיום המשחק המעודכנת
  const handleGameOver = async (score: number, isPerfect: boolean) => {
    setFinalScore(score);

    // שמירה ב-Firebase אם יש לנו שחקן מחובר
    if (currentPlayer && currentTeam) {
      console.log("Saving score to DB...");
      await savePlayerScore(currentPlayer.id, currentPlayer.name, currentTeam, score);
    }

    setGameState("GAME_OVER");
  };

  return (
    <>
      {/* הבר מופיע תמיד בחלק העליון */}
      <CompetitionBar />

      <div className="flex-1 relative overflow-hidden flex flex-col">
        {gameState === "WELCOME" && (
          <WelcomeScreen onStart={handleStartGame} />
        )}

        {gameState === "SELECT_TEAM" && (
          <TeamSelector onJoin={handleJoinGame} />
        )}

        {gameState === "PLAYING" && (
          <GameArena onGameOver={handleGameOver} />
        )}

        {gameState === "GAME_OVER" && (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-white animate-fade-in">
            <h1 className="text-4xl font-bold mb-4 text-gray-800">המשחק הסתיים!</h1>
            <div className="text-6xl mb-6">🏆</div>

            <p className="text-xl text-gray-500 mb-2">הניקוד שלך:</p>
            <p className="text-6xl font-black text-blue-600 mb-8">{finalScore}</p>

            <div className="text-sm text-gray-400 mb-8 bg-gray-50 p-4 rounded-lg">
              הניקוד עודכן בלוח התוצאות הקבוצתי.
              <br />
              הצוות שלך מודה לך!
            </div>

            <button
              onClick={() => setGameState("WELCOME")}
              className="bg-gray-900 hover:bg-black text-white px-8 py-3 rounded-xl font-bold transition-transform active:scale-95 shadow-lg"
            >
              חזרה למסך הראשי
            </button>
          </div>
        )}
      </div>
    </>
  );
}