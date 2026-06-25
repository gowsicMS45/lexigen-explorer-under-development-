import { useEffect, useState } from "react";
import { setNote, useAppState } from "@/lib/lexigen-store";

export type ModalKind = "flashcards" | "quiz" | "mindmap" | "compare" | "notes" | null;

export function Modal({
  kind,
  topic,
  category,
  onClose,
}: {
  kind: ModalKind;
  topic: string;
  category: string;
  onClose: () => void;
}) {
  if (!kind) return null;
  return (
    <div className="lx-modal-overlay" onClick={onClose}>
      <div className="lx-modal" onClick={(e) => e.stopPropagation()}>
        <button className="lx-modal-close" onClick={onClose}>
          ×
        </button>
        {kind === "flashcards" && <Flashcards topic={topic} />}
        {kind === "quiz" && <Quiz topic={topic} />}
        {kind === "mindmap" && <MindMap topic={topic} />}
        {kind === "compare" && <Compare topic={topic} />}
        {kind === "notes" && <Notes topic={topic} category={category} />}
      </div>
    </div>
  );
}

function Flashcards({ topic }: { topic: string }) {
  const cards = [
    { q: `What is ${topic}?`, a: "Generating explanation..." },
    { q: `Why does ${topic} matter?`, a: "Generating explanation..." },
    { q: `Example of ${topic}?`, a: "Generating explanation..." },
  ];
  const [i, setI] = useState(0);
  const [flipped, setFlipped] = useState(false);
  return (
    <div className="lx-modal-body">
      <h3>🃏 Flashcards · {topic}</h3>
      <div className="lx-progress-bar">
        <div className="lx-progress-fill" style={{ width: `${((i + 1) / cards.length) * 100}%` }} />
      </div>
      <div className="lx-flashcard" onClick={() => setFlipped((f) => !f)}>
        <div className="lx-flashcard-content">
          {flipped ? cards[i].a : cards[i].q}
        </div>
        <div className="lx-flashcard-hint">Click to flip</div>
      </div>
      <div className="lx-modal-actions">
        <button
          className="lx-pill lx-pill-glass"
          onClick={() => {
            setFlipped(false);
            setI((p) => (p + 1) % cards.length);
          }}
        >
          Again
        </button>
        <button
          className="lx-pill lx-pill-grad"
          onClick={() => {
            setFlipped(false);
            setI((p) => (p + 1) % cards.length);
          }}
        >
          Good
        </button>
      </div>
    </div>
  );
}

function Quiz({ topic }: { topic: string }) {
  const questions = [
    { q: `Core idea of ${topic}?`, opts: ["Option A", "Option B", "Option C", "Option D"], correct: 1 },
    { q: `Best example of ${topic}?`, opts: ["Option A", "Option B", "Option C", "Option D"], correct: 2 },
    { q: `Common misconception?`, opts: ["Option A", "Option B", "Option C", "Option D"], correct: 0 },
  ];
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);

  const next = () => {
    if (picked === questions[i].correct) setScore((s) => s + 1);
    setPicked(null);
    setI((p) => (p + 1) % questions.length);
  };

  return (
    <div className="lx-modal-body">
      <h3>🏆 Quiz · {topic}</h3>
      <div className="lx-quiz-meta">
        <span className="lx-pill lx-pill-glass">Q {i + 1}/{questions.length}</span>
        <span className="lx-pill lx-pill-grad">Score: {score}</span>
      </div>
      <div className="lx-progress-bar">
        <div className="lx-progress-fill" style={{ width: `${((i + 1) / questions.length) * 100}%` }} />
      </div>
      <div className="lx-quiz-q">{questions[i].q}</div>
      <div className="lx-quiz-opts">
        {questions[i].opts.map((o, k) => {
          const cls =
            picked === null
              ? ""
              : k === questions[i].correct
                ? "lx-opt-correct"
                : picked === k
                  ? "lx-opt-wrong"
                  : "";
          return (
            <button
              key={k}
              className={`lx-opt ${cls}`}
              disabled={picked !== null}
              onClick={() => setPicked(k)}
            >
              {o}
            </button>
          );
        })}
      </div>
      <div className="lx-modal-actions">
        <button className="lx-pill lx-pill-grad" disabled={picked === null} onClick={next}>
          Next →
        </button>
      </div>
    </div>
  );
}

function MindMap({ topic }: { topic: string }) {
  const nodes = [
    { x: 250, y: 150, label: topic, main: true },
    { x: 80, y: 60, label: "Origin" },
    { x: 420, y: 60, label: "Theory" },
    { x: 80, y: 240, label: "Examples" },
    { x: 420, y: 240, label: "Impact" },
  ];
  return (
    <div className="lx-modal-body">
      <h3>🗺️ Mind Map · {topic}</h3>
      <svg viewBox="0 0 500 320" className="lx-mindmap">
        {nodes.slice(1).map((n, i) => (
          <line
            key={i}
            x1={250}
            y1={150}
            x2={n.x}
            y2={n.y}
            stroke="rgba(163,130,255,0.4)"
            strokeWidth="1.5"
          />
        ))}
        {nodes.map((n, i) => (
          <g key={i}>
            <circle
              cx={n.x}
              cy={n.y}
              r={n.main ? 46 : 36}
              fill="rgba(255,255,255,0.06)"
              stroke="rgba(163,130,255,0.6)"
              strokeWidth="1"
              style={{ filter: "drop-shadow(0 0 12px rgba(139,92,246,0.5))" }}
            />
            <text
              x={n.x}
              y={n.y + 4}
              textAnchor="middle"
              fill="#f0f0f8"
              fontSize={n.main ? 12 : 10}
              fontWeight={n.main ? 700 : 500}
            >
              {n.label.length > 14 ? n.label.slice(0, 12) + "…" : n.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

function Compare({ topic }: { topic: string }) {
  return (
    <div className="lx-modal-body">
      <h3>⚡ Compare · {topic}</h3>
      <div className="lx-compare">
        <div className="lx-compare-col lx-compare-blue">
          <h4>{topic}</h4>
          <p>Generating explanation...</p>
        </div>
        <div className="lx-compare-col lx-compare-pink">
          <h4>Related concept</h4>
          <p>Generating explanation...</p>
        </div>
      </div>
      <div className="lx-compare-section">
        <div className="lx-section-title">Similarities</div>
        <p className="lx-muted">Generating explanation...</p>
      </div>
      <div className="lx-compare-section">
        <div className="lx-section-title">Differences</div>
        <div className="lx-compare">
          <div className="lx-compare-col lx-compare-blue lx-mini">Generating...</div>
          <div className="lx-compare-col lx-compare-pink lx-mini">Generating...</div>
        </div>
      </div>
    </div>
  );
}

function Notes({ topic, category }: { topic: string; category: string }) {
  const state = useAppState();
  const [text, setText] = useState(state.topics[topic]?.note ?? "");
  useEffect(() => {
    setText(state.topics[topic]?.note ?? "");
  }, [topic, state.topics]);
  return (
    <div className="lx-modal-body">
      <h3>📝 Notes · {topic}</h3>
      <textarea
        className="lx-textarea"
        value={text}
        onChange={(e) => setText(e.target.value.slice(0, 2000))}
        placeholder="Write your notes here..."
        rows={8}
      />
      <div className="lx-notes-meta">
        <span className="lx-muted">{text.length} / 2000</span>
        <button
          className="lx-pill lx-pill-grad"
          onClick={() => setNote(topic, category, text)}
        >
          Save Note
        </button>
      </div>
    </div>
  );
}
