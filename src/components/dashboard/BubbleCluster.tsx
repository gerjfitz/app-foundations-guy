import { useMemo } from "react";

interface Bubble {
  id: number;
  cx: number;
  cy: number;
  r: number;
  color: string;
  animationDelay: number;
  animationDuration: number;
  driftAmount: number;
  driftDirection: number;
  isMain: boolean;
}

const BubbleCluster = () => {
  const bubbles = useMemo(() => {
    const result: Bubble[] = [];
    let id = 0;

    // 6 main large bubbles - grouped in pairs with one in between
    const mainBubbles = [
      { cx: 120, cy: 90, r: 65, hue: 275 },   // Purple (left)
      { cx: 210, cy: 88, r: 72, hue: 255 },   // Purple-Blue (between left pair)
      { cx: 300, cy: 90, r: 68, hue: 230 },   // Blue
      { cx: 500, cy: 90, r: 68, hue: 175 },   // Cyan/Teal
      { cx: 590, cy: 88, r: 72, hue: 155 },   // Cyan-Green (between right pair)
      { cx: 680, cy: 90, r: 65, hue: 135 },   // Green (right)
    ];

    mainBubbles.forEach((bubble, i) => {
      // Main large bubble
      result.push({
        id: id++,
        cx: bubble.cx,
        cy: bubble.cy,
        r: bubble.r,
        color: `hsla(${bubble.hue}, 60%, 55%, 0.7)`,
        animationDelay: i * 0.4,
        animationDuration: 5 + (i % 3) * 0.5,
        driftAmount: 18 + (i % 2) * 8,
        driftDirection: i % 2 === 0 ? 1 : -1,
        isMain: true,
      });

      // Secondary overlapping bubble
      result.push({
        id: id++,
        cx: bubble.cx + (i % 2 === 0 ? 20 : -20),
        cy: bubble.cy + (i % 3 === 0 ? 12 : -8),
        r: bubble.r * 0.55,
        color: `hsla(${bubble.hue + 8}, 55%, 60%, 0.45)`,
        animationDelay: i * 0.4 + 1.5,
        animationDuration: 4.5 + (i % 2) * 0.4,
        driftAmount: 14,
        driftDirection: i % 2 === 0 ? -1 : 1,
        isMain: false,
      });

      // Tertiary accent bubble
      if (i % 2 === 0) {
        result.push({
          id: id++,
          cx: bubble.cx - 35,
          cy: bubble.cy - 20,
          r: bubble.r * 0.35,
          color: `hsla(${bubble.hue - 5}, 50%, 65%, 0.4)`,
          animationDelay: i * 0.5 + 0.8,
          animationDuration: 4 + i * 0.2,
          driftAmount: 10,
          driftDirection: 1,
          isMain: false,
        });
      }
    });

    // Small scattered dots around edges
    const scatterPositions = [
      // Far left side
      { cx: -20, cy: 80 }, { cx: -10, cy: 110 }, { cx: 5, cy: 60 },
      { cx: 15, cy: 130 }, { cx: 25, cy: 95 }, { cx: -5, cy: 145 },
      // Left side
      { cx: 40, cy: 70 }, { cx: 55, cy: 100 }, { cx: 30, cy: 120 },
      { cx: 70, cy: 50 }, { cx: 45, cy: 140 }, { cx: 80, cy: 130 },
      // Between purple and blue
      { cx: 240, cy: 60 }, { cx: 250, cy: 130 },
      // Between blue and cyan (gap area)
      { cx: 400, cy: 75 }, { cx: 395, cy: 110 },
      // Between cyan and green
      { cx: 560, cy: 55 }, { cx: 570, cy: 125 },
      // Right side
      { cx: 730, cy: 70 }, { cx: 750, cy: 100 }, { cx: 720, cy: 130 },
      { cx: 760, cy: 60 }, { cx: 740, cy: 140 }, { cx: 770, cy: 85 },
      // Far right side
      { cx: 790, cy: 75 }, { cx: 805, cy: 105 }, { cx: 795, cy: 135 },
      { cx: 815, cy: 65 }, { cx: 810, cy: 145 }, { cx: 825, cy: 90 },
    ];

    scatterPositions.forEach((pos, i) => {
      const normalizedX = pos.cx / 800;
      let hue: number;
      if (normalizedX < 0.25) hue = 270 + (Math.random() - 0.5) * 20;
      else if (normalizedX < 0.45) hue = 230 + (Math.random() - 0.5) * 20;
      else if (normalizedX < 0.65) hue = 175 + (Math.random() - 0.5) * 20;
      else hue = 140 + (Math.random() - 0.5) * 20;

      result.push({
        id: id++,
        cx: pos.cx + (Math.random() - 0.5) * 10,
        cy: pos.cy + (Math.random() - 0.5) * 10,
        r: 4 + Math.random() * 10,
        color: `hsla(${hue}, 50%, 65%, ${0.3 + Math.random() * 0.25})`,
        animationDelay: Math.random() * 4,
        animationDuration: 2.5 + Math.random() * 2,
        driftAmount: 8 + Math.random() * 8,
        driftDirection: Math.random() > 0.5 ? 1 : -1,
        isMain: false,
      });
    });

    return result;
  }, []);

  return (
    <div className="relative w-full h-52 overflow-visible py-6">
      <svg
        viewBox="0 0 800 180"
        className="w-full h-full overflow-visible"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id="bubbleFade" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="white" stopOpacity="0.4" />
            <stop offset="2%" stopColor="white" stopOpacity="1" />
            <stop offset="98%" stopColor="white" stopOpacity="1" />
            <stop offset="100%" stopColor="white" stopOpacity="0.4" />
          </linearGradient>
          <mask id="bubbleMask">
            <rect x="-50" y="0" width="900" height="180" fill="url(#bubbleFade)" />
          </mask>
        </defs>
        
        <g mask="url(#bubbleMask)">
          {/* Render smaller bubbles first, then larger ones on top */}
          {bubbles
            .sort((a, b) => a.r - b.r)
            .map((bubble) => (
              <circle
                key={bubble.id}
                cx={bubble.cx}
                cy={bubble.cy}
                r={bubble.r}
                fill={bubble.color}
                className="animate-bubble-float"
                style={{
                  animationDelay: `${bubble.animationDelay}s, ${bubble.animationDelay + 0.5}s`,
                  animationDuration: `${bubble.animationDuration}s, ${bubble.animationDuration * 1.2}s`,
                  transformOrigin: `${bubble.cx}px ${bubble.cy}px`,
                  ["--drift-dir" as string]: bubble.driftDirection,
                  ["--drift-amount" as string]: `${bubble.driftAmount}px`,
                }}
              />
            ))}
        </g>
      </svg>
    </div>
  );
};

export default BubbleCluster;
