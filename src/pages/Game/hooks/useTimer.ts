import { useEffect, useRef, useState } from "react";

const DEFAULT_TIME : number = 60;
const START_DELAY_MS : number = 1200;

export default function useTimer() {
    const [timer, setTimer] = useState<number>(DEFAULT_TIME);
    const [running, setRunning] = useState<boolean>(false);

    const intervalRef = useRef<number | undefined>(undefined);
    const timeOutRef = useRef<number | undefined>(undefined);

    const clearTimer = () => {
        if (intervalRef.current !== undefined) {
            clearInterval(intervalRef.current);
            intervalRef.current = undefined;
        }
    }

    const clearDelay = () => {
        if (timeOutRef.current !== undefined) {
            clearTimeout(timeOutRef.current);
            timeOutRef.current = undefined;
        }
    }
    
    const reset = () => {
        clearDelay();
        clearTimer();
        setTimer(DEFAULT_TIME);
        setRunning(false);
    }

    const start = () => {
        reset();
        timeOutRef.current = window.setTimeout(() => {
            setRunning(true);
        }, START_DELAY_MS)
    }

    useEffect(() => {
        if (!running) {
            clearTimer();
            return;
        }

        intervalRef.current = window.setInterval(() => {
            setTimer(prev => {
                if (prev <= 1) {
                    clearTimer();
                    setRunning(false);
                    return 0;
                }
                return prev - 1;
            })

        }, 1000)

        return () => {
            clearTimer();
        }
    }, [running])


    useEffect(() => {
        return () => {
            clearTimer();
            clearDelay();
        }
    }, [])

    return { timer, start, running };
}