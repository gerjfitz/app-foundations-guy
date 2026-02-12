import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

// Colors matching the signal category icons on the page
const geneColors = [
  "#d97706",  // amber-600 - Executive Access
  "#9333ea",  // purple-600 - Strategic Positioning
  "#2563eb",  // blue-600 - Voice & Influence
  "#ea580c",  // orange-600 - Transformation
  "#0d9488",  // teal-600 - People Leadership
  "#e11d48",  // rose-600 - Anti-Patterns
];

const LeadershipGenome = () => {
  const [mounted, setMounted] = useState(false);
  const [time, setTime] = useState(0);
  const animationRef = useRef<number>();

  useEffect(() => {
    setMounted(true);
    
    const animate = () => {
      setTime(t => t + 0.003);
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animationRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  const width = 300;
  const height = 360;
  const centerX = width / 2;
  const centerY = height / 2;
  const helixRadius = 80;
  const verticalSpread = 140;
  const nodeCount = 24;

  // Generate helix points in a vertical orientation
  const points = Array.from({ length: nodeCount }).map((_, i) => {
    const progress = i / (nodeCount - 1);
    const y = (centerY - verticalSpread) + progress * (verticalSpread * 2);
    const phase = progress * Math.PI * 3 + time * 2;
    
    const sinVal = Math.sin(phase);
    const cosVal = Math.cos(phase);
    
    // Two strands of the helix
    const leftX = centerX + sinVal * helixRadius;
    const rightX = centerX - sinVal * helixRadius;
    
    // Z-depth for 3D effect
    const leftZ = cosVal;
    const rightZ = -cosVal;
    
    const leftOpacity = 0.5 + (leftZ + 1) * 0.25;
    const rightOpacity = 0.5 + (rightZ + 1) * 0.25;
    
    // Size varies with depth
    const leftSize = 6 + (leftZ + 1) * 4;
    const rightSize = 6 + (rightZ + 1) * 4;
    
    return { 
      y,
      leftX, 
      rightX, 
      leftOpacity, 
      rightOpacity,
      leftSize,
      rightSize,
      leftZ,
      rightZ,
      sinVal,
      cosVal,
      colorIndex: i % geneColors.length,
    };
  });

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: mounted ? 1 : 0, scale: mounted ? 1 : 0.9 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="relative"
      style={{ width, height }}
    >
      {/* Glow background */}
      <div 
        className="absolute inset-0 rounded-full blur-3xl"
        style={{
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, rgba(190, 43, 190, 0.08) 50%, transparent 70%)',
        }}
      />
      
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-full"
      >
        <defs>
          {/* Strand gradients */}
          <linearGradient id="genomeStrandLeft" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="hsl(271, 81%, 65%)" />
            <stop offset="50%" stopColor="hsl(280, 70%, 60%)" />
            <stop offset="100%" stopColor="hsl(220, 90%, 65%)" />
          </linearGradient>
          <linearGradient id="genomeStrandRight" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="hsl(220, 90%, 65%)" />
            <stop offset="50%" stopColor="hsl(280, 70%, 60%)" />
            <stop offset="100%" stopColor="hsl(271, 81%, 65%)" />
          </linearGradient>
          
          {/* Connection gradient */}
          <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(271, 81%, 60%)" stopOpacity="0.6" />
            <stop offset="50%" stopColor="hsl(280, 70%, 55%)" stopOpacity="0.8" />
            <stop offset="100%" stopColor="hsl(220, 90%, 60%)" stopOpacity="0.6" />
          </linearGradient>

        </defs>

        {/* Connection bars between strand nodes */}
        {points.map((p, i) => {
          // Draw connections at every other node for clarity
          if (i % 2 !== 0) return null;
          
          return (
            <g key={`connection-${i}`}>
              {/* Main connection bar */}
              <line
                x1={p.leftX}
                y1={p.y}
                x2={p.rightX}
                y2={p.y}
                stroke="url(#connectionGradient)"
                strokeWidth="2"
                opacity={0.4 + Math.abs(p.cosVal) * 0.3}
              />
              {/* Center marker */}
              <circle
                cx={centerX}
                cy={p.y}
                r={3}
                fill={geneColors[p.colorIndex]}
                opacity={0.6}
              />
            </g>
          );
        })}

        {/* Left strand nodes */}
        {points.map((p, i) => (
          <circle
            key={`left-${i}`}
            cx={p.leftX}
            cy={p.y}
            r={p.leftSize}
            fill={geneColors[p.colorIndex]}
            opacity={p.leftOpacity}
          />
        ))}

        {/* Right strand nodes */}
        {points.map((p, i) => (
          <circle
            key={`right-${i}`}
            cx={p.rightX}
            cy={p.y}
            r={p.rightSize}
            fill={geneColors[(p.colorIndex + 3) % geneColors.length]}
            opacity={p.rightOpacity}
          />
        ))}

      </svg>
    </motion.div>
  );
};

export default LeadershipGenome;
