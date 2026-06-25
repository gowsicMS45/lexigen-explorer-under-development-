import { useEffect, useRef, useState } from "react";
import {
  cycleStatus,
  ensureTopic,
  toggleSaved,
  useAppState,
  type ProgressStatus,
} from "@/lib/lexigen-store";

interface Msg {
  role: "assistant" | "user";
  text: string;
  thinking?: boolean;
}

const STATUS_LABEL: Record<ProgressStatus, string> = {
  learning: "Learning",
  understood: "Understood",
  mastered: "Mastered",
};

export function Chat({
  topic,
  category,
  difficulty,
  onFeature,
}: {
  topic: string;
  category: string;
  difficulty: string;
  onFeature: (f: string) => void;
}) {
  const state = useAppState();
  const t = state.topics[topic];
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ensureTopic(topic, category);
    setMsgs([
      { role: "assistant", text: "", thinking: true },
    ]);
    const timer = setTimeout(() => {
      setMsgs([
        {
          role: "assistant",
          text: `Generating explanation of "${topic}" at ${difficulty} level...`,
        },
      ]);
    }, 1200);
    return () => clearTimeout(timer);
  }, [topic, category, difficulty]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs]);

  const send = () => {
    if (!input.trim()) return;
    const text = input.trim();
    setInput("");
    setMsgs((m) => [
      ...m,
      { role: "user", text },
      { role: "assistant", text: "", thinking: true },
    ]);
    setTimeout(() => {
      setMsgs((m) => {
        const copy = [...m];
        copy[copy.length - 1] = {
          role: "assistant",
          text: "Generating explanation...",
        };
        return copy;
      });
    }, 1200);
  };

  const quick = (label: string) => {
    setMsgs((m) => [
      ...m,
      { role: "user", text: label },
      { role: "assistant", text: "", thinking: true },
    ]);
    setTimeout(() => {
      setMsgs((m) => {
        const copy = [...m];
        copy[copy.length - 1] = { role: "assistant", text: "Generating explanation..." };
        return copy;
      });
    }, 1100);
  };

  return (
    <div className="lx-card lx-chat lx-reveal">
      <div className="lx-chat-head">
        <div className="lx-chat-title">
          <div className="lx-topic-name">{topic}</div>
          <div className="lx-chat-tags">
            <span className="lx-tag">{category}</span>
            <span className="lx-tag">{difficulty}</span>
          </div>
        </div>
        <div className="lx-chat-actions">
          <button
            className={`lx-status-btn lx-status-${t?.status ?? "none"}`}
            onClick={() => cycleStatus(topic, category)}
          >
            {t?.status ? STATUS_LABEL[t.status] : "Track"}
          </button>
          <button
            className={`lx-star ${t?.saved ? "lx-star-on" : ""}`}
            onClick={() => toggleSaved(topic, category)}
            aria-label="Save"
          >
            ★
          </button>
        </div>
      </div>

      <div className="lx-thread">
        {msgs.map((m, i) =>
          m.role === "assistant" ? (
            <div key={i} className="lx-msg lx-msg-a">
              <div className="lx-avatar">λ</div>
              <div className="lx-bubble lx-bubble-a">
                {m.thinking ? (
                  <div className="lx-thinking">
                    <span /> <span /> <span />
                  </div>
                ) : (
                  m.text
                )}
              </div>
            </div>
          ) : (
            <div key={i} className="lx-msg lx-msg-u">
              <div className="lx-bubble lx-bubble-u">{m.text}</div>
            </div>
          ),
        )}
        <div ref={bottomRef} />
      </div>

      <div className="lx-quick">
        {["Go deeper ↗", "Example ↗", "Related ↗", "Analogy ↗"].map((q) => (
          <button key={q} className="lx-pill lx-pill-glass" onClick={() => quick(q)}>
            {q}
          </button>
        ))}
      </div>

      <div className="lx-divider" />

      <div className="lx-features">
        <button className="lx-feat lx-feat-amber" onClick={() => onFeature("flashcards")}>
          🃏 Flashcards
        </button>
        <button className="lx-feat lx-feat-green" onClick={() => onFeature("quiz")}>
          🏆 Scored Quiz
        </button>
        <button className="lx-feat lx-feat-cyan" onClick={() => onFeature("mindmap")}>
          🗺️ Mind Map
        </button>
        <button className="lx-feat lx-feat-purple" onClick={() => onFeature("compare")}>
          ⚡ Compare
        </button>
        <button className="lx-feat lx-feat-emerald" onClick={() => onFeature("notes")}>
          📝 Notes
        </button>
      </div>

      <div className="lx-composer">
        <input
          className="lx-input"
          placeholder="Ask a follow-up..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
        />
        <button className="lx-send" onClick={send} aria-label="Send">
          ↑
        </button>
      </div>
    </div>
  );
}
