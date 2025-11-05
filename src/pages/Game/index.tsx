import { Link } from "react-router-dom";
import Container from "../../components/Container";
import useHover from "../../hooks/useHover";
import useTimer from "./hooks/useTimer";
import { useEffect, useRef, useState, useCallback } from "react";
import Modal from "./components/Modal";
import useCombo from "./hooks/useCombo";
import useSpawnTarget from "./hooks/useSpawnTarget";
import { useSpawnTimer } from "./hooks/useSpawnTarget";
import useScore from "./hooks/useScore";
import Target from "./components/Target";
import randomTarget from "./functions/randomTarget";
import { saveScore } from "../../utils/leaderboard";

type TargetCfg = {
  firstColor: string;
  secondColor: string;
  borderCircleColor: string;
  width: string;
  height: string;
  points: number;
  delete: number;
};

type ActiveTarget = {
  id: number;
  cfg: TargetCfg;
  top: number;  // px
  left: number; // px
};

const LIMIT_TARGETS = 8;

function Game() {
  const { isHovered: isBtn1Hovered, onMouseEnter: btn1Enter, onMouseLeave: btn1Leave } = useHover();
  const { isHovered: isBtn2Hovered, onMouseEnter: btn2Enter, onMouseLeave: btn2Leave } = useHover();

  const { hitCount, comboRate, onHit: onComboHit } = useCombo();
  const { score, addScore, resetScore } = useScore();

  // useTimer deve retornar { timer, start, running }
  const { timer, start, running } = useTimer();
  const [isOpen, setOpen] = useState<boolean>(false);

  // maior combo da rodada (pico)
  const [maxCombo, setMaxCombo] = useState<number>(0);
  useEffect(() => {
    setMaxCombo(prev => (hitCount > prev ? hitCount : prev));
  }, [hitCount]);

  const { area, areaRef } = useSpawnTarget();
  const { spawnTick } = useSpawnTimer(hitCount);

  // alvos + timeouts
  const [targets, setTargets] = useState<ActiveTarget[]>([]);
  const spawnTimeoutRef = useRef<number | null>(null);
  const killTimeoutsRef = useRef<Record<number, number>>({});
  const nextIdRef = useRef<number>(1);

  // helpers
  const pxToInt = (px: string) => parseInt(px.replace("px", ""), 10);

  const clearSpawnTimeout = useCallback(() => {
    if (spawnTimeoutRef.current !== null) {
      clearTimeout(spawnTimeoutRef.current);
      spawnTimeoutRef.current = null;
    }
  }, []);

  const clearKillTimeout = useCallback((id: number) => {
    const t = killTimeoutsRef.current[id];
    if (t !== undefined) {
      clearTimeout(t);
      delete killTimeoutsRef.current[id];
    }
  }, []);

  const removeTarget = useCallback((id: number) => {
    setTargets(prev => prev.filter(t => t.id !== id));
    clearKillTimeout(id);
  }, [clearKillTimeout]);

  const missTarget = useCallback((id?: number) => {
    if (id !== undefined) removeTarget(id);
    onComboHit(true); // miss reseta combo
  }, [removeTarget, onComboHit]);

  const handleHit = useCallback((id: number, points: number) => {
    clearKillTimeout(id);
    removeTarget(id);
    addScore(points, comboRate);
    onComboHit(false);
  }, [clearKillTimeout, removeTarget, addScore, comboRate, onComboHit]);

  // Spawner: cria 1 alvo após spawnTick (apenas quando `running` = true)
  const spawnOne = useCallback(() => {
    if (!running || area.width <= 0 || area.height <= 0) return;

    const cfg = randomTarget();
    const w = pxToInt(cfg.width);
    const h = pxToInt(cfg.height);

    const margin = 6;
    const maxLeft = Math.max(0, area.width - w - margin);
    const maxTop = Math.max(0, area.height - h - margin);

    const left = Math.floor(Math.random() * (maxLeft + 1));
    const top = Math.floor(Math.random() * (maxTop + 1));

    const id = nextIdRef.current++;
    const at: ActiveTarget = { id, cfg, left, top };

    setTargets(prev => (prev.length >= LIMIT_TARGETS ? prev : [...prev, at]));

    // auto-remover (miss) conforme cfg.delete
    killTimeoutsRef.current[id] = window.setTimeout(() => {
      missTarget(id);
    }, cfg.delete);
  }, [running, area.width, area.height, missTarget]);

  // loop de spawn governado por spawnTick enquanto o jogo roda
  useEffect(() => {
    // só spawna se jogo estiver rodando (após delay) e ainda houver tempo
    if (!running || timer <= 0) {
      clearSpawnTimeout();
      return;
    }
    clearSpawnTimeout();
    spawnTimeoutRef.current = window.setTimeout(() => {
      spawnOne();
    }, spawnTick);

    return clearSpawnTimeout;
  }, [running, timer, spawnTick, spawnOne, clearSpawnTimeout]);

  // abre modal ao fim
  useEffect(() => {
    if (timer > 0) return;
    setOpen(true);
    clearSpawnTimeout();
    Object.keys(killTimeoutsRef.current).forEach(k => clearKillTimeout(Number(k)));
    setTargets([]);
  }, [timer, clearSpawnTimeout, clearKillTimeout]);

  // iniciar/reiniciar partida
  const startGame = useCallback(() => {
    setOpen(false);
    setTargets([]);
    Object.keys(killTimeoutsRef.current).forEach(k => clearKillTimeout(Number(k)));
    clearSpawnTimeout();
    resetScore();
    setMaxCombo(0);           // zera o pico da rodada
    onComboHit(true);         // força reset de combo
    start();                  // inicia cronômetro (com delay interno de 3s)
  }, [clearKillTimeout, clearSpawnTimeout, resetScore, onComboHit, start]);

  // Auto-start ao montar a página
  useEffect(() => {
    startGame();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // salvar score no localStorage (util separado)
  const persistScore = useCallback((playerName: string) => {
    const finalScore = Math.round(score);
    if (!playerName || playerName.trim() === "") return;
    saveScore({ name: playerName.trim(), score: finalScore, createdAt: Date.now() });
  }, [score]);

  // clique no “vazio” conta como miss (opcional)
  const handleAreaClick = useCallback(() => {
    if (!running || timer <= 0) return;
    onComboHit(true);
  }, [running, timer, onComboHit]);

  return (
    <Container className="flex justify-start items-center flex-col min-h-dvh relative">
      {isOpen && (
        <Modal
          start={startGame}
          score={Math.round(score)}
          combo={maxCombo}          
          setOpen={setOpen}
          onPlayAgain={(playerName: string) => {
            persistScore(playerName);
            startGame();
          }}
          onBackToMenu={(playerName: string) => {
            persistScore(playerName);
            // Link no Modal cuida da navegação
          }}
        />
      )}

      <section className="py-6 w-full flex justify-center items-center gap-10 bg-[#0F172B95] border-b-4 border-[#314158]">
        <section className="w-1/3 flex gap-6 pl-30">
          <Link to="/">
            <button
              className={`px-6 py-0.5 font-bold bg-linear-to-r from-[#e7000B80] to-[#C1000780] to-100% border-4 border-[#9F071290] rounded-xl
                          ${isBtn1Hovered ? "scale-110" : ""}`}
              onMouseEnter={btn1Enter}
              onMouseLeave={btn1Leave}
            >
              MENU
            </button>
          </Link>
          <button
            className={`px-6 py-0.5 font-bold bg-linear-to-r from-[#51A2FF60] to-[#155DFC60] to-100% border-4 border-[#1447E660] rounded-xl cursor-pointer
                        ${isBtn2Hovered ? "scale-110" : ""}`}
            onMouseEnter={btn2Enter}
            onMouseLeave={btn2Leave}
            onClick={startGame}
          >
            REINICIAR
          </button>
        </section>

        <section className="w-2/3 flex items-center gap-6">
          <div className="py-2 w-32 text-center text-1xl font-bold bg-[#1D293D] border-4 border-[#314158] rounded-2xl">
            {timer}s
          </div>
          <div className="py-2 w-50 text-center text-2xl font-bold bg-linear-to-r from-[#D0870030] to-[#F5490030] to-100% border-4 border-[#D08700] rounded-2xl">
            {Math.round(score).toLocaleString('pt-BR')}
          </div>
          <div className="py-2 w-60 text-center text-1xl font-bold bg-[#1D293D] border-4 border-[#314158] rounded-2xl">
            COMBO {hitCount} — {comboRate.toFixed(1)}x
          </div>
        </section>
      </section>

      <section
        className={`flex-1 w-full relative ${isOpen || !running ? "pointer-events-none" : ""}`}
        ref={areaRef}
        onClick={isOpen || !running ? undefined : handleAreaClick}
      >
        {targets.map(t => (
          <Target
            key={t.id}
            firstColor={t.cfg.firstColor}
            secondColor={t.cfg.secondColor}
            borderColor={t.cfg.borderCircleColor}
            borderCircleColor={t.cfg.borderCircleColor}
            width={t.cfg.width}
            height={t.cfg.height}
            points={t.cfg.points}
            top={`${t.top}px`}
            left={`${t.left}px`}
            onHit={(pts) => handleHit(t.id, pts)}
          />
        ))}
      </section>
    </Container>
  );
}

export default Game;
