import { useState } from "react";
import { motion } from "framer-motion";
import { Users, ArrowUpRight, Building2, ExternalLink, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { TalentMagnet, tierColors, categoryStyles } from "./types";

/** View 4: Combined Stats + Detail — stats on card, expandable full breakdown */
const CombinedCard = ({ magnet, index }: { magnet: TalentMagnet; index: number }) => {
  const [expanded, setExpanded] = useState(false);
  const style = categoryStyles[magnet.category];

  const statusColors = {
    current: { bg: "bg-emerald-50", text: "text-emerald-700", label: "Current" },
    alumni: { bg: "bg-blue-50", text: "text-blue-700", label: "Internal Alumni" },
    departed: { bg: "bg-slate-100", text: "text-slate-600", label: "Departed" },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      className="bg-white rounded-2xl border border-border overflow-hidden hover:shadow-md transition-shadow flex flex-col"
    >
      <div className="p-7 flex flex-col flex-1">
        {/* Header */}
        <div className="flex items-start gap-4">
          <img src={magnet.image} alt={magnet.name} className="w-14 h-14 rounded-xl object-cover border border-border" />
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-foreground text-base truncate mb-1">{magnet.name}</h3>
            <p className="text-sm text-muted-foreground">{magnet.role}</p>
          </div>
          <span
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold border flex-shrink-0"
            style={{ color: style.color, backgroundColor: `${style.color}10`, borderColor: `${style.color}30` }}
          >
            {style.label}
          </span>
        </div>

        {/* Inline stats */}
        <div className="flex items-center gap-4 mt-5 text-[12px]">
          <span className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5 text-purple-500" />
            <span className="font-bold text-foreground">{magnet.totalDeveloped}</span>
            <span className="text-muted-foreground">developed</span>
          </span>
          <span className="text-border">·</span>
          <span className="flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5 text-emerald-500" />
            <span className="font-bold text-foreground">{magnet.activeCurrent}</span>
            <span className="text-muted-foreground">active</span>
          </span>
          <span className="text-border">·</span>
          <span className="flex items-center gap-1">
            <Building2 className="w-3.5 h-3.5 text-blue-500" />
            <span className="font-bold text-foreground">{magnet.internalAlumni}</span>
            <span className="text-muted-foreground">alumni</span>
          </span>
          {magnet.departed > 0 && (
            <>
              <span className="text-border">·</span>
              <span className="flex items-center gap-1">
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-bold text-foreground">{magnet.departed}</span>
                <span className="text-muted-foreground">departed</span>
              </span>
            </>
          )}
        </div>

        {/* Tier breakdown */}
        <div className="flex items-center gap-3 mt-4">
          {([
            { key: "accelerate" as const, label: "Accelerate", count: magnet.accelerate },
            { key: "nurture" as const, label: "Nurture", count: magnet.nurture },
            { key: "monitor" as const, label: "Monitor", count: magnet.monitor },
          ]).filter((t) => t.count > 0).map((t) => (
            <div
              key={t.key}
              className={cn("inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border", tierColors[t.key].bg, tierColors[t.key].border)}
            >
              <span className={cn("text-sm font-bold", tierColors[t.key].text)}>{t.count}</span>
              <span className={cn("text-[11px] font-semibold capitalize", tierColors[t.key].text)}>{t.label}</span>
            </div>
          ))}
        </div>

        {/* Insight */}
        <p className="text-sm text-foreground/80 mt-5 leading-relaxed flex-1">{magnet.insight}</p>

        {/* Expand toggle */}
        {magnet.directReports.length > 0 && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1 mt-6 pt-4 border-t border-border/50 text-[12px] font-semibold text-muted-foreground hover:text-foreground transition-colors w-full"
          >
            {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            {expanded ? "Hide" : "View"} influence breakdown ({magnet.directReports.length})
          </button>
        )}
      </div>

      {/* Expanded detail */}
      {expanded && magnet.directReports.length > 0 && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          transition={{ duration: 0.25 }}
          className="border-t border-border bg-muted/20"
        >
          <div className="p-5 space-y-4">
            {magnet.directReports.map((dr) => {
              const tc = tierColors[dr.tier];
              const sc = statusColors[dr.status || "current"];
              return (
                <div key={dr.name} className="flex items-start gap-0">
                  <div className="w-[80px] flex-shrink-0 mt-0.5 space-y-1">
                    <span className={cn("block text-center px-2.5 py-1 rounded text-[10px] font-semibold capitalize border", tc.bg, tc.text, tc.border)}>
                      {dr.tier}
                    </span>
                    <span className={cn("block text-center px-2.5 py-0.5 rounded text-[9px] font-medium", sc.bg, sc.text)}>
                      {sc.label}
                    </span>
                  </div>
                  <div className="min-w-0 pl-4">
                    <p className="text-sm font-bold text-foreground">{dr.name}</p>
                    <p className="text-[12px] text-muted-foreground leading-relaxed mt-0.5">{dr.evidence}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default CombinedCard;
