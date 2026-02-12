import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Rocket,
  TrendingUp,
  Users,
  Quote,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import SignalAISidebar from "./SignalAISidebar";

/* ─── Tier config ─── */
type Tier = "accelerate" | "nurture" | "monitor";

const tierConfig: Record<Tier, { label: string; color: string; bg: string; border: string; icon: typeof Rocket }> = {
  accelerate: {
    label: "Accelerate",
    color: "text-emerald-700",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    icon: Rocket,
  },
  nurture: {
    label: "Nurture",
    color: "text-amber-700",
    bg: "bg-amber-50",
    border: "border-amber-200",
    icon: TrendingUp,
  },
  monitor: {
    label: "Monitor",
    color: "text-violet-700",
    bg: "bg-violet-50",
    border: "border-violet-200",
    icon: Users,
  },
};

/* ─── Signal color map ─── */
const signalStyles: Record<string, { bg: string; text: string; border: string; highlightBg: string; highlightText: string }> = {
  Transformation: { bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200", highlightBg: "bg-orange-100", highlightText: "text-orange-800" },
  "Strategic Impact": { bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200", highlightBg: "bg-purple-100", highlightText: "text-purple-800" },
  "People Leadership": { bg: "bg-teal-50", text: "text-teal-700", border: "border-teal-200", highlightBg: "bg-teal-100", highlightText: "text-teal-800" },
  "Executive Access": { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200", highlightBg: "bg-amber-100", highlightText: "text-amber-800" },
  "Voice & Influence": { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200", highlightBg: "bg-blue-100", highlightText: "text-blue-800" },
};

/* ─── Person-anchored data ─── */
interface Recognition {
  quote: string;
  from: string;
  highlight: string;
  signal: string;
}

interface LeaderGrowth {
  id: string;
  name: string;
  role: string;
  department: string;
  image: string;
  tier: Tier;
  signals: string[];
  summary: string;
  recognitions: Recognition[];
  recentCount: number;
}

const leaders: LeaderGrowth[] = [
  {
    id: "1",
    name: "Victoria Reynolds",
    role: "Sr. Director, R&D",
    department: "Engineering",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop&crop=face",
    tier: "accelerate",
    signals: ["Transformation", "People Leadership", "Executive Access"],
    summary: "Orchestrated a cross-functional platform migration coordinating 45 engineers across 4 teams, delivered ahead of schedule. Simultaneously mentored two directors through their first executive presentations.",
    recentCount: 8,
    recognitions: [
      { quote: "Victoria's ability to align competing priorities and keep everyone moving in the same direction was extraordinary.", from: "Michael Ross, CTO", highlight: "align competing priorities", signal: "Transformation" },
      { quote: "Her mentorship of junior leaders has become a model for our organization. Three of her direct reports were promoted this year.", from: "Amanda Foster, VP Talent", highlight: "model for our organization", signal: "People Leadership" },
    ],
  },
  {
    id: "2",
    name: "Michael Chang",
    role: "VP, Product Strategy",
    department: "Product",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face",
    tier: "accelerate",
    signals: ["Strategic Impact", "Voice & Influence"],
    summary: "Launched a formal enterprise customer advisory board with 12 clients, directly influencing the Q3 roadmap. Presented the company's product vision at two industry conferences.",
    recentCount: 6,
    recognitions: [
      { quote: "Michael didn't just create a program — he built a strategic asset. The insights from the advisory board have fundamentally changed how we prioritize.", from: "Elena Rodriguez, CPO", highlight: "built a strategic asset", signal: "Strategic Impact" },
      { quote: "His conference keynote generated more inbound interest than our entire marketing campaign last quarter.", from: "Sarah Klein, CMO", highlight: "more inbound interest", signal: "Voice & Influence" },
    ],
  },
  {
    id: "3",
    name: "Elizabeth Hart",
    role: "Director, Talent",
    department: "HR",
    image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=200&h=200&fit=crop&crop=face",
    tier: "accelerate",
    signals: ["People Leadership", "Transformation"],
    summary: "Rebuilt the company's leadership development curriculum from the ground up, incorporating 360 feedback loops and stretch assignments. First cohort of 24 leaders graduated with 95% satisfaction.",
    recentCount: 5,
    recognitions: [
      { quote: "Elizabeth took our leadership development from a checkbox exercise to something people genuinely compete to join.", from: "Sarah Klein, CHRO", highlight: "genuinely compete to join", signal: "People Leadership" },
      { quote: "The new performance framework she designed has already reduced manager complaints by 40%. That's real impact.", from: "Tom Bradley, COO", highlight: "real impact", signal: "Transformation" },
    ],
  },
  {
    id: "4",
    name: "Daniel Kim",
    role: "Sr. Director, Sales",
    department: "Sales",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
    tier: "accelerate",
    signals: ["Executive Access", "Strategic Impact", "Voice & Influence"],
    summary: "Personally led negotiations and closed a $12M multi-year strategic partnership — the largest in company history. Built C-suite relationships on both sides and restructured the enterprise sales playbook.",
    recentCount: 7,
    recognitions: [
      { quote: "Daniel operated at a level far beyond his current role. He commanded the room with Fortune 100 executives as if he'd been doing it for decades.", from: "James Foster, CRO", highlight: "commanded the room", signal: "Executive Access" },
      { quote: "The new sales playbook he created has become our standard. Win rates in EMEA are up 18% since adoption.", from: "Rachel Adams, SVP Sales", highlight: "Win rates in EMEA are up 18%", signal: "Strategic Impact" },
    ],
  },
  {
    id: "5",
    name: "Amanda Foster",
    role: "Engineering Manager",
    department: "Engineering",
    image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=200&h=200&fit=crop&crop=face",
    tier: "nurture",
    signals: ["Voice & Influence", "Transformation"],
    summary: "Delivered a compelling architecture vision to the executive team, earning approval for a $3M platform modernization investment. Led a hackathon that produced two features now in the product roadmap.",
    recentCount: 4,
    recognitions: [
      { quote: "Amanda's presentation was the most well-prepared and persuasive technical pitch I've seen from a mid-level leader. She's ready for bigger stages.", from: "Kevin Liu, VP Engineering", highlight: "ready for bigger stages", signal: "Voice & Influence" },
    ],
  },
  {
    id: "6",
    name: "James Wilson",
    role: "Director of Sales",
    department: "Sales",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop&crop=face",
    tier: "nurture",
    signals: ["Transformation", "Strategic Impact"],
    summary: "Restructured EMEA sales operations with a new territory model that increased pipeline generation by 28%. Identified and resolved a systemic pricing issue that had been depressing margins for over a year.",
    recentCount: 3,
    recognitions: [
      { quote: "James saw a systemic problem that others had accepted as normal and fixed it. That kind of initiative is exactly what we need more of.", from: "Rachel Adams, SVP Sales", highlight: "initiative is exactly what we need", signal: "Transformation" },
    ],
  },
  {
    id: "7",
    name: "Emily Chen",
    role: "Product Manager",
    department: "Product",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face",
    tier: "monitor",
    signals: ["Strategic Impact", "Voice & Influence"],
    summary: "Created a competitive intelligence framework now adopted across the entire product organization. Proactively identified two market threats that informed the Q4 strategy pivot.",
    recentCount: 3,
    recognitions: [
      { quote: "Emily is operating well beyond what's expected at her level. Her competitive analysis was cited in the board deck — that's unusual for someone in her role.", from: "Tom Bradley, VP Product", highlight: "operating well beyond", signal: "Strategic Impact" },
    ],
  },
  {
    id: "8",
    name: "Marcus Johnson",
    role: "Team Lead",
    department: "Engineering",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face",
    tier: "monitor",
    signals: ["People Leadership"],
    summary: "Mentored and developed three junior engineers who all received promotions this cycle. Built a structured mentorship program now being piloted across the engineering organization.",
    recentCount: 2,
    recognitions: [
      { quote: "Marcus has a rare gift for developing people. Three promotions from one team in a single cycle is unheard of — and they all credit him.", from: "Sarah Chen, Sr. Director Eng", highlight: "rare gift for developing people", signal: "People Leadership" },
    ],
  },
];

/* ─── Highlight helper ─── */
const highlightText = (text: string, highlight: string, highlightBg: string, highlightTextColor: string) => {
  if (!highlight) return text;
  const parts = text.split(new RegExp(`(${highlight})`, "gi"));
  return parts.map((part, i) =>
    part.toLowerCase() === highlight.toLowerCase() ? (
      <mark key={i} className={cn(highlightBg, highlightTextColor, "px-1 py-0.5 rounded font-semibold")}>{part}</mark>
    ) : part
  );
};

const growthColor = "#059669";

const suggestedPrompts = [
  "Who has shown the most growth recently?",
  "Which signals are most active this quarter?",
  "Compare activity across Accelerate vs Nurture",
  "What leadership themes are emerging?",
];

/* ─── Component ─── */
const GrowthPage = () => {
  const [activeTier, setActiveTier] = useState<Tier | "all">("accelerate");
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const filtered = activeTier === "all" ? leaders : leaders.filter((l) => l.tier === activeTier);

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const tierCounts = {
    all: leaders.length,
    accelerate: leaders.filter((l) => l.tier === "accelerate").length,
    nurture: leaders.filter((l) => l.tier === "nurture").length,
    monitor: leaders.filter((l) => l.tier === "monitor").length,
  };

  return (
    <div className="h-full bg-white flex overflow-hidden">
      {/* Left: Main scrollable content */}
      <div className="flex-1 overflow-y-auto">
        {/* Hero */}
        <div className="bg-white">
          <div className="flex justify-center">
            <div className="w-full max-w-[1020px] px-8 pt-8 pb-10 flex flex-col gap-2 items-center text-center">
              <div className="flex justify-center mb-4">
                <div className="p-3 rounded-xl bg-emerald-50">
                  <TrendingUp className="h-7 w-7 text-emerald-600" />
                </div>
              </div>
              <div className="py-2">
                <h1 className="text-4xl lg:text-5xl font-extrabold text-foreground leading-tight mb-3">
                  Growth
                </h1>
                <p className="text-lg text-muted-foreground max-w-xl mx-auto">
                  See where and how your predicted Future Leaders are growing.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex justify-center">
          <div className="w-full max-w-[1020px] py-8 px-8 space-y-8">
            {/* Tier Filter */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="flex items-center gap-2"
            >
              
              {(["accelerate", "nurture", "monitor", "all"] as const).map((tier) => {
                const isActive = activeTier === tier;
                const config = tier === "all" ? null : tierConfig[tier];
                return (
                  <button
                    key={tier}
                    onClick={() => setActiveTier(tier)}
                    className={cn(
                      "px-4 py-2 rounded-xl text-sm font-medium border transition-all",
                      isActive
                        ? tier === "all"
                          ? "bg-foreground text-background border-foreground"
                          : cn(config!.bg, config!.color, config!.border)
                        : "bg-card text-muted-foreground border-border hover:bg-muted/50"
                    )}
                  >
                    {tier === "all" ? "All" : config!.label}
                    <span className="ml-1.5 text-xs opacity-70">{tierCounts[tier]}</span>
                  </button>
                );
              })}
            </motion.div>

            {/* Person Cards */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTier}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
                className="space-y-5"
              >
                {filtered.map((leader, index) => {
                  const tConfig = tierConfig[leader.tier];
                  const TierIcon = tConfig.icon;
                  const isExpanded = expandedIds.has(leader.id);

                  return (
                    <motion.div
                      key={leader.id}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35, delay: index * 0.06 }}
                      className="bg-card border border-border rounded-2xl overflow-hidden hover:shadow-md transition-all"
                    >
                      {/* Main card content */}
                      <div className="px-10 pt-8 pb-7">
                        {/* Header row — cleaner layout */}
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-4">
                            <img
                              src={leader.image}
                              alt={leader.name}
                              className="w-14 h-14 rounded-full object-cover flex-shrink-0"
                            />
                            <div>
                              <h3 className="font-bold text-foreground text-[17px] leading-tight">{leader.name}</h3>
                              <p className="text-[13px] text-muted-foreground mt-0.5">
                                {leader.role} <span className="text-muted-foreground/40 mx-1">·</span> {leader.department}
                              </p>
                            </div>
                          </div>
                          <Badge className={cn("text-xs border flex-shrink-0 px-3 py-1", tConfig.bg, tConfig.color, tConfig.border)}>
                            <TierIcon className="h-3 w-3 mr-1.5" />
                            {tConfig.label}
                          </Badge>
                        </div>

                        {/* Signals row with label */}
                        <div className="mt-6">
                          <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2.5">Demonstrated Signals</p>
                          <div className="flex flex-wrap gap-2">
                            {leader.signals.map((signal) => {
                              const s = signalStyles[signal] || { bg: "bg-slate-50", text: "text-slate-600", border: "border-slate-200" };
                              return (
                                <span
                                  key={signal}
                                  className={cn("text-xs font-medium px-3.5 py-1.5 rounded-full border", s.bg, s.text, s.border)}
                                >
                                  {signal}
                                </span>
                              );
                            })}
                          </div>
                        </div>

                        {/* Summary */}
                        <p className="text-sm text-foreground leading-relaxed mt-6">
                          {leader.summary}
                        </p>

                        {/* Evidence CTA */}
                        <div className="mt-6">
                          <button
                            onClick={() => toggleExpand(leader.id)}
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-border text-sm font-medium text-muted-foreground hover:text-foreground hover:border-foreground/30 hover:bg-muted/30 transition-all"
                          >
                            {isExpanded ? "Hide" : "View"} Evidence
                            <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", isExpanded && "rotate-180")} />
                          </button>
                        </div>
                      </div>

                      {/* Expandable Recognition Quotes */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25, ease: "easeInOut" }}
                            className="overflow-hidden"
                          >
                            <div className="border-t border-border bg-muted/20 px-10 py-7">
                              <div className="space-y-6">
                                {leader.recognitions.map((rec, ri) => {
                                  const s = signalStyles[rec.signal] || { bg: "bg-slate-50", text: "text-slate-600", border: "border-slate-200", highlightBg: "bg-slate-100", highlightText: "text-slate-700" };
                                  return (
                                    <div key={ri} className="flex gap-3">
                                      <Quote className="h-4 w-4 text-muted-foreground/30 flex-shrink-0 mt-0.5" />
                                      <div className="flex-1">
                                        <p className="text-sm text-foreground leading-relaxed italic">
                                          "{highlightText(rec.quote, rec.highlight, s.highlightBg, s.highlightText)}"
                                        </p>
                                        <div className="flex items-center gap-2.5 mt-2.5">
                                          <span className="text-xs text-muted-foreground">{rec.from}</span>
                                          <span className="text-muted-foreground/30">·</span>
                                          <span className={cn("text-[10px] font-medium px-2.5 py-0.5 rounded-full border", s.bg, s.text, s.border)}>
                                            {rec.signal}
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Right: AI Assistant */}
      <div className="w-[410px] flex-shrink-0">
        <SignalAISidebar
          categoryName="Growth"
          categoryColor={growthColor}
          aiSummary="Strong activity across the Accelerate tier this quarter. Victoria Reynolds and Daniel Kim are demonstrating executive-level impact with 8 and 7 recognitions respectively. Transformation and Strategic Impact are the dominant signal themes."
          recognitionSummary="Recent recognition patterns show a surge in Transformation and Strategic Impact signals, particularly in Engineering and Product. 4 Accelerate-tier leaders received executive-level recognition this quarter."
          suggestedPrompts={suggestedPrompts}
        />
      </div>
    </div>
  );
};

export default GrowthPage;
