import { useState, useEffect } from "react";
import { ROSTER, LIST_META } from "./roster.js";
import { searchIG, searchYT, analyzeWithClaude } from "./api.js";
import MD from "./MD.jsx";

const C = {
  bg: "#06060a",
  card: "#0d0d15",
  border: "#1a1a28",
  text: "#e0e0f0",
  sub: "#5050a0",
  mono: "'IBM Plex Mono', monospace",
  display: "'Bebas Neue', display",
  body: "'DM Sans', sans-serif",
};

// ─── Shared styles ────────────────────────────────────────────
const inputStyle = {
  background: "#060608",
  border: `1px solid ${C.border}`,
  color: C.text,
  padding: "9px 12px",
  borderRadius: 6,
  fontFamily: C.mono,
  fontSize: 12,
  outline: "none",
  width: "100%",
};

const cardStyle = {
  background: C.card,
  border: `1px solid ${C.border}`,
  borderRadius: 10,
  padding: "16px 18px",
};

// ─── HOME PAGE ────────────────────────────────────────────────
function HomePage({ savedKey, setSavedKey, onSelectArtist }) {
  const [apiKey, setApiKey] = useState("");

  return (
    <div style={{ fontFamily: C.body }}>
      {/* Header */}
      <div style={{ marginBottom: 40 }}>
        <div style={{ fontFamily: C.display, fontSize: 48, letterSpacing: 4, lineHeight: 1, background: "linear-gradient(135deg,#fff 40%,#888)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          SABRINA'S
        </div>
        <div style={{ fontFamily: C.display, fontSize: 48, letterSpacing: 4, lineHeight: 1, background: "linear-gradient(135deg,#9b5de5,#f72585)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          INTEL HUB
        </div>
        <div style={{ fontFamily: C.mono, fontSize: 10, color: C.sub, letterSpacing: 3, marginTop: 8 }}>
          DJ MANAGEMENT · TREND INTELLIGENCE · REAL-TIME DATA
        </div>
      </div>

      {/* API Key */}
      {!savedKey ? (
        <div style={{ ...cardStyle, marginBottom: 28 }}>
          <div style={{ fontFamily: C.mono, fontSize: 10, color: C.sub, letterSpacing: 2, marginBottom: 10 }}>
            SCRAPECREATORS API KEY
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sc_••••••••"
              style={{ ...inputStyle, flex: 1 }}
              onFocus={(e) => (e.target.style.borderColor = "#9b5de5")}
              onBlur={(e) => (e.target.style.borderColor = C.border)}
              onKeyDown={(e) => e.key === "Enter" && apiKey.trim() && setSavedKey(apiKey.trim())}
            />
            <button
              onClick={() => apiKey.trim() && setSavedKey(apiKey.trim())}
              style={{ background: "#1a0a30", border: "1px solid #3a1060", color: "#9b5de5", padding: "9px 14px", borderRadius: 6, cursor: "pointer", fontFamily: C.mono, fontSize: 11, letterSpacing: 1 }}
            >
              SALVAR
            </button>
          </div>
          <div style={{ fontFamily: C.mono, fontSize: 10, color: "#303050", marginTop: 8 }}>
            A key fica salva só no seu browser. Não vai para nenhum servidor.
          </div>
        </div>
      ) : (
        <div style={{ background: "#0a0f0a", border: "1px solid #1a3020", borderRadius: 10, padding: "10px 16px", marginBottom: 28, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontFamily: C.mono, fontSize: 11, color: "#4caf80" }}>✓ API Key configurada</div>
          <span onClick={() => setSavedKey("")} style={{ fontFamily: C.mono, fontSize: 10, color: "#404060", cursor: "pointer" }}>
            trocar
          </span>
        </div>
      )}

      {/* Roster */}
      <div style={{ fontFamily: C.mono, fontSize: 10, color: C.sub, letterSpacing: 2, marginBottom: 14 }}>
        SELECIONE O ARTISTA
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 32 }}>
        {Object.entries(ROSTER).map(([key, a]) => (
          <div
            key={key}
            onClick={() => savedKey && onSelectArtist(key)}
            style={{
              ...cardStyle,
              cursor: savedKey ? "pointer" : "not-allowed",
              opacity: savedKey ? 1 : 0.4,
              display: "flex",
              alignItems: "center",
              gap: 16,
              transition: "border-color .2s, background .2s",
            }}
            onMouseEnter={(e) => {
              if (!savedKey) return;
              e.currentTarget.style.borderColor = a.color;
              e.currentTarget.style.background = a.accent;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = C.border;
              e.currentTarget.style.background = C.card;
            }}
          >
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: a.color, flexShrink: 0, boxShadow: `0 0 10px ${a.color}88` }} />
            <div>
              <div style={{ fontFamily: C.display, fontSize: 22, letterSpacing: 2, color: a.color }}>{a.label}</div>
              <div style={{ fontFamily: C.mono, fontSize: 10, color: "#404060", marginTop: 2 }}>{a.niche}</div>
            </div>
            <div style={{ marginLeft: "auto", fontFamily: C.mono, fontSize: 18, color: C.border }}>›</div>
          </div>
        ))}
      </div>

      {!savedKey && (
        <div style={{ fontFamily: C.mono, fontSize: 11, color: "#303050", textAlign: "center" }}>
          ↑ Configure a API key para começar
        </div>
      )}
    </div>
  );
}

