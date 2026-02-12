import { ArrowRight, Rocket, TrendingUp, Users, Sparkles, Target, Activity, ChevronRight, Star } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface OverviewPageV2Props {
  onTierClick?: (tier: "monitor" | "nurture" | "accelerate") => void;
  onViewPredicted?: () => void;
  onViewSignals?: () => void;
}

const accelerateAvatars = [
  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face",
];

const nurtureAvatars = [
  "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=100&h=100&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop&crop=face",
];

const monitorAvatars = [
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
];

const provenPredictions = [
  {
    name: "Dr. Sarah Mitchell",
    currentRole: "VP of R&D",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face",
    yearsEarly: 5,
  },
  {
    name: "James Chen",
    currentRole: "SVP Manufacturing",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
    yearsEarly: 6,
  },
  {
    name: "Maria Rodriguez",
    currentRole: "Chief Product Officer",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop&crop=face",
    yearsEarly: 6,
  },
  {
    name: "David Kim",
    currentRole: "EVP Global Sales",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face",
    yearsEarly: 6,
  },
];

const insights = [
  { text: "3 Accelerate leaders showing rapid growth", type: "positive" },
  { text: "Engineering: 14 future leaders identified", type: "positive" },
  { text: "2 leaders at potential flight risk", type: "attention" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const }
  }
};

