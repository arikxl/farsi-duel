import React, { useState, useEffect, useRef } from "react";
import { GameQuestion } from "@/types";
import { generateGameDeck } from "@/lib/game-logic";

interface GameArenaProps {
    onGameOver: (score: number, isPerfect: boolean) => void;
}

// --- צבעי דגל איראן המדויקים ---
const IRAN_GREEN = "bg-[#239F40] border-[#1A7830]";
const IRAN_RED = "bg-[#DA0000] border-[#A80000]";

export default function GameArena({ onGameOver }: GameArenaProps) {
    // --- ניהול מצב (State) ---
    const [questions, setQuestions] = useState<GameQuestion[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [lives, setLives] = useState(3);
    const [timeLeft, setTimeLeft] = useState(10);

    // מצבי תצוגה
    const [isLoading, setIsLoading] = useState(true);
    const [feedback, setFeedback] = useState<"CORRECT" | "WRONG" | "TIMEOUT" | null>(null);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);

    // שימוש ב-Ref כדי לנהל את הטיימר בצורה מדויקת מבלי לגרום לרינדורים מיותרים
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    // --- טעינת המשחק ---
    useEffect(() => {
        const deck = generateGameDeck();
        setQuestions(deck);
        setIsLoading(false);
    }, []);

    // --- ניהול הטיימר ---
    useEffect(() => {
        if (feedback !== null || isLoading) return; // עוצרים טיימר בזמן פידבק

        if (timeLeft === 0) {
            // eslint-disable-next-line react-hooks/immutability
            handleTimeout();
            return;
        }

        timerRef.current = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [timeLeft, feedback, isLoading]);

    // --- לוגיקה מרכזית ---

    const handleTimeout = () => {
        if (feedback !== null) return;

        setFeedback("TIMEOUT");
        const newLives = lives - 1;
        setLives(newLives);

        // בדיקת סיום משחק מיידית
        if (newLives <= 0) {
            setTimeout(() => finishGame(score, newLives), 2000);
        } else {
            setTimeout(nextQuestion, 2000);
        }
    };

    const handleAnswer = (option: string) => {
        if (feedback !== null) return; // חסימת לחיצות כפולות

        setSelectedOption(option);

        const currentQ = questions[currentIndex];
        const isCorrect = option === currentQ.hebrew;

        let newScore = score;
        let newLives = lives;

        if (isCorrect) {
            newScore = score + 1;
            setScore(newScore);
            setFeedback("CORRECT");
        } else {
            newLives = lives - 1;
            setLives(newLives);
            setFeedback("WRONG");
        }

        // לוגיקת סיום/המשך
        if (newLives <= 0) {
            // מקרה א': נגמרו החיים
            setTimeout(() => finishGame(newScore, newLives), 1500);
        } else {
            // מקרה ב': ממשיכים (בודקים אם זו השאלה האחרונה בפונקציה הבאה)
            setTimeout(() => nextQuestion(newLives), 1500);
        }
    };

    const nextQuestion = (currentLivesInput?: number) => {
        // אבטחה: מוודאים שאנחנו לא חורגים ממערך השאלות
        // משתמשים ב-currentIndex הנוכחי כדי להחליט

        // בדיקה האם הגענו לסוף המערך
        if (currentIndex >= questions.length - 1) {
            finishGame(score, currentLivesInput ?? lives);
            return;
        }

        // איפוס ומעבר הלאה
        setFeedback(null);
        setSelectedOption(null);
        setTimeLeft(10);
        setCurrentIndex((prev) => prev + 1);
    };

    const finishGame = (finalScoreValue: number, finalLivesValue: number) => {
        // וידוא שהמשחק לא מסתיים פעמיים
        if (timerRef.current) clearInterval(timerRef.current);

        // בדיקה האם השחקן סיים את כל השאלות בהצלחה
        // (הוא נחשב perfect רק אם ענה על הכל ויש לו 3 חיים)
        const completedAll = currentIndex >= questions.length - 1 && finalLivesValue > 0;
        const isPerfect = completedAll && finalLivesValue === 3;

        const totalScore = finalScoreValue + (isPerfect ? 5 : 0);

        onGameOver(totalScore, isPerfect);
    };

    const speakPersian = (text: string) => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = "fa-IR";
        window.speechSynthesis.speak(utterance);
    };

    // --- פונקציית עיצוב כפתורים (עם צבעי איראן) ---
    const getButtonStyle = (option: string) => {
        const currentQ = questions[currentIndex];
        const isCorrectAnswer = option === currentQ.hebrew;
        const isSelected = option === selectedOption;

        const baseClass = "w-full py-4 text-xl font-bold border-2 rounded-xl transition-all shadow-sm ";

        // טרם ענו
        if (feedback === null) {
            return baseClass + "bg-white border-gray-200 text-gray-700 active:bg-gray-100 hover:border-blue-300";
        }

        // ענו - צובעים
        if (isCorrectAnswer) {
            // שימוש בירוק האיראני
            return baseClass + `${IRAN_GREEN} text-white scale-105 shadow-md`;
        }

        if (isSelected && !isCorrectAnswer) {
            // שימוש באדום האיראני
            return baseClass + `${IRAN_RED} text-white opacity-90`;
        }

        return baseClass + "bg-gray-100 border-gray-200 text-gray-400 opacity-50";
    };

    if (isLoading) return <div className="text-center p-10">מכין את הזירה...</div>;

    // הגנה מפני שגיאה אם המערך ריק
    if (!questions || questions.length === 0) return null;

    const currentQ = questions[currentIndex];

    return (
        <div className="relative flex flex-col h-full bg-gray-50 overflow-hidden">

            {/* HUD מתוקן - הניקוד ממורכז אבסולוטית */}
            <div className="relative flex justify-between items-center p-4 bg-white shadow-sm z-10 h-16">

                {/* צד ימין: חיים (לבבות) */}
                <div className="flex gap-1 text-red-500 text-xl z-20 relative">
                    {[...Array(3)].map((_, i) => (
                        <span key={i} className={i < lives ? "opacity-100" : "opacity-20 grayscale"}>
                            ❤️
                        </span>
                    ))}
                </div>

                {/* מרכז: ניקוד (ממוקם מעל הכל במרכז המדויק) */}
                <div className="absolute inset-0 flex items-center justify-center font-bold text-xl text-blue-900 pointer-events-none">
                    {score} נק'
                </div>

                {/* צד שמאל: טיימר */}
                <div className={`font-mono font-bold text-xl z-20 relative ${timeLeft <= 3 ? 'text-[#DA0000] animate-pulse' : 'text-gray-700'}`}>
                    00:{timeLeft.toString().padStart(2, '0')}
                </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2 bg-gray-200">
                <div
                    className="h-full bg-[#239F40] transition-all duration-300"
                    style={{ width: `${((currentIndex) / 20) * 100}%` }}
                ></div>
                <div className="text-xs text-center text-gray-400 mt-1">
                    שאלה {currentIndex + 1} מתוך {questions.length}
                </div>
            </div>

            {/* שאלה */}
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-6">
                <button
                    onClick={() => speakPersian(currentQ.persian)}
                    className="bg-blue-100 text-blue-600 p-3 rounded-full hover:bg-blue-200 transition"
                >
                    🔊
                </button>

                <div>
                    <h2 className="text-5xl font-black text-gray-800 mb-2">
                        {currentQ.persian}
                    </h2>
                    <p className="text-gray-400 text-lg font-mono">
                        {currentQ.transliteration}
                    </p>
                </div>

                <div className="h-8">
                    {feedback === "TIMEOUT" && (
                        <span className="text-[#DA0000] font-bold animate-pulse">נגמר הזמן!</span>
                    )}
                </div>
            </div>

            {/* תשובות */}
            <div className="p-4 space-y-3 pb-8 bg-white rounded-t-3xl shadow-[0_-5px_20px_rgba(0,0,0,0.05)]">
                {currentQ.options.map((option, idx) => (
                    <button
                        key={idx}
                        onClick={() => handleAnswer(option)}
                        disabled={feedback !== null}
                        className={getButtonStyle(option)}
                    >
                        {option}
                    </button>
                ))}
            </div>
        </div>
    );
}