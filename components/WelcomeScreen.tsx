import Image from "next/image";
import React from "react";

interface WelcomeScreenProps {
    onStart: () => void;
    onShowLeaderboard: () => void; // <--- הוספנו פונקציה לפתיחת הטבלה
    playerName?: string;
}

export default function WelcomeScreen({ onStart, onShowLeaderboard, playerName }: WelcomeScreenProps) {
    return (
        <div className="flex flex-col items-center justify-between h-full bg-linear-to-b from-blue-50 via-white to-gray-50 overflow-y-auto h-full">

            {/* חלק עליון - תוכן גלילה */}
            <div className="flex flex-col items-center w-full px-8 pb-2 pt-0 flex-1">

                {/* לוגו וכותרת */}
                <div className="mt-2 animate-fade-in-down">
                    <Image alt='עתידים בום' src={'/logo77.png' } width={300} height={200}/>
                </div>

                {/* חוקים */}
                <div className="mt-8 space-y-4 text-gray-600 text-lg bg-white p-6 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-gray-100 w-full max-w-xs">
                    <div className="flex items-center gap-3">
                        <span className="text-2xl bg-blue-50 p-2 rounded-lg">⏱️</span>
                        <span className="font-medium">10 שניות לשאלה</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-2xl bg-red-50 p-2 rounded-lg">❤️</span>
                        <span className="font-medium">3 פסילות ונגמר</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-2xl bg-yellow-50 p-2 rounded-lg">🏆</span>
                        <span className="font-medium">בונוס על משחק ללא טעויות</span>
                    </div>
                </div>

                {/* כפתורים */}
                <div className="w-full mt-8 space-y-3">
                    <button
                        onClick={onStart}
                        className="w-full bg-yellow-500 hover:bg-orange-600 text-white text-xl font-bold py-4 rounded-xl shadow-lg shadow-blue-200 transform transition active:scale-95 flex items-center justify-center gap-2"
                    >
                        {playerName ? `בהצלחה ${playerName}!` : "הבנתי!"}
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
            <footer className="w-full bg-yellow-500 py-2 px-6 text-center text-sm mt-auto">
                <p className="mt-1 ">
                    Created by&nbsp;
                    <a href="https://www.linkedin.com/in/arik-alexandrov/" target="_blank"
                        className="underline">
                        arikxl
                    </a>
                </p>
            </footer>
        </div>
    );
}