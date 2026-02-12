import { motion } from "framer-motion";

interface StrengthRingProps {
  value: number;
  color: string;
  size?: number;
  strokeWidth?: number;
}

const StrengthRing = ({
  value,
  color,
  size = 44,
  strokeWidth = 3.5,
}: StrengthRingProps) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="-rotate-90"
      >
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          className="text-border/40"
          strokeWidth={strokeWidth}
        />
        {/* Progress arc */}
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
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        />
      </svg>
      {/* Center text */}
      <span
        className="absolute inset-0 flex items-center justify-center font-bold"
        style={{ color, fontSize: size * 0.22 }}
      >
        {value}%
      </span>
    </div>
  );
};

export default StrengthRing;
