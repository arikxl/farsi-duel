import React, { useState } from "react";
import playersData from "@/data/players.json"; // טוענים את קובץ השמות
import { Player, TeamData } from "@/types";

interface TeamSelectorProps {
    onJoin: (player: Player, team: "beer_sheva" | "eilat") => void;
}

export default function TeamSelector({ onJoin }: TeamSelectorProps) {
    const [selectedTeam, setSelectedTeam] = useState<"beer_sheva" | "eilat" | null>(null);
    const [selectedPlayerId, setSelectedPlayerId] = useState<string>("");

    // המרה של ה-JSON לטיפוס שאנחנו מכירים
    const teams = playersData as TeamData;

    const handleJoinClick = () => {
        if (!selectedTeam || !selectedPlayerId) return;

        // מציאת אובייקט השחקן המלא לפי ה-ID שנבחר
        const playerList = teams[selectedTeam];
        const player = playerList.find((p) => p.id === selectedPlayerId);

        if (player) {
            onJoin(player, selectedTeam);
        }
    };

    return (
        <div className="flex flex-col h-full p-6 bg-gray-50">
            <h2 className="text-2xl font-bold text-center mb-8 text-gray-800">
                בחר את הצוות שלך
            </h2>

            {/* שלב 1: כפתורי בחירת קבוצה */}
            <div className="grid grid-cols-2 gap-4 mb-8">
                <button
                    onClick={() => { setSelectedTeam("beer_sheva"); setSelectedPlayerId(""); }}
                    className={`p-4 rounded-xl border-2 transition-all ${selectedTeam === "beer_sheva"
                            ? "border-red-500 bg-red-50 ring-2 ring-red-200"
                            : "border-gray-200 bg-white hover:border-red-300"
                        }`}
                >
                    <div className="text-3xl mb-2">🐫</div>
                    <div className="font-bold text-gray-900">באר שבע</div>
                </button>

                <button
                    onClick={() => { setSelectedTeam("eilat"); setSelectedPlayerId(""); }}
                    className={`p-4 rounded-xl border-2 transition-all ${selectedTeam === "eilat"
                            ? "border-blue-500 bg-blue-50 ring-2 ring-blue-200"
                            : "border-gray-200 bg-white hover:border-blue-300"
                        }`}
                >
                    <div className="text-3xl mb-2">🌊</div>
                    <div className="font-bold text-gray-900">אילת</div>
                </button>
            </div>

            {/* שלב 2: רשימת שמות (מופיע רק אחרי שבחרו קבוצה) */}
            {selectedTeam && (
                <div className="space-y-4 animate-fade-in-up">
                    <label className="block text-sm font-medium text-gray-700">
                        מי אתה ברשימה?
                    </label>
                    <select
                        value={selectedPlayerId}
                        onChange={(e) => setSelectedPlayerId(e.target.value)}
                        className="w-full p-4 bg-white border border-gray-300 rounded-xl text-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                        <option value="" disabled>
                            -- בחר את השם שלך --
                        </option>
                        {teams[selectedTeam].map((player) => (
                            <option key={player.id} value={player.id}>
                                {player.name}
                            </option>
                        ))}
                    </select>

                    <button
                        onClick={handleJoinClick}
                        disabled={!selectedPlayerId}
                        className={`w-full py-4 mt-6 rounded-xl text-xl font-bold text-white transition-all shadow-md ${selectedPlayerId
                                ? "bg-green-600 hover:bg-green-700 transform active:scale-95"
                                : "bg-gray-300 cursor-not-allowed"
                            }`}
                    >
                        כנס למשחק!
                    </button>
                </div>
            )}
        </div>
    );
}