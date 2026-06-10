"use client";

import { motion } from "framer-motion";

const ORBIT_NODES = [
  { label: "AI Agent", angle: 0, radius: 130, delay: 0 },
  { label: "SAP", angle: 72, radius: 130, delay: 0.1 },
  { label: "CRM", angle: 144, radius: 130, delay: 0.2 },
  { label: "ERP", angle: 216, radius: 130, delay: 0.3 },
  { label: "BI", angle: 288, radius: 130, delay: 0.4 },
];

const OUTER_NODES = [
  { label: "Slack", angle: 36, radius: 200, delay: 0.15 },
  { label: "API", angle: 108, radius: 200, delay: 0.25 },
  { label: "DB", angle: 180, radius: 200, delay: 0.35 },
  { label: "Email", angle: 252, radius: 200, delay: 0.45 },
  { label: "Voice", angle: 324, radius: 200, delay: 0.05 },
];

function getPos(angleDeg: number, radius: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: Math.cos(rad) * radius,
    y: Math.sin(rad) * radius,
  };
}

export function OrbitVisual() {
  return (
    <div className="relative w-full max-w-[480px] aspect-square mx-auto">
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="-240 -240 480 480"
        fill="none"
      >
        {/* Orbit rings */}
        <circle
          cx="0"
          cy="0"
          r="130"
          stroke="oklch(0.72 0.18 195 / 12%)"
          strokeWidth="1"
          strokeDasharray="4 6"
        />
        <circle
          cx="0"
          cy="0"
          r="200"
          stroke="oklch(0.72 0.18 195 / 8%)"
          strokeWidth="1"
          strokeDasharray="3 8"
        />
        <circle
          cx="0"
          cy="0"
          r="60"
          stroke="oklch(0.72 0.18 195 / 20%)"
          strokeWidth="1"
        />

        {/* Connection lines from center to inner nodes */}
        {ORBIT_NODES.map((node) => {
          const pos = getPos(node.angle, node.radius);
          return (
            <line
              key={node.label}
              x1="0"
              y1="0"
              x2={pos.x}
              y2={pos.y}
              stroke="oklch(0.72 0.18 195 / 15%)"
              strokeWidth="1"
            />
          );
        })}

        {/* Connection lines from inner to outer nodes */}
        {ORBIT_NODES.map((inner, i) => {
          const outer = OUTER_NODES[i];
          const iPos = getPos(inner.angle, inner.radius);
          const oPos = getPos(outer.angle, outer.radius);
          return (
            <line
              key={`conn-${i}`}
              x1={iPos.x}
              y1={iPos.y}
              x2={oPos.x}
              y2={oPos.y}
              stroke="oklch(0.72 0.18 195 / 10%)"
              strokeWidth="1"
              strokeDasharray="3 5"
            />
          );
        })}
      </svg>

      {/* Center Node */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="relative"
        >
          <div className="absolute inset-0 rounded-full bg-teal/10 blur-xl scale-150" />
          <div className="relative w-16 h-16 rounded-full border border-teal/40 bg-graphite flex items-center justify-center">
            <div className="absolute inset-2 rounded-full border border-teal/20" />
            <div className="w-3 h-3 rounded-full bg-teal shadow-[0_0_12px_oklch(0.72_0.18_195)]" />
          </div>
          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] text-teal font-medium whitespace-nowrap tracking-wider">
            OrbitAI
          </div>
        </motion.div>
      </div>

      {/* Inner orbit nodes */}
      {ORBIT_NODES.map((node) => {
        const pos = getPos(node.angle, node.radius);
        const pct = (x: number) => `calc(50% + ${x}px)`;
        return (
          <motion.div
            key={node.label}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: node.delay + 0.5, duration: 0.4 }}
            className="absolute transform -translate-x-1/2 -translate-y-1/2"
            style={{ left: pct(pos.x), top: pct(pos.y) }}
          >
            <div className="w-10 h-10 rounded-lg border border-teal/25 bg-graphite flex items-center justify-center teal-glow-sm">
              <span className="text-[9px] text-teal font-semibold tracking-wide">{node.label}</span>
            </div>
          </motion.div>
        );
      })}

      {/* Outer nodes */}
      {OUTER_NODES.map((node) => {
        const pos = getPos(node.angle, node.radius);
        const pct = (x: number) => `calc(50% + ${x}px)`;
        return (
          <motion.div
            key={node.label}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: node.delay + 0.8, duration: 0.4 }}
            className="absolute transform -translate-x-1/2 -translate-y-1/2"
            style={{ left: pct(pos.x), top: pct(pos.y) }}
          >
            <div className="w-8 h-8 rounded-md border border-white/10 bg-white/3 flex items-center justify-center">
              <span className="text-[8px] text-muted-foreground font-medium">{node.label}</span>
            </div>
          </motion.div>
        );
      })}

      {/* Rotating ring animation */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 pointer-events-none"
        style={{ transformOrigin: "center" }}
      >
        <svg className="w-full h-full" viewBox="-240 -240 480 480" fill="none">
          <circle cx="0" cy="0" r="168" stroke="oklch(0.72 0.18 195 / 6%)" strokeWidth="1" strokeDasharray="1 12" />
        </svg>
      </motion.div>
    </div>
  );
}
