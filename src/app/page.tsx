
export default function Home() {
  return (
    <main style={{maxWidth:1000,margin:'24px auto',padding:'0 16px'}}>
      <section style={{background:'linear-gradient(180deg, #f6f3ff, #eef3ff)',padding:24,border:'1px solid #e8e6f2',borderRadius:16,boxShadow:'0 6px 20px rgba(0,0,0,0.06)',textAlign:'center',marginBottom:24}}>
        <img src="/icons/bolt.svg" alt="" width="32" height="32" style={{margin:'0 auto 8px'}}/>
        <h1 style={{fontSize:32,margin:'0 0 8px'}}>Bienvenido a CalmSpace</h1>
        <p style={{opacity:0.8,margin:0}}>Encuentra tu paz con nuestros ejercicios y herramientas guiadas.</p>
      </section>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))',gap:16}}>
        <a href="/breathing" style={{border:'1px solid #e8e6f2',borderRadius:12,padding:16,background:'#fff',boxShadow:'0 4px 12px rgba(0,0,0,0.04)',textDecoration:'none',color:'inherit'}}>
          <div style={{fontSize:24,marginBottom:8}}>🫁</div>
          <h3 style={{margin:'0 0 6px'}}>Ejercicio de Respiración</h3>
          <p style={{opacity:0.7,margin:0}}>Respiración guiada para calmar tu mente.</p>
          <div style={{marginTop:12}}><span style={{background:'#d9cbff',padding:'6px 10px',borderRadius:8}}>Ver</span></div>
        </a>
        <a href="/mindfulness" style={{border:'1px solid #e8e6f2',borderRadius:12,padding:16,background:'#fff',boxShadow:'0 4px 12px rgba(0,0,0,0.04)',textDecoration:'none',color:'inherit'}}>
          <img src="/icons/brain.svg" alt="" width="24" height="24" />
          <h3 style={{margin:'8px 0 6px'}}>Preguntas de Atención Plena</h3>
          <p style={{opacity:0.7,margin:0}}>Reflexiona con nuestras preguntas seleccionadas.</p>
          <div style={{marginTop:12}}><span style={{background:'#d9cbff',padding:'6px 10px',borderRadius:8}}>Ver</span></div>
        </a>
        <a href="/journal" style={{border:'1px solid #e8e6f2',borderRadius:12,padding:16,background:'#fff',boxShadow:'0 4px 12px rgba(0,0,0,0.04)',textDecoration:'none',color:'inherit'}}>
          <div style={{fontSize:24,marginBottom:8}}>📖</div>
          <h3 style={{margin:'0 0 6px'}}>Diario Personal</h3>
          <p style={{opacity:0.7,margin:0}}>Expresa tus pensamientos y sentimientos.</p>
          <div style={{marginTop:12}}><span style={{background:'#d9cbff',padding:'6px 10px',borderRadius:8}}>Ver</span></div>
        </a>
      </div>
      <footer style={{textAlign:'center',opacity:0.6,marginTop:24}}>&copy; 2025 CalmSpace.</footer>
    </main>
  );
}
