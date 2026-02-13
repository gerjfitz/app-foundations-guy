import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { alignmentData, genomeCategoryColors, evidenceQuotes } from "./alignmentData";

const StackedCardsLayout = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {alignmentData.map((item, i) => (
        <AlignmentCard key={item.id} item={item} index={i} />
      ))}
    </div>
  );
};

const AlignmentCard = ({ item, index }: { item: (typeof alignmentData)[0]; index: number }) => {
  const [expanded, setExpanded] = useState(false);
  const quotes = evidenceQuotes[item.id] || {};
  const maxStrength = Math.max(...item.mappings.map((m) => m.strength));

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.06 }}
      className="rounded-2xl border border-border/50 bg-card hover:border-border/80 hover:shadow-md transition-all overflow-hidden"
    >
      <div
        className="p-6 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
        style={{ background: `linear-gradient(135deg, ${item.color}08 0%, transparent 100%)` }}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm" style={{ backgroundColor: item.color }}>
              {item.name[0]}
            </div>
            <div>
              <h3 className="font-bold text-lg text-foreground">{item.name}</h3>
              <p className="text-[11px] text-muted-foreground">{item.description}</p>
            </div>
          </div>
          <motion.div animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </motion.div>
        </div>

        {/* Genome mappings as rings */}
        <div className="space-y-3">
          {item.mappings.map((mapping, mi) => {
            const catColor = genomeCategoryColors[mapping.category] || "#94a3b8";
            return (
              <div key={mapping.category} className="flex items-center gap-3">
                {/* Mini ring */}
                <div className="relative w-8 h-8 flex-shrink-0">
                  <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                    <circle cx="18" cy="18" r="14" fill="none" stroke="currentColor" strokeWidth="3" className="text-border/30" />
                    <motion.circle
                      cx="18" cy="18" r="14" fill="none"
                      stroke={catColor}
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeDasharray={`${(mapping.strength / 100) * 88} 88`}
                      initial={{ strokeDasharray: "0 88" }}
                      animate={{ strokeDasharray: `${(mapping.strength / 100) * 88} 88` }}
                      transition={{ duration: 0.6, delay: index * 0.06 + mi * 0.1 }}
                    />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-[9px] font-bold tabular-nums" style={{ color: catColor }}>
                    {mapping.strength}
                  </span>
                </div>
                <span className="text-xs font-medium text-foreground/80 truncate">{mapping.category}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Expanded evidence */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 pt-2 border-t border-border/30 space-y-4">
              {item.mappings.map((mapping) => {
                const catQuotes = quotes[mapping.category] || [];
                const catColor = genomeCategoryColors[mapping.category] || "#94a3b8";
                return (
                  <div key={mapping.category}>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: catColor }} />
                      <span className="text-xs font-semibold text-foreground/80">{mapping.category}</span>
                    </div>
                    {catQuotes.length > 0 ? (
                      <div className="space-y-1.5 pl-4">
                        {catQuotes.map((q, qi) => (
                          <div key={qi} className="flex gap-2">
                            <div className="w-[2px] rounded-full flex-shrink-0" style={{ backgroundColor: item.color, opacity: 0.4 }} />
                            <p className="text-[11px] text-muted-foreground leading-relaxed italic">{q}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-[11px] text-muted-foreground/50 pl-4 italic">No evidence available</p>
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default StackedCardsLayout;
