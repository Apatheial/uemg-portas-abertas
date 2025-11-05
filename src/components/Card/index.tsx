import useHover from "../../hooks/useHover";

interface cardProps  {
    children? : React.ReactNode,
    className? : string
    width: string,
    height: string,
    firstColor: string,
    secondColor: string,
    borderCircleColor: string,
    borderColor: string,
    position?: string,
    title: string,
    subtext: string
}

function Card( props : cardProps ) {

    const {isHovered, onMouseEnter, onMouseLeave} = useHover();

    return (
        <section 
            className={`w-[80%] bg-[#0F172B] flex-1 flex justify-start items-center ml-3 mr-4 mb-4 border-[3px] rounded-2xl p-3`}
            style={{ 
                borderColor: isHovered ? props.firstColor : props.borderColor 

            }}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
        >
            <div 
                className={`rounded-full border-[3px] text-center mr-4`}
                style={{
                    background: `linear-gradient(120deg, ${props.firstColor}, ${props.secondColor})`,
                    borderColor: props.borderCircleColor,
                    width: props.width,
                    height: props.height
                }}
            >
                { props.position }
            </div>
            <div className="flex flex-col gap-1">
                <p className={`font-bold`}>{ props.title }</p>
                <p className={`font-bold`} style={{ color: props.firstColor }}>
                    { props.subtext }
                </p>
            </div>
            {props.children}
        </section>
    );

}

export default Card;
