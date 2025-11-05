import { useState } from "react";

export default function useCombo() {
    const [comboRate, setComboRate] = useState<number>(1.0);
    const [hitCount, setHitCount] = useState<number>(0);

    const onHit = (miss: boolean) => {
        if (miss) {
            setComboRate(1.0);
            setHitCount(0);
            return;
        }

        setHitCount(prev => {
            const newHitCount = prev + 1;
            
            setComboRate(prev => {
                if (newHitCount % 10 === 0) return ((prev * (newHitCount / 100)) + prev);
                return prev + 0.1
            })

            return newHitCount;
        });
    }

    return {hitCount, comboRate, onHit};
}