import { useEffect } from "react";

/** Adds spotlight glow + ripple effects to all glass cards/buttons globally. */
export function Interactions() {
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const t = e.target as HTMLElement | null;
      if (!t) return;
      const card = t.closest<HTMLElement>(".lx-card");
      if (card) {
        const r = card.getBoundingClientRect();
        card.style.setProperty("--mx", `${e.clientX - r.left}px`);
        card.style.setProperty("--my", `${e.clientY - r.top}px`);
      }
    };

    const onClick = (e: MouseEvent) => {
      const t = e.target as HTMLElement | null;
      if (!t) return;
      const btn = t.closest<HTMLElement>(
        ".lx-pill, .lx-roll, .lx-feat, .lx-tab, .lx-send, .lx-opt, .lx-status-btn",
      );
      if (!btn) return;
      const r = btn.getBoundingClientRect();
      const ripple = document.createElement("span");
      ripple.className = "lx-ripple";
      const size = Math.max(r.width, r.height) * 2;
      ripple.style.width = ripple.style.height = `${size}px`;
      ripple.style.left = `${e.clientX - r.left - size / 2}px`;
      ripple.style.top = `${e.clientY - r.top - size / 2}px`;
      const prevPos = btn.style.position;
      const prevOv = btn.style.overflow;
      if (!getComputedStyle(btn).position || getComputedStyle(btn).position === "static") {
        btn.style.position = "relative";
      }
      btn.style.overflow = "hidden";
      btn.appendChild(ripple);
      setTimeout(() => {
        ripple.remove();
        if (prevPos !== undefined) btn.style.position = prevPos;
        btn.style.overflow = prevOv;
      }, 650);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("click", onClick);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("click", onClick);
    };
  }, []);

  return null;
}
