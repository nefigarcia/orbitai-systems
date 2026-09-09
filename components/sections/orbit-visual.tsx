"use client";

import { motion } from "framer-motion";

const INNER = [
  { label: "AI Agent", angle: 0,   r: 128, delay: 0,   color: "oklch(0.72 0.18 195)" },
  { label: "SAP",      angle: 72,  r: 128, delay: 0.1, color: "oklch(0.72 0.18 195)" },
  { label: "CRM",      angle: 144, r: 128, delay: 0.2, color: "oklch(0.72 0.18 195)" },
  { label: "ERP",      angle: 216, r: 128, delay: 0.3, color: "oklch(0.72 0.18 195)" },
  { label: "BI",       angle: 288, r: 128, delay: 0.4, color: "oklch(0.72 0.18 195)" },
];

const OUTER = [
  { label: "Slack",  angle: 36,  r: 196, delay: 0.15 },
  { label: "API",    angle: 108, r: 196, delay: 0.25 },
  { label: "DB",     angle: 180, r: 196, delay: 0.35 },
  { label: "Email",  angle: 252, r: 196, delay: 0.45 },
  { label: "Voice",  angle: 324, r: 196, delay: 0.05 },
];

function pos(deg: number, r: number) {
  const rad = ((deg - 90) * Math.PI) / 180;
  return { x: Math.cos(rad) * r, y: Math.sin(rad) * r };
}
const pct = (v: number) => `calc(50% + ${v}px)`;

/* Animated line that draws itself, then a dot travels it */
function FlowLine({
  x1, y1, x2, y2, delay, dasharray = "120",
}: {
  x1: number; y1: number; x2: number; y2: number;
  delay: number; dasharray?: string;
}) {
  const len = Math.hypot(x2 - x1, y2 - y1);
  return (
    <>
      {/* Static dim line */}
      <line
        x1={x1} y1={y1} x2={x2} y2={y2}
        stroke="oklch(0.72 0.18 195 / 12%)"
        strokeWidth="0.75"
      />
      {/* Travelling dot */}
      <motion.circle r="2" fill="oklch(0.72 0.18 195 / 80%)">
        <animateMotion
          dur={`${2.4 + delay}s`}
          repeatCount="indefinite"
          begin={`${delay}s`}
          calcMode="linear"
        >
          <mpath xlinkHref={`#flow-path-${x1.toFixed(0)}-${y1.toFixed(0)}`} />
        </animateMotion>
        <animate attributeName="opacity" values="0;1;1;0" dur={`${2.4 + delay}s`} repeatCount="indefinite" begin={`${delay}s`} />
      </motion.circle>
      <path
        id={`flow-path-${x1.toFixed(0)}-${y1.toFixed(0)}`}
        d={`M ${x1} ${y1} L ${x2} ${y2}`}
        fill="none"
        style={{ display: "none" }}
      />
      {/* Shimmer sweep */}
      <line
        x1={x1} y1={y1} x2={x2} y2={y2}
        stroke="url(#teal-gradient)"
        strokeWidth="0.75"
        strokeDasharray={`${len * 0.25} ${len}`}
        opacity="0.5"
      >
        <animate
          attributeName="stroke-dashoffset"
          from={`${len}`}
          to={`${-len}`}
          dur={`${3 + delay * 0.5}s`}
          repeatCount="indefinite"
          calcMode="linear"
        />
      </line>
    </>
  );
}

