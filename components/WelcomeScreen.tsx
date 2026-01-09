import React from "react";

interface WelcomeScreenProps {
    onStart: () => void;
    onShowLeaderboard: () => void; // <--- הוספנו פונקציה לפתיחת הטבלה
    playerName?: string;
}

export default function WelcomeScreen({ onStart, onShowLeaderboard, playerName }: WelcomeScreenProps) {
    return (
        <div className="flex flex-col items-center justify-between h-full bg-gradient-to-b from-blue-50 via-white to-gray-50 overflow-y-auto">

            {/* חלק עליון - תוכן גלילה */}
            <div className="flex flex-col items-center w-full p-8 flex-1">

                {/* לוגו וכותרת */}
                <div className="mt-6 space-y-2 text-center animate-fade-in-down">
                    <div className="text-6xl mb-4 drop-shadow-md">⚔️</div>
                    <h1 className="text-4xl font-black text-blue-900 tracking-tight">
                        עתידים בו"מ
                        <span className="block text-2xl text-blue-600 font-bold mt-1">
                            אתגר הפרסית
                        </span>
                    </h1>
                    <div className="inline-block bg-blue-100 text-blue-800 px-4 py-1 rounded-full text-sm font-bold mt-2 border border-blue-200">
                        באר שבע VS אילת
                    </div>
                </div>

                {/* חוקים */}
                <div className="mt-8 space-y-4 text-gray-600 text-lg bg-white p-6 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-gray-100 w-full max-w-xs">
                    <div className="flex items-center gap-3">
                        <span className="text-2xl bg-blue-50 p-2 rounded-lg">⏱️</span>
                        <span className="font-medium">10 שניות לשאלה</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-2xl bg-red-50 p-2 rounded-lg">❤️</span>
                        <span className="font-medium">3 פסילות ונפסלת</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-2xl bg-yellow-50 p-2 rounded-lg">🏆</span>
                        <span className="font-medium">צבירת נקודות קבוצתית</span>
                    </div>
                </div>

                {/* כפתורים */}
                <div className="w-full mt-8 space-y-3">
                    <button
                        onClick={onStart}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xl font-bold py-4 rounded-xl shadow-lg shadow-blue-200 transform transition active:scale-95 flex items-center justify-center gap-2"
                    >
                        {playerName ? `בהצלחה, ${playerName}!` : "התחל משחק"}
                        <span>🚀</span>
                    </button>

                    <button
                        onClick={onShowLeaderboard}
                        className="w-full bg-white border-2 border-gray-200 text-gray-700 font-bold py-3 rounded-xl hover:bg-gray-50 transition active:scale-95 flex items-center justify-center gap-2"
                    >
                        <span>🏆</span>
                     לטבלת האלופים
                    </button>
                </div>

            </div>

            {/* Footer חדש ומעוצב */}
            <footer className="w-full bg-gray-900 text-gray-400 py-4 px-6 text-center text-xs mt-auto">
                <div className="flex justify-center items-center gap-4 mb-2 opacity-50 grayscale hover:grayscale-0 transition-all">
                    {/* מקום ללוגואים אם תרצה בעתיד */}
                    {/* <img src="/logo-atidim.png" alt="Atidim" className="h-6" /> */}
                </div>
                <p className="mt-1 opacity-60">
                    פיתוח ועיצוב: אריק | מחזור 2026 ©
                </p>
            </footer>
        </div>
    );
}