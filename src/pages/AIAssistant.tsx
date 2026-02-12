import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { ArrowUpRight, TrendingUp, Users, Dna, Sparkles, ChevronRight, Bot, Zap, Target, Award, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const AIAssistant = () => {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const predictedLeaders = [
    { name: "Sarah Chen", role: "Senior PM", score: 94, trend: "+12%", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop" },
    { name: "Marcus Rivera", role: "Engineering Lead", score: 91, trend: "+8%", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop" },
    { name: "Aisha Patel", role: "Design Director", score: 89, trend: "+15%", image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=100&h=100&fit=crop" },
  ];

  const pipelineStats = [
    { stage: "Ready Now", count: 12, color: "bg-emerald-500", lightColor: "bg-emerald-100", textColor: "text-emerald-700" },
    { stage: "1-2 Years", count: 28, color: "bg-blue-500", lightColor: "bg-blue-100", textColor: "text-blue-700" },
    { stage: "Developing", count: 45, color: "bg-amber-500", lightColor: "bg-amber-100", textColor: "text-amber-700" },
  ];

  const dnaBehaviors = [
    { name: "Strategic Vision", strength: "Strong", percentage: 87 },
    { name: "Team Empowerment", strength: "Strong", percentage: 82 },
    { name: "Innovation Drive", strength: "Medium", percentage: 71 },
  ];

  return (
    <Layout>
      <div className="h-full bg-gradient-to-br from-slate-50 via-white to-blue-50/30 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-6 py-10">
          
          {/* Header */}
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-br from-primary to-violet-600 shadow-lg shadow-primary/25">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <span className="text-sm font-semibold text-primary tracking-wide uppercase">AI-Powered Insights</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-3 tracking-tight">
            Leadership Intelligence
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mb-12">
            Your AI assistant synthesizes millions of data points to surface leadership potential across your organization.
          </p>

          {/* Bento Grid Layout */}
          <div className="grid grid-cols-12 gap-5 auto-rows-[minmax(140px,auto)]">
            
            {/* Main Stat Card - Prediction Accuracy */}
            <div 
              className={cn(
                "col-span-12 md:col-span-4 row-span-2 relative group cursor-pointer",
                "bg-white rounded-3xl p-7 overflow-hidden",
                "border border-slate-200/80 shadow-xl shadow-slate-200/50",
                "transition-all duration-500 hover:shadow-2xl hover:shadow-primary/15 hover:border-primary/30"
              )}
              onMouseEnter={() => setHoveredCard("main")}
              onMouseLeave={() => setHoveredCard(null)}
            >
              {/* Decorative gradient orb */}
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-primary/20 to-violet-400/20 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-violet-500 to-primary rounded-b-3xl" />
              
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-8">
                  <Sparkles className="w-5 h-5 text-primary" />
                  <span className="text-sm font-semibold text-primary">Proven Predictions</span>
                </div>
                <div className="mb-2">
                  <span className="text-8xl font-black text-foreground tracking-tighter">89</span>
                  <span className="text-4xl font-bold text-primary ml-1">%</span>
                </div>
                <p className="text-muted-foreground text-sm mb-8">Prediction accuracy rate</p>
                <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-emerald-50 text-emerald-600 text-sm font-semibold w-fit">
                  <TrendingUp className="w-4 h-4" />
                  <span>+12% from last quarter</span>
                </div>
              </div>
              <div className={cn(
                "absolute bottom-6 right-6 p-3 rounded-2xl bg-slate-100 group-hover:bg-primary group-hover:text-white",
                "transition-all duration-300"
              )}>
                <ArrowUpRight className="w-5 h-5" />
              </div>
            </div>

            {/* Top Predicted Leaders */}
            <div 
              className={cn(
                "col-span-12 md:col-span-5 row-span-2",
                "bg-white rounded-3xl p-6 border border-slate-200/80",
                "shadow-xl shadow-slate-200/50",
                "transition-all duration-300 hover:shadow-2xl hover:border-slate-300"
              )}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-amber-100">
                    <Target className="w-5 h-5 text-amber-600" />
                  </div>
                  <span className="font-bold text-foreground text-lg">Top Predicted</span>
                </div>
                <button className="text-sm text-primary hover:text-primary/80 flex items-center gap-1 font-semibold transition-colors">
                  View all <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-3">
                {predictedLeaders.map((leader, idx) => (
                  <div 
                    key={leader.name}
                    className={cn(
                      "flex items-center gap-4 p-4 rounded-2xl transition-all duration-300",
                      "hover:bg-slate-50 cursor-pointer group border border-transparent hover:border-slate-200"
                    )}
                  >
                    <div className="relative">
                      <img 
                        src={leader.image} 
                        alt={leader.name}
                        className="w-12 h-12 rounded-xl object-cover"
                      />
                      <div className={cn(
                        "absolute -top-1 -right-1 w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold text-white shadow-md",
                        idx === 0 ? "bg-gradient-to-br from-amber-400 to-orange-500" :
                        idx === 1 ? "bg-gradient-to-br from-slate-400 to-slate-500" :
                        "bg-gradient-to-br from-amber-600 to-amber-700"
                      )}>
                        {idx + 1}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-foreground truncate">{leader.name}</p>
                      <p className="text-sm text-muted-foreground">{leader.role}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-foreground">{leader.score}</p>
                      <p className="text-xs text-emerald-600 font-semibold">{leader.trend}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="col-span-12 md:col-span-3 row-span-2 flex flex-col gap-5">
              <button className={cn(
                "flex-1 relative group overflow-hidden text-left",
                "bg-gradient-to-br from-primary to-violet-600 rounded-3xl p-6",
                "shadow-xl shadow-primary/25",
                "transition-all duration-300 hover:shadow-2xl hover:shadow-primary/40 hover:scale-[1.02]"
              )}>
                <div className="p-3 rounded-2xl bg-white/20 w-fit mb-4">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <p className="font-bold text-white text-lg mb-1">Quick Analysis</p>
                <p className="text-sm text-white/80">AI-powered insights</p>
                <ArrowRight className="absolute bottom-5 right-5 w-5 h-5 text-white/60 group-hover:text-white group-hover:translate-x-1 transition-all" />
              </button>
              <button className={cn(
                "flex-1 relative group overflow-hidden text-left",
                "bg-white border border-slate-200/80 rounded-3xl p-6",
                "shadow-xl shadow-slate-200/50",
                "transition-all duration-300 hover:border-amber-300 hover:shadow-xl hover:shadow-amber-100"
              )}>
                <div className="p-3 rounded-2xl bg-amber-100 w-fit mb-4">
                  <Award className="w-6 h-6 text-amber-600" />
                </div>
                <p className="font-bold text-foreground text-lg mb-1">Calibration</p>
                <p className="text-sm text-muted-foreground">Review & validate</p>
                <ArrowRight className="absolute bottom-5 right-5 w-5 h-5 text-slate-300 group-hover:text-amber-500 group-hover:translate-x-1 transition-all" />
              </button>
            </div>

            {/* Pipeline Overview */}
            <div 
              className={cn(
                "col-span-12 md:col-span-6",
                "bg-white rounded-3xl p-6 border border-slate-200/80",
                "shadow-xl shadow-slate-200/50",
                "transition-all duration-300 hover:shadow-2xl"
              )}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-blue-100">
                    <Users className="w-5 h-5 text-blue-600" />
                  </div>
                  <span className="font-bold text-foreground text-lg">Leadership Pipeline</span>
                </div>
                <span className="text-3xl font-bold text-foreground">85</span>
              </div>
              <div className="flex gap-1.5 h-4 rounded-full overflow-hidden bg-slate-100 mb-5">
                {pipelineStats.map((stat) => (
                  <div 
                    key={stat.stage}
                    className={cn(stat.color, "transition-all duration-500 hover:opacity-80 first:rounded-l-full last:rounded-r-full")}
                    style={{ width: `${(stat.count / 85) * 100}%` }}
                  />
                ))}
              </div>
              <div className="flex gap-4">
                {pipelineStats.map((stat) => (
                  <div key={stat.stage} className={cn("flex-1 p-3 rounded-2xl", stat.lightColor)}>
                    <p className={cn("text-2xl font-bold", stat.textColor)}>{stat.count}</p>
                    <p className="text-xs font-medium text-muted-foreground mt-1">{stat.stage}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* DNA Snapshot */}
            <div 
              className={cn(
                "col-span-12 md:col-span-6",
                "bg-white rounded-3xl p-6 border border-slate-200/80",
                "shadow-xl shadow-slate-200/50",
                "transition-all duration-300 hover:shadow-2xl"
              )}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-emerald-100">
                    <Dna className="w-5 h-5 text-emerald-600" />
                  </div>
                  <span className="font-bold text-foreground text-lg">Leadership DNA</span>
                </div>
                <button className="text-sm text-primary hover:text-primary/80 flex items-center gap-1 font-semibold transition-colors">
                  Explore <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-4">
                {dnaBehaviors.map((behavior) => (
                  <div key={behavior.name} className="group">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-foreground">{behavior.name}</span>
                      <span className={cn(
                        "text-xs font-semibold px-3 py-1 rounded-full",
                        behavior.strength === "Strong" 
                          ? "bg-emerald-100 text-emerald-700" 
                          : "bg-amber-100 text-amber-700"
                      )}>
                        {behavior.strength}
                      </span>
                    </div>
                    <div className="h-2.5 rounded-full bg-slate-100 overflow-hidden">
                      <div 
                        className={cn(
                          "h-full rounded-full transition-all duration-500",
                          behavior.strength === "Strong" 
                            ? "bg-gradient-to-r from-emerald-500 to-emerald-400" 
                            : "bg-gradient-to-r from-amber-500 to-amber-400"
                        )}
                        style={{ width: `${behavior.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Insight Banner */}
            <div 
              className={cn(
                "col-span-12",
                "bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900",
                "rounded-3xl p-6",
                "flex items-center gap-6 shadow-xl"
              )}
            >
              <div className="p-4 rounded-2xl bg-gradient-to-br from-primary/40 to-violet-500/40 border border-white/10">
                <Bot className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-primary font-semibold mb-1">AI Insight</p>
                <p className="text-white text-lg leading-relaxed">
                  "Your Q4 predictions show a <span className="text-emerald-400 font-semibold">23% improvement</span> in 
                  identifying high-potential leaders early. Sarah Chen's trajectory suggests she'll be ready for 
                  VP-level responsibilities within 6 months."
                </p>
              </div>
              <button className="shrink-0 px-6 py-3 rounded-2xl bg-white text-foreground font-semibold hover:bg-slate-100 transition-colors shadow-lg">
                Ask AI
              </button>
            </div>

          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AIAssistant;
