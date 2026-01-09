import React, { useEffect, useState } from "react";
import { subscribeToScores } from "@/firebase/db";

export default function CompetitionBar() {
    const [scores, setScores] = useState({ beer_sheva: 0, eilat: 0 });

    useEffect(() => {
        const unsubscribe = subscribeToScores((newScores) => {
            setScores(newScores);
        });
        return () => unsubscribe();
    }, []);

    // --- לוגיקת חישוב רוחב חכמה ---
    const calculateWidths = () => {
        const total = scores.beer_sheva + scores.eilat;

        // מצב התחלתי או שוויון מוחלט (0-0)
        if (total === 0) return { bs: 50, ei: 50 };

        let bsPercent = (scores.beer_sheva / total) * 100;
        let eiPercent = (scores.eilat / total) * 100;

        const MIN_WIDTH = 20; // 20% רוחב מינימלי כדי שהטקסט ייכנס יפה

        // אם לבאר שבע יש נקודות אבל האחוז המחושב קטן מדי -> נקבע למינימום
        if (scores.beer_sheva > 0 && bsPercent < MIN_WIDTH) {
            bsPercent = MIN_WIDTH;
            eiPercent = 100 - MIN_WIDTH;
        }
        // אותו דבר לאילת
        else if (scores.eilat > 0 && eiPercent < MIN_WIDTH) {
            eiPercent = MIN_WIDTH;
            bsPercent = 100 - MIN_WIDTH;
        }

        return { bs: bsPercent, ei: eiPercent };
    };

    const { bs: bsPercent, ei: eiPercent } = calculateWidths();

    return (
        <div className="w-full h-16 flex text-white font-bold text-2xl shadow-lg sticky top-0 z-50 overflow-hidden font-sans bg-gray-900">

            {/* צד ימין - באר שבע (אדום) */}
            <div
                className="bg-red-600 flex items-center justify-center transition-all duration-1000 ease-out whitespace-nowrap relative border-l-2 border-white/20 overflow-hidden"
                style={{ width: `${bsPercent}%` }}
            >
                {/* הורדתי את התנאי שמסתיר את הטקסט (opacity-0) כי עכשיו תמיד יהיה מקום */}
                <span className="drop-shadow-md px-2 truncate">
                    באר שבע {scores.beer_sheva}
                </span>
            </div>

            {/* צד שמאל - אילת (כחול) */}
            <div
                className="bg-blue-600 flex items-center justify-center transition-all duration-1000 ease-out whitespace-nowrap relative overflow-hidden"
                style={{ width: `${eiPercent}%` }}
            >
                <span className="drop-shadow-md px-2 truncate">
                    {scores.eilat} אילת
                </span>
            </div>

        </div>
    );
}