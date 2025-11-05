import { useState } from "react";
import { Link } from "react-router-dom";

interface propsModal {
    score : number;
    combo : number;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    start : () => void;
    onPlayAgain?: (name: string) => void;
    onBackToMenu?: (name: string) => void;
}

function Modal(props : propsModal) {
    const [name, setName] = useState<string>("");

    return (
        <div className="fixed inset-0 z-50 flex justify-center items-center bg-black/50">
            <div className="w-130 flex flex-col justify-center items-center bg-[#1D293D] border-4 border-[#314158] rounded-2xl p-6">
                
                {/* Header */}
                <div className="w-full flex items-start">
                    <div className="w-full flex flex-col justify-center items-center">
                        <h1 className="font-bold text-4xl">PARTIDA</h1>
                        <h1 className="font-bold text-4xl mb-2">FINALIZADA!</h1>
                    </div>
                    
                    <button 
                        className="cursor-pointer font-bold"
                        onClick={() => props.setOpen(false)}
                    >
                        x
                    </button>
                </div>

                {/* Score */}
                <p className="font-bold text-xl mb-4">Confira seus resultados</p>

                <div className="w-full mb-6 flex flex-col justify-center items-center bg-linear-to-r from-[#D0870030] to-[#F5490030] to-100% border-4 border-[#D08700] rounded-2xl">
                    <h2 className="font-bold text-[#FDC700] mb-2 mt-6">PONTUAÇÃO FINAL</h2>
                    <p className="font-black text-4xl mb-8">{props.score}</p>
                </div>

                {/* Combo */}
                <div className="w-full flex flex-col justify-center items-center bg-[#0F172B] border-4 border-[#314158] rounded-2xl mb-6">
                    <p className="font-bold text-[#FDC700] mb-2 mt-6">MAIOR COMBO</p>
                    <p className="font-black text-4xl mb-8">{props.combo}</p>
                </div>

                {/* Input Name */}
                <label className="w-full font-bold mb-2 self-start">NOME</label>
                <input 
                    className="w-full bg-[#0F172B] border-4 border-[#314158] rounded-2xl mb-8 py-1 pl-4"
                    type="text"
                    placeholder="Digite seu nome"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />

                {/* Buttons */}
                <div className="w-full flex justify-evenly">

                    {/* Jogar novamente */}
                    <button
                        className="py-1 px-8 bg-linear-to-r from-[#364153] to-[#1E2939] border-4 border-[#1E2939] rounded-2xl cursor-pointer"
                        onClick={() => {
                            props.onPlayAgain?.(name);
                        }}
                    >
                        JOGAR NOVAMENTE
                    </button>

                    {/* Voltar ao Menu */}
                    <Link
                        to="/"
                        onClick={() => {
                            props.onBackToMenu?.(name);
                        }}
                    >
                        <button
                            className="py-1 px-8 bg-linear-to-r from-[#364153] to-[#1E2939] border-4 border-[#1E2939] rounded-2xl cursor-pointer"
                        >
                            VOLTAR AO MENU
                        </button>
                    </Link>
                </div>
            </div>
        </div> 
    );
}

export default Modal;
