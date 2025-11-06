
"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
type Phase={label:string;duration:number}; type Mode={id:string;name:string;description:string;phases:Phase[]};
const MODES:Mode[]=[
  {id:"box",name:"Box 4-4-4-4",description:"Inhala 4s, mantén 4s, exhala 4s, mantén 4s.",phases:[{label:"Inhala",duration:4},{label:"Mantén",duration:4},{label:"Exhala",duration:4},{label:"Mantén",duration:4}]},
  {id:"478",name:"4-7-8 (relajación)",description:"Para bajar activación.",phases:[{label:"Inhala",duration:4},{label:"Mantén",duration:7},{label:"Exhala",duration:8}]},
  {id:"coh",name:"Coherente 5-5",description:"≈6 respiraciones/min.",phases:[{label:"Inhala",duration:5},{label:"Exhala",duration:5}]},
  {id:"ext46",name:"Exhalación 4-6",description:"Exhala más largo para activar el vago.",phases:[{label:"Inhala",duration:4},{label:"Exhala",duration:6}]}
];
export default function BreathingExercise(){
  const [modeId,setModeId]=useState(MODES[2].id); const mode=useMemo(()=>MODES.find(m=>m.id===modeId)!,[modeId]);
  const [minutes,setMinutes]=useState(1); const [running,setRunning]=useState(false);
  const [phaseIndex,setPhaseIndex]=useState(0); const [phaseLeft,setPhaseLeft]=useState(0); const [sessionLeft,setSessionLeft]=useState(0);
  const timer=useRef<number|null>(null);
  const reset=useCallback(()=>{setRunning(false);setPhaseIndex(0);setPhaseLeft(0);setSessionLeft(0); if(timer.current){clearInterval(timer.current); timer.current=null;}},[]);
  const start=useCallback(()=>{const total=Math.max(1,minutes)*60; setSessionLeft(total); setPhaseIndex(0); setPhaseLeft(mode.phases[0].duration); setRunning(true);},[minutes,mode.phases]);
  useEffect(()=>{ if(!running) return; timer.current=window.setInterval(()=>{ setSessionLeft(prev=>Math.max(0,prev-1)); setPhaseLeft(prev=>{ if(prev>1) return prev-1; setPhaseIndex(p=>(p+1)%mode.phases.length); const next=(phaseIndex+1)%mode.phases.length; return mode.phases[next].duration; }); },1000); return ()=>{ if(timer.current){clearInterval(timer.current); timer.current=null;} }; },[running,mode.phases,phaseIndex]);
  useEffect(()=>{ if(running && sessionLeft<=0) reset(); },[running,sessionLeft,reset]);
  const label=mode.phases[phaseIndex]?.label ?? "";
  return (<div style={{display:'grid',gap:12}}>
    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:8}}>
      <label style={{display:'flex',flexDirection:'column',gap:4}}><span style={{opacity:0.7,fontSize:12}}>Modo</span>
        <select value={modeId} onChange={e=>setModeId(e.target.value)} disabled={running} style={{padding:'8px',borderRadius:8,border:'1px solid #ddd'}}>
          {MODES.map(m=><option key={m.id} value={m.id}>{m.name}</option>)}
        </select></label>
      <label style={{display:'flex',flexDirection:'column',gap:4}}><span style={{opacity:0.7,fontSize:12}}>Minutos</span>
        <input type="number" min={1} max={10} value={minutes} onChange={e=>setMinutes(Math.max(1,Math.min(10,Number(e.target.value)||1)))} disabled={running} style={{padding:'8px',borderRadius:8,border:'1px solid #ddd'}}/></label>
      <div style={{display:'flex',alignItems:'end',gap:8}}>
        {!running? <button onClick={start} style={{flex:1,background:'#A0C4FF',color:'#fff',border:'none',padding:'10px',borderRadius:8}}>Iniciar</button>
                  : <button onClick={reset} style={{flex:1,background:'#ef4444',color:'#fff',border:'none',padding:'10px',borderRadius:8}}>Detener</button>}
      </div>
    </div>
    <p style={{opacity:0.8,fontSize:14,margin:'4px 0 0'}}>{mode.description}</p>
    <div style={{display:'flex',justifyContent:'center'}}>
      <div aria-hidden style={{width:160,height:160,borderRadius:'50%',border:'6px solid #A0C4FF',transition:'transform 0.7s ease', transform: label.startswith('Inhala') ? 'scale(1.1)' : (label.startswith('Exhala') ? 'scale(0.9)' : 'scale(1.0)')}}></div>
    </div>
    <div style={{textAlign:'center'}}>
      <div style={{fontSize:24,fontWeight:700}}>{label}</div>
      {running && <div style={{opacity:0.7}}>Fase: {phaseLeft}s • Sesión: {sessionLeft}s</div>}
    </div>
  </div>);
}
