import { useCallback, useState } from "react"

export default function useHover() {
    const [isHovered, setIsHovered] = useState<boolean>(false);

    const onMouseEnter = useCallback(() => setIsHovered(true), []);
    const onMouseLeave = useCallback(() => setIsHovered(false), []);

    return { isHovered, onMouseEnter, onMouseLeave };
}