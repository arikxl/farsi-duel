"use client";

import { useState, useEffect } from "react";
import WelcomeScreen from "@/components/WelcomeScreen";
import TeamSelector from "@/components/TeamSelector";
import GameArena from "@/components/GameArena";
import CompetitionBar from "@/components/CompetitionBar";
import LeaderboardModal from "@/components/LeaderboardModal"; // <--- ייבוא חדש
import { GameState, Player } from "@/types";
import { savePlayerScore } from "@/firebase/db";

export default function Home() {
  const [gameState, setGameState] = useState<GameState>("WELCOME");
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);
  const [currentTeam, setCurrentTeam] = useState<"beer_sheva" | "eilat" | null>(null);
  const [finalScore, setFinalScore] = useState(0);

  // --- סטייט חדש לניהול המודאל ---
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem("atidim_user");
    if (savedUser) {
      try {
        const { player, team } = JSON.parse(savedUser);
        if (player && team) {
          setCurrentPlayer(player);
          setCurrentTeam(team);
        }
      } catch (e) {
        console.error("Failed to parse user data", e);
      }
    }
  }, []);

  const handleStartGame = () => {
    if (currentPlayer && currentTeam) {
      setGameState("PLAYING");
    } else {
      setGameState("SELECT_TEAM");
    }
  };

  const handleJoinGame = (player: Player, team: "beer_sheva" | "eilat") => {
    setCurrentPlayer(player);
    setCurrentTeam(team);
    setGameState("PLAYING");
  };

  const handleGameOver = async (score: number, isPerfect: boolean) => {
    setFinalScore(score);
    if (currentPlayer && currentTeam) {
      // הנקודות עכשיו יצטברו!
      await savePlayerScore(currentPlayer.id, currentPlayer.name, currentTeam, score);
    }
    setGameState("GAME_OVER");
  };

  return (
    <>
      {/* לחיצה על הבר תפתח את הטבלה */}
      <div onClick={() => setShowLeaderboard(true)} className="cursor-pointer transition-transform active:scale-[0.99]">
        <CompetitionBar />
      </div>

      <div className="flex-1 relative overflow-hidden flex flex-col">

        {/* הצגת המודאל אם הוא פתוח */}
        {showLeaderboard && (
          <LeaderboardModal
            onClose={() => setShowLeaderboard(false)}
            currentPlayerId={currentPlayer?.id}
          />
        )}

        {gameState === "WELCOME" && (
          <WelcomeScreen
            onStart={handleStartGame}
            playerName={currentPlayer?.name}
            onShowLeaderboard={() => setShowLeaderboard(true)} 
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

            <p className="text-xl text-gray-500 mb-2">צברת בסיבוב זה:</p>
            <p className="text-6xl font-black text-blue-600 mb-8">+{finalScore}</p>

            {/* כפתור נוסף לפתיחת הטבלה בסוף המשחק */}
            <button
              onClick={() => setShowLeaderboard(true)}
              className="text-blue-600 font-bold underline mb-8"
            >
             טבלת האלופים
            </button>

            <button
              onClick={() => setGameState("WELCOME")}
              className="bg-gray-900 hover:bg-black text-white px-12 py-3 rounded-xl font-bold transition-transform active:scale-95 shadow-lg"
            >
             משחק נוסף
            </button>
          </div>
        )}
      </div>
    </>
  );
}