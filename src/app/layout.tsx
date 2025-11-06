
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CalmSpace",
  description: "Respiración, atención plena y diario personal.",
  manifest: "/manifest.webmanifest",
  icons: { icon: [{ url: "/icons/icon-192.png", sizes: "192x192" }, { url: "/icons/icon-512.png", sizes: "512x512" }] },
  themeColor: "#D0B8FF"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body style={{fontFamily:'Arial, Helvetica, sans-serif', background:'#F4F2F9', color:'#2b2b2f'}}>
        <nav style={{display:'flex',gap:16,alignItems:'center',padding:'12px 16px',position:'sticky',top:0,background:'rgba(255,255,255,0.7)',backdropFilter:'blur(8px)',borderBottom:'1px solid #e8e6f2'}}>
          <img src="/icons/leaf.svg" alt="" width="24" height="24" />
          <a href="/" style={{fontWeight:700,color:'#6b4fd7',textDecoration:'none'}}>CalmSpace</a>
          <a href="/" style={{textDecoration:'none',color:'#6b4fd7',background:'#efe9ff',padding:'4px 8px',borderRadius:8,marginLeft:16}}>Inicio</a>
          <a href="/breathing" style={{textDecoration:'none',color:'#2b2b2f'}}>Ejercicio de Respiración</a>
          <a href="/mindfulness" style={{textDecoration:'none',color:'#2b2b2f'}}>Atención Plena</a>
          <a href="/journal" style={{textDecoration:'none',color:'#2b2b2f'}}>Diario</a>
        </nav>
        {children}
        <script dangerouslySetInnerHTML={{__html:`if('serviceWorker' in navigator){window.addEventListener('load',()=>navigator.serviceWorker.register('/sw.js').catch(()=>{}))}`}} />
      </body>
    </html>
  );
}
