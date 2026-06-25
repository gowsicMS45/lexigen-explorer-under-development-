export function Hero({ title, subtitle }: { title: string; subtitle?: string }) {
  const words = title.split(" ");
  return (
    <section className="lx-hero">
      <div className="lx-eyebrow">AI-POWERED LEARNING</div>
      <h1 className="lx-h1">
        {words.map((w, i) => (
          <span
            key={i}
            className="lx-h1-word"
            style={{ animationDelay: `${i * 0.05}s` }}
          >
            {w}{" "}
          </span>
        ))}
      </h1>
      {subtitle && <p className="lx-sub">{subtitle}</p>}
    </section>
  );
}