export function OrbitVisual() {
  return (
    <div className="relative w-full max-w-[500px] aspect-square mx-auto select-none">
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="-250 -250 500 500"
        fill="none"
        overflow="visible"
      >
        <defs>
          <linearGradient id="teal-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="oklch(0.72 0.18 195)" stopOpacity="0" />
            <stop offset="50%" stopColor="oklch(0.72 0.18 195)" stopOpacity="0.8" />
            <stop offset="100%" stopColor="oklch(0.72 0.18 195)" stopOpacity="0" />
          </linearGradient>
          <filter id="node-glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <radialGradient id="center-glow">
            <stop offset="0%" stopColor="oklch(0.72 0.18 195)" stopOpacity="0.3" />
            <stop offset="100%" stopColor="oklch(0.72 0.18 195)" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Ambient glow at center */}
        <circle cx="0" cy="0" r="80" fill="url(#center-glow)" />

        {/* Orbit rings */}
        <circle cx="0" cy="0" r="56"  stroke="oklch(0.72 0.18 195 / 18%)" strokeWidth="1" />
        <circle cx="0" cy="0" r="128" stroke="oklch(0.72 0.18 195 / 10%)" strokeWidth="1" strokeDasharray="5 7" />
        <circle cx="0" cy="0" r="196" stroke="oklch(0.72 0.18 195 / 6%)"  strokeWidth="1" strokeDasharray="3 10" />

        {/* Center → Inner lines with animated dots */}
        {INNER.map((n) => {
          const p = pos(n.angle, n.r);
          return <FlowLine key={n.label} x1={0} y1={0} x2={p.x} y2={p.y} delay={n.delay} />;
        })}

        {/* Inner → Outer lines */}
        {INNER.map((inn, i) => {
          const out = OUTER[i];
          const ip = pos(inn.angle, inn.r);
          const op = pos(out.angle, out.r);
          return <FlowLine key={`o-${i}`} x1={ip.x} y1={ip.y} x2={op.x} y2={op.y} delay={out.delay} />;
        })}

        {/* Slow rotating decorative ring */}
        <g>
          <animateTransform attributeName="transform" type="rotate" from="0 0 0" to="360 0 0" dur="40s" repeatCount="indefinite" />
          <circle cx="0" cy="0" r="160" stroke="oklch(0.72 0.18 195 / 5%)" strokeWidth="1" strokeDasharray="2 14" />
        </g>

        {/* Counter-rotate */}
        <g>
          <animateTransform attributeName="transform" type="rotate" from="360 0 0" to="0 0 0" dur="60s" repeatCount="indefinite" />
          <circle cx="0" cy="0" r="220" stroke="oklch(0.72 0.18 195 / 4%)" strokeWidth="1" strokeDasharray="1 18" />
        </g>
      </svg>

      {/* ── Center hub ── */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          animate={{ scale: [1, 1.04, 1] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
          className="relative"
        >
          {/* Pulse rings */}
          {[0, 0.6, 1.2].map((d) => (
            <div
              key={d}
              className="absolute inset-0 rounded-full border border-teal/30"
              style={{
                animation: `pulse-ring 2.4s ease-out ${d}s infinite`,
              }}
            />
          ))}
          {/* Hub body */}
          <div className="relative w-[60px] h-[60px] rounded-full border border-teal/50 bg-[oklch(0.13_0.01_240)] flex items-center justify-center teal-glow-sm">
            <div className="absolute inset-[8px] rounded-full border border-teal/20" />
            <div className="w-3.5 h-3.5 rounded-full bg-teal shadow-[0_0_16px_oklch(0.72_0.18_195)]" />
          </div>
          {/* Label */}
          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[9px] text-teal font-semibold whitespace-nowrap tracking-[0.15em] uppercase">
            Orbit
          </div>
        </motion.div>
      </div>

      {/* ── Inner nodes ── */}
      {INNER.map((n) => {
        const p = pos(n.angle, n.r);
        return (
          <motion.div
            key={n.label}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: n.delay + 0.4, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: pct(p.x), top: pct(p.y) }}
          >
            <div className="relative w-11 h-11 rounded-xl border border-teal/30 bg-[oklch(0.13_0.01_240)] flex flex-col items-center justify-center gap-0.5 teal-glow-xs hover:border-teal/60 transition-colors cursor-default">
              <div className="absolute inset-0 rounded-xl bg-teal/5" />
              <span className="relative text-[8px] text-teal font-bold tracking-wide leading-none">{n.label}</span>
            </div>
          </motion.div>
        );
      })}

      {/* ── Outer nodes ── */}
      {OUTER.map((n) => {
        const p = pos(n.angle, n.r);
        return (
          <motion.div
            key={n.label}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: n.delay + 0.9, duration: 0.5 }}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: pct(p.x), top: pct(p.y) }}
          >
            <div className="w-9 h-9 rounded-lg border border-white/10 bg-[oklch(0.11_0.01_240)] flex items-center justify-center hover:border-white/20 transition-colors cursor-default">
              <span className="text-[7px] text-muted-foreground font-medium tracking-wide">{n.label}</span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
