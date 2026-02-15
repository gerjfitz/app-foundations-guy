import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import { signalCategories } from "./GenomeVisual";
import StrengthRing from "./StrengthRing";

const getPredictiveLevel = (pct: number) => {
  if (pct >= 70) return { label: "High", color: "#22c55e", bgColor: "rgba(34,197,94,0.08)" };
  if (pct >= 40) return { label: "Medium", color: "#f59e0b", bgColor: "rgba(245,158,11,0.08)" };
  return { label: "Low", color: "#64748b", bgColor: "rgba(100,116,139,0.08)" };
};

const SignalExplorer = () => {
  // Only first category expanded by default
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(signalCategories.length > 0 ? [signalCategories[0].id] : [])
  );
  const [lines, setLines] = useState<{ path: string; color: string; key: string }[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const categoryRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const behaviorRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
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

        const controlX1 = startX + 50;
        const controlX2 = endX - 50;

        newLines.push({
          key: `${categoryId}-${idx}`,
          path: `M ${startX} ${startY} C ${controlX1} ${startY}, ${controlX2} ${endY}, ${endX} ${endY}`,
          color: `${category.color}55`,
        });
      });
    });

    setLines(newLines);
  }, [expandedCategories]);

  useEffect(() => {
    const timer = setTimeout(updateLines, 120);
    const resizeTimer = setTimeout(updateLines, 350);
    window.addEventListener('resize', updateLines);
    return () => {
      clearTimeout(timer);
      clearTimeout(resizeTimer);
      window.removeEventListener('resize', updateLines);
    };
  }, [updateLines]);

  return (
    <div className="relative" ref={containerRef}>

      {/* Vertical list */}
      <div className="space-y-8">
        {signalCategories.map((category) => {
          const isExpanded = expandedCategories.has(category.id);
          
          return (
            <motion.div 
              key={category.id}
              layout
              transition={{ layout: { duration: 0.35, ease: [0.25, 0.1, 0.25, 1] } }}
            >
              <div className={cn("flex gap-0", isExpanded ? "items-start" : "items-center")}>
                {/* Left: category trigger */}
                <motion.div 
                  className="w-72 flex-shrink-0 pt-1"
                  layout="position"
                  transition={{ layout: { duration: 0.35, ease: [0.25, 0.1, 0.25, 1] } }}
                >
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
                        animate={{ rotate: isExpanded ? 90 : 0 }}
                        transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
                      >
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </motion.div>
                    </div>

                    {/* Strength Ring */}
                    <div className="mb-2">
                      <StrengthRing
                        value={category.strength}
                        color={category.color}
                        size={72}
                        strokeWidth={5}
                      />
                    </div>

                    {/* Predictive level pill */}
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

                    {/* Title */}
                    <span className="font-semibold text-foreground text-sm text-center leading-tight">{category.name}</span>

                    {/* Description */}
                    <p className="text-[11px] text-muted-foreground text-center leading-relaxed mt-2 px-1">
                      {category.description}
                    </p>
                  </div>
                </motion.div>

                {/* Connector line */}
                <div 
                  className="flex items-center flex-shrink-0" 
                  style={{ width: '40px', ...(isExpanded ? { marginTop: '80px' } : {}) }}
                >
                  <div 
                    className="w-full h-[2px] rounded-full transition-colors duration-300"
                    style={{ backgroundColor: `${category.color}${isExpanded ? '40' : '20'}` }}
                  />
                </div>

                {/* Right: sub-signals or collapsed summary */}
                <div className={cn("flex-1 min-w-0", isExpanded && "pt-1")}>
                  <AnimatePresence mode="wait" initial={false}>
                    {isExpanded ? (
                      <motion.div
                        key={`expanded-${category.id}`}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ 
                          height: { duration: 0.35, ease: [0.25, 0.1, 0.25, 1] },
                          opacity: { duration: 0.2, delay: 0.05 },
                        }}
                        className="overflow-hidden"
                      >
                        <div className="space-y-2.5 py-1">
                          {category.subSignals.map((subSignal, idx) => {
                            const level = getPredictiveLevel(subSignal.predictiveStrength);
                            return (
                              <motion.div
                                key={idx}
                                ref={el => { if (el) behaviorRefs.current.set(`${category.id}-${idx}`, el); }}
                                initial={{ opacity: 0, x: 12 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.25, delay: idx * 0.04 }}
                                className="relative flex items-center gap-4 px-5 py-4 rounded-xl bg-white border border-border/50 shadow-sm overflow-hidden"
                              >
                                {/* Subtle gradient accent from right */}
                                <div
                                  className="absolute inset-0 pointer-events-none"
                                  style={{
                                    background: `linear-gradient(270deg, ${category.color}0c 0%, transparent 60%)`,
                                  }}
                                />
                                {/* Strength Ring */}
                                <div className="flex-shrink-0">
                                  <StrengthRing
                                    value={subSignal.predictiveStrength}
                                    color={category.color}
                                    size={52}
                                    strokeWidth={4}
                                  />
                                </div>

                                {/* Signal info */}
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-semibold text-sm text-foreground truncate">{subSignal.name}</h4>
                                  <p className="text-xs text-muted-foreground truncate">{subSignal.description}</p>
                                </div>

                                {/* Predictive level badge */}
                                <span
                                  className="text-[11px] font-semibold px-3 py-1.5 rounded-full flex-shrink-0"
                                  style={{ backgroundColor: level.bgColor, color: level.color }}
                                >
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
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ 
                          height: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] },
                          opacity: { duration: 0.2, delay: 0.05 },
                        }}
                        className="overflow-hidden"
                      >
                        <div className="py-1">
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
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default SignalExplorer;
