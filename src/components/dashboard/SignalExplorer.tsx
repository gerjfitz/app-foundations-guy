import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Activity, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { signalCategories } from "./GenomeVisual";
import StrengthRing from "./StrengthRing";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const getPredictiveLevel = (pct: number) => {
  if (pct >= 70) return { label: "High", color: "#22c55e", bgColor: "rgba(34,197,94,0.08)" };
  if (pct >= 40) return { label: "Medium", color: "#f59e0b", bgColor: "rgba(245,158,11,0.08)" };
  return { label: "Low", color: "#64748b", bgColor: "rgba(100,116,139,0.08)" };
};

/* ── C-LEAD behaviour mapping to genome sub-signals ── */
const cleadBehaviors = [
  { id: "collaborate", name: "Collaborate", color: "#3b82f6", description: "Leaders who build cross-functional relationships and drive alignment across teams, fostering trust and shared purpose." },
  { id: "learn", name: "Learn", color: "#8b5cf6", description: "Leaders who actively seek growth, mentor others, and create environments where continuous development is valued." },
  { id: "execute", name: "Execute", color: "#f97316", description: "Leaders who translate strategy into measurable outcomes, driving accountability and operational excellence." },
  { id: "accelerate", name: "Accelerate", color: "#10b981", description: "Leaders who identify opportunities to scale impact, remove friction, and speed up value delivery." },
  { id: "disrupt", name: "Disrupt", color: "#ec4899", description: "Leaders who challenge the status quo, introduce bold ideas, and reshape how the organisation thinks and operates." },
] as const;

// Maps: genomeCategory-subSignalIndex → C-LEAD behavior ids
const cleadMapping: Record<string, string[]> = {
  "executive-0": ["collaborate"],
  "executive-1": ["accelerate"],
  "executive-2": [],
  "executive-3": ["execute"],
  "executive-4": [],
  "executive-5": ["collaborate"],
  "strategic-0": ["execute", "disrupt"],
  "strategic-1": [],
  "strategic-2": ["accelerate"],
  "strategic-3": ["disrupt"],
  "strategic-4": [],
  "voice-0": ["disrupt"],
  "voice-1": [],
  "voice-2": ["collaborate"],
  "voice-3": ["accelerate"],
  "voice-4": [],
  "transformation-0": ["execute", "accelerate"],
  "transformation-1": [],
  "transformation-2": ["execute"],
  "transformation-3": ["learn"],
  "transformation-4": [],
  "people-0": ["learn"],
  "people-1": ["learn", "collaborate"],
  "people-2": [],
  "people-3": ["learn"],
  "people-4": [],
  "anti-patterns-0": [],
  "anti-patterns-6": [],
};

/* Helper: get all genome sub-signals mapped to a given C-LEAD behavior */
const getSignalsForBehavior = (behaviorId: string) => {
  const results: { categoryName: string; categoryColor: string; signalName: string; strength: number }[] = [];
  Object.entries(cleadMapping).forEach(([key, ids]) => {
    if (!ids.includes(behaviorId)) return;
    const [catId, idxStr] = [key.substring(0, key.lastIndexOf("-")), key.substring(key.lastIndexOf("-") + 1)];
    const category = signalCategories.find(c => c.id === catId);
    if (!category) return;
    const idx = parseInt(idxStr, 10);
    const sub = category.subSignals[idx];
    if (!sub) return;
    results.push({ categoryName: category.name, categoryColor: category.color, signalName: sub.name, strength: sub.predictiveStrength });
  });
  return results;
};

interface SignalExplorerProps {
  showCleadMapping?: boolean;
}

