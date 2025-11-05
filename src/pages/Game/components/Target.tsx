import type { MouseEvent } from "react";

interface targetProps {
  firstColor : string;
  secondColor : string;
  borderColor : string;
  borderCircleColor : string;
  width : string;
  height : string;
  points : number;
  top: string;
  left: string;
  onHit : (points : number) => void;
}

function Target(props: targetProps) {
  const handleClick = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation(); // evita marcar como miss ao clicar no target
    props.onHit(props.points);
  };

  return (
    <div
      className="rounded-full border-[3px] text-center flex items-center justify-center select-none cursor-pointer"
      style={{
        position: "absolute",
        background: `linear-gradient(120deg, ${props.firstColor}, ${props.secondColor})`,
        borderColor: props.borderCircleColor,
        width: props.width,
        height: props.height,
        top: props.top,
        left: props.left,
      }}
      onClick={handleClick}
    >
      {props.points}
    </div>
  );
}

export default Target;
