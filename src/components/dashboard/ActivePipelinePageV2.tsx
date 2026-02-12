import { useState } from "react";
import { ArrowLeft, ArrowRight, Users, TrendingUp, Rocket, AlertTriangle, Target, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import AskAIButton from "@/components/ui/AskAIButton";

interface ActivePipelinePageV2Props {
  onBack: () => void;
  onTierClick?: (tier: "monitor" | "nurture" | "accelerate") => void;
}

const projectedAvatars = [
  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&h=100&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
];

// Calculate totals: 30 + 700 + 1500 = 2230
const healthMetrics = [
  { 
    label: "Total Future Leaders", 
    value: "2,230", 
    description: "Combined count across all pipeline tiers",
    icon: Users, 
    iconColor: "text-primary" 
  },
  { 
    label: "Accelerate", 
    value: "30", 
    description: "Leaders with strong signals",
    icon: Target, 
    iconColor: "text-success", 
    showAvatars: true 
  },
  { 
    label: "Stagnating", 
    value: "3", 
    description: "Accelerate leaders not progressing",
    icon: AlertTriangle, 
    iconColor: "text-warning", 
    warning: true 
  },
];

const pipelineStages = [
  {
    id: "accelerate" as const,
    title: "Accelerate",
    count: 30,
    percent: "0.1%",
    description: "Strong signals with ~70% VP+ prediction confidence. Fast-track with executive sponsorship and stretch assignments.",
    icon: Rocket,
    pillColor: "bg-success text-white",
    countBg: "bg-success/10",
    iconColor: "text-success",
    borderColor: "border-success/30",
    topPeople: [
      { name: "Victoria Reynolds", image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop&crop=face" },
      { name: "Michael Chang", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face" },
      { name: "Elizabeth Hart", image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&h=100&fit=crop&crop=face" },
      { name: "Daniel Kim", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face" },
    ],
  },
  {
    id: "nurture" as const,
    title: "Nurture",
    count: 700,
    percent: "2.3%",
    description: "Medium signal strength. Prioritize for formal leadership development programs and cross-functional exposure.",
    icon: TrendingUp,
    pillColor: "bg-warning text-white",
    countBg: "bg-warning/10",
    iconColor: "text-warning",
    borderColor: "border-warning/30",
    topPeople: [
      { name: "Amanda Foster", image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=100&h=100&fit=crop&crop=face" },
      { name: "James Wilson", image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop&crop=face" },
      { name: "Michelle Lee", image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop&crop=face" },
      { name: "Christopher Brown", image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop&crop=face" },
    ],
  },
  {
    id: "monitor" as const,
    title: "Monitor",
    count: 1500,
    percent: "4.8%",
    description: "Employees showing early leadership signals. Encourage through recognition, mentorship, and visibility opportunities.",
    icon: Users,
    pillColor: "bg-slate-600 text-white",
    countBg: "bg-slate-50",
    iconColor: "text-slate-600",
    borderColor: "border-slate-200",
    topPeople: [
      { name: "Emily Chen", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face" },
      { name: "Marcus Johnson", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face" },
      { name: "Sarah Williams", image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face" },
      { name: "David Park", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face" },
    ],
  },
];

const insights = {
  attention: [
    "3 leaders in Accelerate tier >24 months — potential flight risk",
    "Engineering has 14 future leaders (highest department volume)",
    "2 Nurture leaders have stalled progression for 6+ months",
  ],
  trends: [
    "8 people moved from Nurture → Accelerate (last 90 days)",
    "Average signal strength up 6% YoY across all tiers",
    "New entrant rate increased 23% this quarter",
  ],
};

// Pipeline Conversion Data - reversed order: Accelerate → Nurture → Monitor
const conversionStages = [
  { 
    name: "Accelerate", 
    value: 30, 
    textColor: "text-success", 
    description: "Strong signals",
    bgColor: "hsl(var(--success))"
  },
  { 
    name: "Nurture", 
    value: 700, 
    textColor: "text-warning", 
    description: "In development",
    bgColor: "hsl(var(--warning))"
  },
  { 
    name: "Monitor", 
    value: 1500, 
    textColor: "text-primary", 
    description: "Early signals",
    bgColor: "hsl(var(--primary))"
  },
];

// Pipeline Conversion Chart Component - Thinner Horizontal Bands
const PipelineConversionChart = () => {
  const total = conversionStages.reduce((sum, s) => sum + s.value, 0);
  
  return (
    <div className="bg-card border border-border rounded-2xl p-6 mb-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-foreground">Pipeline Conversion</h3>
          <p className="text-sm text-muted-foreground">Leadership tier progression</p>
        </div>
        <AskAIButton size="sm" />
      </div>
      
      {/* Horizontal Band Visualization - Thinner */}
      <div className="relative">
        {/* Main band container - thinner height */}
        <div className="flex h-16 rounded-xl overflow-hidden shadow-sm">
          {conversionStages.map((stage, index) => {
            const widthPercent = (stage.value / total) * 100;
            // First segment (Accelerate) needs minimum width since it has smallest value
            const needsMinWidth = index === 0 || index === conversionStages.length - 1;
            
            return (
              <motion.div
                key={stage.name}
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: `${Math.max(8, widthPercent)}%`, opacity: 1 }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className="flex items-center justify-center relative group cursor-pointer hover:brightness-110 transition-all"
                style={{ 
                  minWidth: needsMinWidth ? '100px' : undefined,
                  backgroundColor: stage.bgColor
                }}
              >
                <span className="text-white font-bold text-2xl drop-shadow-md">
                  {stage.value.toLocaleString()}
                </span>
                
                {/* Tooltip on hover */}
                <div className="absolute -top-14 left-1/2 -translate-x-1/2 bg-card border border-border rounded-lg px-3 py-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                  <p className="font-semibold text-foreground">{stage.name}</p>
                  <p className="text-sm text-muted-foreground">{stage.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Arrows between sections */}
        <div className="absolute inset-0 flex items-center pointer-events-none">
          <div className="flex w-full">
            {conversionStages.map((stage, index) => {
              const widthPercent = (stage.value / total) * 100;
              const needsMinWidth = index === 0 || index === conversionStages.length - 1;
              
              return (
                <div 
                  key={`arrow-${index}`} 
                  className="relative"
                  style={{ width: `${Math.max(8, widthPercent)}%`, minWidth: needsMinWidth ? '100px' : undefined }}
                >
                  {index < conversionStages.length - 1 && (
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10">
                      <div className="w-8 h-8 rounded-full bg-card border-2 border-border flex items-center justify-center shadow-md">
                        <ArrowLeft className="w-4 h-4 text-muted-foreground" />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Labels below */}
      <div className="flex mt-5">
        {conversionStages.map((stage, index) => {
          const widthPercent = (stage.value / total) * 100;
          const needsMinWidth = index === 0 || index === conversionStages.length - 1;
          
          return (
            <motion.div
              key={`label-${stage.name}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
              className="text-center"
              style={{ width: `${Math.max(8, widthPercent)}%`, minWidth: needsMinWidth ? '100px' : undefined }}
            >
              <p className={`font-semibold ${stage.textColor}`}>{stage.name}</p>
              <p className="text-sm text-muted-foreground">{stage.description}</p>
            </motion.div>
          );
        })}
      </div>

      {/* AI Insight */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.7 }}
        className="mt-6 pt-5 border-t border-border"
      >
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-accent-magenta/10 flex-shrink-0">
            <Sparkles className="w-5 h-5 text-accent-magenta" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground mb-1">AI Insight</p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Your pipeline shows strong early detection with <span className="font-semibold text-foreground">1,500 leaders identified</span>, 
              but the <span className="font-semibold text-foreground">4.3% conversion</span> from Advancing to Projected suggests a 
              development bottleneck. Consider expanding executive sponsorship programs to accelerate high-potential leaders through the final stage.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const ActivePipelinePageV2 = ({ onBack, onTierClick }: ActivePipelinePageV2Props) => {
  const [activeTab, setActiveTab] = useState<"overview" | "movement">("overview");

  return (
    <div className="py-12 bg-page-background min-h-full">
      <div className="max-w-[1100px] mx-auto px-8">
        {/* Hero Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <p className="text-sm font-semibold tracking-widest text-muted-foreground uppercase mb-4">
            Leadership Pipeline
          </p>
          <h1 className="text-4xl lg:text-5xl font-extrabold mb-4 text-foreground">
            Spot the Leaders Who Will
            <br />
            Shape What's Next
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            AI-powered leadership intelligence that identifies and develops your next generation
            of executive talent. Powered by the Workhuman Ascend model.
          </p>
        </motion.div>

        {/* Sub-tabs Navigation - Switch Style */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="flex justify-center mb-10"
        >
          <div className="inline-flex bg-card border border-border rounded-full p-1">
            <button
              onClick={() => setActiveTab("overview")}
              className={`px-5 py-2 rounded-full text-xs font-semibold transition-all ${
                activeTab === "overview"
                  ? "bg-slate-800 text-white shadow-lg"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Pipeline Overview
            </button>
            <button
              onClick={() => setActiveTab("movement")}
              className={`px-5 py-2 rounded-full text-xs font-semibold transition-all ${
                activeTab === "movement"
                  ? "bg-slate-800 text-white shadow-lg"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Pipeline Movement
            </button>
          </div>
        </motion.div>

        {activeTab === "overview" ? (
          <>
            {/* Pipeline Health Dashboard - Funnel Only */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-10 bg-card border border-border rounded-2xl p-8"
        >
          <div className="mb-6 text-center">
            <h3 className="text-lg font-bold text-foreground">Pipeline Health</h3>
          </div>
          
          {/* Stacked Trapezoid Funnel - Inverted (widens downward) */}
          <div className="relative py-8">
            {/* Funnel centered - smaller width with spacing */}
            <div className="flex flex-col items-center gap-2">
              {/* Accelerate - narrowest (top) */}
              <motion.div 
                className="flex flex-col items-center justify-center h-[90px] text-white cursor-pointer hover:brightness-110 transition-all"
                whileHover={{ scale: 1.02 }}
                style={{
                  width: '380px',
                  background: 'linear-gradient(180deg, #8B5CF6 0%, #7C3AED 100%)',
                  clipPath: 'polygon(15% 0%, 85% 0%, 95% 100%, 5% 100%)',
                }}
              >
                <span className="px-5 py-1 rounded-full bg-white/20 backdrop-blur-sm mb-1">
                  <span className="text-4xl font-bold drop-shadow-lg">30</span>
                </span>
                <span className="text-sm font-semibold opacity-90">Accelerate</span>
                <span className="w-10 h-0.5 bg-white/40 rounded-full mt-0.5"></span>
              </motion.div>
              
              {/* Nurture - medium */}
              <motion.div 
                className="flex flex-col items-center justify-center h-[90px] text-white cursor-pointer hover:brightness-110 transition-all"
                whileHover={{ scale: 1.02 }}
                style={{
                  width: '500px',
                  background: 'linear-gradient(180deg, #C084FC 0%, #A855F7 100%)',
                  clipPath: 'polygon(10% 0%, 90% 0%, 97% 100%, 3% 100%)',
                }}
              >
                <span className="px-5 py-1 rounded-full bg-white/20 backdrop-blur-sm mb-1">
                  <span className="text-4xl font-bold drop-shadow-lg">700</span>
                </span>
                <span className="text-sm font-semibold opacity-90">Nurture</span>
                <span className="w-10 h-0.5 bg-white/40 rounded-full mt-0.5"></span>
              </motion.div>
              
              {/* Monitor - widest (bottom) */}
              <motion.div 
                className="flex flex-col items-center justify-center h-[90px] text-white cursor-pointer hover:brightness-110 transition-all"
                whileHover={{ scale: 1.02 }}
                style={{
                  width: '620px',
                  background: 'linear-gradient(180deg, #FDA4AF 0%, #F472B6 100%)',
                  clipPath: 'polygon(6% 0%, 94% 0%, 100% 100%, 0% 100%)',
                }}
              >
                <span className="px-5 py-1 rounded-full bg-white/20 backdrop-blur-sm mb-1">
                  <span className="text-4xl font-bold drop-shadow-lg">1,500</span>
                </span>
                <span className="text-sm font-semibold opacity-90">Monitor</span>
                <span className="w-10 h-0.5 bg-white/40 rounded-full mt-0.5"></span>
              </motion.div>
            </div>
          </div>

          {/* AI Insight */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.7 }}
            className="mt-6 pt-5 border-t border-border"
          >
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-accent-magenta/10 flex-shrink-0">
                <Sparkles className="w-5 h-5 text-accent-magenta" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground mb-1">AI Insight</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Your pipeline shows strong early detection with <span className="font-semibold text-foreground">1,500 leaders identified</span>, 
                  but the <span className="font-semibold text-foreground">4.3% conversion</span> from Advancing to Projected suggests a 
                  development bottleneck. Consider expanding executive sponsorship programs to accelerate high-potential leaders through the final stage.
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Pipeline Tier Cards - Featured Layout */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-10"
        >
          <h2 className="text-sm font-bold tracking-widest text-muted-foreground uppercase mb-5">
            Leadership Pipeline Tiers
          </h2>
          
          <div className="grid grid-cols-5 gap-5">
            {/* Featured Accelerate Card - Takes 3 columns */}
            {(() => {
              const accelerateStage = pipelineStages.find(s => s.id === "accelerate")!;
              const Icon = accelerateStage.icon;
              return (
                <div 
                  onClick={() => onTierClick?.("accelerate")}
                  className="col-span-3 bg-gradient-to-br from-success/5 via-card to-success/10 border-2 border-success/30 rounded-2xl overflow-hidden cursor-pointer group transition-all hover:scale-[1.01] hover:shadow-2xl hover:border-success/50 relative"
                >
                  {/* Featured badge */}
                  <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full text-xs font-bold bg-success text-white shadow-lg z-10">
                    ★ TOP TIER
                  </div>
                  
                  <div className="flex h-full">
                    {/* Left - Avatars */}
                    <div className="relative bg-gradient-to-b from-success/10 to-transparent p-8 flex items-center justify-center min-w-[200px]">
                      <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full text-xs font-semibold bg-card text-foreground shadow-sm">
                        {accelerateStage.percent}
                      </div>
                      <div className="flex -space-x-5 mt-4">
                        {accelerateStage.topPeople.map((person, index) => (
                          <img 
                            key={person.name}
                            src={person.image}
                            alt={person.name}
                            className="w-20 h-20 rounded-full object-cover border-4 border-card shadow-xl transition-transform hover:scale-110 hover:z-10"
                            style={{ zIndex: 4 - index }}
                          />
                        ))}
                      </div>
                    </div>
                    
                    {/* Right - Content */}
                    <div className="flex-1 p-6 flex flex-col justify-center">
                      <div className="flex items-center gap-3 mb-3">
                        <div>
                          <h3 className="text-2xl font-bold text-foreground">
                            {accelerateStage.title}
                          </h3>
                          <p className="text-sm text-muted-foreground">Leaders with strong signals</p>
                        </div>
                        <div className={`ml-auto ${accelerateStage.countBg} ${accelerateStage.borderColor} border px-5 py-3 rounded-xl`}>
                          <span className="text-4xl font-bold text-success">{accelerateStage.count}</span>
                        </div>
                      </div>
                      
                      <p className="text-muted-foreground mb-5 leading-relaxed">
                        {accelerateStage.description}
                      </p>
                      
                      <button className="w-fit py-3 px-6 rounded-xl text-sm font-semibold bg-success text-white hover:bg-success/90 transition-colors flex items-center gap-2 shadow-lg shadow-success/20">
                        View accelerate leaders
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })()}
            
            {/* Right column - Nurture and Monitor stacked */}
            <div className="col-span-2 flex flex-col gap-5">
              {pipelineStages.filter(s => s.id !== "accelerate").map((stage) => {
                return (
                  <div 
                    key={stage.id}
                    onClick={() => onTierClick?.(stage.id)}
                    className="bg-card border border-border rounded-2xl overflow-hidden cursor-pointer group transition-all hover:scale-[1.02] hover:shadow-xl flex-1 flex flex-col"
                  >
                    {/* Compact header with avatars */}
                    <div className="relative bg-gradient-to-r from-muted/40 to-muted/10 p-5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex -space-x-3">
                            {stage.topPeople.slice(0, 3).map((person, index) => (
                              <img 
                                key={person.name}
                                src={person.image}
                                alt={person.name}
                                className="w-10 h-10 rounded-full object-cover border-2 border-card shadow-md"
                                style={{ zIndex: 3 - index }}
                              />
                            ))}
                          </div>
                          <span className="text-xs font-medium text-muted-foreground bg-card/80 px-2 py-1 rounded-full">
                            {stage.percent}
                          </span>
                        </div>
                        <div className={`${stage.countBg} ${stage.borderColor} border px-3 py-1.5 rounded-lg`}>
                          <span className={`text-xl font-bold ${stage.iconColor}`}>{stage.count}</span>
                        </div>
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="p-5 flex flex-col flex-1">
                      <h3 className="text-lg font-bold text-foreground mb-2">
                        {stage.title}
                      </h3>
                      
                      <p className="text-sm text-muted-foreground mb-4 leading-relaxed line-clamp-2 flex-1">
                        {stage.description}
                      </p>
                      
                      <button className="w-full py-2.5 px-4 rounded-lg text-sm font-medium text-primary bg-primary/5 hover:bg-primary/10 transition-colors flex items-center justify-center gap-2 group-hover:bg-primary group-hover:text-white">
                        View pipeline
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Key Insights Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="bg-card border border-border rounded-2xl p-8"
        >
          <h2 className="text-sm font-bold tracking-widest text-muted-foreground uppercase mb-6">
            Pipeline Insights
          </h2>
          
          <div className="grid grid-cols-2 gap-8">
            {/* Needs Attention */}
            <div className="border-r border-border pr-8">
              <div className="flex items-center gap-3 mb-5">
                <div className="p-2.5 rounded-xl bg-warning/10">
                  <AlertTriangle className="h-5 w-5 text-warning" />
                </div>
                <h3 className="text-lg font-bold text-foreground">Needs Attention</h3>
              </div>
              <ul className="space-y-4">
                {insights.attention.map((insight, index) => (
                  <li key={index} className="flex items-start gap-3 p-3 rounded-lg bg-warning/5 border border-warning/10">
                    <div className="w-2 h-2 rounded-full bg-warning mt-1.5 flex-shrink-0" />
                    <span className="text-sm text-foreground leading-relaxed">{insight}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Positive Trends */}
            <div className="pl-8">
              <div className="flex items-center gap-3 mb-5">
                <div className="p-2.5 rounded-xl bg-success/10">
                  <TrendingUp className="h-5 w-5 text-success" />
                </div>
                <h3 className="text-lg font-bold text-foreground">Positive Trends</h3>
              </div>
              <ul className="space-y-4">
                {insights.trends.map((insight, index) => (
                  <li key={index} className="flex items-start gap-3 p-3 rounded-lg bg-success/5 border border-success/10">
                    <div className="w-2 h-2 rounded-full bg-success mt-1.5 flex-shrink-0" />
                    <span className="text-sm text-foreground leading-relaxed">{insight}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
          </>
        ) : (
          /* Pipeline Movement - V3 Style Matrix */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-6"
          >
            <div className="mb-8 text-center">
              <h2 className="text-sm font-bold tracking-widest text-muted-foreground uppercase mb-2">
                Leadership Signal Map
              </h2>
              <p className="text-muted-foreground">
                Track leader progression across tenure and readiness dimensions
              </p>
            </div>
            
            {/* Quadrant Visualization */}
            <div className="relative">
              {/* Quadrant grid with background colors and inside labels */}
              <div className="relative h-[600px] rounded-xl border border-border">
                {/* Background quadrant colors */}
                <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 rounded-xl overflow-hidden">
                  <div className="bg-success/5 relative">
                    {/* Rising Stars label - top left */}
                    <div className="absolute top-4 left-4">
                      <h4 className="text-lg font-bold text-success">Rising Stars</h4>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">Rising Fast — Early Tenure</p>
                    </div>
                  </div>
                  <div className="bg-destructive/5 relative">
                    {/* Stagnating label - top right */}
                    <div className="absolute top-4 right-4 text-right">
                      <h4 className="text-lg font-bold text-destructive">Stagnating</h4>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">High Value — High Tenure</p>
                    </div>
                  </div>
                  <div className="bg-muted/30 relative">
                    {/* Developing label - bottom left corner */}
                    <div className="absolute bottom-4 left-4">
                      <h4 className="text-lg font-bold text-slate-500">Developing</h4>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">Growing — Early Tenure</p>
                    </div>
                  </div>
                  <div className="bg-primary/5 relative">
                    {/* Stable Anchors label - bottom right corner */}
                    <div className="absolute bottom-4 right-4 text-right">
                      <h4 className="text-lg font-bold text-primary">Stable Anchors</h4>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">Consistent — High Tenure</p>
                    </div>
                  </div>
                </div>

                {/* Grid lines */}
                <div className="absolute left-1/2 top-0 bottom-0 border-l-2 border-dashed border-border" />
                <div className="absolute top-1/2 left-0 right-0 border-t-2 border-dashed border-border" />

                {/* People plotted on quadrant */}
                {[
                  // RISING STARS (top-left): High signal, early tenure (0-5 years)
                  { name: "Sarah Mitchell", tier: "Accelerate", x: 35, y: 18, timeInRole: "1.5 years", image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop&crop=face", insight: "Exceptional trajectory—reached Accelerate tier in just 18 months." },
                  { name: "Sofia Rodriguez", tier: "Nurture", x: 25, y: 35, timeInRole: "2.5 years", image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop&crop=face", insight: "Rapid signal growth over 2.5 years." },
                  
                  // STAGNATING (top-right): High signal, long tenure (5+ years)
                  { name: "Daniela Chen", tier: "Accelerate", x: 62, y: 15, timeInRole: "6 years", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face", insight: "⚠️ Strong signals but 6 years without promotion." },
                  { name: "Marcus Thompson", tier: "Nurture", x: 72, y: 40, timeInRole: "7 years", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face", insight: "⚠️ Strong people leadership signals but plateauing." },
                  { name: "Tom Bradley", tier: "Accelerate", x: 82, y: 28, timeInRole: "8 years", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face", insight: "⚠️ Critical: 8 years at Accelerate tier." },
                  
                  // DEVELOPING (bottom-left): Lower signal, early tenure (0-5 years)
                  { name: "James Wilson", tier: "Monitor", x: 28, y: 58, timeInRole: "2 years", image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop&crop=face", insight: "Early signals emerging after 2 years." },
                  { name: "Liam O'Connor", tier: "Monitor", x: 18, y: 72, timeInRole: "1 year", image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop&crop=face", insight: "Newest pipeline entrant at 1 year." },
                  
                  // STEADY LEADERS (bottom-right): Consistent signal, long tenure (5+ years)
                  { name: "Priya Sharma", tier: "Nurture", x: 68, y: 55, timeInRole: "6.5 years", image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=100&h=100&fit=crop&crop=face", insight: "Reliable contributor with consistent execution." },
                  { name: "Elena Vasquez", tier: "Nurture", x: 58, y: 65, timeInRole: "7.5 years", image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face", insight: "Steady progression with strong execution signals." },
                ].map((person, index) => {
                  const tierColors: Record<string, string> = {
                    Accelerate: "ring-3 ring-success/60",
                    Nurture: "ring-3 ring-warning/60",
                    Monitor: "ring-3 ring-slate-400/60",
                  };
                  
                  return (
                    <motion.div
                      key={person.name}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4, delay: 0.1 + index * 0.05 }}
                      className="absolute flex flex-col items-center cursor-pointer group z-10 hover:z-50"
                      style={{ left: `${person.x}%`, top: `${person.y}%`, transform: 'translate(-50%, -50%)' }}
                    >
                      <div className="relative">
                        <img
                          src={person.image}
                          alt={person.name}
                          className={`w-14 h-14 rounded-full object-cover border-2 border-card shadow-lg transition-transform group-hover:scale-110 group-hover:shadow-xl ${tierColors[person.tier]}`}
                        />
                      </div>
                      <span className="text-xs font-medium text-foreground mt-2 whitespace-nowrap">{person.name}</span>
                      
                      {/* Hover tooltip */}
                      <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-48 p-2 bg-card border border-border rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-[100]">
                        <div className="flex items-center gap-2 mb-1">
                          <Sparkles className="w-3 h-3 text-accent-magenta flex-shrink-0" />
                          <span className="text-xs text-muted-foreground">In role: {person.timeInRole}</span>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">{person.insight}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Tenure Timeline - Outside the matrix */}
              <div className="mt-4 px-2">
                <div className="flex justify-between items-center py-2">
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((year) => (
                    <span key={year} className="text-xs text-muted-foreground font-medium">{year}</span>
                  ))}
                </div>
                <p className="text-center text-sm text-muted-foreground mt-1">Time in current pipeline (years)</p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ActivePipelinePageV2;
