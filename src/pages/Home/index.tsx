import { Link } from "react-router-dom";
import Card from "../../components/Card";
import Container from "../../components/Container";
import useHover from "../../hooks/useHover";
import { useEffect, useState, useCallback } from "react";
import { getLeaderboard, type LeaderboardEntry } from "../../utils/leaderboard";

function Home() {
  const { isHovered, onMouseEnter, onMouseLeave } = useHover();
  const [top5, setTop5] = useState<LeaderboardEntry[]>([]);

  const refreshLeaderboard = useCallback(() => {
    const all = getLeaderboard();
    setTop5(all.slice(0, 5));
  }, []);

  useEffect(() => {
    refreshLeaderboard();
    // se o ranking for atualizado em outra aba/janela
    const onStorage = () => refreshLeaderboard();
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [refreshLeaderboard]);

  const medal = (i: number) => (i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `${i + 1}.`);

  return (
    <Container className="flex justify-center items-center flex-col min-h-dvh">
      <header className="flex justify-center items-center flex-col mb-8">
        <h1 className="text-6xl font-bold mb-6"> 
          🎯 JOGO DE REFLEXO 
        </h1>
        <p className="text-2xl"> 
          Clique nos Alvos o mais rápido possível! 
        </p>
      </header>

      <section className="flex gap-8">
        {/* Como Jogar */}
        <section className="w-108 flex flex-col justify-start items-center bg-[#1D293D] border-4 border-[#314158] rounded-2xl">
          <h2 className="text-4xl font-black mt-8 mb-4">
            Como Jogar
          </h2>
          <Card
            width="40px" height="40px" firstColor="#FF6467" secondColor="#E7000B"
            borderCircleColor="#C10007" borderColor="#FB2C36" title="Alvo Pequeno" 
            subtext="50 pontos"              
          />
          <Card
            width="48px" height="48px" firstColor="#FDC700" secondColor="#D08700"
            borderCircleColor="#A65F00" borderColor="#F0B100" title="Alvo Médio" 
            subtext="30 pontos"              
          />
          <Card
            width="56px" height="56px" firstColor="#05DF72" secondColor="#00A63E"
            borderCircleColor="#008236" borderColor="#00c950" title="Alvo Grande" 
            subtext="20 pontos"              
          />
          <Card
            width="64px" height="64px" firstColor="#51A2FF" secondColor="#155DFC"
            borderCircleColor="#1447E6" borderColor="#2B7FFF" title="Alvo Gigante" 
            subtext="10 pontos"              
          />
          <Link 
            to="/Game"
            className={`w-[80%] pt-2 pb-2 bg-linear-to-r from-[#4F39F6] to-[#9810FA] to-100% text-xl font-bold text-center border-4 border-[#372AAC] rounded-2xl mb-8
                        ${isHovered ? "scale-110" : ""} `}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
          >
            🚀 INICIAR JOGO
          </Link>
        </section>

        {/* Placar */}
        <section className="w-108 flex flex-col justify-start items-center bg-[#1D293D] border-4 border-[#314158] rounded-2xl">
          <h2 className="text-4xl font-black mt-8 mb-4">
            Placar
          </h2>

          <div className="w-[90%] mb-8">
            {top5.length === 0 ? (
              <div className="w-full text-center py-6 text-[#9fb0c9]">
                Ainda não há pontuações. Jogue uma partida! 🎮
              </div>
            ) : (
              <ul className="w-full divide-y divide-[#314158]">
                {top5.map((entry, i) => (
                  <li
                    key={`${entry.name}-${entry.createdAt}-${i}`}
                    className="flex items-center justify-between py-3"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-8 text-xl text-center">{medal(i)}</span>
                      <span className="font-bold">{entry.name}</span>
                    </div>
                    <span className="font-black text-2xl">
                      {Math.round(entry.score).toLocaleString("pt-BR")}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </section>
    </Container>
  );
}

export default Home;
