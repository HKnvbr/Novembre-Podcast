/**
 * Bandeau défilant. Pure CSS, dupliqué une fois pour la boucle, figé sous
 * `prefers-reduced-motion`. Sert de respiration entre deux sections denses.
 */
export function Ticker({ items, duration = 34 }: { items: readonly string[]; duration?: number }) {
  const suite = (
    <>
      {items.map((item, i) => (
        <span key={`${item}-${i}`} className="ticker__item mega">
          {item}
          <span className="ticker__sep" aria-hidden="true">
            ·
          </span>
        </span>
      ))}
    </>
  );

  return (
    <div className="ticker" aria-hidden="true">
      <div className="ticker__piste" style={{ animationDuration: `${duration}s` }}>
        {suite}
        {suite}
      </div>
    </div>
  );
}
