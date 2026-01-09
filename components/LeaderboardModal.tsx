import React, { useEffect, useState } from "react";
import { subscribeToLeaderboard, LeaderboardEntry } from "@/firebase/db";

interface LeaderboardModalProps {
    onClose: () => void;
    currentPlayerId?: string; // כדי להדגיש את השחקן הנוכחי
}

export default function LeaderboardModal({ onClose, currentPlayerId }: LeaderboardModalProps) {
    const [players, setPlayers] = useState<LeaderboardEntry[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = subscribeToLeaderboard((data) => {
            setPlayers(data);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    return (
        <div className="absolute inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white w-full h-[80%] rounded-2xl shadow-2xl flex flex-col overflow-hidden relative">

                {/* כותרת וכפתור סגירה */}
                <div className="bg-gray-900 text-white p-4 flex justify-between items-center shrink-0">
                    <h2 className="text-xl font-bold">🏆 טבלת האלופים</h2>
                    <button onClick={onClose} className="text-2xl hover:text-gray-300">
                        ✕
                    </button>
                </div>

                {/* הטבלה עצמה - נגללת */}
                <div className="flex-1 overflow-y-auto p-2">
                    {loading ? (
                        <div className="text-center p-10">טוען נתונים...</div>
                    ) : (
                        <table className="w-full text-right border-collapse">
                            <thead className="text-gray-500 text-sm font-medium sticky top-0 bg-white shadow-sm">
                                <tr>
                                    <th className="p-3">#</th>
                                    <th className="p-3">שם</th>
                                    <th className="p-3 text-center">קבוצה</th>
                                    <th className="p-3 font-bold">נקודות</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                {players.map((player, index) => {
                                    const isMe = player.id === currentPlayerId;
                                    // עיצוב לפי קבוצה
                                    const teamColor = player.team === "beer_sheva" ? "text-red-600" : "text-blue-600";
                                    const teamIcon = player.team === "beer_sheva" ? "ב״ש" : "אילת";

                                    return (
                                        <tr
                                            key={player.id}
                                            className={`border-b last:border-0 ${isMe ? "bg-yellow-50 font-bold" : "odd:bg-gray-50"}`}
                                        >
                                            <td className="p-3 w-10">
                                                {index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : index + 1}
                                            </td>
                                            <td className="p-3">
                                                {player.name}
                                                {isMe && <span className="mr-2 text-xs bg-yellow-200 px-1 rounded">אני</span>}
                                            </td>
                                            <td className={`p-3 text-center font-bold ${teamColor}`}>
                                                {teamIcon}
                                            </td>
                                            <td className="p-3 font-mono font-bold text-lg">
                                                {player.score}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
}