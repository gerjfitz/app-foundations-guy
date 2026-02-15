import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { TalentMagnet, categoryStyles } from "./types";

/** View 1: Influence Footprint — concentric rings showing Current / Alumni / Departed */
const FootprintCard = ({ magnet, index }: { magnet: TalentMagnet; index: number }) => {
  const style = categoryStyles[magnet.category];
  const maxRing = Math.max(magnet.activeCurrent, magnet.internalAlumni, magnet.departed, 1);

  const rings = [
    { label: "Current", count: magnet.activeCurrent, color: "#22c55e", radius: 44 },
    { label: "Alumni", count: magnet.internalAlumni, color: "#3b82f6", radius: 68 },
    { label: "Departed", count: magnet.departed, color: "#94a3b8", radius: 92 },
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
        <div className="flex items-start gap-4 mb-6">
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

        {/* Concentric Rings */}
        <div className="flex items-center justify-center py-4">
          <div className="relative" style={{ width: 200, height: 200 }}>
            {rings.map((ring, i) => {
              const opacity = ring.count > 0 ? 0.12 + (ring.count / maxRing) * 0.25 : 0.06;
              const strokeOpacity = ring.count > 0 ? 0.4 + (ring.count / maxRing) * 0.4 : 0.15;
              return (
                <motion.div
                  key={ring.label}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.06 + i * 0.12 }}
                  className="absolute rounded-full flex items-center justify-center"
                  style={{
                    width: ring.radius * 2,
                    height: ring.radius * 2,
                    top: 100 - ring.radius,
                    left: 100 - ring.radius,
                    backgroundColor: `${ring.color}`,
                    opacity,
                    border: `2px solid ${ring.color}`,
                  }}
                />
              );
            })}
            {/* Center avatar */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
              <img src={magnet.image} alt="" className="w-12 h-12 rounded-full border-2 border-white shadow-md object-cover" />
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-5 mt-2">
          {rings.map((ring) => (
            <div key={ring.label} className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: ring.color }} />
              <span className="text-[11px] text-muted-foreground">{ring.label}</span>
              <span className="text-[12px] font-bold text-foreground">{ring.count}</span>
            </div>
          ))}
        </div>

        {/* Total */}
        <div className="text-center mt-4 pt-4 border-t border-border/50">
          <span className="text-2xl font-bold text-foreground">{magnet.totalDeveloped}</span>
          <span className="text-sm text-muted-foreground ml-2">leaders influenced over {magnet.yearsOfInfluence} years</span>
        </div>
      </div>
    </motion.div>
  );
};

export default FootprintCard;
