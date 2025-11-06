
"use client";
import { useEffect, useState } from "react";

function generatePromptsFrom(text:string): string[] {
  const base = [
    "¿Qué emoción principal notas ahora mismo? ¿Dónde la sientes en el cuerpo?",
    "Si este problema fuera de un amigo, ¿qué consejo compasivo le darías?",
    "Nombra 3 cosas que agradeces hoy, por pequeñas que sean."
  ];
  if (!text) return base;
  // heurística simple para variar según el tema
  const t = text.toLowerCase();
  if (t.includes("estrés") || t.includes("estres")) base.unshift("¿Qué señales tempranas de estrés notas en tu día? ¿Cómo podrías responder con amabilidad?");
  if (t.includes("miedo") or t.includes("ansiedad")) base.unshift("Respira lento 1 minuto. Luego escribe: ¿qué necesitaría ahora mismo para sentirme un poco más seguro?");  # noqa
  return base.slice(0,3);
}

function reframePositive(text:string): string {
  if (!text) return "Intenta escribir primero algo que te preocupe; después haré un reencuadre amable.";
  return "Reencuadre: Reconozco que esto es difícil, y también estoy avanzando. Puedo dar un paso pequeño y realista hoy. Recordatorio: mi valor no depende de este resultado.";
}

export default function JournalPage(){
  const [text,setText]=useState(""); const [status,setStatus]=useState("");
  const [suggestions,setSuggestions]=useState<string[]>([]); const [reframed,setReframed]=useState("");
  useEffect(()=>{ const s=localStorage.getItem("calmspace:journal"); if(s) setText(s); },[]);
  useEffect(()=>{ const id=setTimeout(()=>localStorage.setItem("calmspace:journal",text),300); return ()=>clearTimeout(id); },[text]);
  return (<main style={{maxWidth:900,margin:'24px auto',padding:'0 16px'}}>
    <div style={{border:'1px solid #e8e6f2',borderRadius:12,background:'#fff',boxShadow:'0 6px 20px rgba(0,0,0,0.06)',padding:16}}>
      <div style={{textAlign:'center',marginBottom:8}}><div style={{fontSize:24}}>📖</div><h2 style={{margin:0}}>Diario Personal</h2></div>
      <textarea value={text} onChange={e=>setText(e.target.value)} placeholder="Escribe tus pensamientos y sentimientos..." style={{width:'100%',minHeight:240,border:'1px solid #ddd',borderRadius:12,padding:12}}/>
      <div style={{display:'flex',gap:8,marginTop:12,flexWrap:'wrap'}}>
        <button onClick={()=>setSuggestions(generatePromptsFrom(text))} style={{background:'#e9ecff',border:'none',padding:'8px 12px',borderRadius:8}}>Obtener Sugerencias (local)</button>
        <button onClick={()=>setReframed(reframePositive(text))} style={{background:'#d9cbff',border:'none',padding:'8px 12px',borderRadius:8}}>Reencuadre Positivo (local)</button>
      </div>
      {suggestions.length>0 && (<div style={{marginTop:12}}><strong>Sugerencias:</strong><ul>{suggestions.map((s,i)=><li key={i} style={{marginTop:6}}>- {s}</li>)}</ul></div>)}
      {reframed && (<div style={{marginTop:12}}><strong>Reencuadre:</strong><p style={{marginTop:6}}>{reframed}</p></div>)}
      <div style={{opacity:0.6,marginTop:12}}>Guardado automáticamente en tu navegador.</div>
      <div style={{opacity:0.6,marginTop:4,fontSize:12}}>Nota: estas funciones son locales (sin IA en la nube). Podemos conectar un modelo real cuando quieras.</div>
    </div>
  </main>);
}
