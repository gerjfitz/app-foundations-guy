import { Activity, Sparkles, ArrowRight, Crown, Compass, Megaphone, Rocket, Users, AlertTriangle } from "lucide-react";
import { AIAssistantBadge } from "./AIAssistantDrawer";
import { cn } from "@/lib/utils";

interface LeadershipDNAPreviewProps {
  onExplore: () => void;
}

const signalsPrompts = [
  "What signals distinguish top performers?",
  "How do stated values align with observed behaviors?",
  "Which leadership traits predict success?",
  "Identify gaps between expected and actual behaviors",
];

// Top behaviors mapped to their signal categories
const topBehaviors = [
  {
    name: "CEO/C-Suite Direct Access",
    description: "Regular interaction and recognition from C-level executives",
    category: "Executive Access & Recognition",
    categoryShort: "Executive Access",
    icon: Crown,
    categoryColor: "text-amber-600",
    categoryBg: "bg-amber-100 dark:bg-amber-900/30",
  },
  {
    name: "Enterprise Transformation Programme Role",
    description: "Leading organization-wide change initiatives",
    category: "Strategic Positioning",
    categoryShort: "Strategic",
    icon: Compass,
    categoryColor: "text-purple-600",
    categoryBg: "bg-purple-100 dark:bg-purple-900/30",
  },
  {
    name: "Courageous Voice in Senior Forums",
    description: "Speaking truth to power and challenging status quo",
    category: "Voice & Influence",
    categoryShort: "Voice & Influence",
    icon: Megaphone,
    categoryColor: "text-blue-600",
    categoryBg: "bg-blue-100 dark:bg-blue-900/30",
  },
  {
    name: "Sustained Excellence (3+ Years)",
    description: "Consistent high performance over extended period",
    category: "Transformation & Impact",
    categoryShort: "Transformation",
    icon: Rocket,
    categoryColor: "text-orange-600",
    categoryBg: "bg-orange-100 dark:bg-orange-900/30",
  },
  {
    name: "People Development & Mentorship",
    description: "Actively growing and mentoring team members",
    category: "People Leadership",
    categoryShort: "People",
    icon: Users,
    categoryColor: "text-teal-600",
    categoryBg: "bg-teal-100 dark:bg-teal-900/30",
  },
];

const LeadershipDNAPreview = ({ onExplore }: LeadershipDNAPreviewProps) => {
  return (
    <section className="pt-4 pb-20 -mx-8 px-8" style={{ backgroundColor: '#F6F7FB' }}>
      <div className="max-w-[1100px] mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-primary/15 flex items-center justify-center">
              <Activity className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-foreground">Key Leadership Signals</h2>
              <p className="text-muted-foreground">
                Actions, behaviors, and experiences that distinguish exceptional leaders.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <AIAssistantBadge 
              context="Leadership Signals" 
              suggestedPrompts={signalsPrompts} 
            />
            <button 
              onClick={onExplore}
              className="text-sm font-semibold transition-colors hover:opacity-70"
              style={{ color: '#1E4195' }}
            >
              Explore Signals →
            </button>
          </div>
        </div>

        {/* Single Panel Layout */}
        <div className="rounded-2xl bg-white dark:bg-card shadow-lg p-6">
          <div className="grid grid-cols-5 gap-6">
            {/* Left - Top Behaviors (3 cols) */}
            <div className="col-span-3">
              <div className="space-y-3">
                {topBehaviors.map((behavior) => {
                  const Icon = behavior.icon;
                  return (
                    <div 
                      key={behavior.name}
                      className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-border/50"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex-1">
                          <h4 className="font-semibold text-foreground mb-1">{behavior.name}</h4>
                          <p className="text-sm text-muted-foreground">{behavior.description}</p>
                        </div>
                        {/* Category Pill on the right */}
                        <span className={cn(
                          "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap",
                          behavior.categoryBg,
                          behavior.categoryColor
                        )}>
                          <Icon className="h-3 w-3" />
                          {behavior.categoryShort}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right - AI Summary (2 cols) */}
            <div className="col-span-2 bg-gradient-to-br from-accent-magenta/10 to-accent-magenta/5 rounded-xl p-5 border border-accent-magenta/20 flex flex-col">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="h-5 w-5 text-accent-magenta" />
                <span className="text-sm font-semibold uppercase tracking-wider text-accent-magenta">
                  AI Insight
                </span>
              </div>
              
              <p className="text-sm text-foreground leading-relaxed mb-4">
                These behaviors emerge as <span className="font-semibold text-accent-magenta">key indicators of leadership potential</span> in your organization. 
                CEO/C-Suite Direct Access and Enterprise Transformation roles appear in 85% of senior promotions.
              </p>

              <p className="text-sm text-foreground leading-relaxed mb-4">
                Leaders showing Courageous Voice combined with People Development & Mentorship 
                are promoted <span className="font-semibold text-accent-magenta">2.3x faster</span> than peers.
              </p>
              
              <button 
                onClick={onExplore}
                className="flex items-center gap-2 text-sm font-medium text-accent-magenta hover:text-accent-magenta/80 transition-colors group mt-auto"
              >
                Dive deeper into signals analysis
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LeadershipDNAPreview;
