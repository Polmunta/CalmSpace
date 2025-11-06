
"use client";
import { useEffect, useRef, useState } from "react";
const PROMPTS=[
  "Toma 3 respiraciones lentas. ¿Qué notas en tu cuerpo ahora?",
  "Observa 3 cosas que ves, 2 que oyes y 1 que sientes.",
  "Nombra una emoción presente sin intentar cambiarla.",
  "Relaja hombros y mandíbula. ¿Qué cambia?",
  "Recuerda algo que salió bien hoy, por pequeño que sea.",
  "Siente tus pies en el suelo durante 10 segundos."
];
export default function MindfulnessPage(){
  const [idx,setIdx]=useState(0); const [running,setRunning]=useState(false); const timer=useRef<number|null>(null);
  useEffect(()=>{ return ()=>{ if(timer.current){clearInterval(timer.current); timer.current=null;} } },[]);
  const start=()=>{ if(timer.current) return; setRunning(true); timer.current=window.setInterval(()=>{ setIdx(prev=>(prev+1)%PROMPTS.length); }, 8000); };
  const stop=()=>{ if(timer.current){clearInterval(timer.current); timer.current=null;} setRunning(false); };
  return (<main style={{maxWidth:800,margin:'24px auto',padding:'0 16px'}}>
    <div style={{border:'1px solid #e8e6f2',borderRadius:12,background:'#fff',boxShadow:'0 6px 20px rgba(0,0,0,0.06)'}}>
      <div style={{padding:16,background:'#eaf3ff',borderTopLeftRadius:12,borderTopRightRadius:12,textAlign:'center'}}>
        <img src="/icons/brain.svg" alt="" width="24" height="24" />
        <h2 style={{margin:'8px 0 0'}}>Preguntas de Atención Plena</h2>
        <p style={{opacity:0.8,margin:'4px 0 0'}}>Tómate un momento para reflexionar. Cambia cada 8s o pulsa el botón.</p>
      </div>
      <div style={{padding:24,display:'flex',justifyContent:'center'}}>
        <div style={{maxWidth:520,background:'#fff',border:'1px solid #eee',borderRadius:12,boxShadow:'0 10px 30px rgba(0,0,0,0.08)',padding:20,textAlign:'center',fontSize:18}}>
          {PROMPTS[idx]}
          <div style={{marginTop:16,display:'flex',gap:8,justifyContent:'center'}}>
            <button onClick={()=>setIdx((idx+1)%PROMPTS.length)} style={{background:'#d9cbff',border:'none',padding:'8px 12px',borderRadius:8}}>Siguiente Pregunta</button>
            {!running ? <button onClick={start} style={{background:'#A0C4FF',color:'#fff',border:'none',padding:'8px 12px',borderRadius:8}}>Auto</button>
                       : <button onClick={stop} style={{background:'#ef4444',color:'#fff',border:'none',padding:'8px 12px',borderRadius:8}}>Parar</button>}
          </div>
        </div>
      </div>
    </div>
  </main>);
}
