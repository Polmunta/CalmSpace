"use client";

import { useEffect, useState } from "react";

async function getAiPrompts(text: string): Promise<string[]> {
  const res = await fetch("/api/ai/journal-prompts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });
  if (!res.ok) {
    throw new Error("No se pudieron obtener sugerencias IA");
  }
  const data = await res.json();
  return data.prompts ?? [];
}

async function getAiReframe(text: string): Promise<string> {
  const res = await fetch("/api/ai/reframe", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });
  if (!res.ok) {
    throw new Error("No se pudo obtener el reencuadre IA");
  }
  const data = await res.json();
  return data.rewritten ?? "";
}

export default function JournalPage() {
  const [text, setText] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [reframed, setReframed] = useState("");
  const [loading, setLoading] = useState<null | "prompts" | "reframe">(null);
  const [error, setError] = useState<string | null>(null);

  // cargar del navegador
  useEffect(() => {
    const saved = localStorage.getItem("calmspace:journal");
    if (saved) setText(saved);
  }, []);

  // guardar automáticamente
  useEffect(() => {
    const id = setTimeout(() => {
      localStorage.setItem("calmspace:journal", text);
    }, 400);
    return () => clearTimeout(id);
  }, [text]);

  const appendToText = (extra: string) => {
    setText((prev) => (prev ? prev + "\n\n" + extra : extra));
  };

  const handlePrompts = async () => {
    try {
      setError(null);
      setLoading("prompts");
      const prompts = await getAiPrompts(text);
      setSuggestions(prompts);
    } catch (e: any) {
      setError(e?.message || "Error al obtener sugerencias IA");
    } finally {
      setLoading(null);
    }
  };

  const handleReframe = async () => {
    try {
      setError(null);
      setLoading("reframe");
      const r = await getAiReframe(text);
      setReframed(r);
      if (r) appendToText(r);
    } catch (e: any) {
      setError(e?.message || "Error al reencuadrar con IA");
    } finally {
      setLoading(null);
    }
  };

  return (
    <main style={{ maxWidth: 900, margin: "24px auto", padding: "0 16px" }}>
      <div
        style={{
          border: "1px solid #e8e6f2",
          borderRadius: 16,
          background: "#ffffff",
          boxShadow: "0 6px 20px rgba(0,0,0,0.06)",
          padding: 20,
        }}
      >
        <header style={{ textAlign: "center", marginBottom: 12 }}>
          <div style={{ fontSize: 32 }}>📖</div>
          <h1 style={{ margin: "8px 0 4px" }}>Diario Personal</h1>
          <p style={{ margin: 0, opacity: 0.7 }}>
            Escribe con libertad. Tus entradas se guardan solo en tu navegador.
          </p>
        </header>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Escribe tus pensamientos y sentimientos aquí..."
          style={{
            width: "100%",
            minHeight: 260,
            borderRadius: 12,
            border: "1px solid #ddd",
            padding: 12,
            resize: "vertical",
          }}
        />

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 8,
            marginTop: 12,
          }}
        >
          <button
            onClick={handlePrompts}
            disabled={loading !== null}
            style={{
              border: "none",
              borderRadius: 8,
              padding: "8px 12px",
              background: "#e9ecff",
              cursor: loading ? "wait" : "pointer",
            }}
          >
            {loading === "prompts"
              ? "Cargando sugerencias IA..."
              : "Obtener Sugerencias (IA)"}
          </button>

          <button
            onClick={handleReframe}
            disabled={loading !== null}
            style={{
              border: "none",
              borderRadius: 8,
              padding: "8px 12px",
              background: "#d9cbff",
              cursor: loading ? "wait" : "pointer",
            }}
          >
            {loading === "reframe"
              ? "Reencuadrando con IA..."
              : "Reencuadre Positivo (IA)"}
          </button>
        </div>

        {error && (
          <div style={{ marginTop: 12, color: "#b91c1c" }}>
            ⚠️ {error}
          </div>
        )}

        {suggestions.length > 0 && (
          <section style={{ marginTop: 16 }}>
            <strong>Sugerencias IA:</strong>
            <ul style={{ paddingLeft: 20, marginTop: 8 }}>
              {suggestions.map((s, i) => (
                <li
                  key={i}
                  style={{
                    marginBottom: 8,
                    display: "flex",
                    gap: 8,
                    alignItems: "flex-start",
                  }}
                >
                  <span style={{ flex: 1 }}>{s}</span>
                  <button
                    onClick={() => appendToText(s)}
                    style={{
                      border: "none",
                      borderRadius: 6,
                      padding: "4px 8px",
                      background: "#f3e8ff",
                      cursor: "pointer",
                    }}
                  >
                    Insertar
                  </button>
                </li>
              ))}
            </ul>
          </section>
        )}

        {reframed && (
          <section style={{ marginTop: 16 }}>
            <strong>Reencuadre IA:</strong>
            <p style={{ marginTop: 8 }}>{reframed}</p>
          </section>
        )}

        <p style={{ marginTop: 16, opacity: 0.6, fontSize: 12 }}>
          Guardado automáticamente en tu navegador.
        </p>
      </div>
    </main>
  );
}
