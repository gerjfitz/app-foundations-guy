import { useRef, useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Signal } from "lucide-react";
import { signalCategories as genomeCategories } from "./GenomeVisual";
import { cn } from "@/lib/utils";

// Simulate which genome sub-signals (by index within the category) this leader demonstrates
const leaderGenomeMap: Record<string, number[]> = {
  executive: [0, 1, 5],
  strategic: [0, 1],
  voice: [0, 1],
  transformation: [0, 2],
  people: [0, 1, 3],
};

type ViewOption = "ring" | "number" | "icon";

// Ring showing demonstrated/total as a fraction
const CountRing = ({
  demonstrated,
  total,
  color,
  size = 96,
  strokeWidth = 5,
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

// Option 2: Number with subtle bg + small signal icon above
const NumberBadge = ({
  demonstrated,
  total,
  color,
  hasAny,
}: { demonstrated: number; total: number; color: string; hasAny: boolean }) => (
  <div
    className="flex flex-col items-center justify-center rounded-full"
    style={{
      width: 96,
      height: 96,
      backgroundColor: hasAny ? `${color}18` : "transparent",
      border: `1px solid ${hasAny ? `${color}33` : "hsl(var(--border))"}`,
    }}
  >
    <Signal
      className="mb-0.5"
      size={16}
      style={{ color: hasAny ? color : "#94a3b8" }}
    />
    <span
      className="font-bold tabular-nums leading-none"
      style={{ color: hasAny ? color : "#64748b", fontSize: 36 }}
    >
      {demonstrated}
    </span>
    <span className="text-[10px] font-medium mt-0.5" style={{ color: hasAny ? color : "#94a3b8", opacity: 0.7 }}>
      of {total}
    </span>
  </div>
);

// Option 3: Just a large styled signal icon
const IconBadge = ({ color, hasAny }: { color: string; hasAny: boolean }) => (
  <div
    className="flex items-center justify-center rounded-full"
    style={{
      width: 96,
      height: 96,
      background: hasAny
        ? `linear-gradient(135deg, ${color}30 0%, ${color}10 100%)`
        : "transparent",
      border: `1px solid ${hasAny ? `${color}40` : "hsl(var(--border))"}`,
      boxShadow: hasAny ? `0 4px 16px -4px ${color}40` : "none",
    }}
  >
    <Signal size={44} strokeWidth={1.75} style={{ color: hasAny ? color : "#94a3b8" }} />
  </div>
);

const LeaderGenomeExplorer = ({ firstName }: { firstName: string }) => {
  const [view, setView] = useState<ViewOption>("ring");
  const containerRef = useRef<HTMLDivElement>(null);
  const categoryRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const subSignalRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const [lines, setLines] = useState<{ path: string; color: string; key: string; faded: boolean }[]>([]);

  const updateLines = useCallback(() => {
    if (!containerRef.current) { setLines([]); return; }
    const containerRect = containerRef.current.getBoundingClientRect();
    const newLines: { path: string; color: string; key: string; faded: boolean }[] = [];

    genomeCategories.filter(c => c.id !== "anti-patterns").forEach(category => {
      const demonstratedIndices = leaderGenomeMap[category.id] || [];
      const catEl = categoryRefs.current.get(category.id);
      if (!catEl) return;
      const catRect = catEl.getBoundingClientRect();
      const startX = catRect.right - containerRect.left;
      const startY = catRect.top + catRect.height / 2 - containerRect.top;

      category.subSignals.forEach((_, idx) => {
        const subEl = subSignalRefs.current.get(`${category.id}-${idx}`);
        if (!subEl) return;
        const isDemo = demonstratedIndices.includes(idx);
        const subRect = subEl.getBoundingClientRect();
        const endX = subRect.left - containerRect.left;
        const endY = subRect.top + subRect.height / 2 - containerRect.top;
        const midX = startX + (endX - startX) * 0.45;

        newLines.push({
          key: `${category.id}-${idx}`,
          path: `M ${startX} ${startY} C ${midX} ${startY}, ${midX} ${endY}, ${endX} ${endY}`,
          color: isDemo ? `${category.color}80` : `${category.color}55`,
          faded: !isDemo,
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
  }, [updateLines, view]);

  const visibleCategories = genomeCategories.filter(c => c.id !== "anti-patterns");

  const viewOptions: { id: ViewOption; label: string }[] = [
    { id: "ring", label: "Ring" },
    { id: "number", label: "Number" },
    { id: "icon", label: "Icon" },
  ];

  return (
    <div>
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h3 className="font-bold text-foreground text-lg">Genome Signals</h3>
          <p className="text-sm text-muted-foreground">The genome makeup for {firstName}</p>
        </div>
        <div className="flex items-center gap-1 p-1 rounded-lg bg-muted/60 border border-border/50">
          {viewOptions.map(opt => (
            <button
              key={opt.id}
              onClick={() => setView(opt.id)}
              className={cn(
                "px-3 py-1.5 text-xs font-semibold rounded-md transition-colors",
                view === opt.id
                  ? "bg-white text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="relative" ref={containerRef}>
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" style={{ overflow: "visible" }}>
          {lines.map((line, idx) => (
            <motion.path
              key={line.key}
              d={line.path}
              fill="none"
              stroke={line.color}
              strokeWidth={line.faded ? 1.5 : 2.5}
              strokeLinecap="round"
              strokeDasharray={line.faded ? "4 4" : undefined}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: line.faded ? 0.5 : 1 }}
              transition={{ duration: 0.5, delay: 0.1 + idx * 0.03, ease: [0.25, 0.1, 0.25, 1] }}
            />
          ))}
        </svg>

        <div className="space-y-8">
          {visibleCategories.map(category => {
            const demonstratedIndices = leaderGenomeMap[category.id] || [];
            const demonstratedCount = demonstratedIndices.length;
            const total = category.subSignals.length;
            const hasAny = demonstratedCount > 0;

            // Sort: demonstrated first, then non-demonstrated
            const orderedSubSignals = category.subSignals
              .map((s, idx) => ({ s, idx, isDemo: demonstratedIndices.includes(idx) }))
              .sort((a, b) => Number(b.isDemo) - Number(a.isDemo));

            return (
              <div key={category.id} className="flex items-center gap-0">
                <div className="w-56 flex-shrink-0">
                  <div
                    ref={el => { if (el) categoryRefs.current.set(category.id, el); }}
                    className="flex flex-col items-center px-4 py-5 rounded-xl border border-border/40 shadow-sm"
                    style={{
                      background: hasAny
                        ? `linear-gradient(135deg, ${category.color}20 0%, ${category.color}08 40%, white 75%)`
                        : "white",
                      opacity: hasAny ? 1 : 0.55,
                    }}
                  >
                    <div className="mb-3">
                      {view === "ring" && (
                        <CountRing
                          demonstrated={demonstratedCount}
                          total={total}
                          color={hasAny ? category.color : "#94a3b8"}
                        />
                      )}
                      {view === "number" && (
                        <NumberBadge
                          demonstrated={demonstratedCount}
                          total={total}
                          color={category.color}
                          hasAny={hasAny}
                        />
                      )}
                      {view === "icon" && (
                        <IconBadge color={category.color} hasAny={hasAny} />
                      )}
                    </div>
                    <span className="font-semibold text-foreground text-xs text-center leading-tight">{category.name}</span>
                  </div>
                </div>

                <div className="flex-shrink-0" style={{ width: "48px" }} />

                <div className="flex-1 min-w-0 space-y-2">
                  {orderedSubSignals.map(({ s: subSignal, idx, isDemo }) => (
                    <div
                      key={idx}
                      ref={el => { if (el) subSignalRefs.current.set(`${category.id}-${idx}`, el); }}
                      className="relative flex items-center gap-3 px-4 py-3 rounded-xl bg-white border shadow-sm overflow-hidden"
                      style={{
                        borderColor: isDemo ? `${category.color}55` : "hsl(var(--border) / 0.6)",
                        opacity: isDemo ? 1 : 0.85,
                      }}
                    >
                      {isDemo && (
                        <div
                          className="absolute inset-0 pointer-events-none"
                          style={{ background: `linear-gradient(270deg, ${category.color}10 0%, transparent 60%)` }}
                        />
                      )}
                      <div className="flex-shrink-0 relative z-10">
                        <div
                          className="w-2.5 h-2.5 rounded-full"
                          style={{
                            backgroundColor: isDemo ? category.color : "transparent",
                            border: isDemo ? "none" : "1.5px solid hsl(var(--border))",
                          }}
                        />
                      </div>
                      <div className="flex-1 min-w-0 relative z-10">
                        <h5 className="font-medium text-sm text-foreground truncate">{subSignal.name}</h5>
                        <p className="text-xs text-muted-foreground truncate">{subSignal.description}</p>
                      </div>
                    </div>
                  ))}
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
