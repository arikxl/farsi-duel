import rawData from "@/data/vocabulary.json";
import { GameQuestion, VocabularyRoot, WordItem } from "@/types";

// פונקציית עזר לערבוב מערך (Fisher-Yates Shuffle)
// אנחנו נשתמש בה גם כדי לערבב את סדר השאלות וגם כדי לערבב את סדר התשובות
function shuffleArray<T>(array: T[]): T[] {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

export function generateGameDeck(): GameQuestion[] {
    // 1. המרה של ה-JSON הגולמי לטיפוס שאנחנו מכירים
    const data = rawData as VocabularyRoot;

    // 2. שיטוח (Flattening) - איסוף כל המילים מכל הקטגוריות לרשימה אחת
    let allWords: WordItem[] = [];
    data.vocabulary_collections.forEach((collection) => {
        allWords = [...allWords, ...collection.items];
    });

    // 3. יצירת שאלות
    // אנחנו עוברים מילה-מילה ויוצרים עבורה "כרטיסייה" עם 3 אפשרויות
    const deck: GameQuestion[] = allWords.map((word, index) => {
        // מציאת מסיחים (Distractors)
        // א. לוקחים את כל המילים חוץ מהמילה הנוכחית
        const otherWords = allWords.filter((w) => w.hebrew !== word.hebrew);

        // ב. מערבבים אותן ולוקחים את ה-2 הראשונות
        const shuffledOthers = shuffleArray(otherWords);
        const distractors = shuffledOthers.slice(0, 2).map((w) => w.hebrew);

        // ג. יוצרים את מערך האפשרויות (הנכונה + 2 שגויות) ומערבבים אותו
        const options = shuffleArray([word.hebrew, ...distractors]);

        return {
            id: `word_${index}`, // יצירת מזהה ייחודי
            hebrew: word.hebrew,
            persian: word.persian,
            transliteration: word.transliteration,
            options: options,
        };
    });

    // 4. החזרת החפיסה כשהיא כבר מעורבבת (כדי שלא נתחיל תמיד באותו סדר)
    return shuffleArray(deck).slice(0, 20);
}