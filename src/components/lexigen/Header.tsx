import { useAppState } from "@/lib/lexigen-store";

export type View = "explore" | "progress" | "saved" | "notes";

const TABS: { id: View; label: string }[] = [
  { id: "explore", label: "Explore" },
  { id: "progress", label: "Progress" },
  { id: "saved", label: "Saved" },
  { id: "notes", label: "Notes" },
];

export function Header({ view, setView }: { view: View; setView: (v: View) => void }) {
  const state = useAppState();
  const counts = {
    explore: 0,
    progress: Object.values(state.topics).filter((t) => t.status).length,
    saved: Object.values(state.topics).filter((t) => t.saved).length,
    notes: Object.values(state.topics).filter((t) => t.note).length,
  };

  return (
    <header className="lx-header">
      <div className="lx-header-inner">
        <div className="lx-brand">
          <div className="lx-logo">λ</div>
          <div className="lx-wordmark">LexiGen</div>
        </div>
        <nav className="lx-nav">
          {TABS.map((t) => (
            <button
              key={t.id}
              className={`lx-tab ${view === t.id ? "lx-tab-active" : ""}`}
              onClick={() => setView(t.id)}
            >
              {t.label}
              {counts[t.id] > 0 && <span className="lx-badge">{counts[t.id]}</span>}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}
