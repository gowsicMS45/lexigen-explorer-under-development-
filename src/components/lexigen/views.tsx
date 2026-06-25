import { useEffect, useRef, useState } from "react";
import { Hero } from "./Hero";
import { Chat } from "./Chat";
import { Modal, type ModalKind } from "./Modals";
import {
  CATEGORIES,
  CATEGORY_LIST,
  DAILY_TOPIC,
  DIFFICULTIES,
  findCategory,
  rollTopic,
} from "@/lib/lexigen-data";
import {
  cycleStatus,
  deleteNote,
  ensureTopic,
  pushHistory,
  toggleSaved,
  useAppState,
} from "@/lib/lexigen-store";
import { CountUp } from "./CountUp";

function burst(x: number, y: number) {
  const colors = ["#6366f1", "#8b5cf6", "#a855f7", "#ec4899"];
  const wrap = document.createElement("div");
  wrap.className = "lx-burst";
  wrap.style.left = `${x}px`;
  wrap.style.top = `${y}px`;
  for (let i = 0; i < 16; i++) {
    const p = document.createElement("span");
    const angle = (Math.PI * 2 * i) / 16;
    const dist = 60 + Math.random() * 60;
    p.style.setProperty("--dx", `${Math.cos(angle) * dist}px`);
    p.style.setProperty("--dy", `${Math.sin(angle) * dist}px`);
    p.style.background = colors[i % colors.length];
    p.style.boxShadow = `0 0 10px ${colors[i % colors.length]}`;
    wrap.appendChild(p);
  }
  document.body.appendChild(wrap);
  setTimeout(() => wrap.remove(), 900);
}

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".lx-reveal:not(.lx-revealed)");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("lx-revealed");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.1 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  });
}

