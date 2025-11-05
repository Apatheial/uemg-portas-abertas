export type Target = {
    firstColor: string;
    secondColor: string;
    borderCircleColor: string;
    width: string;
    height: string;
    points: number;
    delete: number
};

const redTarget : Target = {
    firstColor : "#FF6467",
    secondColor : "#E7000B",
    borderCircleColor : "#C10007",
    width : "40px",
    height : "40px",
    points : 50,
    delete : 900
}

const yellowTarget : Target = {
    firstColor : "#FDC700",
    secondColor : "#D08700",
    borderCircleColor : "#F0B100",
    width : "48px",
    height : "48px",
    points : 30,
    delete : 1200
}

const greenTarget : Target = {
    firstColor : "#05DF72",
    secondColor : "#00A63E",
    borderCircleColor : "#00c950",
    width : "56px",
    height : "56px",
    points : 20,
    delete : 1300
}

const blueTarget : Target = {
    firstColor : "#51A2FF",
    secondColor : "#155DFC",
    borderCircleColor : "#2B7FFF",
    width : "60px",
    height : "60px",
    points : 10,
    delete : 1500
}

const randomTarget = () => {
    const randomNumber = Math.floor(Math.random() * 100) + 1;

    if ( randomNumber >= 1 && randomNumber <=10) return redTarget;
    if ( randomNumber >= 11 && randomNumber <= 30) return yellowTarget;
    if ( randomNumber >= 31 && randomNumber <= 60) return greenTarget;
    
    return blueTarget;
}

export default randomTarget;