const SignalExplorer = ({ showCleadMapping = false }: SignalExplorerProps) => {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(signalCategories.length > 0 ? [signalCategories[0].id] : [])
  );
  const [lines, setLines] = useState<{ path: string; color: string; key: string }[]>([]);
  const [selectedBehavior, setSelectedBehavior] = useState<typeof cleadBehaviors[number] | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const categoryRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const behaviorRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  const toggleCategory = (categoryId: string) => {
    // Clear all lines immediately to prevent stale paths
    setLines([]);
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
        // Also clean up stale behavior refs for this category
        const category = signalCategories.find(c => c.id === categoryId);
        if (category) {
          category.subSignals.forEach((_, idx) => {
            behaviorRefs.current.delete(`${categoryId}-${idx}`);
          });
        }
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  const updateLines = useCallback(() => {
    if (!containerRef.current || expandedCategories.size === 0) {
      setLines([]);
      return;
    }

    const containerRect = containerRef.current.getBoundingClientRect();
    const newLines: { path: string; color: string; key: string }[] = [];

    expandedCategories.forEach(categoryId => {
      const category = signalCategories.find(c => c.id === categoryId);
      const categoryEl = categoryRefs.current.get(categoryId);
      
      if (!category || !categoryEl) return;

      const categoryRect = categoryEl.getBoundingClientRect();
      const startX = categoryRect.right - containerRect.left;
      const startY = categoryRect.top + categoryRect.height / 2 - containerRect.top;

      category.subSignals.forEach((_, idx) => {
        const behaviorEl = behaviorRefs.current.get(`${categoryId}-${idx}`);
        if (!behaviorEl) return;

        const behaviorRect = behaviorEl.getBoundingClientRect();
        const endX = behaviorRect.left - containerRect.left;
        const endY = behaviorRect.top + behaviorRect.height / 2 - containerRect.top;

        const midX = startX + (endX - startX) * 0.45;

        newLines.push({
          key: `${categoryId}-${idx}`,
          path: `M ${startX} ${startY} C ${midX} ${startY}, ${midX} ${endY}, ${endX} ${endY}`,
          color: `${category.color}50`,
        });
      });
    });

    setLines(newLines);
  }, [expandedCategories]);

  useEffect(() => {
    // Delay line calculation to allow expand animation to settle
    const timer = setTimeout(updateLines, 300);
    const resizeTimer = setTimeout(updateLines, 500);
    window.addEventListener('resize', updateLines);
    return () => {
      clearTimeout(timer);
      clearTimeout(resizeTimer);
      window.removeEventListener('resize', updateLines);
    };
  }, [updateLines]);

  return (
    <div className="relative" ref={containerRef}>
      {/* SVG ribbon connections */}
      <svg 
        className="absolute inset-0 w-full h-full pointer-events-none z-10" 
        style={{ overflow: 'visible' }}
      >
        {lines.map((line, idx) => (
          <motion.path
            key={line.key}
            d={line.path}
            fill="none"
            stroke={line.color}
            strokeWidth="3"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.15 + idx * 0.06, ease: [0.25, 0.1, 0.25, 1] }}
          />
        ))}
      </svg>

      {/* Vertical list */}
      <div className="space-y-8">
        {signalCategories.map((category) => {
          const isExpanded = expandedCategories.has(category.id);
          
          return (
            <div key={category.id}>
              <div className="flex items-center gap-0">
                {/* Left: category card */}
                <div className="w-72 flex-shrink-0">
                  <div
                    ref={el => { if (el) categoryRefs.current.set(category.id, el); }}
                    onClick={() => toggleCategory(category.id)}
                    className="flex flex-col items-center px-4 py-5 rounded-xl cursor-pointer transition-shadow shadow-sm hover:shadow-md border border-border/40 relative"
                    style={{
                      background: `linear-gradient(135deg, ${category.color}20 0%, ${category.color}08 40%, white 75%)`,
                    }}
                  >
                    {/* Expand arrow */}
                    <div className="absolute top-3 right-3">
                      <motion.div
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                      >
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      </motion.div>
                    </div>

                    <div className="mb-2">
                      <StrengthRing
                        value={category.strength}
                        color={category.color}
                        size={72}
                        strokeWidth={5}
                      />
                    </div>

                    {(() => {
                      const level = getPredictiveLevel(category.strength);
                      return (
                        <span
                          className="text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full mb-3"
                          style={{ backgroundColor: level.bgColor, color: level.color }}
                        >
                          {level.label}
                        </span>
                      );
                    })()}

                    <span className="font-semibold text-foreground text-sm text-center leading-tight">{category.name}</span>
                    <p className="text-[11px] text-muted-foreground text-center leading-relaxed mt-2 px-1">
                      {category.description}
                    </p>
                  </div>
                </div>

                {/* Gap / connector between left card and right panel */}
                <div className="flex-shrink-0 flex items-center justify-center" style={{ width: '48px' }}>
                  {!isExpanded && (
                    <div 
                      className="w-full border-t-2 border-dashed rounded-full"
                      style={{ borderColor: `${category.color}30` }}
                    />
                  )}
                </div>

                {/* Right: sub-signals or collapsed summary */}
                <div className="flex-1 min-w-0">
                  <AnimatePresence mode="wait" initial={false}>
                    {isExpanded ? (
                      <motion.div
                        key={`expanded-${category.id}`}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ 
                          height: { duration: 0.35, ease: [0.25, 0.1, 0.25, 1] },
                          opacity: { duration: 0.25, delay: 0.05 },
                        }}
                        className="overflow-hidden"
                        onAnimationComplete={() => {
                          // Recalculate lines after expand animation completes
                          setTimeout(updateLines, 50);
                        }}
                      >
                        <div className="space-y-2.5">
                          {category.subSignals.map((subSignal, idx) => {
                            const level = getPredictiveLevel(subSignal.predictiveStrength);
                            const mappingKey = `${category.id}-${idx}`;
                            const mappedBehaviors = showCleadMapping ? (cleadMapping[mappingKey] || []) : [];
                            const matchedBehaviors = mappedBehaviors.map(id => cleadBehaviors.find(b => b.id === id)).filter(Boolean);

                            return (
                              <motion.div
                                key={idx}
                                ref={el => { if (el) behaviorRefs.current.set(`${category.id}-${idx}`, el); }}
                                initial={{ opacity: 0, x: 16 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3, delay: 0.1 + idx * 0.05, ease: [0.25, 0.1, 0.25, 1] }}
                                className="relative flex items-center gap-4 px-5 py-4 rounded-xl bg-white border border-border/50 shadow-sm overflow-hidden"
                              >
                                <div
                                  className="absolute inset-0 pointer-events-none"
                                  style={{
                                    background: `linear-gradient(270deg, ${category.color}0c 0%, transparent 60%)`,
                                  }}
                                />
                                <div className="flex-shrink-0">
                                  <StrengthRing
                                    value={subSignal.predictiveStrength}
                                    color={category.color}
                                    size={52}
                                    strokeWidth={4}
                                  />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-semibold text-sm text-foreground truncate">{subSignal.name}</h4>
                                  <div className="flex items-center gap-2">
                                    <p className="text-xs text-muted-foreground truncate">{subSignal.description}</p>
                                  </div>
                                  {/* C-LEAD pills */}
                                  <AnimatePresence>
                                    {matchedBehaviors.length > 0 && (
                                      <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="flex items-center gap-1.5 mt-3"
                                      >
                                        {matchedBehaviors.map(behavior => (
                                          <button
                                            key={behavior!.id}
                                            onClick={(e) => { e.stopPropagation(); setSelectedBehavior(behavior!); }}
                                            className="text-[11px] font-semibold px-3 py-1.5 rounded-full border cursor-pointer hover:opacity-80 transition-opacity"
                                            style={{
                                              color: behavior!.color,
                                              backgroundColor: `${behavior!.color}10`,
                                              borderColor: `${behavior!.color}25`,
                                            }}
                                          >
                                            {behavior!.name}
                                          </button>
                                        ))}
                                      </motion.div>
                                    )}
                                  </AnimatePresence>
                                </div>
                                <span className="text-[11px] font-medium text-muted-foreground flex-shrink-0">
                                  {level.label}
                                </span>
                              </motion.div>
                            );
                          })}
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        key={`collapsed-${category.id}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div 
                          className="rounded-xl border border-dashed border-border/40 px-6 py-5 flex items-center gap-4 cursor-pointer hover:border-border/60 transition-colors"
                          onClick={() => toggleCategory(category.id)}
                          style={{
                            background: `linear-gradient(135deg, ${category.color}04 0%, transparent 100%)`,
                          }}
                        >
                          <div 
                            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                            style={{ backgroundColor: `${category.color}10` }}
                          >
                            <Activity className="w-4 h-4" style={{ color: category.color }} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-muted-foreground">
                              <span className="font-medium text-foreground">{category.subSignals.length} signals</span>
                              {' · '}
                              {category.subSignals.slice(0, 3).map(s => s.name).join(', ')}
                              {category.subSignals.length > 3 && ` +${category.subSignals.length - 3} more`}
                            </p>
                          </div>
                          <span className="text-xs text-muted-foreground/60">Click to expand</span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* C-LEAD behavior detail dialog */}
      <Dialog open={!!selectedBehavior} onOpenChange={(open) => { if (!open) setSelectedBehavior(null); }}>
        <DialogContent className="sm:max-w-lg p-0 overflow-hidden">
          {selectedBehavior && (() => {
            const mappedSignals = getSignalsForBehavior(selectedBehavior.id);
            return (
              <>
                {/* Visual header with connected pills */}
                <div className="px-6 pt-6 pb-4">
                  <div className="flex items-center justify-center gap-0 mb-5">
                    {/* Cisco behaviour pill */}
                    <div
                      className="flex items-center gap-2 px-4 py-2 rounded-full border-2 font-semibold text-sm z-10 bg-white"
                      style={{ color: selectedBehavior.color, borderColor: selectedBehavior.color }}
                    >
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: selectedBehavior.color }} />
                      {selectedBehavior.name}
                    </div>
                    {/* SVG connector */}
                    <svg width="60" height="24" viewBox="0 0 60 24" className="flex-shrink-0 -mx-1">
                      <line x1="0" y1="12" x2="60" y2="12" stroke="currentColor" strokeWidth="1.5" className="text-border" strokeDasharray="4 3" />
                      <circle cx="30" cy="12" r="4" fill="currentColor" className="text-muted-foreground/40" />
                    </svg>
                    {/* Genome signal pill - gradient */}
                    <div
                      className="flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-sm text-white z-10 border-0"
                      style={{
                        background: "linear-gradient(135deg, #6366f1, #8b5cf6, #a855f7)",
                        boxShadow: "0 2px 8px rgba(99,102,241,0.25)",
                      }}
                    >
                      <Activity className="w-3.5 h-3.5 text-white/80" />
                      Genome
                    </div>
                  </div>

                  {/* Single combined summary */}
                  <p className="text-sm text-muted-foreground leading-relaxed text-center">
                    {selectedBehavior.description} This behaviour maps to <span className="font-medium text-foreground">{mappedSignals.length}</span> genome signal{mappedSignals.length !== 1 ? 's' : ''} that predict this capability from observed leadership patterns.
                  </p>
                </div>

                {/* Signal list */}
                <div className="px-6 pb-6">
                  <div className="space-y-2">
                    {mappedSignals.map((sig, i) => {
                      const level = getPredictiveLevel(sig.strength);
                      return (
                        <div
                          key={i}
                          className="flex items-center gap-3 px-4 py-3 rounded-xl border border-border/40 bg-muted/20"
                        >
                          <div
                            className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                            style={{ backgroundColor: sig.categoryColor }}
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">{sig.signalName}</p>
                            <p className="text-xs text-muted-foreground truncate">{sig.categoryName}</p>
                          </div>
                          <span
                            className="text-[11px] font-semibold px-3 py-1.5 rounded-full flex-shrink-0"
                            style={{ backgroundColor: level.bgColor, color: level.color }}
                          >
                            {level.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            );
          })()}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SignalExplorer;
