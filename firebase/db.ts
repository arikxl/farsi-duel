import { db } from "./firebase";
import { doc, setDoc, onSnapshot, collection, query, getDoc } from "firebase/firestore";

// פונקציה לשמירת הניקוד של שחקן בסוף משחק
export const savePlayerScore = async (
    playerId: string,
    playerName: string,
    team: "beer_sheva" | "eilat",
    score: number
) => {
    try {
        await setDoc(
            doc(db, "players", playerId),
            {
                id: playerId,
                name: playerName,
                team: team,
                score: score,
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
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
        let bsTotal = 0;
        let eiTotal = 0;
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            if (data.team === "beer_sheva") bsTotal += data.score || 0;
            else if (data.team === "eilat") eiTotal += data.score || 0;
        });
        callback({ beer_sheva: bsTotal, eilat: eiTotal });
    });
    return unsubscribe;
};
// פונקציה חדשה: בדיקה האם השם כבר תפוס
export const checkIdAvailability = async (playerId: string): Promise<boolean> => {
    const docRef = doc(db, "players", playerId);
    const docSnap = await getDoc(docRef);

    // אם המסמך קיים, סימן שהשם תפוס
    return !docSnap.exists();
};



// פונקציה חדשה: רישום שחקן חדש (נועלת את השם)
export const registerNewPlayer = async (
    playerId: string,
    playerName: string,
    team: "beer_sheva" | "eilat"
) => {
    // שמירה ראשונית עם ניקוד 0
    await setDoc(doc(db, "players", playerId), {
        id: playerId,
        name: playerName,
        team: team,
        score: 0,
        registeredAt: new Date().toISOString(),
        userAgent: navigator.userAgent // אופציונלי: לדעת מאיזה מכשיר נרשם
    });
};