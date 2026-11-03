/*
 * Coupé de perfil dibujado a mano para el configurador de Vencejo: el color de la carrocería, el del interior (se ve tras el
 * cristal) y el tipo de llanta cambian de verdad. Sin texto ni emblemas: la marca es inventada.
 */

const RUEDAS = [190, 580];

function Llanta({ cx, tipo }: { cx: number; tipo: string }) {
  return (
    <g>
      <circle cx={cx} cy={226} r={50} fill="#0e0e0e" />
      <circle cx={cx} cy={226} r={35} fill={tipo === "turbina" ? "#2b2d30" : "#9aa0a6"} />
      {tipo === "turbina"
        ? Array.from({ length: 10 }, (_, k) => (
            <path key={k} d={`M ${cx} 226 L ${cx + 33} 220 A 34 34 0 0 1 ${cx + 30} 238 Z`} fill="#b7bcc2" transform={`rotate(${k * 36} ${cx} 226)`} />
          ))
        : Array.from({ length: 24 }, (_, k) => <line key={k} x1={cx} y1={226} x2={cx + 33} y2={226} stroke="#e7e9ec" strokeWidth={1.2} transform={`rotate(${k * 15 + (k % 2) * 4} ${cx} 226)`} />)}
      <circle cx={cx} cy={226} r={8} fill="#c4733a" />
      <circle cx={cx} cy={226} r={3.5} fill="#222" />
    </g>
  );
}

export default function Coche({ color, interior, llanta, className = "" }: { color: string; interior: string; llanta: string; className?: string }) {
  return (
    <svg viewBox="40 60 720 230" className={className} role="img" aria-label="Céfiro XXV de perfil con la configuración elegida">
      <ellipse cx={400} cy={278} rx={330} ry={9} fill="rgba(0,0,0,0.18)" />
      <path
        d="M60 205 C60 180 70 166 110 158 L232 150 C272 110 322 92 382 90 C432 90 472 104 512 140 L690 160 C725 166 742 180 742 200 L742 214 C742 222 736 226 728 226 L640 226 A60 60 0 0 0 520 226 L250 226 A60 60 0 0 0 130 226 L72 226 C64 226 60 220 60 212 Z"
        fill={color}
        style={{ transition: "fill 0.6s" }}
      />
      {/* cristal con el interior asomando */}
      <path d="M254 150 C288 116 328 103 378 102 C424 102 456 114 488 142 Z" fill="#141a1f" />
      <path d="M300 150 C310 132 330 126 352 126 L360 150 Z" fill={interior} style={{ transition: "fill 0.6s" }} />
      <line x1={384} y1={102} x2={384} y2={150} stroke={color} strokeWidth={6} />
      {/* brillo del hombro, juntas y entrada de aire */}
      <path d="M116 168 C240 160 420 158 690 172" fill="none" stroke="rgba(255,255,255,0.32)" strokeWidth={2} />
      <path d="M384 154 L384 220" stroke="rgba(0,0,0,0.25)" strokeWidth={1.4} />
      <path d="M600 186 L660 190" stroke="rgba(0,0,0,0.35)" strokeWidth={3} strokeLinecap="round" />
      <circle cx={726} cy={184} r={8} fill="#f1efe6" stroke="rgba(0,0,0,0.3)" />
      <rect x={60} y={174} width={10} height={14} rx={3} fill="#c1271b" />
      <circle cx={450} cy={150} r={4} fill="#c0c4c8" />
      {RUEDAS.map((cx) => (
        <Llanta key={cx} cx={cx} tipo={llanta} />
      ))}
    </svg>
  );
}
