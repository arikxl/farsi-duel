import React, { useState, useEffect } from "react";
import playersData from "@/data/players.json";
import { Player, TeamData } from "@/types";
import { registerNewPlayer, subscribeToTakenPlayers } from "@/firebase/db"; // ייבוא הפונקציה החדשה

interface TeamSelectorProps {
    onJoin: (player: Player, team: "beer_sheva" | "eilat") => void;
}

export default function TeamSelector({ onJoin }: TeamSelectorProps) {
    const [selectedTeam, setSelectedTeam] = useState<"beer_sheva" | "eilat" | null>(null);
    const [selectedPlayerId, setSelectedPlayerId] = useState<string>("");

    // רשימת השמות התפוסים (מתעדכנת בזמן אמת)
    const [takenIds, setTakenIds] = useState<Set<string>>(new Set());

    const [isChecking, setIsChecking] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const teams = playersData as TeamData;

    // --- האזנה לשינויים ב-DB ---
    useEffect(() => {
        // ברגע שמישהו נרשם, נקבל עדכון ונוסיף אותו לרשימת התפוסים
        const unsubscribe = subscribeToTakenPlayers((ids) => {
            setTakenIds(new Set(ids));
        });
        return () => unsubscribe();
    }, []);

    const handleJoinClick = async () => {
        if (!selectedTeam || !selectedPlayerId) return;

        // בדיקה נוספת ליתר ביטחון (למקרה שהרשימה לא הספיקה להתעדכן)
        if (takenIds.has(selectedPlayerId)) {
            setErrorMsg("השם הזה נתפס ממש עכשיו! בחר שם אחר.");
            return;
        }

        setIsChecking(true);
        setErrorMsg(null);

        const playerList = teams[selectedTeam];
        const player = playerList.find((p) => p.id === selectedPlayerId);

        if (!player) return;

        try {
            // רישום השחקן ב-DB (זה מה שנועל אותו לאחרים)
            await registerNewPlayer(player.id, player.name, selectedTeam);

            // שמירה בלוקאל סטורג'
            const userData = { player, team: selectedTeam };
            localStorage.setItem("atidim_user", JSON.stringify(userData));

            onJoin(player, selectedTeam);

        } catch (error) {
            console.error(error);
            setErrorMsg("הייתה בעיית תקשורת, נסה שוב.");
        } finally {
            setIsChecking(false);
        }
    };

    return (
        <div className="flex flex-col h-full p-6 bg-gray-50 overflow-y-auto">
            <h2 className="text-2xl font-bold text-center mb-8 text-gray-800">
               מי הצוות שלך?
            </h2>

            {/* בחירת קבוצה */}
            <div className="grid grid-cols-2 gap-4 mb-8">
                <button
                    onClick={() => { setSelectedTeam("beer_sheva"); setSelectedPlayerId(""); setErrorMsg(null); }}
                    className={`p-4 rounded-xl border-2 transition-all ${selectedTeam === "beer_sheva"
                            ? "border-red-500 bg-red-50 ring-2 ring-red-200"
                            : "border-gray-200 bg-white hover:border-red-300"
                        }`}
                >
                    <div className="text-6xl mb-2">🐫</div>
                    <div className="font-bold text-gray-900">באר שבע</div>
                </button>

                <button
                    onClick={() => { setSelectedTeam("eilat"); setSelectedPlayerId(""); setErrorMsg(null); }}
                    className={`p-4 rounded-xl border-2 transition-all ${selectedTeam === "eilat"
                            ? "border-blue-500 bg-blue-50 ring-2 ring-blue-200"
                            : "border-gray-200 bg-white hover:border-blue-300"
                        }`}
                >
                    <div className="text-6xl mb-2">🐬</div>
                    <div className="font-bold text-gray-900">אילת</div>
                </button>
            </div>

            {/* בחירת שם */}
            {selectedTeam && (
                <div className="space-y-4 animate-fade-in-up pb-10">
                    <select
                        value={selectedPlayerId}
                        onChange={(e) => { setSelectedPlayerId(e.target.value); setErrorMsg(null); }}
                        className="w-full p-4 bg-white border border-gray-300 rounded-xl text-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                        <option value="" disabled className="text-center">
                            -- מה שמך? --
                        </option>
                        {teams[selectedTeam].map((player) => {
                            const isTaken = takenIds.has(player.id);
                            return (
                                <option
                                    key={player.id}
                                    value={player.id}
                                    disabled={isTaken} // מנטרל את האפשרות לבחור
                                    className={isTaken ? "text-gray-400 bg-gray-100" : ""}
                                >
                                    {player.name} 
                                </option>
                            );
                        })}
                    </select>

                    {/* הודעת שגיאה */}
                    {errorMsg && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-bold border border-red-200">
                            {errorMsg}
                        </div>
                    )}

                    <button
                        onClick={handleJoinClick}
                        disabled={!selectedPlayerId || isChecking}
                        className={`w-full py-4 mt-6 rounded-xl text-xl font-bold text-white transition-all shadow-md ${selectedPlayerId && !isChecking
                                ? "bg-yellow-500 hover:bg-orange-600 transform active:scale-95"
                                : "bg-gray-300 cursor-not-allowed"
                            }`}
                    >
                        {isChecking ? "רושם אותך..." : "מתחילים!"}
                    </button>
                </div>
            )}
        </div>
    );
}