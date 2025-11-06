
"use client";
import BreathingExercise from "@/components/breathing/BreathingExercise";
export default function Page(){return(<main style={{maxWidth:720,margin:'24px auto',padding:'0 16px'}}>
  <div style={{textAlign:'center',marginBottom:16}}>
    <div style={{fontSize:24,marginBottom:8}}>🫁</div>
    <h2 style={{margin:0}}>Ejercicio de Respiración</h2>
    <p style={{opacity:0.8}}>Sigue la guía visual con modos para combatir el estrés.</p>
  </div>
  <div style={{border:'1px solid #e8e6f2',borderRadius:12,background:'#fff',boxShadow:'0 6px 20px rgba(0,0,0,0.06)',padding:16}}>
    <BreathingExercise/>
  </div>
</main>)};
