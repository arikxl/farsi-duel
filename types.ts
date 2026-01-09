// --- מבנה הנתונים כפי שהוא מופיע בקובץ JSON ---
export interface WordItem {
    hebrew: string;
    persian: string;
    transliteration: string;
}

export interface Collection {
    title: string;
    topic: string;
    items: WordItem[];
}

export interface VocabularyRoot {
    vocabulary_collections: Collection[];
}

// --- מבנה הנתונים שהמשחק ישתמש בו (אחרי עיבוד) ---
export interface GameQuestion {
    id: string; // נייצר מזהה ייחודי לכל מילה
    hebrew: string;
    persian: string;
    transliteration: string;
    options: string[]; // 3 אפשרויות בחירה (1 נכונה + 2 מסיחים)
}

// --- שחקנים וצוותים ---
export interface Player {
    id: string;
    name: string;
}

export interface TeamData {
    beer_sheva: Player[];
    eilat: Player[];
}

// --- מצבי משחק ---
export type GameState =
    | "WELCOME"       // מסך פתיחה
    | "SELECT_TEAM"   // בחירת קבוצה
    | "SELECT_NAME"   // בחירת שם
    | "PLAYING"       // המשחק עצמו
    | "GAME_OVER";    // מסך סיום