import { Badge } from "@/components/ui/badge";
import { AIAssistantBadge } from "./AIAssistantDrawer";

interface TrajectoryLevel {
  label: string;
  tier: string;
  color: string;
  bgColor: string;
  description: string;
}

interface TrajectoryPerson {
  id: string;
  name: string;
  image: string;
  level: "projected" | "advancing" | "detected";
  position: number;
}

const levels: Record<string, TrajectoryLevel> = {
  projected: {
    label: "PROJECTED",
    tier: "0.1%",
    color: "text-success",
    bgColor: "bg-success/10 border-success/30",
    description: "Strong signals with ~70% VP+ prediction confidence. Fast-track with executive sponsorship.",
  },
  advancing: {
    label: "ADVANCING",
    tier: "2.3%",
    color: "text-warning",
    bgColor: "bg-warning/10 border-warning/30",
    description: "Medium signal strength. Prioritize for formal leadership development programs.",
  },
  detected: {
    label: "DETECTED",
    tier: "4.8%",
    color: "text-slate-500",
    bgColor: "bg-slate-100 border-slate-200",
    description: "Early leadership signals. Encourage through recognition and mentorship.",
  },
};

const barColors: Record<string, string> = {
  projected: "from-success to-success/20",
  advancing: "from-warning to-warning/20", 
  detected: "from-slate-500 to-slate-500/20",
};

// Height percentages from bottom for each level (where avatar sits)
const levelHeights: Record<string, number> = {
  projected: 100,
  advancing: 66,
  detected: 33,
};

const trajectoryPrompts = [
  "Who in the Projected tier is closest to VP+ promotion?",
  "What development areas are common in the Detected group?",
  "Compare leadership behaviors between Projected and Advancing tiers",
  "Which candidates are moving up tiers fastest?",
  "Identify succession risks in the current pipeline",
];

interface TrajectoryGraphProps {
  people: TrajectoryPerson[];
}

const TrajectoryGraph = ({ people }: TrajectoryGraphProps) => {
  const levelOrder = ["projected", "advancing", "detected"];
  const totalHeight = 420;
  const bandHeight = totalHeight / 3;

  return (
    <div className="bg-card rounded-2xl border border-border p-10 relative">
      {/* AI Assistant Badge - top right */}
      <div className="absolute top-6 right-6">
        <AIAssistantBadge 
          context="Leadership Trajectory" 
          suggestedPrompts={trajectoryPrompts} 
        />
      </div>

      <div className="flex gap-8">
        {/* Left labels */}
        <div className="w-72 flex flex-col" style={{ height: totalHeight }}>
          {levelOrder.map((level, index) => (
            <div 
              key={level} 
              className="flex flex-col justify-center px-4"
              style={{ height: bandHeight }}
            >
              <Badge
                variant="outline"
                className={`${levels[level].bgColor} ${levels[level].color} font-semibold mb-3 w-fit`}
              >
                {levels[level].label}
              </Badge>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {levels[level].description}
              </p>
            </div>
          ))}
        </div>

        {/* Graph area */}
        <div className="flex-1 relative" style={{ height: totalHeight }}>
          {/* Horizontal dotted lines for each level */}
          {[0, 1, 2].map((index) => (
            <div
              key={index}
              className="absolute left-0 right-0"
              style={{ 
                top: `${(index + 1) * 33.33}%`,
                borderTop: "2px dashed hsl(var(--border))",
              }}
            />
          ))}

          {/* People with bars - evenly spaced */}
          {people.map((person, index) => {
            const heightPercent = levelHeights[person.level];
            const barHeightPx = (heightPercent / 100) * totalHeight - 32;
            const spacing = 100 / (people.length + 1);
            const positionPercent = spacing * (index + 1);
            
            return (
              <div
                key={person.id}
                className="absolute flex flex-col items-center"
                style={{ 
                  left: `${positionPercent}%`, 
                  transform: "translateX(-50%)",
                  bottom: 0,
                }}
              >
                {/* Avatar */}
                <img
                  src={person.image}
                  alt={person.name}
                  className="h-14 w-14 rounded-full object-cover border-4 border-card shadow-lg z-10"
                />
                
                {/* Colored bar with gradient fade */}
                <div
                  className={`w-2 rounded-b-full bg-gradient-to-b ${barColors[person.level]}`}
                  style={{ height: barHeightPx }}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TrajectoryGraph;
