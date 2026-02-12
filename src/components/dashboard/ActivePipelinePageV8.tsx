import { ArrowRight, Users, TrendingUp, Rocket, AlertTriangle, Target, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useMemo } from "react";
import AskAIButton from "@/components/ui/AskAIButton";
import dashboardBg from "@/assets/dashboard-bg.png";

interface ActivePipelinePageV8Props {
  onBack: () => void;
  onTierClick?: (tier: "monitor" | "nurture" | "accelerate") => void;
  onPersonClick?: (personId: string) => void;
}

// Pipeline Movement visualization data
const pipelineMovementData = [
  { 
    name: "Victoria Reynolds", 
    role: "Senior Director, R&D", 
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop&crop=face",
    movement: 85,
    direction: "up" as const,
    changeLabel: "+2 tiers in 6 months",
    tier: "accelerate" as const,
  },
  { 
    name: "Richard Lee", 
    role: "VP, R&D Operations", 
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    movement: 70,
    direction: "up" as const,
    changeLabel: "+1 tier in 3 months",
    tier: "accelerate" as const,
  },
  { 
    name: "Daniel Kim", 
    role: "Senior Director, Manufacturing", 
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    movement: 60,
    direction: "up" as const,
    changeLabel: "Steady growth",
    tier: "nurture" as const,
  },
  { 
    name: "Michael Chang", 
    role: "VP, Commercial Strategy", 
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
    movement: 55,
    direction: "up" as const,
    changeLabel: "+1 tier in 4 months",
    tier: "accelerate" as const,
  },
  { 
    name: "Andrew Walsh", 
    role: "Executive Director, R&D", 
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop&crop=face",
    movement: 45,
    direction: "stable" as const,
    changeLabel: "Consistent performance",
    tier: "nurture" as const,
  },
  { 
    name: "Elizabeth Hart", 
    role: "Executive Director, Medical", 
    image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&h=100&fit=crop&crop=face",
    movement: 40,
    direction: "up" as const,
    changeLabel: "Rising signals",
    tier: "nurture" as const,
  },
];