// ─── CONFIG PAGE ──────────────────────────────────────────────
function ConfigPage({ artistKey, selectedList, setSelectedList, onRun, onBack, error }) {
  const artist = ROSTER[artistKey];
  return (
    <div style={{ fontFamily: C.body }}>
      <button onClick={onBack} style={{ background: "transparent", border: "none", color: C.sub, cursor: "pointer", fontFamily: C.mono, fontSize: 11, marginBottom: 24, padding: 0 }}>
        ← ROSTER
      </button>

      <div style={{ marginBottom: 28 }}>
        <div style={{ fontFamily: C.display, fontSize: 40, letterSpacing: 4, color: artist.color }}>{artist.label}</div>
        <div style={{ fontFamily: C.mono, fontSize: 10, color: "#404060", marginTop: 4 }}>{artist.niche}</div>
      </div>

      <div style={{ fontFamily: C.mono, fontSize: 10, color: C.sub, letterSpacing: 2, marginBottom: 12 }}>
        TIPO DE INTELIGÊNCIA
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 28 }}>
        {Object.entries(LIST_META).map(([k, m]) => (
          <div
            key={k}
            onClick={() => setSelectedList(k)}
            style={{
              background: selectedList === k ? artist.accent : C.card,
              border: `1px solid ${selectedList === k ? artist.color : C.border}`,
              borderRadius: 8,
              padding: "12px 16px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 14,
              transition: "all .15s",
            }}
          >
            <span style={{ fontSize: 18 }}>{m.emoji}</span>
            <div>
              <div style={{ fontFamily: C.display, fontSize: 18, letterSpacing: 2, color: selectedList === k ? artist.color : C.text }}>
                {m.label}
              </div>
              <div style={{ fontFamily: C.mono, fontSize: 10, color: "#404060" }}>
                {m.desc} · {artist.lists[k].length} DJs
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* DJ preview */}
      <div style={{ ...cardStyle, marginBottom: 28 }}>
        <div style={{ fontFamily: C.mono, fontSize: 10, color: C.sub, letterSpacing: 2, marginBottom: 12 }}>
          DJs QUE SERÃO MONITORADOS
        </div>
        {artist.lists[selectedList].map((dj, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              gap: 10,
              padding: "7px 0",
              borderBottom: i < artist.lists[selectedList].length - 1 ? `1px solid ${C.border}` : "none",
            }}
          >
            <div style={{ fontFamily: C.mono, fontSize: 12, color: C.text, width: 170, flexShrink: 0 }}>{dj.name}</div>
            <div style={{ fontFamily: C.mono, fontSize: 10, color: "#404060" }}>{dj.reason}</div>
          </div>
        ))}
        <div style={{ fontFamily: C.mono, fontSize: 10, color: "#252540", marginTop: 12 }}>
          ~{artist.lists[selectedList].length * 2} API credits · IG Reels + YouTube por artista
        </div>
      </div>

      {error && (
        <div style={{ background: "#180808", border: "1px solid #500a0a", borderRadius: 8, padding: "10px 14px", marginBottom: 16, fontFamily: C.mono, fontSize: 12, color: "#fc6c6c" }}>
          ⚠ {error}
        </div>
      )}

      <button
        onClick={onRun}
        style={{
          width: "100%",
          padding: "15px",
          background: `linear-gradient(135deg,${artist.accent}cc,${artist.color}22)`,
          border: `1px solid ${artist.color}`,
          borderRadius: 10,
          color: artist.color,
          cursor: "pointer",
          fontFamily: C.display,
          fontSize: 22,
          letterSpacing: 4,
        }}
        onMouseEnter={(e) => (e.currentTarget.style.opacity = ".8")}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
      >
        GERAR INTEL REPORT
      </button>
    </div>
  );
}

