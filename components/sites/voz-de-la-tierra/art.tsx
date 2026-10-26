/** El dibujo de la pantalla de carga: el disco de oro con sus surcos mientras la señal se sincroniza. */

export function LoadingRecord() {
  return (
    <svg className="vd-load" viewBox="-100 -100 200 200" aria-hidden>
      {/* estilos en línea: el dibujo sale bien antes de que llegue el CSS de la web (viene con su JS) */}
      <circle r="96" fill="none" stroke="var(--ln, rgba(243,234,214,0.16))" strokeWidth={0.6} strokeDasharray="2 3" />
      <circle r="30" fill="none" stroke="var(--acc2, #4a9fa4)" strokeWidth={0.6} strokeDasharray="1 2" />
      {/* los surcos: se dibujan con el progreso */}
      {Array.from({ length: 16 }, (_, i) => (
        <circle
          key={i}
          r={36 + i * 3.8}
          fill="none"
          stroke="var(--acc, #e8b64c)"
          strokeWidth={0.7}
          strokeLinecap="round"
          strokeDasharray={1}
          pathLength={1}
          style={{ strokeDashoffset: "calc(1 - min(var(--p, 0) * 3, 1))", opacity: 0.9 - i * 0.045 }}
        />
      ))}
      <line x1="0" y1="-96" x2="0" y2="-108" stroke="var(--acc, #e8b64c)" strokeWidth={0.7} />
      <text y="-72" textAnchor="middle" fill="var(--mut, #8e8577)" fontSize={6} letterSpacing={0.8} style={{ textTransform: "uppercase" }}>
        Sincronizando la señal
      </text>
      <text y="86" textAnchor="middle" fill="var(--acc, #e8b64c)" fontSize={5.4} letterSpacing={1.2} style={{ textTransform: "uppercase" }}>
        16⅔ rpm
      </text>
    </svg>
  );
}
