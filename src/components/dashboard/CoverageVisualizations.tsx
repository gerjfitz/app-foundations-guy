import { motion } from "framer-motion";

interface CoverageProps {
  values: number[];
  tiers: { label: string; count: number }[];
  color: string;
  index: number;
}

/* ───────────── 1. Mini Donut Rings ───────────── */

export const DonutRings = ({ values, tiers, color, index }: CoverageProps) => {
  return (
    <div className="flex items-center gap-6">
      {tiers.map((tier, ti) => {
        const value = values[ti];
        const size = 96;
        const strokeWidth = 7;
        const radius = (size - strokeWidth) / 2;
        const circumference = 2 * Math.PI * radius;
        const offset = circumference - (value / 100) * circumference;

        return (
          <div key={tier.label} className="flex flex-col items-center gap-1.5">
            <div className="relative" style={{ width: size, height: size }}>
              <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
                <circle
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  fill="none"
                  stroke={color}
                  strokeWidth={strokeWidth}
                  opacity={0.1}
                />
                <motion.circle
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  fill="none"
                  stroke={color}
                  strokeWidth={strokeWidth}
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  initial={{ strokeDashoffset: circumference }}
                  animate={{ strokeDashoffset: offset }}
                  transition={{ duration: 0.8, delay: 0.2 + index * 0.08 + ti * 0.12, ease: "easeOut" }}
                />
              </svg>
              <span
                className="absolute inset-0 flex items-center justify-center text-xs font-bold"
                style={{ color }}
              >
                {value}%
              </span>
            </div>
            <span className="text-[10px] text-muted-foreground font-medium text-center leading-tight">
              {tier.label}
            </span>
            <span className="text-[9px] text-muted-foreground/50 font-medium">
              ({tier.count})
            </span>
          </div>
        );
      })}
    </div>
  );
};

/* ───────────── 2. Segmented Arc Gauge ───────────── */

export const ArcGauge = ({ values, tiers, color, index }: CoverageProps) => {
  const size = 120;
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2 - 4;
  const startAngle = -180;
  const totalSweep = 180;

  const polarToCartesian = (cx: number, cy: number, r: number, angleDeg: number) => {
    const rad = (angleDeg * Math.PI) / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  };

  const describeArc = (cx: number, cy: number, r: number, startDeg: number, endDeg: number) => {
    const start = polarToCartesian(cx, cy, r, endDeg);
    const end = polarToCartesian(cx, cy, r, startDeg);
    const largeArc = endDeg - startDeg > 180 ? 1 : 0;
    return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 0 ${end.x} ${end.y}`;
  };

  const cx = size / 2;
  const cy = size / 2 + 8;
  const gapDeg = 4;
  const segmentSweep = (totalSweep - gapDeg * (tiers.length - 1)) / tiers.length;

  const opacities = [1, 0.65, 0.35];
  const avg = Math.round(values.reduce((a, b) => a + b, 0) / values.length);

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative" style={{ width: size, height: size / 2 + 16 }}>
        <svg width={size} height={size / 2 + 20} viewBox={`0 0 ${size} ${size / 2 + 20}`}>
          {/* Track */}
          <path
            d={describeArc(cx, cy, radius, startAngle, startAngle + totalSweep)}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            opacity={0.08}
            strokeLinecap="round"
          />
          {/* Segments */}
          {tiers.map((tier, ti) => {
            const segStart = startAngle + ti * (segmentSweep + gapDeg);
            const fillSweep = (values[ti] / 100) * segmentSweep;
            const segEnd = segStart + fillSweep;

            return (
              <motion.path
                key={tier.label}
                d={describeArc(cx, cy, radius, segStart, segEnd)}
                fill="none"
                stroke={color}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                opacity={opacities[ti]}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.8, delay: 0.2 + index * 0.08 + ti * 0.1, ease: "easeOut" }}
              />
            );
          })}
        </svg>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-center">
          <span className="text-lg font-bold" style={{ color }}>{avg}%</span>
        </div>
      </div>
      <div className="flex items-center gap-3 mt-1">
        {tiers.map((tier, ti) => (
          <div key={tier.label} className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color, opacity: opacities[ti] }} />
            <span className="text-[9px] text-muted-foreground font-medium">
              {tier.label} ({tier.count})
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ───────────── 3. Stacked Pill Badges ───────────── */

export const PillBadges = ({ values, tiers, color, index }: CoverageProps) => {
  return (
    <div className="flex flex-col gap-2">
      {tiers.map((tier, ti) => {
        const value = values[ti];
        return (
          <motion.div
            key={tier.label}
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.15 + index * 0.06 + ti * 0.08 }}
            className="flex items-center gap-2.5"
          >
            <div
              className="relative h-8 rounded-full overflow-hidden flex items-center"
              style={{ backgroundColor: `${color}0c`, minWidth: 160 }}
            >
              <motion.div
                className="absolute inset-y-0 left-0 rounded-full"
                style={{ backgroundColor: `${color}22` }}
                initial={{ width: 0 }}
                animate={{ width: `${value}%` }}
                transition={{ duration: 0.7, delay: 0.2 + index * 0.06 + ti * 0.1, ease: "easeOut" }}
              />
              <div className="relative z-10 flex items-center justify-between w-full px-3">
                <span className="text-[11px] font-semibold" style={{ color }}>
                  {tier.label}
                </span>
                <span className="text-[11px] font-bold tabular-nums" style={{ color }}>
                  {value}%
                </span>
              </div>
            </div>
            <span className="text-[9px] text-muted-foreground/50 font-medium whitespace-nowrap">
              ({tier.count})
            </span>
          </motion.div>
        );
      })}
    </div>
  );
};
