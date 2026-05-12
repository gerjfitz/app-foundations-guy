import { useRef, useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { signalCategories as genomeCategories } from "./GenomeVisual";

const getPredictiveLevel = (pct: number) => {
  if (pct >= 70) return { label: "High", color: "#22c55e", bgColor: "rgba(34,197,94,0.08)" };
  if (pct >= 40) return { label: "Medium", color: "#f59e0b", bgColor: "rgba(245,158,11,0.08)" };
  return { label: "Low", color: "#64748b", bgColor: "rgba(100,116,139,0.08)" };
};

// Simulate which genome sub-signals (by index within the category) this leader demonstrates
const leaderGenomeMap: Record<string, number[]> = {
  executive: [0, 1, 5],
  strategic: [0, 1],
  voice: [0, 1],
  transformation: [0, 2],
  people: [0, 1, 3],
};

// Ring showing demonstrated/total as a fraction
const CountRing = ({
  demonstrated,
  total,
  color,
  size = 56,
  strokeWidth = 4,
}: {
  demonstrated: number;
  total: number;
  color: string;
  size?: number;
  strokeWidth?: number;
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const ratio = total > 0 ? demonstrated / total : 0;
  const offset = circumference - ratio * circumference;
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          className="text-border/40"
          strokeWidth={strokeWidth}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        />
      </svg>
      <span
        className="absolute inset-0 flex items-center justify-center font-bold tabular-nums"
        style={{ color, fontSize: size * 0.26 }}
      >
        {demonstrated}/{total}
      </span>
    </div>
  );
};

const LeaderGenomeExplorer = ({ firstName }: { firstName: string }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const categoryRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const subSignalRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const [lines, setLines] = useState<{ path: string; color: string; key: string }[]>([]);

  const updateLines = useCallback(() => {
    if (!containerRef.current) { setLines([]); return; }
    const containerRect = containerRef.current.getBoundingClientRect();
    const newLines: { path: string; color: string; key: string }[] = [];

    genomeCategories.forEach(category => {
      const demonstratedIndices = leaderGenomeMap[category.id] || [];
      if (demonstratedIndices.length === 0) return;
      const catEl = categoryRefs.current.get(category.id);
      if (!catEl) return;
      const catRect = catEl.getBoundingClientRect();
      const startX = catRect.right - containerRect.left;
      const startY = catRect.top + catRect.height / 2 - containerRect.top;

      demonstratedIndices.forEach(idx => {
        const subEl = subSignalRefs.current.get(`${category.id}-${idx}`);
        if (!subEl) return;
        const subRect = subEl.getBoundingClientRect();
        const endX = subRect.left - containerRect.left;
        const endY = subRect.top + subRect.height / 2 - containerRect.top;
        const midX = startX + (endX - startX) * 0.45;

        newLines.push({
          key: `${category.id}-${idx}`,
          path: `M ${startX} ${startY} C ${midX} ${startY}, ${midX} ${endY}, ${endX} ${endY}`,
          color: `${category.color}80`,
        });
      });
    });
    setLines(newLines);
  }, []);

  useEffect(() => {
    const t1 = setTimeout(updateLines, 100);
    const t2 = setTimeout(updateLines, 400);
    window.addEventListener("resize", updateLines);
    return () => { clearTimeout(t1); clearTimeout(t2); window.removeEventListener("resize", updateLines); };
  }, [updateLines]);

  // Skip anti-patterns from the leader view
  const visibleCategories = genomeCategories.filter(c => c.id !== "anti-patterns");

  return (
    <div>
      <div className="mb-6">
        <h3 className="font-bold text-foreground text-lg">Genome Signals</h3>
        <p className="text-sm text-muted-foreground">The genome makeup for {firstName}</p>
      </div>

      <div className="relative" ref={containerRef}>
        {/* SVG connection lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" style={{ overflow: "visible" }}>
          {lines.map((line, idx) => (
            <motion.path
              key={line.key}
              d={line.path}
              fill="none"
              stroke={line.color}
              strokeWidth="2.5"
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 + idx * 0.04, ease: [0.25, 0.1, 0.25, 1] }}
            />
          ))}
        </svg>

        <div className="space-y-8">
          {visibleCategories.map(category => {
            const demonstratedIndices = leaderGenomeMap[category.id] || [];
            const demonstratedCount = demonstratedIndices.length;
            const total = category.subSignals.length;
            const hasAny = demonstratedCount > 0;

            return (
              <div key={category.id} className="flex items-center gap-0">
                {/* Left: category node */}
                <div className="w-56 flex-shrink-0">
                  <div
                    ref={el => { if (el) categoryRefs.current.set(category.id, el); }}
                    className="flex flex-col items-center px-4 py-5 rounded-xl border border-border/40 shadow-sm transition-opacity"
                    style={{
                      background: hasAny
                        ? `linear-gradient(135deg, ${category.color}20 0%, ${category.color}08 40%, white 75%)`
                        : "white",
                      opacity: hasAny ? 1 : 0.55,
                    }}
                  >
                    <div className="mb-2">
                      <CountRing
                        demonstrated={demonstratedCount}
                        total={total}
                        color={hasAny ? category.color : "#94a3b8"}
                        size={56}
                        strokeWidth={4}
                      />
                    </div>
                    <span
                      className="text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full mb-2"
                      style={{
                        backgroundColor: hasAny ? `${category.color}15` : "rgba(100,116,139,0.08)",
                        color: hasAny ? category.color : "#64748b",
                      }}
                    >
                      {demonstratedCount} of {total}
                    </span>
                    <span className="font-semibold text-foreground text-xs text-center leading-tight">{category.name}</span>
                  </div>
                </div>

                {/* Gap for connection lines */}
                <div className="flex-shrink-0" style={{ width: "48px" }} />

                {/* Right: all sub-signals, demonstrated highlighted */}
                <div className="flex-1 min-w-0 space-y-2">
                  {category.subSignals.map((subSignal, idx) => {
                    const isDemonstrated = demonstratedIndices.includes(idx);
                    const level = getPredictiveLevel(subSignal.predictiveStrength);
                    return (
                      <div
                        key={idx}
                        ref={el => {
                          if (el && isDemonstrated) subSignalRefs.current.set(`${category.id}-${idx}`, el);
                        }}
                        className="relative flex items-center gap-3 px-4 py-3 rounded-xl bg-white border shadow-sm overflow-hidden transition-opacity"
                        style={{
                          borderColor: isDemonstrated ? `${category.color}55` : "hsl(var(--border) / 0.4)",
                          opacity: isDemonstrated ? 1 : 0.45,
                        }}
                      >
                        {isDemonstrated && (
                          <div
                            className="absolute inset-0 pointer-events-none"
                            style={{ background: `linear-gradient(270deg, ${category.color}10 0%, transparent 60%)` }}
                          />
                        )}
                        {/* Status dot */}
                        <div className="flex-shrink-0 relative z-10">
                          <div
                            className="w-2.5 h-2.5 rounded-full"
                            style={{
                              backgroundColor: isDemonstrated ? category.color : "transparent",
                              border: isDemonstrated ? "none" : "1.5px solid hsl(var(--border))",
                            }}
                          />
                        </div>
                        <div className="flex-1 min-w-0 relative z-10">
                          <h5 className="font-medium text-sm text-foreground truncate">{subSignal.name}</h5>
                          <p className="text-xs text-muted-foreground truncate">{subSignal.description}</p>
                        </div>
                        {isDemonstrated && (
                          <span
                            className="text-[10px] font-semibold px-2.5 py-1 rounded-full flex-shrink-0 relative z-10"
                            style={{ backgroundColor: level.bgColor, color: level.color }}
                          >
                            {level.label}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default LeaderGenomeExplorer;