// ─── LOADING PAGE ─────────────────────────────────────────────
function LoadingPage({ artistKey, selectedList, log }) {
  const artist = ROSTER[artistKey];
  return (
    <div style={{ fontFamily: C.body }}>
      <div style={{ fontFamily: C.display, fontSize: 40, letterSpacing: 4, color: artist.color, marginBottom: 4 }}>
        SCANNING
      </div>
      <div style={{ fontFamily: C.display, fontSize: 28, letterSpacing: 4, color: C.sub, marginBottom: 32 }}>
        {LIST_META[selectedList]?.label}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
        <div
          style={{
            width: 22,
            height: 22,
            borderRadius: "50%",
            border: `2px solid ${C.border}`,
            borderTopColor: artist.color,
            animation: "spin .7s linear infinite",
            flexShrink: 0,
          }}
        />
        <div style={{ fontFamily: C.mono, fontSize: 11, color: C.sub }}>
          Coletando dados em tempo real...
        </div>
      </div>
      <div style={{ ...cardStyle, maxHeight: 380, overflowY: "auto" }}>
        {log.length === 0 && (
          <div style={{ fontFamily: C.mono, fontSize: 11, color: "#252540" }}>Inicializando...</div>
        )}
        {log.map((l) => (
          <div
            key={l.id}
            style={{
              fontFamily: C.mono,
              fontSize: 11,
              color: l.ok ? "#9090c0" : "#fc6c6c",
              padding: "5px 0",
              borderBottom: `1px solid ${C.border}`,
              animation: "fadein .25s ease forwards",
            }}
          >
            {l.txt}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── REPORT PAGE ──────────────────────────────────────────────
function ReportPage({ artistKey, selectedList, report, onBack }) {
  const artist = ROSTER[artistKey];
  const meta = LIST_META[selectedList];
  return (
    <div style={{ fontFamily: C.body }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
        <div>
          <div style={{ fontFamily: C.display, fontSize: 36, letterSpacing: 3, color: artist.color }}>{artist.label}</div>
          <div style={{ fontFamily: C.display, fontSize: 20, letterSpacing: 3, color: C.sub }}>{meta?.label} INTEL</div>
          <div style={{ fontFamily: C.mono, fontSize: 10, color: "#303050", marginTop: 4 }}>
            {new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" }).toUpperCase()} · REAL-TIME DATA
          </div>
        </div>
        <button
          onClick={onBack}
          style={{ background: "transparent", border: `1px solid ${C.border}`, color: C.sub, padding: "7px 12px", borderRadius: 6, cursor: "pointer", fontFamily: C.mono, fontSize: 11 }}
        >
          ← BACK
        </button>
      </div>

      {/* DJ tags */}
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 20 }}>
        {artist.lists[selectedList].map((d) => (
          <span
            key={d.name}
            style={{ background: artist.accent, border: `1px solid ${artist.color}33`, borderRadius: 20, padding: "3px 10px", fontFamily: C.mono, fontSize: 10, color: artist.color }}
          >
            {d.name}
          </span>
        ))}
      </div>

      <div style={{ ...cardStyle, padding: "22px", marginBottom: 16 }}>
        <MD text={report} accentColor={artist.color} />
      </div>

      <button
        onClick={onBack}
        style={{ width: "100%", background: "transparent", border: `1px solid ${C.border}`, color: C.sub, padding: "12px", borderRadius: 8, cursor: "pointer", fontFamily: C.mono, fontSize: 11 }}
      >
        ← NOVO RELATÓRIO
      </button>
    </div>
  );
}

// ─── ROOT APP ─────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("home");
  const [savedKey, setSavedKey] = useState(() => localStorage.getItem("sc_api_key") || "");
  const [selectedArtist, setSelectedArtist] = useState(null);
  const [selectedList, setSelectedList] = useState("competitors");
  const [log, setLog] = useState([]);
  const [report, setReport] = useState("");
  const [error, setError] = useState(null);

  // Persist key in localStorage
  const handleSaveKey = (key) => {
    setSavedKey(key);
    localStorage.setItem("sc_api_key", key);
  };
  const handleClearKey = () => {
    setSavedKey("");
    localStorage.removeItem("sc_api_key");
  };

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=IBM+Plex+Mono:wght@400;500&family=DM+Sans:wght@300;400;500&display=swap');
      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
      body { background: #06060a; }
      ::-webkit-scrollbar { width: 3px; }
      ::-webkit-scrollbar-thumb { background: #222; border-radius: 2px; }
      @keyframes spin { to { transform: rotate(360deg); } }
      @keyframes fadein { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const appendLog = (txt, ok = true) =>
    setLog((prev) => [...prev, { txt, ok, id: Math.random() }]);

  const runReport = async () => {
    if (!savedKey) { setError("Configure a API key primeiro."); return; }
    const artist = ROSTER[selectedArtist];
    const djList = artist.lists[selectedList];

    setPage("loading");
    setLog([]);
    setError(null);
    const collected = [];

    for (const dj of djList) {
      appendLog(`↓ Instagram › ${dj.name}`);
      try {
        const d = await searchIG(dj.name + " DJ set", savedKey);
        const reels = d?.reels || d?.data || [];
        collected.push({ dj: dj.name, reason: dj.reason, instagram: reels.slice(0, 4) });
        appendLog(`✓ IG › ${dj.name} — ${reels.length} reels`);
      } catch (e) {
        appendLog(`✗ IG › ${dj.name}: ${e.message}`, false);
      }

      appendLog(`↓ YouTube › ${dj.name}`);
      try {
        const d = await searchYT(dj.name + " DJ mix 2025", savedKey);
        const vids = d?.videos || d?.results || d?.data || [];
        const existing = collected.find((c) => c.dj === dj.name);
        if (existing) existing.youtube = vids.slice(0, 3);
        else collected.push({ dj: dj.name, youtube: vids.slice(0, 3) });
        appendLog(`✓ YT › ${dj.name} — ${vids.length} vídeos`);
      } catch (e) {
        appendLog(`✗ YT › ${dj.name}: ${e.message}`, false);
      }
    }

    appendLog("◎ Analisando com Claude...");
    try {
      const txt = await analyzeWithClaude(
        artist.label, artist.niche, selectedList,
        LIST_META[selectedList], djList, collected
      );
      setReport(txt);
      appendLog("✓ Relatório gerado!");
      setPage("report");
    } catch (e) {
      setError("Erro na análise: " + e.message);
      setPage("config");
    }
  };

  return (
    <div style={{ background: C.bg, minHeight: "100vh", padding: "32px 24px", maxWidth: 580, margin: "0 auto" }}>
      {page === "home" && (
        <HomePage
          savedKey={savedKey}
          setSavedKey={handleSaveKey}
          onClearKey={handleClearKey}
          onSelectArtist={(key) => { setSelectedArtist(key); setPage("config"); }}
        />
      )}
      {page === "config" && selectedArtist && (
        <ConfigPage
          artistKey={selectedArtist}
          selectedList={selectedList}
          setSelectedList={setSelectedList}
          onRun={runReport}
          onBack={() => setPage("home")}
          error={error}
        />
      )}
      {page === "loading" && selectedArtist && (
        <LoadingPage artistKey={selectedArtist} selectedList={selectedList} log={log} />
      )}
      {page === "report" && selectedArtist && (
        <ReportPage
          artistKey={selectedArtist}
          selectedList={selectedList}
          report={report}
          onBack={() => setPage("config")}
        />
      )}
    </div>
  );
}
