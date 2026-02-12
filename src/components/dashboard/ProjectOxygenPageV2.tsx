import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  Handshake,
  BookOpen,
  Target,
  Rocket,
  Zap,
  Signal,
  ChevronDown,
} from "lucide-react";
import SignalAISidebar from "./SignalAISidebar";

/* ───────────── Signal Strength Indicator ───────────── */

const getStrengthLabel = (strength: number) => {
  if (strength >= 70) return "Strong";
  if (strength >= 40) return "Medium";
  return "Low";
};

const getStrengthColor = (strength: number, color: string) => {
  if (strength >= 70) return color;
  if (strength >= 40) return color;
  return "hsl(var(--muted-foreground))";
};

const MicroBars = ({ strength, color, barCount = 5, height = 24, animated = false }: { strength: number; color: string; barCount?: number; height?: number; animated?: boolean }) => {
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
              width: animated ? 7 : 6,
              height: barHeight,
              backgroundColor: color,
              opacity: isFilled ? 0.7 + (j / barCount) * 0.3 : 0.12,
              transitionDelay: animated ? `${j * 60}ms` : '0ms',
              transform: animated ? `scaleY(1.15)` : 'scaleY(1)',
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

/* inline for sub-signal rows */
const SignalStrengthInline = ({ strength, color }: { strength: number; color: string }) => {
  const label = getStrengthLabel(strength);
  return (
    <div className="flex items-center gap-2.5">
      <MicroBars strength={strength} color={color} barCount={5} height={16} />
      <span
        className="text-[9px] font-bold uppercase tracking-widest whitespace-nowrap"
        style={{ color: getStrengthColor(strength, color) }}
      >
        {label}
      </span>
    </div>
  );
};

/* ───────────── C-LEAD Data ───────────── */

const cleadItems = [
  {
    id: "collaborate",
    name: "Collaborate",
    description: "Working across boundaries, building teams, managing conflict, earning trust, and recognizing good performance.",
    icon: Handshake,
    color: "#3b82f6",
    colorLight: "rgba(59, 130, 246, 0.08)",
    strength: 80,
  },
  {
    id: "learn",
    name: "Learn",
    description: "Developing personal skills and coaching others to grow their capabilities and reach their potential.",
    icon: BookOpen,
    color: "#8b5cf6",
    colorLight: "rgba(139, 92, 246, 0.08)",
    strength: 35,
  },
  {
    id: "execute",
    name: "Execute",
    description: "Solving problems, making decisions, delegating, giving feedback, and demonstrating passion for the work.",
    icon: Target,
    color: "#f97316",
    colorLight: "rgba(249, 115, 22, 0.08)",
    strength: 90,
  },
  {
    id: "accelerate",
    name: "Accelerate",
    description: "Communicating goals and building capabilities to drive momentum and scale impact across the organization.",
    icon: Rocket,
    color: "#10b981",
    colorLight: "rgba(16, 185, 129, 0.08)",
    strength: 70,
  },
  {
    id: "disrupt",
    name: "Disrupt",
    description: "Envisioning opportunities, innovating, taking risks, and leading change to stay ahead of the market.",
    icon: Zap,
    color: "#ec4899",
    colorLight: "rgba(236, 72, 153, 0.08)",
    strength: 30,
  },
];

/* ───────────── Genome Data ───────────── */

const genomeCategories = [
  {
    id: "career-development",
    name: "Career Development",
    description: "Tracking progression speed, role breadth, and pivots that signal leadership trajectory.",
    color: "#6366f1",
    colorLight: "rgba(99, 102, 241, 0.08)",
    strength: 75,
    signals: [
      { name: "Progression Tempo", strength: 85 },
      { name: "Accelerated Entry", strength: 70 },
      { name: "Tenure & Plateau", strength: 60 },
      { name: "Track Selection", strength: 80 },
      { name: "Career Pivots & Broadening", strength: 75 },
      { name: "Organizational Context", strength: 65 },
    ],
  },
  {
    id: "strategic-scope",
    name: "Strategic Scope & Ownership",
    description: "Measuring enterprise reach, strategic alignment, and quantified business outcomes.",
    color: "#0ea5e9",
    colorLight: "rgba(14, 165, 233, 0.08)",
    strength: 80,
    signals: [
      { name: "Enterprise Reach", strength: 90 },
      { name: "Strategic Alignment", strength: 75 },
      { name: "Strategic Program Ownership", strength: 85 },
      { name: "Organizational Innovation", strength: 70 },
      { name: "Quantified Business Outcomes", strength: 80 },
      { name: "Customer Strategy", strength: 65 },
    ],
  },
  {
    id: "leadership-presence",
    name: "Leadership Presence",
    description: "Assessing ownership, vision, judgment, and external thought leadership visibility.",
    color: "#f59e0b",
    colorLight: "rgba(245, 158, 11, 0.08)",
    strength: 65,
    signals: [
      { name: "Ownership & Agency", strength: 80 },
      { name: "Vision & Transformation", strength: 70 },
      { name: "Character & Judgment", strength: 75 },
      { name: "Enterprise Mindset", strength: 60 },
      { name: "External Visibility & Thought Leadership", strength: 45 },
      { name: "Perception Ceilings", strength: 50 },
      { name: "Crisis-to-Mandate Expansion", strength: 55 },
    ],
  },
  {
    id: "organizational-influence",
    name: "Organizational Leadership",
    description: "Evaluating advocacy breadth, executive proximity, and talent development impact.",
    color: "#10b981",
    colorLight: "rgba(16, 185, 129, 0.08)",
    strength: 70,
    signals: [
      { name: "Advocacy Escalation", strength: 75 },
      { name: "Advocacy Breadth", strength: 65 },
      { name: "Executive Proximity", strength: 80 },
      { name: "Cross-Functional Influence", strength: 70 },
      { name: "Talent Development", strength: 60 },
      { name: "Team Culture & Inclusion", strength: 75 },
    ],
  },
  {
    id: "execution-expertise",
    name: "Execution & Expertise",
    description: "Gauging execution ceiling, technical depth, and functional specialization.",
    color: "#f97316",
    colorLight: "rgba(249, 115, 22, 0.08)",
    strength: 85,
    signals: [
      { name: "Execution Ceiling", strength: 90 },
      { name: "Technical Depth", strength: 85 },
      { name: "Functional Specialization", strength: 80 },
      { name: "Domain Constraints", strength: 70 },
      { name: "Customer Delivery", strength: 85 },
    ],
  },
  {
    id: "impact-trajectory",
    name: "Leadership Impact Trajectory",
    description: "Analyzing evidence concentration, contribution cadence, and theme evolution patterns.",
    color: "#ec4899",
    colorLight: "rgba(236, 72, 153, 0.08)",
    strength: 30,
    signals: [
      { name: "Signal Quality vs. Volume", strength: 35 },
      { name: "Evidence Concentration", strength: 25 },
      { name: "Contribution Cadence", strength: 40 },
      { name: "Impact Theme Evolution", strength: 30 },
      { name: "Theme Stagnation", strength: 15 },
      { name: "Baseline Commonalities", strength: 20 },
    ],
  },
];

/* ───────────── Genome Expandable Card ───────────── */

const GenomeCard = ({ cat, index }: { cat: typeof genomeCategories[0]; index: number }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="rounded-2xl border border-border/50 bg-card hover:border-border/80 hover:shadow-md transition-all group overflow-hidden cursor-pointer"
      onClick={() => setExpanded(!expanded)}
    >
      <div className="p-8 flex flex-col items-start gap-6" style={{ background: `linear-gradient(135deg, ${cat.color}0a 0%, ${cat.color}03 50%, transparent 100%)` }}>
        <div className="flex items-center justify-between w-full">
          <SignalCircle strength={cat.strength} color={cat.color} />
          <ChevronDown
            className={cn(
              "w-4 h-4 text-muted-foreground transition-transform duration-200 flex-shrink-0",
              expanded && "rotate-180"
            )}
          />
        </div>
        <div>
          <h3 className="font-semibold text-lg text-foreground leading-tight">{cat.name}</h3>
          <p className="text-xs text-muted-foreground leading-relaxed mt-1.5 line-clamp-2 min-h-[2.5rem]">{cat.description}</p>
        </div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-8 pb-8 space-y-3 border-t border-border/30 pt-4">
              {cat.signals.map((signal, si) => (
                <motion.div
                  key={signal.name}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: si * 0.03 }}
                  className="flex items-center justify-between gap-4 py-0.5"
                >
                  <span className="text-xs text-foreground/80 font-medium truncate flex-1">
                    {signal.name}
                  </span>
                  <SignalStrengthInline strength={signal.strength} color={cat.color} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

/* ───────────── Main Page V2 ───────────── */

const ProjectOxygenPageV2 = () => {

  return (
    <div className="h-full bg-page-background flex overflow-hidden">
      <div className="flex-1 overflow-y-auto">
        {/* Hero */}
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
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                C-LEAD outlines five interdependent themes that define what Cisco expects from its leaders.
              </p>
            </motion.div>
          </div>
        </motion.section>

        {/* Content */}
        <div className="flex justify-center">
          <div className="w-full max-w-[1020px] py-10 px-8">

            {/* Two Independent Columns */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 items-start">
              {/* Left: C-LEAD */}
              <div>
                <h2 className="text-lg font-bold text-foreground mb-5">C-LEAD Values</h2>
                <div className="space-y-4">
                  {cleadItems.map((item, i) => {
                    const Icon = item.icon;
                    return (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: i * 0.05 }}
                        className="rounded-2xl border border-border/50 bg-card hover:border-border/80 hover:shadow-md transition-all group overflow-hidden"
                      >
                        <div className="p-8 flex flex-col items-start gap-6" style={{ background: `linear-gradient(135deg, ${item.color}0a 0%, ${item.color}03 50%, transparent 100%)` }}>
                          <SignalCircle strength={item.strength} color={item.color} />
                          <div>
                            <h3 className="font-semibold text-lg text-foreground leading-tight">{item.name}</h3>
                            <p className="text-xs text-muted-foreground leading-relaxed mt-1.5 line-clamp-2 min-h-[2.5rem]">{item.description}</p>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Right: Genome */}
              <div>
                <h2 className="text-lg font-bold text-foreground mb-5">Genome</h2>
                <div className="space-y-4">
                  {genomeCategories.map((cat, i) => (
                    <GenomeCard key={cat.id} cat={cat} index={i} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Sidebar */}
      <div className="w-[410px] flex-shrink-0">
        <SignalAISidebar
          categoryName="C-LEAD × Genome"
          categoryColor="#6366f1"
          aiSummary="The Genome taxonomy surfaces 6 signal categories with 36 sub-signals that provide evidence-based indicators of VP+ readiness, complementing C-LEAD's 5 aspirational leadership themes."
          recognitionSummary="Mapping Genome signals to C-LEAD values reveals strongest alignment in Execute↔Execution & Expertise and Collaborate↔Organizational Influence. Disrupt↔Leadership Impact Trajectory shows the most growth opportunity."
          suggestedPrompts={[
            "How do C-LEAD values map to Genome signals?",
            "Which Genome signals are strongest for our top leaders?",
            "Where are the gaps between C-LEAD expectations and Genome evidence?",
            "Compare leadership presence signals across departments",
          ]}
          bgColor="#ffffff"
        />
      </div>
    </div>
  );
};

export default ProjectOxygenPageV2;
