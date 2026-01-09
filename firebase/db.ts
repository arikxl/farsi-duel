import { db } from "./firebase";
import {
    doc,
    setDoc,
    getDoc,
    onSnapshot,
    collection,
    query,
    orderBy,
    increment
} from "firebase/firestore";

// --- פונקציות קיימות (בדיקת זמינות ורישום) ---
export const checkIdAvailability = async (playerId: string): Promise<boolean> => {
    const docRef = doc(db, "players", playerId);
    const docSnap = await getDoc(docRef);
    return !docSnap.exists();
};

export const registerNewPlayer = async (
    playerId: string,
    playerName: string,
    team: "beer_sheva" | "eilat"
) => {
    await setDoc(doc(db, "players", playerId), {
        id: playerId,
        name: playerName,
        team: team,
        score: 0,
        registeredAt: new Date().toISOString(),
    });
};

export const subscribeToTakenPlayers = (
    callback: (takenIds: string[]) => void
) => {
    const q = query(collection(db, "players"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const takenIds: string[] = [];
        querySnapshot.forEach((doc) => {
            takenIds.push(doc.id);
        });
        callback(takenIds);
    });
    return unsubscribe;
};

// --- השינוי הגדול: שמירת ניקוד מצטבר ---
export const savePlayerScore = async (
    playerId: string,
    playerName: string,
    team: "beer_sheva" | "eilat",
    pointsToAdd: number
) => {
    try {
        // increment מוסיפה את הנקודות החדשות למה שכבר יש ב-DB
        // זה אטומי ובטוח (מונע בעיות אם שני עדכונים קורים יחד)
        await setDoc(
            doc(db, "players", playerId),
            {
                id: playerId,
                name: playerName,
                team: team,
                score: increment(pointsToAdd), // <--- כאן הקסם
                lastPlayed: new Date().toISOString(),
            },
            { merge: true }
        );
    } catch (error) {
        console.error("Error saving score:", error);
    }
};

// פונקציה שמחשבת את הסיכום הקבוצתי (נשארה זהה)
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

// --- פונקציה חדשה: קבלת טבלת המובילים המלאה ---
export interface LeaderboardEntry {
    id: string;
    name: string;
    team: "beer_sheva" | "eilat";
    score: number;
}

export const subscribeToLeaderboard = (
    callback: (players: LeaderboardEntry[]) => void
) => {
    // שואבים את השחקנים ממוינים לפי ניקוד יורד
    const q = query(collection(db, "players"), orderBy("score", "desc"));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const players: LeaderboardEntry[] = [];
        querySnapshot.forEach((doc) => {
            const data = doc.data() as LeaderboardEntry;
            players.push(data);
        });
        callback(players);
    });
    return unsubscribe;
};