export function ExploreView() {
  const state = useAppState();
  const [category, setCategory] = useState("All");
  const [difficulty, setDifficulty] = useState("Clear");
  const [topic, setTopic] = useState<string | null>(null);
  const [topicCat, setTopicCat] = useState<string>("");
  const [customInput, setCustomInput] = useState("");
  const [modal, setModal] = useState<ModalKind>(null);
  const chatRef = useRef<HTMLDivElement>(null);
  useReveal();

  const openTopic = (t: string, c?: string) => {
    const cat = c ?? findCategory(t);
    setTopic(t);
    setTopicCat(cat);
    ensureTopic(t, cat);
    pushHistory(t);
    setTimeout(() => chatRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
  };

  const roll = (e?: React.MouseEvent) => {
    const t = rollTopic(category);
    const c = category === "All" ? findCategory(t) : category;
    if (e) burst(e.clientX, e.clientY);
    openTopic(t, c);
  };

  const explain = () => {
    if (!customInput.trim()) return;
    openTopic(customInput.trim(), category === "All" ? "Custom" : category);
    setCustomInput("");
  };

  return (
    <>
      <Hero
        title="Explore any topic, explained your way"
        subtitle="Pick a category, set your level, and let LexiGen explain anything — clearly."
      />

      <div className="lx-card lx-daily lx-reveal">
        <div>
          <div className="lx-label">TODAY'S TOPIC</div>
          <div className="lx-daily-name">{DAILY_TOPIC.name}</div>
          <div className="lx-muted">{DAILY_TOPIC.category}</div>
        </div>
        <button
          className="lx-pill lx-pill-grad"
          onClick={() => openTopic(DAILY_TOPIC.name, DAILY_TOPIC.category)}
        >
          Learn it ↗
        </button>
      </div>

      <div className="lx-card lx-controls lx-reveal">
        <div className="lx-row">
          <div className="lx-label">CATEGORY</div>
          <div className="lx-pills">
            {CATEGORY_LIST.map((c) => (
              <button
                key={c}
                className={`lx-pill lx-pill-glass ${category === c ? "lx-pill-active" : ""}`}
                onClick={() => setCategory(c)}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="lx-row">
          <div className="lx-label">DIFFICULTY</div>
          <div className="lx-pills">
            {DIFFICULTIES.map((d) => (
              <button
                key={d.id}
                title={d.desc}
                className={`lx-pill lx-pill-glass ${difficulty === d.id ? "lx-pill-active" : ""}`}
                onClick={() => setDifficulty(d.id)}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>

        <div className="lx-actions-row">
          <button className="lx-roll" onClick={roll}>
            🎲 Roll Topic
          </button>
          <input
            className="lx-input lx-input-grow"
            placeholder="Or type any topic..."
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && explain()}
          />
          <button className="lx-pill lx-pill-glass" onClick={explain}>
            Explain ↗
          </button>
        </div>
      </div>

      {topic && (
        <div ref={chatRef}>
          <Chat
            topic={topic}
            category={topicCat}
            difficulty={difficulty}
            onFeature={(f) => setModal(f as ModalKind)}
          />
        </div>
      )}

      {state.history.length > 0 && (
        <div className="lx-history lx-reveal">
          <div className="lx-label">RECENT</div>
          <div className="lx-pills">
            {state.history.map((h) => (
              <button
                key={h}
                className={`lx-pill lx-pill-glass ${topic === h ? "lx-pill-active" : ""}`}
                onClick={() => openTopic(h)}
              >
                {h}
              </button>
            ))}
          </div>
        </div>
      )}

      <Modal kind={modal} topic={topic ?? ""} category={topicCat} onClose={() => setModal(null)} />
    </>
  );
}

export function ProgressView() {
  const state = useAppState();
  useReveal();
  const all = Object.values(state.topics).filter((t) => t.status);
  const groups = {
    mastered: all.filter((t) => t.status === "mastered"),
    understood: all.filter((t) => t.status === "understood"),
    learning: all.filter((t) => t.status === "learning"),
  };
  const total = all.length || 1;
  const pct = Math.round((groups.mastered.length / total) * 100);

  return (
    <>
      <Hero title="Your learning journey" subtitle="Track every topic you explore." />

      <div className="lx-card lx-streak lx-reveal">
        <div className="lx-flame">🔥</div>
        <div>
          <div className="lx-streak-count">{state.streak}</div>
          <div className="lx-muted">Day streak</div>
        </div>
      </div>

      <div className="lx-card lx-stats lx-reveal">
        <div className="lx-stats-pills">
          <span className="lx-pill lx-pill-glass lx-stat-learning">
            Learning · {groups.learning.length}
          </span>
          <span className="lx-pill lx-pill-glass lx-stat-understood">
            Understood · {groups.understood.length}
          </span>
          <span className="lx-pill lx-pill-glass lx-stat-mastered">
            Mastered · {groups.mastered.length}
          </span>
        </div>
        <div className="lx-progress-bar">
          <div className="lx-progress-fill" style={{ width: `${pct}%` }} />
        </div>
        <div className="lx-muted">{pct}% mastered</div>
      </div>

      {(["mastered", "understood", "learning"] as const).map((g) =>
        groups[g].length ? (
          <div key={g} className="lx-group">
            <div className="lx-group-title">{g.toUpperCase()}</div>
            <div className="lx-grid">
              {groups[g].map((t) => (
                <div key={t.name} className={`lx-card lx-topic-card lx-${g} lx-reveal`}>
                  <div className="lx-topic-name">{t.name}</div>
                  <div className="lx-muted">{t.category}</div>
                  <div className="lx-card-actions">
                    <button
                      className={`lx-status-btn lx-status-${t.status}`}
                      onClick={() => cycleStatus(t.name, t.category)}
                    >
                      {t.status}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null,
      )}

      {all.length === 0 && <div className="lx-empty">Explore topics to track progress.</div>}
    </>
  );
}

export function SavedView() {
  const state = useAppState();
  useReveal();
  const saved = Object.values(state.topics).filter((t) => t.saved);

  return (
    <>
      <Hero title="Your saved topics" subtitle="A library of what you want to revisit." />
      {saved.length === 0 ? (
        <div className="lx-empty">No saved topics yet. Tap the ★ to save one.</div>
      ) : (
        <div className="lx-grid">
          {saved.map((t) => (
            <div key={t.name} className="lx-card lx-topic-card lx-reveal">
              <button
                className="lx-star lx-star-on lx-star-corner"
                onClick={() => toggleSaved(t.name, t.category)}
              >
                ★
              </button>
              <div className="lx-topic-name">{t.name}</div>
              <div className="lx-muted">{t.category}</div>
              {t.status && (
                <span className={`lx-pill lx-pill-glass lx-stat-${t.status}`}>{t.status}</span>
              )}
              <div className="lx-card-actions">
                <button className="lx-pill lx-pill-grad">Explain this ↗</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

export function NotesView() {
  const state = useAppState();
  const [editing, setEditing] = useState<string | null>(null);
  const [modal, setModal] = useState<ModalKind>(null);
  useReveal();
  const notes = Object.values(state.topics).filter((t) => t.note);

  return (
    <>
      <Hero title="Your notes" subtitle="Everything you've written, in one place." />
      {notes.length === 0 ? (
        <div className="lx-empty">No notes yet. Open a topic and tap 📝 Notes.</div>
      ) : (
        <div className="lx-grid">
          {notes.map((t) => (
            <div key={t.name} className="lx-card lx-topic-card lx-reveal">
              <div className="lx-topic-name">{t.name}</div>
              <div className="lx-muted">{t.category}</div>
              <p className="lx-note-preview">{t.note}</p>
              <div className="lx-card-actions">
                <button
                  className="lx-pill lx-pill-glass"
                  onClick={() => {
                    setEditing(t.name);
                    setModal("notes");
                  }}
                >
                  Edit
                </button>
                <button className="lx-pill lx-pill-glass" onClick={() => deleteNote(t.name)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      {editing && (
        <Modal
          kind={modal}
          topic={editing}
          category={state.topics[editing]?.category ?? "Custom"}
          onClose={() => {
            setModal(null);
            setEditing(null);
          }}
        />
      )}
    </>
  );
}

// keep import bundle silent
void CATEGORIES;
