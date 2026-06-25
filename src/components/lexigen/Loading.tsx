import { useEffect, useState } from "react";

const MSGS = ["Loading LexiGen...", "Preparing AI...", "Almost ready..."];

export function Loading({ onDone }: { onDone: () => void }) {
  const [msg, setMsg] = useState(0);
  const [fade, setFade] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setMsg((m) => (m + 1) % MSGS.length), 800);
    const fadeT = setTimeout(() => setFade(true), 2200);
    const done = setTimeout(onDone, 2600);
    return () => {
      clearInterval(t);
      clearTimeout(fadeT);
      clearTimeout(done);
    };
  }, [onDone]);

  return (
    <div className={`lx-loading ${fade ? "lx-loading-out" : ""}`}>
      <div className="lx-loading-logo">λ</div>
      <div className="lx-loading-msg" key={msg}>
        {MSGS[msg]}
      </div>
      <div className="lx-loading-bar">
        <div className="lx-loading-bar-fill" />
      </div>
    </div>
  );
}
