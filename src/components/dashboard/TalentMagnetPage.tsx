import { useState } from "react";
import { motion } from "framer-motion";
import { Magnet, TrendingUp, Users, AlertTriangle, Layers, BarChart3, Clock, LayoutGrid } from "lucide-react";
import SignalAISidebar from "./SignalAISidebar";
import { magnets } from "./talent-magnet/data";
import { ViewMode } from "./talent-magnet/types";
import FootprintCard from "./talent-magnet/FootprintCard";
import StatsCard from "./talent-magnet/StatsCard";
import TimelineCard from "./talent-magnet/TimelineCard";
import CombinedCard from "./talent-magnet/CombinedCard";

const viewOptions: { key: ViewMode; label: string; icon: typeof Layers; description: string }[] = [
  { key: "footprint", label: "Influence Footprint", icon: Layers, description: "Concentric rings showing current, alumni & departed layers" },
  { key: "stats", label: "Summary Stats", icon: BarChart3, description: "Simple counts: developed · active · alumni · departed" },
  { key: "timeline", label: "Timeline", icon: Clock, description: "Longitudinal view of pipeline entries over time" },
  { key: "combined", label: "Combined", icon: LayoutGrid, description: "Stats on card with expandable influence breakdown" },
];

const CardComponent = {
  footprint: FootprintCard,
  stats: StatsCard,
  timeline: TimelineCard,
  combined: CombinedCard,
};

const TalentMagnetPage = () => {
  const [viewMode, setViewMode] = useState<ViewMode>("combined");

  const standouts = magnets.filter((m) => m.category === "standout");
  const strong = magnets.filter((m) => m.category === "strong");
  const gaps = magnets.filter((m) => m.category === "gap");
  const Card = CardComponent[viewMode];

  const sections = [
    { data: standouts, label: "Standout Magnets", sub: "Leaders producing the highest concentration of VP+ potential with zero Monitor-tier reports", icon: TrendingUp, iconBg: "bg-emerald-50", iconColor: "text-emerald-500" },
    { data: strong, label: "Strong Signals", sub: "Leaders with quality pipelines and strategic questions to address", icon: Users, iconBg: "bg-blue-50", iconColor: "text-blue-500" },
    { data: gaps, label: "Needs Attention", sub: "Structural or developmental barriers limiting pipeline health", icon: AlertTriangle, iconBg: "bg-amber-50", iconColor: "text-amber-500" },
  ];

  return (
    <div className="h-full bg-white flex overflow-hidden">
      <div className="flex-1 overflow-y-auto">
        {/* Hero */}
        <div className="bg-white border-b border-border relative overflow-hidden">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="absolute right-[-60px] top-[-40px] pointer-events-none"
          >
            <Magnet className="w-[340px] h-[340px] text-purple-500/[0.04]" strokeWidth={1} />
          </motion.div>

          <div className="relative z-10 flex justify-center">
            <div className="w-full max-w-[1020px] px-8 pt-12 pb-8 text-center">
              <div className="flex items-center justify-center gap-3 mb-5">
                <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center">
                  <Magnet className="w-6 h-6 text-purple-500" />
                </div>
              </div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Talent Magnet Analysis</span>
              <h1 className="text-4xl font-bold text-foreground mt-3 mb-4">Who Attracts Future Leaders?</h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Some leaders consistently attract and develop future VPs. When high-potential directors cluster under one manager, it's worth asking what they're doing that others can learn from.
              </p>

              {/* View Mode Switcher */}
              <div className="flex items-center justify-center gap-2 mt-8">
                {viewOptions.map((opt) => (
                  <button
                    key={opt.key}
                    onClick={() => setViewMode(opt.key)}
                    className={`group relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-[12px] font-semibold transition-all ${
                      viewMode === opt.key
                        ? "bg-foreground text-background shadow-md"
                        : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    <opt.icon className="w-4 h-4" />
                    {opt.label}
                    {/* Tooltip */}
                    <span className="absolute -bottom-10 left-1/2 -translate-x-1/2 whitespace-nowrap px-2.5 py-1 rounded-md bg-foreground text-background text-[10px] font-medium opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20 shadow-lg">
                      {opt.description}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex justify-center">
          <div className="w-full max-w-[1020px] py-8 px-8 space-y-14">
            {sections.filter(s => s.data.length > 0).map((section) => (
              <section key={section.label}>
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-9 h-9 rounded-lg ${section.iconBg} flex items-center justify-center`}>
                    <section.icon className={`w-5 h-5 ${section.iconColor}`} />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground">{section.label}</h2>
                </div>
                <p className="text-[11px] uppercase tracking-widest text-muted-foreground mb-6 ml-12">
                  {section.sub}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                  {section.data.map((m, i) => <Card key={m.name} magnet={m} index={i} />)}
                </div>
              </section>
            ))}
          </div>
        </div>
      </div>

      {/* Right: AI sidebar */}
      <div className="w-[410px] flex-shrink-0">
        <SignalAISidebar
          categoryName="Talent Magnet"
          categoryColor="#a855f7"
          aiSummary="Leaders who naturally attract, develop, and retain future VPs at a higher rate than peers. When multiple high-potential directors cluster under one manager, it signals deliberate development behavior worth replicating."
          suggestedPrompts={[
            "What makes Sara Morales the strongest talent magnet?",
            "Which managers have structural barriers limiting their teams?",
            "How can we replicate standout magnet behaviors?",
            "Which Nurture-tier leaders are closest to Accelerate?",
          ]}
        />
      </div>
    </div>
  );
};

export default TalentMagnetPage;
