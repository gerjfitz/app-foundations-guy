import { ArrowRight, Users, TrendingUp, Rocket, AlertTriangle, Target, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import AskAIButton from "@/components/ui/AskAIButton";

interface ActivePipelinePageV7Props {
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
    description: "Leaders ready for executive roles",
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
    "3 leaders in Projected tier >24 months — potential flight risk",
    "Engineering has 14 future leaders (highest department volume)",
    "2 Advancing leaders have stalled progression for 6+ months",
  ],
  trends: [
    "8 people moved from Advancing → Projected (last 90 days)",
    "Average signal strength up 6% YoY across all tiers",
    "New entrant rate increased 23% this quarter",
  ],
};

// Pipeline Conversion Data - solid colors, no gradient
const conversionStages = [
  { 
    name: "Monitor", 
    value: 1500, 
    textColor: "text-primary", 
    description: "Early signals",
    bgColor: "hsl(var(--primary))"
  },
  { 
    name: "Nurture", 
    value: 700, 
    textColor: "text-warning", 
    description: "In development",
    bgColor: "hsl(var(--warning))"
  },
  { 
    name: "Accelerate", 
    value: 30, 
    textColor: "text-success", 
    description: "Executive ready",
    bgColor: "hsl(var(--success))"
  },
];

// Pipeline Conversion Chart Component - Thinner Horizontal Bands
const PipelineConversionChart = () => {
  const total = conversionStages[0].value;
  
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
            const minWidth = index === conversionStages.length - 1 ? 8 : widthPercent;
            
            return (
              <motion.div
                key={stage.name}
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: `${Math.max(minWidth, widthPercent)}%`, opacity: 1 }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className="flex items-center justify-center relative group cursor-pointer hover:brightness-110 transition-all"
                style={{ 
                  minWidth: index === conversionStages.length - 1 ? '100px' : undefined,
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
              const minWidth = index === conversionStages.length - 1 ? 8 : widthPercent;
              
              return (
                <div 
                  key={`arrow-${index}`} 
                  className="relative"
                  style={{ width: `${Math.max(minWidth, widthPercent)}%`, minWidth: index === conversionStages.length - 1 ? '100px' : undefined }}
                >
                  {index < conversionStages.length - 1 && (
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10">
                      <div className="w-8 h-8 rounded-full bg-card border-2 border-border flex items-center justify-center shadow-md">
                        <ArrowRight className="w-4 h-4 text-muted-foreground" />
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
          const minWidth = index === conversionStages.length - 1 ? 8 : widthPercent;
          
          return (
            <motion.div
              key={`label-${stage.name}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
              className="text-center"
              style={{ width: `${Math.max(minWidth, widthPercent)}%`, minWidth: index === conversionStages.length - 1 ? '80px' : undefined }}
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

const ActivePipelinePageV7 = ({ onBack, onTierClick }: ActivePipelinePageV7Props) => {
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

        {/* Unified Pipeline Health Dashboard */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-10 bg-card border border-border rounded-2xl p-8"
        >
          {/* Top Row - 3 Metrics */}
          <div className="grid grid-cols-3 gap-8">
            {healthMetrics.map((metric, index) => {
              const Icon = metric.icon;
              return (
                <motion.div 
                  key={metric.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 + index * 0.05 }}
                  className={`text-center ${index < healthMetrics.length - 1 ? 'border-r border-border' : ''}`}
                >
                  <div className="flex justify-center mb-4">
                    <div className={`p-2.5 rounded-lg ${metric.warning ? 'bg-warning/10' : 'bg-muted'}`}>
                      <Icon className={`h-6 w-6 ${metric.iconColor}`} />
                    </div>
                  </div>
                  <div className="flex items-center justify-center mb-1">
                    <span className={`text-5xl font-bold ${metric.warning ? 'text-warning' : 'text-foreground'}`}>
                      {metric.value}
                    </span>
                  </div>
                  <p className="text-base font-medium text-foreground mb-1">{metric.label}</p>
                  <p className="text-sm text-muted-foreground">{metric.description}</p>
                </motion.div>
              );
            })}
          </div>

        </motion.div>

        {/* Tier Cards Section - Replacing Pipeline Health Graph */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-10"
        >
          <div className="grid grid-cols-5 gap-5">
            {/* Featured Accelerate Card - Takes 3 columns */}
            {(() => {
              const accelerateStage = pipelineStages.find(s => s.id === "accelerate")!;
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
                    {/* Left - 2x2 Avatar Grid */}
                    <div className="relative bg-gradient-to-b from-success/10 to-transparent p-6 flex items-center justify-center min-w-[220px]">
                      <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full text-xs font-semibold bg-card text-foreground shadow-sm">
                        {accelerateStage.percent}
                      </div>
                      <div className="grid grid-cols-2 gap-3 mt-4">
                        {accelerateStage.topPeople.map((person) => (
                          <img 
                            key={person.name}
                            src={person.image}
                            alt={person.name}
                            className="w-24 h-24 rounded-xl object-cover border-3 border-card shadow-lg transition-transform hover:scale-105"
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
                          <p className="text-sm text-muted-foreground">Executive-ready leaders</p>
                        </div>
                        <div className={`ml-auto ${accelerateStage.countBg} ${accelerateStage.borderColor} border px-5 py-3 rounded-xl`}>
                          <span className="text-4xl font-bold text-success">{accelerateStage.count}</span>
                        </div>
                      </div>
                      
                      <p className="text-muted-foreground mb-5 leading-relaxed">
                        {accelerateStage.description}
                      </p>
                      
                      <button className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-success bg-success/10 hover:bg-success/20 transition-colors w-fit border border-success/30">
                        View accelerate leaders
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Stacked Nurture & Monitor Cards - Takes 2 columns */}
            <div className="col-span-2 flex flex-col gap-5">
              {pipelineStages.filter(s => s.id !== "accelerate").map((stage) => (
                <div 
                  key={stage.id}
                  onClick={() => onTierClick?.(stage.id)}
                  className={`flex-1 bg-card border ${stage.borderColor} rounded-2xl p-5 cursor-pointer group hover:shadow-lg hover:scale-[1.01] transition-all`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex gap-2">
                      {stage.topPeople.slice(0, 3).map((person) => (
                        <img 
                          key={person.name}
                          src={person.image}
                          alt={person.name}
                          className="w-10 h-10 rounded-xl object-cover border-2 border-card"
                        />
                      ))}
                    </div>
                    <span className="text-xs text-muted-foreground">{stage.percent}</span>
                    <div className={`ml-auto ${stage.countBg} ${stage.borderColor} border px-4 py-2 rounded-lg`}>
                      <span className={`text-2xl font-bold ${stage.iconColor}`}>{stage.count}</span>
                    </div>
                  </div>
                  
                  <h4 className="font-bold text-foreground text-lg mb-1">{stage.title}</h4>
                  <p className="text-sm text-muted-foreground line-clamp-2">{stage.description}</p>
                  
                  <button className="mt-4 flex items-center gap-2 w-full justify-center px-4 py-2.5 rounded-lg font-medium text-foreground bg-muted hover:bg-muted/80 transition-colors text-sm">
                    View pipeline
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ))}
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
      </div>
    </div>
  );
};

export default ActivePipelinePageV7;