// Generate timeline data for each tier with exponential decay (more people at start, fewer later)
const generateTimelineData = () => {
  const people: {
    id: string;
    name: string;
    role: string;
    tier: "monitor" | "nurture" | "accelerate";
    monthsInTier: number;
    confidence: number;
    image: string;
  }[] = [];

  // Exponential decay function - more people at lower months, fewer at higher
  const getExponentialMonth = (maxMonths: number, decay: number = 0.3) => {
    const random = Math.random();
    // Inverse exponential distribution
    return Math.floor(-Math.log(1 - random * (1 - Math.exp(-decay * maxMonths))) / decay) + 1;
  };

  const projectedNames = [
    { name: "Victoria Reynolds", role: "Director of Engineering", image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop&crop=face" },
    { name: "Michael Chang", role: "VP of Product", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face" },
    { name: "Elizabeth Hart", role: "Senior Director", image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&h=100&fit=crop&crop=face" },
    { name: "Daniel Kim", role: "Head of Strategy", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face" },
    { name: "Michelle Lee", role: "Marketing Director", image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop&crop=face" },
  ];
  
  projectedNames.forEach((p, i) => {
    people.push({
      id: `accelerate-${i}`,
      ...p,
      tier: "accelerate",
      monthsInTier: getExponentialMonth(120, 0.025),
      confidence: 0.75 + Math.random() * 0.2,
    });
  });
  
  for (let i = 5; i < 30; i++) {
    people.push({
      id: `accelerate-${i}`,
      name: `Executive ${i - 4}`,
      role: "Senior Leader",
      tier: "accelerate",
      monthsInTier: getExponentialMonth(120, 0.02),
      confidence: 0.7 + Math.random() * 0.25,
      image: "",
    });
  }

  for (let i = 0; i < 50; i++) {
    people.push({
      id: `nurture-${i}`,
      name: `Manager ${i + 1}`,
      role: "Manager",
      tier: "nurture",
      monthsInTier: getExponentialMonth(120, 0.018),
      confidence: 0.45 + Math.random() * 0.3,
      image: "",
    });
  }

  for (let i = 0; i < 80; i++) {
    people.push({
      id: `monitor-${i}`,
      name: `Employee ${i + 1}`,
      role: "Individual Contributor",
      tier: "monitor",
      monthsInTier: getExponentialMonth(120, 0.015),
      confidence: 0.2 + Math.random() * 0.35,
      image: "",
    });
  }

  return people;
};

// Group by yearly buckets (10 buckets for 10 years)
const groupByTimeBuckets = (people: ReturnType<typeof generateTimelineData>, tier: string) => {
  const tierPeople = people.filter(p => p.tier === tier);
  const buckets: { month: number; count: number; people: typeof tierPeople }[] = [];
  
  // 10 buckets for 10 years (each bucket = 12 months)
  for (let i = 0; i < 10; i++) {
    const minMonth = i * 12;
    const maxMonth = (i + 1) * 12;
    const inBucket = tierPeople.filter(p => p.monthsInTier >= minMonth && p.monthsInTier < maxMonth);
    if (inBucket.length > 0) {
      buckets.push({
        month: minMonth + 6, // Center of the year
        count: inBucket.length,
        people: inBucket,
      });
    }
  }
  
  return buckets;
};

// Pipeline Funnel Visualization Component
const PipelineFunnelVisualization = ({ 
  onTierClick 
}: { 
  onTierClick?: (tier: "monitor" | "nurture" | "accelerate") => void;
}) => {
  const [hoveredTier, setHoveredTier] = useState<string | null>(null);
  
  const tiers = [
    { 
      id: "accelerate" as const, 
      label: "Accelerate", 
      count: 30,
      insight: "8 leaders ready for VP+ roles within 6 months",
      widthPercent: 35,
      bgColor: "#dcfce7",
      borderColor: "#86efac",
      countBg: "#bbf7d0",
    },
    { 
      id: "nurture" as const, 
      label: "Nurture", 
      count: 700,
      insight: "Engineering shows 23% higher signal density than average",
      widthPercent: 60,
      bgColor: "#fef3c7",
      borderColor: "#fcd34d",
      countBg: "#fde68a",
    },
    { 
      id: "monitor" as const, 
      label: "Monitor", 
      count: 1500,
      insight: "142 new signals detected in the last 30 days",
      widthPercent: 90,
      bgColor: "#e0e7ff",
      borderColor: "#a5b4fc",
      countBg: "#c7d2fe",
    },
  ];

  // Conversion data between tiers (last 12 months)
  const conversions = [
    { from: "monitor", to: "nurture", count: 89, label: "Monitor → Nurture" },
    { from: "nurture", to: "accelerate", count: 12, label: "Nurture → Accelerate" },
  ];

  return (
    <div className="mb-10">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="overflow-hidden"
      >

        {/* Funnel Visualization - Separate Panels */}
        <div className="relative flex flex-col items-center pb-8 pt-4 px-4">
          {/* Perspective container */}
          <div 
            className="relative w-full max-w-4xl flex flex-col gap-4"
          >
            {tiers.map((tier, index) => {
              return (
                <div key={tier.id}>
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.15 }}
                    className="relative mx-auto"
                    style={{ 
                      width: `${tier.widthPercent}%`,
                    }}
                    onClick={() => onTierClick?.(tier.id)}
                  >
                    {/* Panel */}
                    <div 
                      className="relative overflow-hidden flex items-center"
                      style={{
                        backgroundColor: tier.bgColor,
                        borderRadius: "16px",
                        border: `1px solid ${tier.borderColor}`,
                        padding: "16px",
                      }}
                    >
                      {/* Content */}
                      <div className="relative flex items-center gap-5 w-full">
                        {/* Count badge */}
                        <div 
                          className="w-20 h-20 rounded-2xl flex items-center justify-center flex-shrink-0"
                          style={{ 
                            backgroundColor: tier.countBg,
                            border: `1px solid ${tier.borderColor}`,
                          }}
                        >
                          <span className="text-3xl font-bold text-foreground">{tier.count.toLocaleString()}</span>
                        </div>
                        {/* Label and AI Insight */}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-bold text-foreground">{tier.label}</h3>
                          <p className="text-sm text-muted-foreground truncate">{tier.insight}</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>

      </motion.div>
    </div>
  );
};

// Health metrics data
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
    countBg: "bg-violet-50",
    iconColor: "text-violet-600",
    borderColor: "border-violet-200",
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

const ActivePipelinePageV8 = ({ onBack, onTierClick, onPersonClick }: ActivePipelinePageV8Props) => {
  const [activeTab, setActiveTab] = useState<"overview" | "matrix" | "movement">("overview");
  
  return (
    <div 
      className="py-12 min-h-full bg-no-repeat"
      style={{
        backgroundImage: `url(${dashboardBg})`,
        backgroundSize: "100% auto",
        backgroundPosition: "center top -30px",
        backgroundColor: "white",
      }}
    >
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
              Overview
            </button>
            <button
              onClick={() => setActiveTab("matrix")}
              className={`px-5 py-2 rounded-full text-xs font-semibold transition-all ${
                activeTab === "matrix"
                  ? "bg-slate-800 text-white shadow-lg"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Pipeline Matrix
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

        {activeTab === "overview" && (
          <>
            {/* Pipeline Funnel Visualization */}
            <PipelineFunnelVisualization onTierClick={onTierClick} />

        {/* Tier Cards Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-10 mt-[50px]"
        >
          <div className="grid grid-cols-5 gap-5">
            {/* Featured Accelerate Card */}
            {(() => {
              const accelerateStage = pipelineStages.find(s => s.id === "accelerate")!;
              return (
                <div 
                  onClick={() => onTierClick?.("accelerate")}
                  className="col-span-3 bg-gradient-to-br from-success/5 via-card to-success/10 border-2 border-success/30 rounded-2xl overflow-hidden cursor-pointer group transition-all hover:scale-[1.01] hover:shadow-2xl hover:border-success/50 relative"
                >
                  <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full text-xs font-bold bg-success text-white shadow-lg z-10">
                    ★ TOP TIER
                  </div>
                  
                  <div className="flex h-full">
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
                      
                      <button className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-success bg-success/10 hover:bg-success/20 transition-colors w-fit border border-success/30">
                        View accelerate leaders
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Stacked Nurture & Monitor Cards */}
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
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-card border border-border rounded-2xl p-8"
        >
          <h2 className="text-sm font-bold tracking-widest text-muted-foreground uppercase mb-6">
            Pipeline Insights
          </h2>
          
          <div className="grid grid-cols-2 gap-8">
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
        )}

        {activeTab === "matrix" && (
          /* Pipeline Matrix - Quadrant Visualization */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-6"
          >
            <div className="mb-12 text-center">
              <h2 className="text-sm font-bold tracking-widest text-muted-foreground uppercase mb-2">
                Accelerate Matrix
              </h2>
              <p className="text-muted-foreground">
                Track leader progression across tenure. Understand who is rising fast and those that might be static.
              </p>
            </div>
            
            {/* Quadrant Visualization */}
            <div className="relative bg-white rounded-xl p-6">
              <div className="relative h-[600px] rounded-xl">
                <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 rounded-xl overflow-hidden">
                  <div className="relative overflow-hidden">
                    <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.12) 0%, rgba(34, 197, 94, 0.04) 40%, rgba(255, 255, 255, 1) 80%)' }} />
                    <div className="absolute top-4 left-4 z-10">
                      <h4 className="text-lg font-bold text-foreground">Rising Stars</h4>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">Rising Fast — Early Tenure</p>
                    </div>
                  </div>
                  <div className="relative overflow-hidden">
                    <div className="absolute inset-0" style={{ background: 'linear-gradient(225deg, rgba(239, 68, 68, 0.12) 0%, rgba(239, 68, 68, 0.04) 40%, rgba(255, 255, 255, 1) 80%)' }} />
                    <div className="absolute top-4 right-4 text-right z-10">
                      <h4 className="text-lg font-bold text-foreground">Static</h4>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">High Value — High Tenure</p>
                    </div>
                  </div>
                  <div className="relative overflow-hidden">
                    <div className="absolute inset-0" style={{ background: 'linear-gradient(45deg, rgba(148, 163, 184, 0.15) 0%, rgba(148, 163, 184, 0.05) 40%, rgba(255, 255, 255, 1) 80%)' }} />
                    <div className="absolute bottom-4 left-4 z-10">
                      <h4 className="text-lg font-bold text-foreground">Developing</h4>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">Growing — Early Tenure</p>
                    </div>
                  </div>
                  <div className="relative overflow-hidden">
                    <div className="absolute inset-0" style={{ background: 'linear-gradient(315deg, rgba(99, 102, 241, 0.12) 0%, rgba(99, 102, 241, 0.04) 40%, rgba(255, 255, 255, 1) 80%)' }} />
                    <div className="absolute bottom-4 right-4 text-right z-10">
                      <h4 className="text-lg font-bold text-foreground">Stable Anchors</h4>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">Consistent — High Tenure</p>
                    </div>
                  </div>
                </div>

                <div className="absolute left-1/2 top-0 bottom-0 border-l-2 border-dashed border-border" />
                <div className="absolute top-1/2 left-0 right-0 border-t-2 border-dashed border-border" />

                {[
                  { name: "Sarah Mitchell", tier: "Accelerate", x: 35, y: 18, image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop&crop=face" },
                  { name: "Sofia Rodriguez", tier: "Nurture", x: 25, y: 35, image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop&crop=face" },
                  { name: "Daniela Chen", tier: "Accelerate", x: 62, y: 15, image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face" },
                  { name: "Marcus Thompson", tier: "Nurture", x: 72, y: 40, image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face" },
                  { name: "Tom Bradley", tier: "Accelerate", x: 82, y: 28, image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face" },
                  { name: "James Wilson", tier: "Monitor", x: 28, y: 58, image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop&crop=face" },
                  { name: "Liam O'Connor", tier: "Monitor", x: 18, y: 72, image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop&crop=face" },
                  { name: "Priya Sharma", tier: "Nurture", x: 68, y: 55, image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=100&h=100&fit=crop&crop=face" },
                  { name: "Elena Vasquez", tier: "Nurture", x: 58, y: 65, image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face" },
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
                      <img
                        src={person.image}
                        alt={person.name}
                        className={`w-14 h-14 rounded-full object-cover border-2 border-card shadow-lg transition-transform group-hover:scale-110 ${tierColors[person.tier]}`}
                      />
                      <span className="text-xs font-medium text-foreground mt-2 whitespace-nowrap">{person.name}</span>
                    </motion.div>
                  );
                })}
              </div>

              <div className="mt-4 px-2">
                <div className="flex justify-between items-center py-2">
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((year) => (
                    <span key={year} className="text-xs text-muted-foreground font-medium">{year}</span>
                  ))}
                </div>
                <p className="text-center text-sm text-muted-foreground mt-1">Time in current role</p>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === "movement" && (
          /* Pipeline Movement - Visual Movement Graph */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-6"
          >
            <div className="mb-8 text-center">
              <h2 className="text-sm font-bold tracking-widest text-muted-foreground uppercase mb-2">
                Pipeline Movement
              </h2>
              <p className="text-muted-foreground">
                Track how leaders are progressing through the pipeline. Green bars show upward movement velocity.
              </p>
            </div>
            
            {/* Movement Visualization */}
            <div className="bg-white rounded-xl p-8">
              <div className="flex items-end justify-between gap-6">
                {pipelineMovementData.map((person, index) => (
                  <motion.div
                    key={person.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="flex flex-col items-center flex-1 group cursor-pointer"
                  >
                    {/* Avatar */}
                    <div className="relative mb-4">
                      <img
                        src={person.image}
                        alt={person.name}
                        className={`w-16 h-16 rounded-full object-cover border-3 shadow-lg transition-transform group-hover:scale-110 ${
                          person.tier === "accelerate" 
                            ? "border-success/60" 
                            : person.tier === "nurture" 
                            ? "border-warning/60" 
                            : "border-slate-400/60"
                        }`}
                      />
                      {person.direction === "up" && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-success rounded-full flex items-center justify-center border-2 border-white">
                          <TrendingUp className="w-2.5 h-2.5 text-white" />
                        </div>
                      )}
                    </div>

                    {/* Movement Bar */}
                    <div className="relative w-10 h-48 bg-muted/30 rounded-full overflow-hidden mb-4">
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${person.movement}%` }}
                        transition={{ duration: 0.8, delay: 0.3 + index * 0.1, ease: "easeOut" }}
                        className={`absolute bottom-0 left-0 right-0 rounded-full ${
                          person.tier === "accelerate"
                            ? "bg-gradient-to-t from-success to-success/70"
                            : person.tier === "nurture"
                            ? "bg-gradient-to-t from-warning to-warning/70"
                            : "bg-gradient-to-t from-slate-500 to-slate-400"
                        }`}
                      />
                    </div>

                    {/* Name and Role */}
                    <h4 className="font-semibold text-foreground text-sm text-center group-hover:text-success transition-colors">
                      {person.name}
                    </h4>
                    <p className="text-xs text-muted-foreground text-center truncate max-w-[120px]">
                      {person.role}
                    </p>

                    {/* Hover tooltip */}
                    <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-40 p-2 bg-card border border-border rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 text-center">
                      <span className={`text-xs font-medium ${
                        person.tier === "accelerate" ? "text-success" : person.tier === "nurture" ? "text-warning" : "text-slate-500"
                      }`}>
                        {person.changeLabel}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Legend */}
              <div className="flex justify-center gap-6 mt-10 pt-6 border-t border-border">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-success" />
                  <span className="text-xs text-muted-foreground">Accelerate</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-warning" />
                  <span className="text-xs text-muted-foreground">Nurture</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-slate-500" />
                  <span className="text-xs text-muted-foreground">Monitor</span>
                </div>
              </div>
            </div>

            {/* Movement Summary Cards */}
            <div className="grid grid-cols-3 gap-4 mt-6">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.6 }}
                className="bg-success/5 border border-success/20 rounded-xl p-5"
              >
                <div className="flex items-center gap-3 mb-2">
                  <TrendingUp className="w-5 h-5 text-success" />
                  <span className="text-2xl font-bold text-success">8</span>
                </div>
                <p className="text-sm text-foreground font-medium">Promoted This Quarter</p>
                <p className="text-xs text-muted-foreground mt-1">Moved up one or more tiers</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.7 }}
                className="bg-warning/5 border border-warning/20 rounded-xl p-5"
              >
                <div className="flex items-center gap-3 mb-2">
                  <Target className="w-5 h-5 text-warning" />
                  <span className="text-2xl font-bold text-warning">23</span>
                </div>
                <p className="text-sm text-foreground font-medium">Steady Progress</p>
                <p className="text-xs text-muted-foreground mt-1">Consistent signal growth</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.8 }}
                className="bg-destructive/5 border border-destructive/20 rounded-xl p-5"
              >
                <div className="flex items-center gap-3 mb-2">
                  <AlertTriangle className="w-5 h-5 text-destructive" />
                  <span className="text-2xl font-bold text-destructive">3</span>
                </div>
                <p className="text-sm text-foreground font-medium">Needs Attention</p>
                <p className="text-xs text-muted-foreground mt-1">Stalled or declining signals</p>
              </motion.div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ActivePipelinePageV8;
