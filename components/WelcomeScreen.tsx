import React from "react";

interface WelcomeScreenProps {
    onStart: () => void;
    playerName?: string; // הוספנו משתנה אופציונלי לשם השחקן
}

export default function WelcomeScreen({ onStart, playerName }: WelcomeScreenProps) {
    return (
        <div className="flex flex-col items-center justify-between h-full p-8 text-center bg-gradient-to-b from-blue-50 to-white">

            {/* אזור עליון - לוגו וכותרת */}
            <div className="mt-10 space-y-4 animate-fade-in-down">
                <div className="text-6xl mb-4">⚔️</div>
                <h1 className="text-4xl font-black text-blue-900 tracking-tight">
                    עתידים בו"מ
                    <span className="block text-2xl text-blue-600 font-bold mt-2">
                        אתגר הפרסית
                    </span>
                </h1>
                <div className="inline-block bg-blue-100 text-blue-800 px-4 py-1 rounded-full text-sm font-bold mt-2">
                    באר שבע VS אילת
                </div>
            </div>

            {/* אזור מרכזי - חוקי המשחק */}
            <div className="space-y-3 text-gray-600 text-lg bg-white p-6 rounded-2xl shadow-sm border border-gray-100 w-full">
                <p className="flex items-center justify-center gap-2">
                    <span>⏱️</span> 10 שניות לשאלה
                </p>
                <p className="flex items-center justify-center gap-2">
                    <span>❤️</span> 3 פסילות ונפסלת
                </p>
                <p className="flex items-center justify-center gap-2">
                    <span>🏆</span> בונוס על משחק מושלם
                </p>
            </div>

            {/* אזור תחתון - כפתור התחלה */}
            <div className="w-full mb-10">
                <button
                    onClick={onStart}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xl font-bold py-4 rounded-xl shadow-lg transform transition active:scale-95"
                >
                    {/* כאן השינוי: אם יש שם, מציגים אותו. אם לא - טקסט רגיל */}
                    {playerName ? `בהצלחה, ${playerName}!` : "התחל משחק"}
                </button>

        

                <p className="text-xs text-gray-400 mt-4">
                    פותח ע"י אריק | מחזור 2026
                </p>
            </div>
        </div>
    );
}