const OverviewPageV2 = ({ onTierClick, onViewPredicted, onViewSignals }: OverviewPageV2Props) => {

  return (
    <div className="min-h-full bg-[#FAFBFC]">
      {/* Hero */}
      <section className="pt-14 pb-10 px-8 bg-white border-b border-border/50">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-[1100px] mx-auto text-center"
        >
          <h1 className="text-[2.75rem] font-bold text-foreground tracking-tight mb-3">
            Leadership Intelligence
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Your complete view of tomorrow's leaders, today.
          </p>
        </motion.div>
      </section>

      {/* Main Content */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="px-8 py-10"
      >
        <div className="max-w-[1100px] mx-auto space-y-10">
          
          {/* Pipeline Tiers - New Layout */}
          <motion.section variants={itemVariants}>
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-6">
              Leadership Pipeline Tiers
            </h2>

            <div className="grid grid-cols-5 gap-5">
              {/* Accelerate - Large Card (3 cols) */}
              <motion.div
                onClick={() => onTierClick?.("accelerate")}
                className="col-span-3 group relative rounded-2xl cursor-pointer overflow-hidden border border-border/60 hover:shadow-xl transition-all duration-300"
                style={{
                  background: 'linear-gradient(135deg, #dcfce7 0%, #d1fae5 30%, #ecfdf5 60%, #ffffff 100%)'
                }}
              >
                {/* Top badges */}
                <div className="absolute top-4 left-4 px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-foreground shadow-sm">
                  0.1%
                </div>
                <div className="absolute top-4 right-4 px-3 py-1.5 bg-emerald-500 rounded-full text-xs font-semibold text-white flex items-center gap-1.5 shadow-sm">
                  <Star className="h-3 w-3 fill-current" />
                  TOP TIER
                </div>

                <div className="flex min-h-[320px]">
                  {/* Left - Avatars */}
                  <div className="flex-1 flex items-end justify-center pb-8 pt-16">
                    <div className="flex -space-x-5">
                      {accelerateAvatars.map((avatar, i) => (
                        <img 
                          key={i}
                          src={avatar} 
                          alt="Leader"
                          className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg hover:scale-105 transition-transform"
                          style={{ zIndex: accelerateAvatars.length - i }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Right - Content */}
                  <div className="flex-1 flex flex-col justify-center pr-8 py-8">
                    <div className="flex items-center gap-4 mb-2">
                      <h3 className="text-2xl font-bold text-foreground">Accelerate</h3>
                      <div className="px-4 py-2 border-2 border-emerald-500 rounded-lg">
                        <span className="text-3xl font-bold text-emerald-500">30</span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">Leaders with strong signals</p>
                    
                    <p className="text-muted-foreground leading-relaxed mb-6">
                      Strong signals with ~70% VP+ prediction confidence. Fast-track with executive sponsorship and stretch assignments.
                    </p>

                    <button className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium text-sm transition-colors w-fit shadow-sm">
                      View accelerate leaders
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </motion.div>

              {/* Right Column - Nurture & Monitor (2 cols) */}
              <div className="col-span-2 flex flex-col gap-5">
                {/* Nurture Card */}
                <motion.div
                  onClick={() => onTierClick?.("nurture")}
                  className="flex-1 bg-white rounded-2xl border border-border/60 p-5 cursor-pointer hover:shadow-lg hover:border-amber-200 transition-all duration-300 group"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="flex -space-x-2">
                        {nurtureAvatars.map((avatar, i) => (
                          <img 
                            key={i}
                            src={avatar} 
                            alt="Leader"
                            className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
                          />
                        ))}
                      </div>
                      <span className="text-xs text-muted-foreground">2.3%</span>
                    </div>
                    <div className="px-3 py-1.5 border-2 border-amber-400 rounded-lg">
                      <span className="text-xl font-bold text-amber-500">700</span>
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-foreground mb-2">Nurture</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                    Medium signal strength. Prioritize for formal leadership development programs and cross-functional exposure.
                  </p>

                  <button className="w-full flex items-center justify-center gap-2 py-2.5 bg-muted/50 hover:bg-muted rounded-lg text-sm font-medium text-foreground transition-colors group-hover:bg-muted">
                    View pipeline
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </motion.div>

                {/* Monitor Card */}
                <motion.div
                  onClick={() => onTierClick?.("monitor")}
                  className="flex-1 bg-white rounded-2xl border border-border/60 p-5 cursor-pointer hover:shadow-lg hover:border-violet-200 transition-all duration-300 group"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="flex -space-x-2">
                        {monitorAvatars.map((avatar, i) => (
                          <img 
                            key={i}
                            src={avatar} 
                            alt="Leader"
                            className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
                          />
                        ))}
                      </div>
                      <span className="text-xs text-muted-foreground">4.8%</span>
                    </div>
                    <div className="px-3 py-1.5 border-2 border-violet-400 rounded-lg">
                      <span className="text-xl font-bold text-violet-500">1500</span>
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-foreground mb-2">Monitor</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                    Employees showing early leadership signals. Encourage through recognition, mentorship, and visibility opportunities.
                  </p>

                  <button className="w-full flex items-center justify-center gap-2 py-2.5 bg-muted/50 hover:bg-muted rounded-lg text-sm font-medium text-foreground transition-colors group-hover:bg-muted">
                    View pipeline
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </motion.div>
              </div>
            </div>
          </motion.section>

          {/* Two Column: Predictions + Insights */}
          <div className="grid grid-cols-5 gap-6">
            {/* Proven Predictions */}
            <motion.section variants={itemVariants} className="col-span-3">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-lg bg-primary/8 flex items-center justify-center">
                    <Target className="h-4 w-4 text-primary" />
                  </div>
                  <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Proven Predictions</h2>
                </div>
                <button 
                  onClick={onViewPredicted}
                  className="text-xs font-medium text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
                >
                  View all
                  <ArrowRight className="h-3 w-3" />
                </button>
              </div>

              <div className="bg-white rounded-2xl border border-border/60 p-5">
                <div className="grid grid-cols-4 gap-4">
                  {provenPredictions.map((person, i) => (
                    <motion.div 
                      key={person.name}
                      whileHover={{ y: -2 }}
                      className="group text-center cursor-pointer"
                    >
                      <div className="relative inline-block mb-3">
                        <img 
                          src={person.image}
                          alt={person.name}
                          className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-sm group-hover:shadow-md transition-shadow"
                        />
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-primary text-white text-[9px] font-bold flex items-center justify-center shadow-sm">
                          {person.yearsEarly}y
                        </div>
                      </div>
                      <p className="font-medium text-foreground text-xs leading-tight">{person.name}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{person.currentRole}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.section>

            {/* AI Insights */}
            <motion.section variants={itemVariants} className="col-span-2">
              <div className="flex items-center gap-2.5 mb-5">
                <div className="h-8 w-8 rounded-lg bg-accent-magenta/10 flex items-center justify-center">
                  <Sparkles className="h-4 w-4 text-accent-magenta" />
                </div>
                <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Insights</h2>
              </div>

              <div className="bg-white rounded-2xl border border-border/60 p-5 h-[calc(100%-44px)]">
                <div className="space-y-3">
                  {insights.map((insight, i) => (
                    <div 
                      key={i}
                      className="flex items-start gap-3 p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer group"
                    >
                      <div className={cn(
                        "w-1.5 h-1.5 rounded-full mt-1.5 shrink-0",
                        insight.type === "positive" ? "bg-emerald-400" : "bg-amber-400"
                      )} />
                      <p className="text-sm text-muted-foreground group-hover:text-foreground transition-colors flex-1">
                        {insight.text}
                      </p>
                      <ChevronRight className="h-4 w-4 text-muted-foreground/50 group-hover:text-muted-foreground transition-colors shrink-0" />
                    </div>
                  ))}
                </div>
              </div>
            </motion.section>
          </div>

          {/* Signals Preview */}
          <motion.section variants={itemVariants}>
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-lg bg-primary/8 flex items-center justify-center">
                  <Activity className="h-4 w-4 text-primary" />
                </div>
                <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Leadership Signals</h2>
              </div>
              <button 
                onClick={onViewSignals}
                className="text-xs font-medium text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
              >
                Explore all
                <ArrowRight className="h-3 w-3" />
              </button>
            </div>

            <div className="bg-white rounded-2xl border border-border/60 overflow-hidden">
              <div className="grid grid-cols-2">
                {/* Left: Key insight */}
                <div className="p-6 border-r border-border/40">
                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles className="h-4 w-4 text-accent-magenta" />
                    <span className="text-xs font-semibold uppercase tracking-wider text-accent-magenta">Key Finding</span>
                  </div>
                  <p className="text-foreground leading-relaxed">
                    Leaders with <span className="font-semibold">C-Suite access</span> and <span className="font-semibold">transformation experience</span> are promoted <span className="text-accent-magenta font-semibold">2.3× faster</span> than peers.
                  </p>
                  <p className="text-sm text-muted-foreground mt-3">
                    These patterns appear in 85% of senior promotions.
                  </p>
                </div>

                {/* Right: Stats */}
                <div className="p-6 bg-muted/20">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 rounded-xl bg-white border border-border/40">
                      <span className="text-2xl font-bold text-foreground">6</span>
                      <p className="text-xs text-muted-foreground mt-1">Signal categories</p>
                    </div>
                    <div className="text-center p-4 rounded-xl bg-white border border-border/40">
                      <span className="text-2xl font-bold text-foreground">42</span>
                      <p className="text-xs text-muted-foreground mt-1">Key behaviors</p>
                    </div>
                    <div className="text-center p-4 rounded-xl bg-white border border-border/40">
                      <span className="text-2xl font-bold text-emerald-500">92%</span>
                      <p className="text-xs text-muted-foreground mt-1">Prediction accuracy</p>
                    </div>
                    <div className="text-center p-4 rounded-xl bg-white border border-border/40">
                      <span className="text-2xl font-bold text-primary">5.2</span>
                      <p className="text-xs text-muted-foreground mt-1">Avg years early</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>

          {/* AI Assistant */}
          <motion.section variants={itemVariants}>
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 text-white">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center">
                    <Sparkles className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold">AI Assistant</h3>
                    <p className="text-sm text-white/60">Ask anything about your leadership data</p>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2 flex-wrap mb-4">
                {["Who's at flight risk?", "Top development actions", "Pipeline gaps"].map((q, i) => (
                  <button
                    key={i}
                    className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/15 text-sm text-white/80 hover:text-white transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
              
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Type your question..."
                  className="flex-1 px-4 py-2.5 rounded-xl bg-white/10 border border-white/10 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/20"
                />
                <button className="px-5 py-2.5 bg-white text-slate-900 rounded-xl font-medium text-sm hover:bg-white/90 transition-colors">
                  Ask
                </button>
              </div>
            </div>
          </motion.section>

        </div>
      </motion.div>
    </div>
  );
};

export default OverviewPageV2;
