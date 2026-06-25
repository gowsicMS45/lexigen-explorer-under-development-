export function Background() {
  const dots = Array.from({ length: 12 });
  const colors = ["#6366f1", "#7c3aed", "#ec4899"];
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
              left: `${(i * 83) % 100}%`,
              animationDelay: `${(i * 1.3) % 8}s`,
              animationDuration: `${10 + (i % 5) * 2}s`,
              background: colors[i % 3],
              boxShadow: `0 0 12px ${colors[i % 3]}`,
            }}
          />
        ))}
      </div>
    </>
  );
}
