import { motion } from "framer-motion";
import { TalentMagnet, categoryStyles } from "./types";

/** View 3: Timeline Attribution — longitudinal chart of pipeline entries & promotions */
const TimelineCard = ({ magnet, index }: { magnet: TalentMagnet; index: number }) => {
  const style = categoryStyles[magnet.category];
  const data = magnet.timelineData;
  const maxVal = Math.max(...data.map((d) => Math.max(d.entered, d.promoted)), 1);

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

        {/* Timeline Chart */}
        <div className="space-y-1">
          {data.map((d, i) => (
            <motion.div
              key={d.year}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.06 + i * 0.05 }}
              className="flex items-center gap-3"
            >
              <span className="text-[11px] font-mono text-muted-foreground w-10 flex-shrink-0">{d.year}</span>
              <div className="flex-1 flex items-center gap-1.5 h-7">
                {/* Entered bar */}
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(d.entered / maxVal) * 100}%` }}
                  transition={{ duration: 0.5, delay: index * 0.06 + i * 0.05 }}
                  className="h-5 rounded-md bg-purple-400/70 flex items-center justify-end pr-1.5"
                  style={{ minWidth: d.entered > 0 ? 24 : 0 }}
                >
                  {d.entered > 0 && <span className="text-[9px] font-bold text-white">{d.entered}</span>}
                </motion.div>
                {/* Promoted bar */}
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(d.promoted / maxVal) * 100}%` }}
                  transition={{ duration: 0.5, delay: index * 0.06 + i * 0.05 + 0.1 }}
                  className="h-5 rounded-md bg-emerald-400/70 flex items-center justify-end pr-1.5"
                  style={{ minWidth: d.promoted > 0 ? 24 : 0 }}
                >
                  {d.promoted > 0 && <span className="text-[9px] font-bold text-white">{d.promoted}</span>}
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-5 mt-4 pt-4 border-t border-border/50">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-purple-400/70" />
            <span className="text-[11px] text-muted-foreground">Entered pipeline</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-emerald-400/70" />
            <span className="text-[11px] text-muted-foreground">Promoted / advanced</span>
          </div>
        </div>

        {/* Summary */}
        <p className="text-[12px] text-foreground/70 mt-3 leading-relaxed">{magnet.insight}</p>
      </div>
    </motion.div>
  );
};

export default TimelineCard;
