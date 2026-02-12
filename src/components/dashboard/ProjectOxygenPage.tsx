import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  Handshake,
  BookOpen,
  Target,
  Rocket,
  Zap,
  LayoutGrid,
  Link2,
} from "lucide-react";
import SignalAISidebar from "./SignalAISidebar";
import AlignmentView from "./AlignmentView";
import { DonutRings } from "./CoverageVisualizations";

/* ───────────── Coverage Data ───────────── */

const coverageTiers = [
  { label: "Accelerate", count: 62 },
  { label: "Nurture", count: 734 },
  { label: "Monitor", count: 756 },
];

const coverageByPrinciple: Record<string, number[]> = {
  collaborate: [100, 100, 100],
  learn: [71, 71, 71],
  execute: [100, 100, 100],
  accelerate: [90, 90, 85],
  disrupt: [85, 88, 83],
};

/* ───────────── Signal Strength Helpers (from V2) ───────────── */

const getStrengthLabel = (strength: number) => {
  if (strength >= 70) return "Strong";
  if (strength >= 40) return "Medium";
  return "Low";
};

const MicroBars = ({ strength, color, barCount = 5, height = 24 }: { strength: number; color: string; barCount?: number; height?: number }) => {
  const filled = Math.round(strength / (100 / barCount));
  return (
    <div className="flex items-end gap-[3px]" style={{ height }}>
      {[...Array(barCount)].map((_, j) => {
        const barHeight = ((j + 1) / barCount) * height;
        const isFilled = j < filled;
        return (
          <div
            key={j}
            className="rounded-t-sm transition-all duration-500"
            style={{
              width: 6,
              height: barHeight,
              backgroundColor: color,
              opacity: isFilled ? 0.7 + (j / barCount) * 0.3 : 0.12,
              transformOrigin: 'bottom',
            }}
          />
        );
      })}
    </div>
  );
};

const SignalCircle = ({ strength, color }: { strength: number; color: string }) => {
  const label = getStrengthLabel(strength);
  return (
    <div className="flex items-center gap-4 flex-shrink-0">
      <div
        className="w-24 h-24 rounded-full flex items-center justify-center transition-all duration-500 ease-out group-hover:scale-105"
        style={{
          backgroundColor: `${color}14`,
          boxShadow: `0 0 0 0px ${color}00`,
          transition: 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.5s ease-out, background-color 0.5s ease-out',
        }}
      >
        <div className="transition-transform duration-500 ease-out group-hover:scale-110">
          <MicroBars strength={strength} color={color} height={34} barCount={5} />
        </div>
      </div>
      <span
        className="text-[10px] font-extrabold uppercase tracking-widest transition-all duration-500 group-hover:tracking-[0.2em]"
        style={{ color }}
      >
        {label}
      </span>
    </div>
  );
};

/* ───────────── Data ───────────── */

