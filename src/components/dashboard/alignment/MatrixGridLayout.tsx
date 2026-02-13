import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { alignmentData, genomeCategoryColors, allGenomeCategories, evidenceQuotes } from "./alignmentData";

const MatrixGridLayout = () => {
  const [selectedCell, setSelectedCell] = useState<{ principle: string; category: string } | null>(null);

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <div className="min-w-[700px]">
          {/* Header row */}
          <div className="grid gap-1" style={{ gridTemplateColumns: `160px repeat(${allGenomeCategories.length}, 1fr)` }}>
            <div /> {/* empty corner */}
            {allGenomeCategories.map((cat) => {
              const catColor = genomeCategoryColors[cat] || "#94a3b8";
              return (
                <div key={cat} className="text-center px-1 pb-3">
                  <div className="w-2 h-2 rounded-full mx-auto mb-1.5" style={{ backgroundColor: catColor }} />
                  <span className="text-[10px] font-semibold text-muted-foreground leading-tight block">{cat}</span>
                </div>
              );
            })}
          </div>

          {/* Data rows */}
          {alignmentData.map((item, ri) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: ri * 0.05 }}
              className="grid gap-1 mb-1"
              style={{ gridTemplateColumns: `160px repeat(${allGenomeCategories.length}, 1fr)` }}
            >
              {/* Row label */}
              <div className="flex items-center gap-2 pr-3">
                <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                <span className="text-xs font-semibold text-foreground truncate">{item.name}</span>
              </div>

              {/* Cells */}
              {allGenomeCategories.map((cat) => {
                const mapping = item.mappings.find((m) => m.category === cat);
                const strength = mapping?.strength || 0;
                const isSelected = selectedCell?.principle === item.id && selectedCell?.category === cat;

                return (
                  <motion.div
                    key={cat}
                    className="rounded-lg border border-border/30 flex items-center justify-center h-14 cursor-pointer transition-all relative overflow-hidden"
                    style={{
                      backgroundColor: strength > 0 ? `${item.color}${Math.round(8 + (strength / 100) * 25).toString(16).padStart(2, "0")}` : undefined,
                      borderColor: isSelected ? item.color : undefined,
                      boxShadow: isSelected ? `0 0 0 1px ${item.color}40` : undefined,
                    }}
                    whileHover={{ scale: strength > 0 ? 1.05 : 1 }}
                    onClick={() => strength > 0 && setSelectedCell(isSelected ? null : { principle: item.id, category: cat })}
                  >
                    {strength > 0 && (
                      <span className="text-sm font-bold tabular-nums" style={{ color: item.color }}>
                        {strength}
                      </span>
                    )}
                  </motion.div>
                );
              })}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Selected cell evidence */}
      <AnimatePresence>
        {selectedCell && (() => {
          const item = alignmentData.find((d) => d.id === selectedCell.principle);
          const quotes = evidenceQuotes[selectedCell.principle]?.[selectedCell.category] || [];
          if (!item || quotes.length === 0) return null;
          return (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="rounded-xl border border-border/50 p-5 bg-card overflow-hidden"
            >
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-xs font-semibold">{item.name}</span>
                <span className="text-muted-foreground text-xs">→</span>
                <span className="text-xs font-semibold">{selectedCell.category}</span>
              </div>
              <div className="space-y-2">
                {quotes.map((q, qi) => (
                  <div key={qi} className="flex gap-3">
                    <div className="w-[2px] rounded-full flex-shrink-0" style={{ backgroundColor: item.color, opacity: 0.4 }} />
                    <p className="text-xs text-muted-foreground leading-relaxed italic">{q}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          );
        })()}
      </AnimatePresence>
    </div>
  );
};

export default MatrixGridLayout;
