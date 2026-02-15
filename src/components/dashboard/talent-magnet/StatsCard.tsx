import { motion } from "framer-motion";
import { Users, ArrowUpRight, Building2, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { TalentMagnet, tierColors, categoryStyles } from "./types";

/** View 2: Summary Stats Row — simple counts on each card */
const StatsCard = ({ magnet, index }: { magnet: TalentMagnet; index: number }) => {
  const style = categoryStyles[magnet.category];

  const stats = [
    { label: "Developed", value: magnet.totalDeveloped, icon: Users, color: "#8b5cf6" },
    { label: "Active", value: magnet.activeCurrent, icon: ArrowUpRight, color: "#22c55e" },
    { label: "Alumni", value: magnet.internalAlumni, icon: Building2, color: "#3b82f6" },
    { label: "Departed", value: magnet.departed, icon: ExternalLink, color: "#94a3b8" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      className="bg-white rounded-2xl border border-border overflow-hidden hover:shadow-md transition-shadow"
    >
      <div className="p-7">
        {/* Header */}
        <div className="flex items-start gap-4 mb-5">
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

        {/* Stats Row */}
        <div className="grid grid-cols-4 gap-2 mb-5">
          {stats.map((s) => (
            <div key={s.label} className="text-center p-3 rounded-xl bg-muted/30 border border-border/50">
              <s.icon className="w-4 h-4 mx-auto mb-1.5" style={{ color: s.color }} />
              <div className="text-xl font-bold text-foreground">{s.value}</div>
              <div className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Tier breakdown */}
        <div className="flex items-center gap-3 mb-4">
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
        <p className="text-sm text-foreground/80 leading-relaxed">{magnet.insight}</p>

        {/* Influence span */}
        <div className="mt-4 pt-4 border-t border-border/50 text-[12px] text-muted-foreground">
          <span className="font-semibold text-foreground">{magnet.yearsOfInfluence} years</span> of influence tracked
        </div>
      </div>
    </motion.div>
  );
};

export default StatsCard;