const cleadPeople: Record<string, { name: string; initials: string; photo: string }[]> = {
  collaborate: [
    { name: "Sarah Chen", initials: "SC", photo: "https://i.pravatar.cc/80?u=cl-sarah" },
    { name: "Marcus Rivera", initials: "MR", photo: "https://i.pravatar.cc/80?u=cl-marcus" },
    { name: "Anika Patel", initials: "AP", photo: "https://i.pravatar.cc/80?u=cl-anika" },
    { name: "David Kim", initials: "DK", photo: "https://i.pravatar.cc/80?u=cl-david" },
  ],
  learn: [
    { name: "Elena Vasquez", initials: "EV", photo: "https://i.pravatar.cc/80?u=cl-elena" },
    { name: "Tom Andersen", initials: "TA", photo: "https://i.pravatar.cc/80?u=cl-tom" },
    { name: "Rachel Nguyen", initials: "RN", photo: "https://i.pravatar.cc/80?u=cl-rachel" },
  ],
  execute: [
    { name: "Michael Torres", initials: "MT", photo: "https://i.pravatar.cc/80?u=cl-michael" },
    { name: "Claire Dubois", initials: "CD", photo: "https://i.pravatar.cc/80?u=cl-claire" },
    { name: "Ben Hartley", initials: "BH", photo: "https://i.pravatar.cc/80?u=cl-ben" },
    { name: "Yuki Tanaka", initials: "YT", photo: "https://i.pravatar.cc/80?u=cl-yuki" },
    { name: "Lisa Johansson", initials: "LJ", photo: "https://i.pravatar.cc/80?u=cl-lisa" },
  ],
  accelerate: [
    { name: "Carlos Mendez", initials: "CM", photo: "https://i.pravatar.cc/80?u=cl-carlos" },
    { name: "Nina Petrov", initials: "NP", photo: "https://i.pravatar.cc/80?u=cl-nina" },
    { name: "Priya Sharma", initials: "PS", photo: "https://i.pravatar.cc/80?u=cl-priya" },
  ],
  disrupt: [
    { name: "Omar Farah", initials: "OF", photo: "https://i.pravatar.cc/80?u=cl-omar" },
    { name: "Fatima Al-Rashid", initials: "FA", photo: "https://i.pravatar.cc/80?u=cl-fatima" },
    { name: "Sophie Laurent", initials: "SL", photo: "https://i.pravatar.cc/80?u=cl-sophie" },
    { name: "Ryan Brooks", initials: "RB", photo: "https://i.pravatar.cc/80?u=cl-ryan" },
  ],
};

const cleadBehaviors = [
  {
    id: "collaborate",
    name: "Collaborate",
    description: "Working across boundaries, building teams, managing conflict, earning trust, and recognizing good performance.",
    icon: Handshake,
    color: "#3b82f6",
    colorLight: "rgba(59, 130, 246, 0.06)",
    ringColor: "rgba(59, 130, 246, 0.25)",
    strength: 82,
  },
  {
    id: "learn",
    name: "Learn",
    description: "Developing personal skills and coaching others to grow their capabilities and reach their potential.",
    icon: BookOpen,
    color: "#8b5cf6",
    colorLight: "rgba(139, 92, 246, 0.06)",
    ringColor: "rgba(139, 92, 246, 0.25)",
    strength: 75,
  },
  {
    id: "execute",
    name: "Execute",
    description: "Solving problems, making decisions, delegating, giving feedback, and demonstrating passion for the work.",
    icon: Target,
    color: "#f97316",
    colorLight: "rgba(249, 115, 22, 0.06)",
    ringColor: "rgba(249, 115, 22, 0.25)",
    strength: 88,
  },
  {
    id: "accelerate",
    name: "Accelerate",
    description: "Communicating goals and building capabilities to drive momentum and scale impact across the organization.",
    icon: Rocket,
    color: "#10b981",
    colorLight: "rgba(16, 185, 129, 0.06)",
    ringColor: "rgba(16, 185, 129, 0.25)",
    strength: 78,
  },
  {
    id: "disrupt",
    name: "Disrupt",
    description: "Envisioning opportunities, innovating, taking risks, and leading change to stay ahead of the market.",
    icon: Zap,
    color: "#ec4899",
    colorLight: "rgba(236, 72, 153, 0.06)",
    ringColor: "rgba(236, 72, 153, 0.25)",
    strength: 70,
  },
];

/* ───────────── V2-style C-LEAD Card ───────────── */

