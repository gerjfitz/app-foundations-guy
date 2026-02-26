import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

const strandColors = [
  { stroke: "#f59e0b", node: "#f59e0b" }, // amber
  { stroke: "#a855f7", node: "#a855f7" }, // purple
  { stroke: "#3b82f6", node: "#3b82f6" }, // blue
  { stroke: "#f97316", node: "#f97316" }, // orange
  { stroke: "#14b8a6", node: "#14b8a6" }, // teal
  { stroke: "#ef4444", node: "#ef4444" }, // rose
];

const GenomeStrand = () => {
  const [time, setTime] = useState(0);
  const animRef = useRef<number>();

  useEffect(() => {
    const tick = () => {
      setTime((t) => t + 0.004);
      animRef.current = requestAnimationFrame(tick);
    };
    animRef.current = requestAnimationFrame(tick);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, []);

  const width = 520;
  const height = 44;
  const cy = height / 2;
  const amplitude = 12;
  const segments = 60;

  // Build two intertwining strand paths
  const getY = (x: number, strand: 1 | 2) => {
    const norm = x / width;
    const phase = norm * Math.PI * 4 + time * 1.5;
    const dir = strand === 1 ? 1 : -1;
    return cy + Math.sin(phase) * amplitude * dir;
  };

  const buildPath = (strand: 1 | 2) => {
    const pts = Array.from({ length: segments + 1 }).map((_, i) => {
      const x = (i / segments) * width;
      return { x, y: getY(x, strand) };
    });
    let d = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 1; i < pts.length; i++) {
      const prev = pts[i - 1];
      const curr = pts[i];
      const cpx = (prev.x + curr.x) / 2;
      d += ` C ${cpx} ${prev.y}, ${cpx} ${curr.y}, ${curr.x} ${curr.y}`;
    }
    return d;
  };

  // Find crossing points and place nodes + cross-links
  const nodeCount = 16;
  const nodes = Array.from({ length: nodeCount }).map((_, i) => {
    const x = ((i + 0.5) / nodeCount) * width;
    const y1 = getY(x, 1);
    const y2 = getY(x, 2);
    const colorIdx = i % strandColors.length;
    return { x, y1, y2, colorIdx };
  });

  // Cross-links where strands are close (every 3rd node)
  const crossLinks = nodes.filter((_, i) => i % 3 === 1);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2 }}
      className="flex justify-center mb-5"
    >
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-[336px] h-[44px]"
        fill="none"
      >
        {/* Cross-links (behind strands) */}
        {crossLinks.map((n, i) => (
          <line
            key={`cl-${i}`}
            x1={n.x}
            y1={n.y1}
            x2={n.x}
            y2={n.y2}
            stroke={strandColors[n.colorIdx].stroke}
            strokeWidth="1"
            opacity="0.2"
            strokeLinecap="round"
          />
        ))}

        {/* Strand 1 — gradient stroke */}
        <path
          d={buildPath(1)}
          stroke="url(#gs1)"
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0.4"
        />

        {/* Strand 2 — gradient stroke */}
        <path
          d={buildPath(2)}
          stroke="url(#gs2)"
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0.4"
        />

        {/* Nodes on strand 1 */}
        {nodes
          .filter((_, i) => i % 2 === 0)
          .map((n, i) => (
            <circle
              key={`s1-${i}`}
              cx={n.x}
              cy={n.y1}
              r={4}
              fill={strandColors[n.colorIdx].node}
              opacity="0.85"
            />
          ))}

        {/* Nodes on strand 2 */}
        {nodes
          .filter((_, i) => i % 2 === 1)
          .map((n, i) => (
            <circle
              key={`s2-${i}`}
              cx={n.x}
              cy={n.y2}
              r={3.5}
              fill={strandColors[(n.colorIdx + 3) % strandColors.length].node}
              opacity="0.75"
            />
          ))}

        {/* Diamond markers at crossing points */}
        {nodes
          .filter((n) => Math.abs(n.y1 - n.y2) < 4)
          .map((n, i) => (
            <rect
              key={`d-${i}`}
              x={n.x - 3}
              y={(n.y1 + n.y2) / 2 - 3}
              width={6}
              height={6}
              rx={1}
              fill={strandColors[n.colorIdx].node}
              opacity="0.6"
              transform={`rotate(45 ${n.x} ${(n.y1 + n.y2) / 2})`}
            />
          ))}

        <defs>
          <linearGradient id="gs1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="20%" stopColor="#a855f7" />
            <stop offset="40%" stopColor="#3b82f6" />
            <stop offset="60%" stopColor="#f97316" />
            <stop offset="80%" stopColor="#14b8a6" />
            <stop offset="100%" stopColor="#ef4444" />
          </linearGradient>
          <linearGradient id="gs2" x1="100%" y1="0%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#14b8a6" />
            <stop offset="20%" stopColor="#f97316" />
            <stop offset="40%" stopColor="#ef4444" />
            <stop offset="60%" stopColor="#f59e0b" />
            <stop offset="80%" stopColor="#a855f7" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>
        </defs>
      </svg>
    </motion.div>
  );
};

export default GenomeStrand;
