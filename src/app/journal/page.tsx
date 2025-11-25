"use client";
import { useEffect, useState } from "react";

async function fetchPrompts(text: string): Promise<string[]> {
  const res = await fetch("/api/ai/journal-prompts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });
  if (!res.ok) throw new Error("Fallo al pedir sugerencias IA");
  const data = await res.json();
  return data.prompts ?? [];
}

async function fetchReframe(text: string): Promise<string> {
  const res = await fetch("/api/ai/reframe", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });
  if (!res.ok) throw new Error("Fallo al pedir reencuadre IA");
  const data = await res.json();
  return data.rewritten ?? "";
}

export default function JournalPage() {
  const [text, setText] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [reframed, setReframed] = useState("");
  const [loading, setLoading] = useState<null | "prompts" | "reframe">(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const s = localStorage.getItem("calmspace:journal");
    if (s) setText(s);
  }, []);
  useEffect(() => {
    const id = setTimeout(() => localStorage.setItem("calmspace:journal", text), 300);
    return () => clearTimeout(id);
  }, [text]);

  const insert = (t: string) => setText(prev => (prev ? prev + "\n\n" + t : t));

  const handlePrompts = async () => {
    try {
      setError(null); setLoading("prompts");
      const arr = await fetchPrompts(text);
      setSuggestions(arr);
    } catch (e: any) {
      setError(e?.message || "Error al obtener sugerencias");
    } finally {
      setLoading(null);
    }
  };

  const handleReframe = async () => {
    try {
      setError(null); setLoading("reframe");
      const r = await fetchReframe(text);
      setReframed(r);
      if (r) insert(r);
    } catch (e: any) {
      setError(e?.message || "Error al reencuadrar");
    } finally {
      setLoading(null);
    }
  };

  return (
    <main style={{ maxWidth: 900, margin: "24px auto", padding: "0 16px" }}>
      <div style={{ border: "1px solid #e8e6f2", borderRadius: 12, background: "#fff", boxShadow: "0 6px 20px rgba(0,0,0,0.06)", padding: 16 }}>
        <div style={{ textAlign: "center", marginBottom: 8 }}>
          <div style={{ fontSize: 24 }}>📖</div><h2 style={{ margin: 0 }}>Diario Personal</h2>
        </div>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Escribe tus pensamientos y sentimientos..."
          style={{ width: "100%", minHeight: 240, border: "1px solid #ddd", borderRadius: 12, padding: 12 }}
        />

        <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
          <button onClick={handlePrompts} disabled={loading !== null}
            style={{ background: "#e9ecff", border: "none", padding: "8px 12px", borderRadius: 8 }}>
            {loading === "prompts" ? "Cargando…" : "Obtener Sugerencias (IA)"}
          </button>
          <button onClick={handleReframe} disabled={loading !== null}
            style={{ background: "#d9cbff", border: "none", padding: "8px 12px", borderRadius: 8 }}>
            {loading === "reframe" ? "Reencuadrando…" : "Reencuadre Positivo (IA)"}
          </button>
        </div>

        {error && <div style={{ marginTop: 12, color: "#b91c1c" }}>⚠️ {error}</div>}

        {suggestions.length > 0 && (
          <div style={{ marginTop: 12 }}>
            <strong>Sugerencias:</strong>
            <ul>
              {suggestions.map((s, i) => (
                <li key={i} style={{ marginTop: 6, display: "flex", gap: 8, alignItems: "center" }}>
                  <span>- {s}</span>
                  <button onClick={() => insert(s)} style={{ marginLeft: 8, background: "#f3e8ff", border: "none", padding: "4px 8px", borderRadius: 6 }}>
                    Insertar
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {reframed && (
          <div style={{ marginTop: 12 }}>
            <strong>Reencuadre:</strong>
            <p style={{ marginTop: 6 }}>{reframed}</p>
          </div>
        )}

        <div style={{ opacity: 0.6, marginTop: 12 }}>Guardado automáticamente en tu navegador.</div>
      </div>
    </main>
  );
}
