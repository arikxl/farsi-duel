import React, { useEffect, useState } from "react";
import { subscribeToScores } from "@/firebase/db";

export default function CompetitionBar() {
    const [scores, setScores] = useState({ beer_sheva: 0, eilat: 0 });

    useEffect(() => {
        // מתחילים להאזין לשינויים ב-Firebase
        const unsubscribe = subscribeToScores((newScores) => {
            setScores(newScores);
        });

        // ניקוי כשיוצאים מהעמוד (לא אמור לקרות באפליקציה הזו, אבל הרגל טוב)
        return () => unsubscribe();
    }, []);

    // חישוב אחוזים לגרף
    const total = scores.beer_sheva + scores.eilat;
    const bsPercent = total === 0 ? 50 : (scores.beer_sheva / total) * 100;
    const eiPercent = total === 0 ? 50 : (scores.eilat / total) * 100;

    return (
        <div className="w-full bg-gray-900 text-white shadow-lg sticky top-0 z-50">
            {/* כותרות וניקוד מספרי */}
            <div className="flex justify-between items-center px-4 py-2 text-sm font-bold">
                <div className="flex flex-col items-start">
                    <span className="text-red-400">באר שבע</span>
                    <span className="text-xl">{scores.beer_sheva}</span>
                </div>

                <div className="text-gray-500 text-xs">VS</div>

                <div className="flex flex-col items-end">
                    <span className="text-blue-400">אילת</span>
                    <span className="text-xl">{scores.eilat}</span>
                </div>
            </div>

            {/* הבר הגרפי */}
            <div className="flex h-2 w-full">
                <div
                    className="bg-red-500 h-full transition-all duration-1000 ease-out"
                    style={{ width: `${bsPercent}%` }}
                />
                <div
                    className="bg-blue-500 h-full transition-all duration-1000 ease-out"
                    style={{ width: `${eiPercent}%` }}
                />
            </div>
        </div>
    );
}