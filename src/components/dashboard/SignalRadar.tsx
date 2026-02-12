import { motion } from "framer-motion";
import { useState, useEffect } from "react";

// Dot colors matching the signal category icons
const dotColors = [
  "#D97706", // amber
  "#7C3AED", // purple  
  "#2563EB", // blue
  "#EA580C", // orange
  "#0D9488", // teal
  "#E11D48", // rose
  "#8B5CF6", // violet
  "#059669", // emerald
  "#0891B2", // cyan
  "#DB2777", // pink
  "#4F46E5", // indigo
];

// Signal dots with varying sizes and positions on the radar - more dots spread across
const signalDots = [
  { angle: -80, ringIndex: 3.8, size: 10, colorIndex: 0 },
  { angle: -70, ringIndex: 3, size: 12, colorIndex: 1 },
  { angle: -60, ringIndex: 2.2, size: 8, colorIndex: 2 },
  { angle: -50, ringIndex: 2.5, size: 10, colorIndex: 3 },
  { angle: -40, ringIndex: 3.5, size: 14, colorIndex: 4 },
  { angle: -30, ringIndex: 3.5, size: 12, colorIndex: 5 },
  { angle: -20, ringIndex: 1.8, size: 8, colorIndex: 6 },
  { angle: -10, ringIndex: 2, size: 8, colorIndex: 7 },
  { angle: 0, ringIndex: 3.2, size: 12, colorIndex: 8 },
  { angle: 10, ringIndex: 2.8, size: 10, colorIndex: 9 },
  { angle: 20, ringIndex: 3, size: 10, colorIndex: 10 },
  { angle: 30, ringIndex: 2.2, size: 8, colorIndex: 0 },
  { angle: 45, ringIndex: 2.5, size: 12, colorIndex: 1 },
  { angle: 55, ringIndex: 3.6, size: 10, colorIndex: 2 },
  { angle: 70, ringIndex: 3.2, size: 8, colorIndex: 3 },
  { angle: 80, ringIndex: 2.4, size: 8, colorIndex: 4 },
  { angle: 90, ringIndex: 3.4, size: 10, colorIndex: 5 },
  { angle: 100, ringIndex: 2.8, size: 10, colorIndex: 6 },
  { angle: 120, ringIndex: 3.0, size: 12, colorIndex: 7 },
  { angle: 140, ringIndex: 2.6, size: 8, colorIndex: 8 },
  { angle: 160, ringIndex: 3.2, size: 10, colorIndex: 9 },
  { angle: 180, ringIndex: 2.4, size: 8, colorIndex: 10 },
  { angle: 200, ringIndex: 3.6, size: 12, colorIndex: 0 },
  { angle: 220, ringIndex: 2.8, size: 10, colorIndex: 1 },
  { angle: 240, ringIndex: 3.4, size: 10, colorIndex: 2 },
  { angle: 260, ringIndex: 2.2, size: 8, colorIndex: 3 },
];

const SignalRadar = () => {
  const radarSize = 700;
  const centerOffset = radarSize / 2;
  const ringStartSize = 120;
  const ringSpacing = 105;
  const rotationDuration = 12; // seconds for full rotation
  
  const [sweepAngle, setSweepAngle] = useState(0);
  
  // Track sweep angle synced with actual rotation animation
  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = (Date.now() - startTime) / 1000; // seconds
      const angle = (elapsed / rotationDuration) * 360 % 360;
      setSweepAngle(angle);
    }, 50);
    return () => clearInterval(interval);
  }, []);
  
  // Check if a dot is near the sweep line - sweep starts at top (-90deg) and goes clockwise
  const isDotNearSweep = (dotAngle: number) => {
    // Normalize dot angle to 0-360
    const normalizedDotAngle = ((dotAngle % 360) + 360) % 360;
    // The sweep line starts pointing up (-90 degrees) and rotates clockwise
    // So the current sweep position is sweepAngle - 90
    const currentSweepPosition = ((sweepAngle - 90) % 360 + 360) % 360;
    
    // Calculate the angular difference
    let diff = Math.abs(normalizedDotAngle - currentSweepPosition);
    if (diff > 180) diff = 360 - diff;
    
    // Dot lights up when sweep line is within 15 degrees
    return diff < 15;
  };

  return (
    <div className="relative flex items-center justify-center" style={{ width: radarSize, height: radarSize }}>
      {/* Radar Container - full circle */}
      <div 
        className="absolute"
        style={{ 
          width: radarSize, 
          height: radarSize,
        }}
      >
        {/* Concentric Rings - magenta color */}
        {[...Array(5)].map((_, i) => {
          const size = ringStartSize + i * ringSpacing;
          // Fade out the outermost ring more
          const ringOpacity = i === 4 ? 0.15 : 0.5 - i * 0.08;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: ringOpacity, scale: 1 }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="absolute rounded-full"
              style={{
                width: `${size}px`,
                height: `${size}px`,
                left: `${centerOffset - size / 2}px`,
                top: `${centerOffset - size / 2}px`,
                border: '2px solid #BE2BBE',
              }}
            />
          );
        })}

        {/* Signal Dots - colorful with animation on sweep */}
        {signalDots.map((dot, index) => {
          const radians = (dot.angle * Math.PI) / 180;
          const ringRadius = (ringStartSize + dot.ringIndex * ringSpacing) / 2;
          const x = centerOffset + Math.cos(radians) * ringRadius;
          const y = centerOffset + Math.sin(radians) * ringRadius;
          const isNearSweep = isDotNearSweep(dot.angle);
          const color = dotColors[dot.colorIndex];
          
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ 
                opacity: isNearSweep ? 1 : 0.6, 
                scale: isNearSweep ? 1.5 : 1,
              }}
              transition={{ 
                duration: 0.3,
                ease: "easeOut"
              }}
              className="absolute rounded-full"
              style={{
                width: dot.size,
                height: dot.size,
                left: x - dot.size / 2,
                top: y - dot.size / 2,
                backgroundColor: color,
                boxShadow: isNearSweep ? `0 0 12px 3px ${color}50` : 'none',
              }}
            />
          );
        })}

        {/* Rotating Radar Sweep Line */}
        <motion.div
          className="absolute"
          style={{
            width: radarSize,
            height: radarSize,
            left: 0,
            top: 0,
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: rotationDuration, repeat: Infinity, ease: "linear" }}
        >
          {/* Sweep Line */}
          <div
            className="absolute origin-bottom"
            style={{
              width: 2,
              height: centerOffset - 40,
              left: centerOffset - 1,
              top: 40,
              background: 'linear-gradient(to top, rgba(190, 43, 190, 0.7) 0%, rgba(190, 43, 190, 0.2) 70%, transparent 100%)',
            }}
          />
        </motion.div>

        {/* Center Dot - magenta */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="absolute z-10"
          style={{
            left: centerOffset - 24,
            top: centerOffset - 24,
          }}
        >
          <div 
            className="w-12 h-12 rounded-full flex items-center justify-center"
            style={{ backgroundColor: 'rgba(190, 43, 190, 0.2)' }}
          >
            <div 
              className="w-6 h-6 rounded-full"
              style={{ backgroundColor: '#BE2BBE' }}
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SignalRadar;