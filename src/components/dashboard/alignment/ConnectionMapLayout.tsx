import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { alignmentData, genomeCategoryColors, allGenomeCategories, evidenceQuotes } from "./alignmentData";

const ConnectionMapLayout = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredPrinciple, setHoveredPrinciple] = useState<string | null>(null);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [positions, setPositions] = useState<{ left: DOMRect[]; right: DOMRect[] }>({ left: [], right: [] });
  const leftRefs = useRef<(HTMLDivElement | null)[]>([]);
  const rightRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const update = () => {
      const container = containerRef.current;
      if (!container) return;
      const cRect = container.getBoundingClientRect();
      setPositions({
        left: leftRefs.current.map((el) => {
          if (!el) return new DOMRect();
          const r = el.getBoundingClientRect();
          return new DOMRect(r.x - cRect.x, r.y - cRect.y, r.width, r.height);
        }),
        right: rightRefs.current.map((el) => {
          if (!el) return new DOMRect();
          const r = el.getBoundingClientRect();
          return new DOMRect(r.x - cRect.x, r.y - cRect.y, r.width, r.height);
        }),
      });
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // Build connections
  const connections: { fromIdx: number; toIdx: number; strength: number; color: string; principleId: string; category: string }[] = [];
  alignmentData.forEach((item, fi) => {
    item.mappings.forEach((m) => {
      const ti = allGenomeCategories.indexOf(m.category);
      if (ti >= 0) {
        connections.push({ fromIdx: fi, toIdx: ti, strength: m.strength, color: item.color, principleId: item.id, category: m.category });
      }
    });
  });

  const activeId = hoveredPrinciple || hoveredCategory;

  return (
    <div ref={containerRef} className="relative flex items-start justify-between gap-4 min-h-[400px]">
      {/* Left: C-LEAD Principles */}
      <div className="flex flex-col gap-3 w-[200px] flex-shrink-0 z-10">
        {alignmentData.map((item, i) => {
          const isActive = !activeId || hoveredPrinciple === item.id || connections.some(c => c.principleId === item.id && hoveredCategory === c.category);
          return (
            <motion.div
              key={item.id}
              ref={(el) => { leftRefs.current[i] = el; }}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="rounded-xl border border-border/50 px-4 py-3 cursor-pointer transition-all"
              style={{
                backgroundColor: isActive ? `${item.color}12` : undefined,
                borderColor: isActive ? `${item.color}40` : undefined,
                opacity: activeId && !isActive ? 0.3 : 1,
              }}
              onMouseEnter={() => setHoveredPrinciple(item.id)}
              onMouseLeave={() => setHoveredPrinciple(null)}
            >
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                <span className="text-sm font-semibold text-foreground">{item.name}</span>
              </div>
              <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed">{item.description}</p>
            </motion.div>
          );
        })}
      </div>

      {/* SVG connections */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
        {connections.map((conn, ci) => {
          const from = positions.left[conn.fromIdx];
          const to = positions.right[conn.toIdx];
          if (!from || !to || from.width === 0) return null;

          const x1 = from.x + from.width;
          const y1 = from.y + from.height / 2;
          const x2 = to.x;
          const y2 = to.y + to.height / 2;
          const cpx = (x1 + x2) / 2;

          const isActive = !activeId || hoveredPrinciple === conn.principleId || hoveredCategory === conn.category;
          const strokeWidth = 1 + (conn.strength / 100) * 3;

          return (
            <motion.path
              key={ci}
              d={`M ${x1} ${y1} C ${cpx} ${y1}, ${cpx} ${y2}, ${x2} ${y2}`}
              fill="none"
              stroke={conn.color}
              strokeWidth={strokeWidth}
              strokeOpacity={activeId && !isActive ? 0.08 : 0.3 + (conn.strength / 100) * 0.4}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.8, delay: ci * 0.05 }}
            />
          );
        })}
      </svg>

      {/* Right: Genome Categories */}
      <div className="flex flex-col gap-3 w-[220px] flex-shrink-0 z-10">
        {allGenomeCategories.map((cat, i) => {
          const catColor = genomeCategoryColors[cat] || "#94a3b8";
          const isActive = !activeId || hoveredCategory === cat || connections.some(c => c.category === cat && hoveredPrinciple === c.principleId);
          return (
            <motion.div
              key={cat}
              ref={(el) => { rightRefs.current[i] = el; }}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="rounded-xl border border-border/50 px-4 py-3 cursor-pointer transition-all"
              style={{
                backgroundColor: isActive ? `${catColor}12` : undefined,
                borderColor: isActive ? `${catColor}40` : undefined,
                opacity: activeId && !isActive ? 0.3 : 1,
              }}
              onMouseEnter={() => setHoveredCategory(cat)}
              onMouseLeave={() => setHoveredCategory(null)}
            >
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: catColor }} />
                <span className="text-xs font-semibold text-foreground">{cat}</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default ConnectionMapLayout;
