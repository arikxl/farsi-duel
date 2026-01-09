import { db } from "./firebase";
import { doc, setDoc, onSnapshot, collection, query } from "firebase/firestore";
import { Player } from "@/types";

// פונקציה לשמירת הניקוד של שחקן בסוף משחק
export const savePlayerScore = async (
    playerId: string,
    playerName: string,
    team: "beer_sheva" | "eilat",
    score: number
) => {
    try {
        // אנחנו שומרים מסמך עם ה-ID של השחקן
        // אם הוא כבר קיים, זה יערוך אותו (או ידרוס, תלוי בלוגיקה שנרצה)
        // כאן נשתמש ב-setDoc עם merge: true כדי לעדכן רק את הניקוד
        await setDoc(
            doc(db, "players", playerId),
            {
                id: playerId,
                name: playerName,
                team: team,
                score: score, // שומר את הניקוד האחרון (אפשר גם לעשות שישמור את הגבוה ביותר)
                lastPlayed: new Date().toISOString(),
            },
            { merge: true }
        );
    } catch (error) {
        console.error("Error saving score:", error);
    }
};

// פונקציה שמאזינה לשינויים בזמן אמת ומחזירה את הסיכום הקבוצתי
export const subscribeToScores = (
    callback: (scores: { beer_sheva: number; eilat: number }) => void
) => {
    const q = query(collection(db, "players"));

    // onSnapshot זה הקסם של פיירבייס - הוא רץ כל פעם שמשהו משתנה בשרת
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
        let bsTotal = 0;
        let eiTotal = 0;

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            if (data.team === "beer_sheva") {
                bsTotal += data.score || 0;
            } else if (data.team === "eilat") {
                eiTotal += data.score || 0;
            }
        });

        callback({ beer_sheva: bsTotal, eilat: eiTotal });
    });

    // מחזירים פונקציה לביטול ההאזנה (cleanup)
    return unsubscribe;
};