import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { signalCategories } from "./GenomeVisual";

const SignalExplorer = () => {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(["executive"]));
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

  // Calculate curved connection lines from category node to each sub-signal
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
      {/* SVG for connection lines */}
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
            strokeWidth="2"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.35, delay: idx * 0.025 }}
          />
        ))}
      </svg>

      {/* Vertical list — each category is a row; when expanded, sub-signals appear beside it */}
      <div className="space-y-3">
        {signalCategories.map((category) => {
          const isExpanded = expandedCategories.has(category.id);
          
          return (
            <div key={category.id}>
              {/* Row: category node on left, sub-signals on right when expanded */}
              <div className={cn("flex gap-12", isExpanded ? "items-center" : "items-start")}>
                {/* Left: category trigger — fixed width */}
                <div className="w-72 flex-shrink-0">
                  <div
                    ref={el => { if (el) categoryRefs.current.set(category.id, el); }}
                    onClick={() => toggleCategory(category.id)}
                    className={cn(
                      "flex items-center justify-between px-4 py-3.5 rounded-xl cursor-pointer border transition-all",
                      isExpanded 
                        ? "bg-white shadow-md border-border" 
                        : "bg-white/50 border-transparent hover:bg-white hover:border-border"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div 
                        className="h-9 w-9 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: `${category.color}15` }}
                      >
                        <div 
                          className="h-3 w-3 rounded-full"
                          style={{ backgroundColor: category.color }}
                        />
                      </div>
                      <span className="font-medium text-foreground text-sm">{category.name}</span>
                    </div>
                    <ChevronDown 
                      className={cn(
                        "h-5 w-5 text-muted-foreground transition-transform duration-300 flex-shrink-0",
                        isExpanded && "rotate-180"
                      )} 
                    />
                  </div>
                </div>

                {/* Right: sub-signals (only when expanded) */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, x: 16 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 16 }}
                      transition={{ duration: 0.25 }}
                      className="flex-1 min-w-0 space-y-2 py-1"
                    >
                      {category.subSignals.map((subSignal, idx) => (
                        <div
                          key={idx}
                          ref={el => { if (el) behaviorRefs.current.set(`${category.id}-${idx}`, el); }}
                          className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white border border-border/50 hover:shadow-md transition-all cursor-pointer"
                        >
                          <div 
                            className="h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0"
                            style={{ backgroundColor: `${category.color}15` }}
                          >
                            <div 
                              className="h-2.5 w-2.5 rounded-full"
                              style={{ backgroundColor: category.color }}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-sm" style={{ color: category.color }}>{subSignal.name}</h4>
                            <p className="text-xs text-muted-foreground truncate">{subSignal.description}</p>
                          </div>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SignalExplorer;