const CLEADCard = ({
  behavior,
  index,
}: {
  behavior: (typeof cleadBehaviors)[0];
  index: number;
}) => {
  const coverage = coverageByPrinciple[behavior.id] || [0, 0, 0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="rounded-2xl border border-border/50 bg-card hover:border-border/80 hover:shadow-md transition-all group overflow-hidden"
    >
      <div
        className="p-8 flex flex-col md:flex-row md:items-center gap-8"
        style={{ background: `linear-gradient(135deg, ${behavior.color}0a 0%, ${behavior.color}03 50%, transparent 100%)` }}
      >
        {/* Left side */}
        <div className="flex flex-col items-start gap-6 md:w-[40%] flex-shrink-0">
          <SignalCircle strength={behavior.strength} color={behavior.color} />
          <div>
            <h3 className="font-bold text-2xl text-foreground leading-tight">{behavior.name}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed mt-2 line-clamp-2 min-h-[2.5rem]">{behavior.description}</p>
          </div>
        </div>

        {/* Right side — coverage donut rings */}
        <div className="flex-1 flex flex-col items-center gap-5 md:pl-8">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            Pipeline Coverage
          </p>
          <DonutRings
            values={coverage}
            tiers={coverageTiers}
            color={behavior.color}
            index={index}
          />
        </div>
      </div>
    </motion.div>
  );
};

/* ───────────── Main Page ───────────── */

const ProjectOxygenPage = () => {
  const [activeView, setActiveView] = useState<"overview" | "alignment">("overview");
  

  const suggestedPrompts = [
    "Which leaders show the strongest C-LEAD signals?",
    "How does Collaborate compare to Disrupt across teams?",
    "What development actions should I prioritise?",
    "Show recognition trends for Execute this quarter",
  ];

  return (
    <div className="h-full bg-white flex overflow-hidden">
      {/* Left: Main scrollable content */}
      <div className="flex-1 overflow-y-auto">
        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="pt-12 pb-8 px-8 bg-card border-b border-border"
        >
          <div className="max-w-[1100px] mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <p className="text-sm font-semibold tracking-widest text-muted-foreground uppercase mb-4">
                Leadership Framework
              </p>
              <h1 className="text-4xl lg:text-5xl font-extrabold text-foreground mb-4">
                C-Lead
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
                C-LEAD defines what Cisco expects from its leaders and what they should expect from each other — five interdependent themes that together constitute the skill set of an effective leader.
              </p>
            </motion.div>

            {/* View Toggle */}
            <div className="flex justify-center">
              <div className="bg-muted/50 rounded-xl border border-border p-1.5 flex gap-1">
                <button
                  onClick={() => setActiveView("overview")}
                  className={cn(
                    "flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all",
                    activeView === "overview"
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  )}
                >
                   <LayoutGrid className="h-4 w-4" />
                   Overview
                </button>
                <button
                  onClick={() => setActiveView("alignment")}
                  className={cn(
                    "flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all",
                    activeView === "alignment"
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  )}
                >
                   <Link2 className="h-4 w-4" />
                   Genome Map
                </button>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Content */}
        <div className="flex justify-center">
          <div className="w-full max-w-[1020px] py-10 px-8">
            {activeView === "overview" && (
              <div className="grid grid-cols-1 gap-4">
                {cleadBehaviors.map((b, i) => (
                  <CLEADCard key={b.id} behavior={b} index={i} />
                ))}
              </div>
            )}

            {activeView === "alignment" && <AlignmentView />}
          </div>
        </div>
      </div>

      {/* Right: AI Assistant Sidebar */}
      <div className="w-[410px] flex-shrink-0">
        <SignalAISidebar
          categoryName="C-LEAD"
          categoryColor="#3b82f6"
          aiSummary="C-LEAD recognition patterns show strongest signals in Execute (88%) and Collaborate (82%). Disrupt has the most growth potential with emerging signals across 4 leaders. Cross-theme recognition increased 15% this quarter."
          recognitionSummary="Recognition for C-LEAD behaviours is strongest in Execute and Collaborate, with 72% of recognition coming from cross-functional peers. The Learn theme shows the highest quarter-over-quarter growth at 23%."
          suggestedPrompts={suggestedPrompts}
        />
      </div>
    </div>
  );
};

export default ProjectOxygenPage;
