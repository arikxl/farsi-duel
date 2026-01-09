import React, { useEffect, useState } from "react";
import { subscribeToScores } from "@/firebase/db";

export default function CompetitionBar() {
    const [scores, setScores] = useState({ beer_sheva: 0, eilat: 0 });

    useEffect(() => {
        const unsubscribe = subscribeToScores((newScores: React.SetStateAction<{ beer_sheva: number; eilat: number; }>) => {
            setScores(newScores);
        });
        return () => unsubscribe();
    }, []);

    // חישוב אחוזים
    const total = scores.beer_sheva + scores.eilat;
    const bsPercent = total === 0 ? 50 : (scores.beer_sheva / total) * 100;
    const eiPercent = total === 0 ? 50 : (scores.eilat / total) * 100;

    return (
        // קונטיינר ראשי - דביק למעלה, גובה h-16, טקסט לבן וגדול
        <div className="w-full h-16 flex text-white font-bold text-2xl shadow-lg sticky top-0 z-50 overflow-hidden font-sans">

            {/* צד ימין - באר שבע (אדום) */}
            <div
                className="bg-red-600 flex items-center justify-center transition-all duration-1000 ease-out whitespace-nowrap relative border-l-2 border-white/20"
                style={{ width: `${bsPercent}%` }}
            >
                <span className={`drop-shadow-md px-2 ${bsPercent < 15 ? 'opacity-0' : 'opacity-100'}`}>
                    באר שבע {scores.beer_sheva}
                </span>
            </div>

            {/* צד שמאל - אילת (כחול) */}
            <div
                className="bg-blue-600 flex items-center justify-center transition-all duration-1000 ease-out whitespace-nowrap relative"
                style={{ width: `${eiPercent}%` }}
            >
                <span className={`drop-shadow-md px-2 ${eiPercent < 15 ? 'opacity-0' : 'opacity-100'}`}>
                    {scores.eilat} אילת
                </span>
            </div>

        </div>
    );
}