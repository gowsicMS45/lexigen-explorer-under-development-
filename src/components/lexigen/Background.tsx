import { useEffect } from "react";

export function Background() {
  const dots = Array.from({ length: 14 });
  const colors = ["#6366f1", "#7c3aed", "#ec4899"];

  useEffect(() => {
    let raf = 0;
    let tx = 0, ty = 0, cx = 0, cy = 0;
    const onMove = (e: MouseEvent) => {
      tx = (e.clientX / window.innerWidth - 0.5) * 60;
      ty = (e.clientY / window.innerHeight - 0.5) * 60;
    };
    const loop = () => {
      cx += (tx - cx) * 0.05;
      cy += (ty - cy) * 0.05;
      document.documentElement.style.setProperty("--lx-px", `${cx}px`);
      document.documentElement.style.setProperty("--lx-py", `${cy}px`);
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener("mousemove", onMove);
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div className="lx-bg">
        <div className="lx-orb lx-orb-1" />
        <div className="lx-orb lx-orb-2" />
        <div className="lx-orb lx-orb-3" />
      </div>
      <div className="lx-dots" aria-hidden>
        {dots.map((_, i) => (
          <span
            key={i}
            className="lx-dot"
            style={{
              left: `${(i * 73) % 100}%`,
              animationDelay: `${(i * 1.1) % 10}s`,
              animationDuration: `${9 + (i % 6) * 2}s`,
              background: colors[i % 3],
              boxShadow: `0 0 12px ${colors[i % 3]}`,
            }}
          />
        ))}
      </div>
    </>
  );
}
