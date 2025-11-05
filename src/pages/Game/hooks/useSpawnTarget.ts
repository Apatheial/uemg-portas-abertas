import { useState, useCallback, useRef, useEffect } from "react";

export default function useSpawnTarget() {
  const [area, setArea] = useState({ width: 0, height: 0 });
  const observerRef = useRef<ResizeObserver | null>(null);
  const nodeRef = useRef<HTMLDivElement | null>(null);

  const areaRef = useCallback((node: HTMLDivElement | null) => {
    if (nodeRef.current && observerRef.current) {
      observerRef.current.unobserve(nodeRef.current);
    }
    nodeRef.current = node;

    if (!node) return;

    const rect = node.getBoundingClientRect();
    setArea({ width: rect.width, height: rect.height });

    if (typeof ResizeObserver !== "undefined") {
      if (!observerRef.current) {
        observerRef.current = new ResizeObserver(([entry]) => {
          const r = entry.contentRect;
          setArea({ width: r.width, height: r.height });
        });
      }
      observerRef.current.observe(node);
    }
  }, []);

  useEffect(() => {
    return () => {

      if (nodeRef.current && observerRef.current) {
        observerRef.current.unobserve(nodeRef.current);
      }
      observerRef.current?.disconnect();
      observerRef.current = null;
      nodeRef.current = null;
    };
  }, []);

  return { area, areaRef };
}

export function useSpawnTimer(
    hitCount: number,
    opts?: { base?: number; min?: number; step?: number; stepBig?: number }
  ) {
    const base = opts?.base ?? 400;
    const min = opts?.min ?? 200;
    const step = opts?.step ?? 10;
    const stepBig = opts?.stepBig ?? 20;
  
    const [spawnTick, setSpawnTick] = useState<number>(base);
    const [spawnCount, setSpawnCount] = useState<number>(0);
  
    const handleSpawnCount = () => setSpawnCount((p) => p + 1);
    const reset = () => {
      setSpawnTick(base);
      setSpawnCount(0);
    };
  
    useEffect(() => {
      if (hitCount === 0) {
        setSpawnTick(base);
        return;
      }
      setSpawnTick((prev) => {
        const delta = hitCount % 5 === 0 ? stepBig : step;
        const next = prev - delta;
        return next < min ? min : next;
      });
    }, [hitCount, base, min, step, stepBig]);
  
    return { spawnTick, spawnCount, handleSpawnCount, reset };
}

