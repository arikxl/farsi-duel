import React, { useState } from "react";
import playersData from "@/data/players.json";
import { Player, TeamData } from "@/types";
import { checkIdAvailability, registerNewPlayer } from "@/firebase/db"; // ייבוא הפונקציות החדשות

interface TeamSelectorProps {
    onJoin: (player: Player, team: "beer_sheva" | "eilat") => void;
}

export default function TeamSelector({ onJoin }: TeamSelectorProps) {
    const [selectedTeam, setSelectedTeam] = useState<"beer_sheva" | "eilat" | null>(null);
    const [selectedPlayerId, setSelectedPlayerId] = useState<string>("");

    // מצבים לטיפול בבדיקה מול השרת
    const [isChecking, setIsChecking] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const teams = playersData as TeamData;

    const handleJoinClick = async () => {
        if (!selectedTeam || !selectedPlayerId) return;

        setIsChecking(true);
        setErrorMsg(null);

        const playerList = teams[selectedTeam];
        const player = playerList.find((p) => p.id === selectedPlayerId);

        if (!player) return;

        try {
            // 1. בדיקה מול Firebase האם השם פנוי
            const isAvailable = await checkIdAvailability(player.id);

            if (!isAvailable) {
                setErrorMsg("השם הזה כבר תפוס על ידי מכשיר אחר! בחר שם אחר.");
                setIsChecking(false);
                return;
            }

            // 2. השם פנוי - רושמים אותו ב-DB (נועלים אותו)
            await registerNewPlayer(player.id, player.name, selectedTeam);

            // 3. שמירה בלוקאל סטורג' (כדי שבפעם הבאה לא נצטרך לבחור)
            const userData = { player, team: selectedTeam };
            localStorage.setItem("atidim_user", JSON.stringify(userData));

            // 4. כניסה למשחק
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
                בחר את הצוות שלך
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
                    <div className="text-3xl mb-2">🐫</div>
                    <div className="font-bold text-gray-900">באר שבע</div>
                </button>

                <button
                    onClick={() => { setSelectedTeam("eilat"); setSelectedPlayerId(""); setErrorMsg(null); }}
                    className={`p-4 rounded-xl border-2 transition-all ${selectedTeam === "eilat"
                            ? "border-blue-500 bg-blue-50 ring-2 ring-blue-200"
                            : "border-gray-200 bg-white hover:border-blue-300"
                        }`}
                >
                    <div className="text-3xl mb-2">🌊</div>
                    <div className="font-bold text-gray-900">אילת</div>
                </button>
            </div>

            {/* בחירת שם */}
            {selectedTeam && (
                <div className="space-y-4 animate-fade-in-up pb-10">
                    <label className="block text-sm font-medium text-gray-700">
                        מי אתה ברשימה?
                    </label>
                    <select
                        value={selectedPlayerId}
                        onChange={(e) => { setSelectedPlayerId(e.target.value); setErrorMsg(null); }}
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

                    {/* הודעת שגיאה אם השם תפוס */}
                    {errorMsg && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-bold border border-red-200">
                            {errorMsg}
                        </div>
                    )}

                    <button
                        onClick={handleJoinClick}
                        disabled={!selectedPlayerId || isChecking}
                        className={`w-full py-4 mt-6 rounded-xl text-xl font-bold text-white transition-all shadow-md ${selectedPlayerId && !isChecking
                                ? "bg-green-600 hover:bg-green-700 transform active:scale-95"
                                : "bg-gray-300 cursor-not-allowed"
                            }`}
                    >
                        {isChecking ? "בודק זמינות..." : "כנס למשחק!"}
                    </button>
                </div>
            )}
        </div>
    );
}