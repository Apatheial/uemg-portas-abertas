import { useState } from "react";

export default function useScore () {
    const [score, setScore] = useState<number>(0);

    const addScore = (points : number, combo : number) => {
        setScore(prev => prev + Math.round(points * combo));
    }

    const resetScore = () => setScore(0);

    return {score, addScore, resetScore};
}