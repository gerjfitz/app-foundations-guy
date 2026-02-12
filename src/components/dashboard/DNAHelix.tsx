import { useEffect, useRef, useState } from "react";

const DNAHelix = () => {
  const [mounted, setMounted] = useState(false);
  const [time, setTime] = useState(0);
  const animationRef = useRef<number>();

  useEffect(() => {
    setMounted(true);
    
    const animate = () => {
      setTime(t => t + 0.008); // Slowed down from 0.02
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animationRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  const strandCount = 28;
  const width = 700;
  const height = 80;

  const points = Array.from({ length: strandCount }).map((_, i) => {
    const x = 40 + (i / (strandCount - 1)) * (width - 80);
    const phase = (i / strandCount) * Math.PI * 4 + time;
    const sinVal = Math.sin(phase);
    const cosVal = Math.cos(phase);
    
    // Create 3D effect - when sin is positive, top strand is in front
    const topY = height / 2 + sinVal * 22;
    const bottomY = height / 2 - sinVal * 22;
    
    // Z-depth for opacity (simulates 3D rotation)
    const topZ = cosVal;
    const bottomZ = -cosVal;
    
    const topOpacity = 0.4 + (topZ + 1) * 0.3;
    const bottomOpacity = 0.4 + (bottomZ + 1) * 0.3;
    
    return { 
      x, 
      topY, 
      bottomY, 
      topOpacity, 
      bottomOpacity,
      sinVal,
      cosVal,
      phase 
    };
  });

  // Create smooth strand paths
  const createSmoothPath = (getY: (p: typeof points[0]) => number) => {
    if (points.length < 2) return "";
    
    let path = `M ${points[0].x} ${getY(points[0])}`;
    
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[Math.max(0, i - 1)];
      const p1 = points[i];
      const p2 = points[i + 1];
      const p3 = points[Math.min(points.length - 1, i + 2)];
      
      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = getY(p1) + (getY(p2) - getY(p0)) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = getY(p2) - (getY(p3) - getY(p1)) / 6;
      
      path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${getY(p2)}`;
    }
    
    return path;
  };

  const topStrandPath = createSmoothPath(p => p.topY);
  const bottomStrandPath = createSmoothPath(p => p.bottomY);

  return (
    <div className="relative h-20 overflow-hidden">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-full max-w-2xl mx-auto"
        preserveAspectRatio="xMidYMid meet"
        style={{
          opacity: mounted ? 1 : 0,
          transition: "opacity 0.5s ease-out",
        }}
      >
        <g mask="url(#edgeFadeMask)">
          {/* Connecting vertical lines between top and bottom dots */}
          {points.map((p, i) => (
            <line
              key={`connect-${i}`}
              x1={p.x}
              y1={p.topY}
              x2={p.x}
              y2={p.bottomY}
              stroke="url(#lineGradient)"
              strokeWidth="1.5"
              opacity={0.5 + Math.abs(p.cosVal) * 0.3}
              strokeLinecap="round"
            />
          ))}

          {/* Nodes on strands */}
          {points.map((p, i) => {
            const topInFront = p.cosVal > 0;
            
            return (
              <g key={i}>
                {/* Render back node first */}
                <circle
                  cx={p.x}
                  cy={topInFront ? p.bottomY : p.topY}
                  r={3 + Math.abs(p.sinVal) * 1.5}
                  fill={topInFront ? "url(#bottomGradient)" : "url(#topGradient)"}
                  opacity={topInFront ? p.bottomOpacity : p.topOpacity}
                />
                {/* Render front node second */}
                <circle
                  cx={p.x}
                  cy={topInFront ? p.topY : p.bottomY}
                  r={3.5 + Math.abs(p.sinVal) * 2}
                  fill={topInFront ? "url(#topGradient)" : "url(#bottomGradient)"}
                  opacity={topInFront ? p.topOpacity : p.bottomOpacity}
                />
              </g>
            );
          })}
        </g>

        <defs>
          {/* Edge fade masks */}
          <linearGradient id="fadeLeft" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="white" stopOpacity="0" />
            <stop offset="100%" stopColor="white" stopOpacity="1" />
          </linearGradient>
          <linearGradient id="fadeRight" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="white" stopOpacity="1" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="fadeBoth" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="white" stopOpacity="0" />
            <stop offset="15%" stopColor="white" stopOpacity="1" />
            <stop offset="85%" stopColor="white" stopOpacity="1" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </linearGradient>
          <mask id="edgeFadeMask">
            <rect x="0" y="0" width={width} height={height} fill="url(#fadeBoth)" />
          </mask>
          <linearGradient id="topGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(220, 90%, 65%)" />
            <stop offset="50%" stopColor="hsl(250, 80%, 65%)" />
            <stop offset="100%" stopColor="hsl(280, 70%, 65%)" />
          </linearGradient>
          <linearGradient id="bottomGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(280, 70%, 60%)" />
            <stop offset="50%" stopColor="hsl(250, 80%, 60%)" />
            <stop offset="100%" stopColor="hsl(220, 90%, 60%)" />
          </linearGradient>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="hsl(220, 90%, 70%)" />
            <stop offset="50%" stopColor="hsl(250, 80%, 65%)" />
            <stop offset="100%" stopColor="hsl(280, 70%, 70%)" />
          </linearGradient>
          <linearGradient id="strandGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(220, 90%, 60%)" />
            <stop offset="50%" stopColor="hsl(250, 80%, 60%)" />
            <stop offset="100%" stopColor="hsl(280, 70%, 60%)" />
          </linearGradient>
          <linearGradient id="strandGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(280, 70%, 55%)" />
            <stop offset="50%" stopColor="hsl(250, 80%, 55%)" />
            <stop offset="100%" stopColor="hsl(220, 90%, 55%)" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};

export default DNAHelix;