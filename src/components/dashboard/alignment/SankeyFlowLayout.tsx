import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { alignmentData, genomeCategoryColors, allGenomeCategories, evidenceQuotes } from "./alignmentData";

const SankeyFlowLayout = () => {
  const [hoveredFlow, setHoveredFlow] = useState<string | null>(null);

  // Compute vertical positions for left & right nodes
  const leftHeight = 360;
  const rightHeight = 360;
  const leftGap = leftHeight / alignmentData.length;
  const rightGap = rightHeight / allGenomeCategories.length;

  const flows = useMemo(() => {
    const result: {
      key: string;
      fromY: number;
      toY: number;
      strength: number;
      color: string;
      principleId: string;
      principleName: string;
      category: string;
    }[] = [];

    alignmentData.forEach((item, fi) => {
      item.mappings.forEach((m) => {
        const ti = allGenomeCategories.indexOf(m.category);
        if (ti >= 0) {
          result.push({
            key: `${item.id}-${m.category}`,
            fromY: fi * leftGap + leftGap / 2,
            toY: ti * rightGap + rightGap / 2,
            strength: m.strength,
            color: item.color,
            principleId: item.id,
            principleName: item.name,
            category: m.category,
          });
        }
      });
    });
    return result;
  }, [leftGap, rightGap]);

  const svgWidth = 300;

  return (
    <div className="flex items-start gap-0 justify-center">
      {/* Left labels */}
      <div className="flex flex-col flex-shrink-0 w-[140px]" style={{ height: leftHeight }}>
        {alignmentData.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="flex items-center gap-2 justify-end pr-3 cursor-pointer"
            style={{ height: leftGap, opacity: hoveredFlow && !flows.some(f => f.principleId === item.id && f.key === hoveredFlow) && hoveredFlow ? 0.3 : 1 }}
            onMouseEnter={() => {
              const first = flows.find(f => f.principleId === item.id);
              if (first) setHoveredFlow(first.key);
            }}
            onMouseLeave={() => setHoveredFlow(null)}
          >
            <span className="text-xs font-semibold text-foreground text-right">{item.name}</span>
            <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
          </motion.div>
        ))}
      </div>

      {/* SVG flows */}
      <svg width={svgWidth} height={Math.max(leftHeight, rightHeight)} className="flex-shrink-0">
        {flows.map((flow) => {
          const bandWidth = 2 + (flow.strength / 100) * 16;
          const isActive = !hoveredFlow || hoveredFlow === flow.key;

          return (
            <motion.path
              key={flow.key}
              d={`M 0 ${flow.fromY} C ${svgWidth * 0.4} ${flow.fromY}, ${svgWidth * 0.6} ${flow.toY}, ${svgWidth} ${flow.toY}`}
              fill="none"
              stroke={flow.color}
              strokeWidth={bandWidth}
              strokeOpacity={isActive ? 0.25 + (flow.strength / 100) * 0.35 : 0.06}
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="cursor-pointer"
              onMouseEnter={() => setHoveredFlow(flow.key)}
              onMouseLeave={() => setHoveredFlow(null)}
            />
          );
        })}
      </svg>

      {/* Right labels */}
      <div className="flex flex-col flex-shrink-0 w-[180px]" style={{ height: rightHeight }}>
        {allGenomeCategories.map((cat, i) => {
          const catColor = genomeCategoryColors[cat] || "#94a3b8";
          return (
            <motion.div
              key={cat}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center gap-2 pl-3"
              style={{ height: rightGap }}
            >
              <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: catColor }} />
              <span className="text-[11px] font-medium text-foreground truncate">{cat}</span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default SankeyFlowLayout;
