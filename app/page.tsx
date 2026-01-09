/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useEffect } from "react";
import WelcomeScreen from "@/components/WelcomeScreen";
import TeamSelector from "@/components/TeamSelector";
import GameArena from "@/components/GameArena";
import CompetitionBar from "@/components/CompetitionBar";
import { GameState, Player } from "@/types";
import { savePlayerScore } from "@/firebase/db";

export default function Home() {
  const [gameState, setGameState] = useState<GameState>("WELCOME");
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);
  const [currentTeam, setCurrentTeam] = useState<"beer_sheva" | "eilat" | null>(null);
  const [finalScore, setFinalScore] = useState(0);

  // --- הוספנו: בדיקת LocalStorage בטעינה ---
  useEffect(() => {
    const savedUser = localStorage.getItem("atidim_user");
    if (savedUser) {
      try {
        const { player, team } = JSON.parse(savedUser);
        if (player && team) {
          console.log("Auto-login from localStorage:", player.name);
          setCurrentPlayer(player);
          setCurrentTeam(team);
          // אפשר להעביר ישר ל-PLAYING או להשאיר ב-WELCOME והכפתור יהיה "המשך כ-[שם]"
          // כרגע נשאיר ב-WELCOME כדי שיראה את החוקים, אבל כשהוא ילחץ "התחל" נדלג על בחירת הקבוצה
        }
      } catch (e) {
        console.error("Failed to parse user data", e);
      }
    }
  }, []);

  const handleStartGame = () => {
    // אם כבר יש לנו שחקן (מהלוקאל סטורג'), דלג ישר למשחק
    if (currentPlayer && currentTeam) {
      setGameState("PLAYING");
    } else {
      setGameState("SELECT_TEAM");
    }
  };

  // ... (שאר הפונקציות: handleJoinGame, handleGameOver נשארות זהות)
  const handleJoinGame = (player: Player, team: "beer_sheva" | "eilat") => {
    setCurrentPlayer(player);
    setCurrentTeam(team);
    setGameState("PLAYING");
  };

  const handleGameOver = async (score: number, isPerfect: boolean) => {
    setFinalScore(score);
    if (currentPlayer && currentTeam) {
      await savePlayerScore(currentPlayer.id, currentPlayer.name, currentTeam, score);
    }
    setGameState("GAME_OVER");
  };

  // פונקציית התנתקות (אופציונלי - אם תרצה כפתור יציאה בעתיד)
  /*
  const handleLogout = () => {
    localStorage.removeItem("atidim_user");
    setCurrentPlayer(null);
    setCurrentTeam(null);
    setGameState("WELCOME");
  };
  */

  return (
    <>
      <CompetitionBar />

      <div className="flex-1 relative overflow-hidden flex flex-col">
        {gameState === "WELCOME" && (
          <WelcomeScreen
            onStart={handleStartGame}
            playerName={currentPlayer?.name} 
          />
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
              onClick={() => setGameState("WELCOME")} // יחזיר אותו למסך פתיחה, אבל הנתונים עדיין שמורים למשחק הבא
              className="bg-gray-900 hover:bg-black text-white px-8 py-3 rounded-xl font-bold transition-transform active:scale-95 shadow-lg"
            >
              משחק חדש
            </button>
          </div>
        )}
      </div>
    </>
  );
}