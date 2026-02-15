import { useRef, useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { signalCategories as genomeCategories } from "./GenomeVisual";
import StrengthRing from "./StrengthRing";

const getPredictiveLevel = (pct: number) => {
  if (pct >= 70) return { label: "High", color: "#22c55e", bgColor: "rgba(34,197,94,0.08)" };
  if (pct >= 40) return { label: "Medium", color: "#f59e0b", bgColor: "rgba(245,158,11,0.08)" };
  return { label: "Low", color: "#64748b", bgColor: "rgba(100,116,139,0.08)" };
};

// Simulate which genome signals this leader has (subset per person)
const leaderGenomeMap: Record<string, number[]> = {
  executive: [0, 1, 5],
  strategic: [0, 1],
  voice: [0, 1],
  transformation: [0, 2],
  people: [0, 1, 3],
};

const LeaderGenomeExplorer = ({ firstName }: { firstName: string }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const categoryRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const subSignalRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const [lines, setLines] = useState<{ path: string; color: string; key: string }[]>([]);

  const activeCategories = genomeCategories.filter(cat => leaderGenomeMap[cat.id]);

  const updateLines = useCallback(() => {
    if (!containerRef.current) { setLines([]); return; }
    const containerRect = containerRef.current.getBoundingClientRect();
    const newLines: { path: string; color: string; key: string }[] = [];

    activeCategories.forEach(category => {
      const catEl = categoryRefs.current.get(category.id);
      if (!catEl) return;
      const catRect = catEl.getBoundingClientRect();
      const startX = catRect.right - containerRect.left;
      const startY = catRect.top + catRect.height / 2 - containerRect.top;

      const indices = leaderGenomeMap[category.id] || [];
      indices.forEach((origIdx, i) => {
        const subEl = subSignalRefs.current.get(`${category.id}-${i}`);
        if (!subEl) return;
        const subRect = subEl.getBoundingClientRect();
        const endX = subRect.left - containerRect.left;
        const endY = subRect.top + subRect.height / 2 - containerRect.top;
        const midX = startX + (endX - startX) * 0.45;

        newLines.push({
          key: `${category.id}-${i}`,
          path: `M ${startX} ${startY} C ${midX} ${startY}, ${midX} ${endY}, ${endX} ${endY}`,
          color: `${category.color}50`,
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
          {activeCategories.map(category => {
            const indices = leaderGenomeMap[category.id] || [];
            const activeSubSignals = indices.map(idx => category.subSignals[idx]).filter(Boolean);
            if (activeSubSignals.length === 0) return null;

            return (
              <div key={category.id} className="flex items-center gap-0">
                {/* Left: category node */}
                <div className="w-56 flex-shrink-0">
                  <div
                    ref={el => { if (el) categoryRefs.current.set(category.id, el); }}
                    className="flex flex-col items-center px-4 py-5 rounded-xl border border-border/40 shadow-sm"
                    style={{
                      background: `linear-gradient(135deg, ${category.color}20 0%, ${category.color}08 40%, white 75%)`,
                    }}
                  >
                    <div className="mb-2">
                      <StrengthRing value={category.strength} color={category.color} size={56} strokeWidth={4} />
                    </div>
                    {(() => {
                      const level = getPredictiveLevel(category.strength);
                      return (
                        <span
                          className="text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full mb-2"
                          style={{ backgroundColor: level.bgColor, color: level.color }}
                        >
                          {level.label}
                        </span>
                      );
                    })()}
                    <span className="font-semibold text-foreground text-xs text-center leading-tight">{category.name}</span>
                  </div>
                </div>

                {/* Gap for connection lines */}
                <div className="flex-shrink-0" style={{ width: "48px" }} />

                {/* Right: sub-signals */}
                <div className="flex-1 min-w-0 space-y-2">
                  {activeSubSignals.map((subSignal, idx) => {
                    const level = getPredictiveLevel(subSignal.predictiveStrength);
                    return (
                      <div
                        key={idx}
                        ref={el => { if (el) subSignalRefs.current.set(`${category.id}-${idx}`, el); }}
                        className="relative flex items-center gap-3 px-4 py-3 rounded-xl bg-white border border-border/50 shadow-sm overflow-hidden"
                      >
                        <div
                          className="absolute inset-0 pointer-events-none"
                          style={{ background: `linear-gradient(270deg, ${category.color}0c 0%, transparent 60%)` }}
                        />
                        <div className="flex-shrink-0">
                          <StrengthRing value={subSignal.predictiveStrength} color={category.color} size={40} strokeWidth={3} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h5 className="font-medium text-sm text-foreground truncate">{subSignal.name}</h5>
                          <p className="text-xs text-muted-foreground truncate">{subSignal.description}</p>
                        </div>
                        <span
                          className="text-[10px] font-semibold px-2.5 py-1 rounded-full flex-shrink-0"
                          style={{ backgroundColor: level.bgColor, color: level.color }}
                        >
                          {level.label}
                        </span>
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
