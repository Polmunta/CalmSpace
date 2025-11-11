"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type Phase = { label: string; duration: number }; // s
type Mode = { id: string; name: string; description: string; phases: Phase[] };

const MODES: Mode[] = [
  { id: "box", name: "Box 4-4-4-4", description: "Inhala 4s, mantén 4s, exhala 4s, mantén 4s.",
    phases: [{label:"Inhala",duration:4},{label:"Mantén",duration:4},{label:"Exhala",duration:4},{label:"Mantén",duration:4}] },
  { id: "478", name: "4-7-8 (relajación)", description: "Para bajar activación.",
    phases: [{label:"Inhala",duration:4},{label:"Mantén",duration:7},{label:"Exhala",duration:8}] },
  { id: "coh", name: "Coherente 5-5", description: "≈6 respiraciones/min.",
    phases: [{label:"Inhala",duration:5},{label:"Exhala",duration:5}] },
  { id: "ext46", name: "Exhalación 4-6", description: "Exhala más largo para activar el vago.",
    phases: [{label:"Inhala",duration:4},{label:"Exhala",duration:6}] },
];

function easeInOut(t: number) {
  // curva suave (0..1)
  return 0.5 - 0.5 * Math.cos(Math.PI * t);
}

export default function BreathingExercise(){
  const [modeId,setModeId]=useState(MODES[2].id);
  const mode = useMemo(()=>MODES.find(m=>m.id===modeId)!,[modeId]);

  const [minutes,setMinutes]=useState(1);
  const [running,setRunning]=useState(false);
  const [phaseIndex,setPhaseIndex]=useState(0);
  const [phaseLeft,setPhaseLeft]=useState(0);     // s
  const [sessionLeft,setSessionLeft]=useState(0); // s

  // animación suave
  const phaseStartTs = useRef<number>(0); // ms epoch
  const rafId = useRef<number| null>(null);

  const currentPhase = mode.phases[phaseIndex] ?? mode.phases[0];

  const reset = useCallback(() => {
    setRunning(false);
    setPhaseIndex(0);
    setPhaseLeft(0);
    setSessionLeft(0);
    if (rafId.current) cancelAnimationFrame(rafId.current);
    rafId.current = null;
  }, []);

  const start = useCallback(() => {
    const total = Math.max(1, minutes) * 60;
    setSessionLeft(total);
    setPhaseIndex(0);
    setPhaseLeft(mode.phases[0].duration);
    setRunning(true);
    phaseStartTs.current = performance.now();
  }, [minutes, mode.phases]);

  // motor de animación/tiempos
  useEffect(() => {
    if (!running) return;
    const tick = () => {
      const now = performance.now();
      const elapsed = (now - phaseStartTs.current) / 1000; // s
      const dur = currentPhase.duration;
      const remain = Math.max(0, dur - elapsed);

      setPhaseLeft(remain);
      setSessionLeft(prev => Math.max(0, prev - (rafId.current ? 1/60 : 0))); // aprox

      if (remain <= 0.001) {
        // pasar a siguiente fase
        setPhaseIndex(p => {
          const next = (p + 1) % mode.phases.length;
          return next;
        });
        phaseStartTs.current = performance.now();
      }
      rafId.current = requestAnimationFrame(tick);
    };
    rafId.current = requestAnimationFrame(tick);
    return () => { if (rafId.current) cancelAnimationFrame(rafId.current); rafId.current = null; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, mode.id, phaseIndex]); // rehace al cambiar de modo o de fase

  // parar al terminar sesión
  useEffect(() => {
    if (running && sessionLeft <= 0) reset();
  }, [running, sessionLeft, reset]);

  // escala suave (1.0..1.2)
  let scale = 1.0;
  const dur = currentPhase.duration || 1;
  const progress = Math.min(1, Math.max(0, 1 - phaseLeft / dur)); // 0..1
  if (currentPhase.label.startsWith("Inhala")) {
    scale = 1.0 + 0.2 * easeInOut(progress);    // crece
  } else if (currentPhase.label.startsWith("Exhala")) {
    scale = 1.2 - 0.2 * easeInOut(progress);    // decrece
  } else {
    scale = 1.1; // Mantén (ligero tamaño medio)
  }

  return (
    <div style={{display:'grid',gap:12}}>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:8}}>
        <label style={{display:'flex',flexDirection:'column',gap:4}}><span style={{opacity:0.7,fontSize:12}}>Modo</span>
          <select value={modeId} onChange={e=>setModeId(e.target.value)} disabled={running}
            style={{padding:'8px',borderRadius:8,border:'1px solid #ddd'}}>
            {MODES.map(m=><option key={m.id} value={m.id}>{m.name}</option>)}
          </select></label>
        <label style={{display:'flex',flexDirection:'column',gap:4}}><span style={{opacity:0.7,fontSize:12}}>Minutos</span>
          <input type="number" min={1} max={10} value={minutes}
            onChange={e=>setMinutes(Math.max(1,Math.min(10,Number(e.target.value)||1)))} disabled={running}
            style={{padding:'8px',borderRadius:8,border:'1px solid #ddd'}}/></label>
        <div style={{display:'flex',alignItems:'end',gap:8}}>
          {!running
            ? <button onClick={start} style={{flex:1,background:'#A0C4FF',color:'#fff',border:'none',padding:'10px',borderRadius:8}}>Iniciar</button>
            : <button onClick={reset} style={{flex:1,background:'#ef4444',color:'#fff',border:'none',padding:'10px',borderRadius:8}}>Detener</button>}
        </div>
      </div>

      <p style={{opacity:0.8,fontSize:14,margin:'4px 0 0'}}>{mode.description}</p>

      <div style={{display:'flex',justifyContent:'center',padding:'16px 0'}}>
        <div aria-hidden
          style={{
            width: 180, height: 180, borderRadius: '50%',
            border: '8px solid #A0C4FF',
            transform: `scale(${scale.toFixed(3)})`,
            transition: 'transform 0.06s linear'
          }}
        />
      </div>

      <div style={{textAlign:'center'}}>
        <div style={{fontSize:24,fontWeight:700}}>{currentPhase.label}</div>
        {running && <div style={{opacity:0.7}}>Fase: {Math.ceil(phaseLeft)}s • Sesión: {Math.max(0, Math.ceil(sessionLeft))}s</div>}
      </div>
    </div>
  );
}

