import { Rocket, TrendingUp, Users, Sparkles, ArrowRight, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
interface ActivePipelinePageV9Props {
  onBack: () => void;
  onTierClick?: (tier: "monitor" | "nurture" | "accelerate") => void;
}

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

const ActivePipelinePageV9 = ({ onBack, onTierClick }: ActivePipelinePageV9Props) => {
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
            of executive talent.
          </p>
        </motion.div>

        {/* Pipeline Constellation - Department Visualization */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-10 bg-white border border-border rounded-2xl p-8 overflow-hidden"
        >
          <div className="mb-6 text-center">
            <h3 className="text-lg font-bold text-foreground">Pipeline Constellation</h3>
            <p className="text-sm text-muted-foreground mt-1">Department distribution across leadership tiers</p>
          </div>
          
          {/* Constellation Visualization */}
          <div className="relative h-[480px] bg-white rounded-xl overflow-hidden">
            {/* Three tier lanes - Accelerate on left, Nurture center, Monitor right */}
            <div className="absolute inset-0 flex">
              {/* Accelerate Lane */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="flex-1 flex flex-col items-center pt-6 px-6 cursor-pointer border-r border-border/30 rounded-l-xl"
                style={{ backgroundColor: 'rgba(34, 197, 94, 0.06)' }}
                onClick={() => onTierClick?.("accelerate")}
              >
                {/* Number first, then pill */}
                <div className="flex flex-col items-center mb-8">
                  <p className="text-5xl font-extrabold text-foreground mb-3">30</p>
                  <div className="flex items-center gap-2 px-4 py-1.5 rounded-full" style={{ backgroundColor: 'rgba(34, 197, 94, 0.15)', border: '1px solid rgba(34, 197, 94, 0.3)' }}>
                    <Rocket className="w-4 h-4" style={{ color: '#22C55E' }} />
                    <span className="text-xs font-bold uppercase tracking-wider" style={{ color: '#22C55E' }}>Accelerate</span>
                  </div>
                </div>
                
                {/* Department bubbles - honeycomb-inspired layout */}
                <div className="flex flex-col items-center gap-4">
                  <TooltipProvider delayDuration={0}>
                    {/* Row 1 - single centered bubble */}
                    <div className="flex justify-center">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <motion.div 
                            initial={{ scale: 0 }} animate={{ scale: 1 }}
                            transition={{ duration: 0.4, delay: 0.3 }}
                            className="w-20 h-20 rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform cursor-pointer"
                            style={{ backgroundColor: 'rgba(34, 197, 94, 0.22)', border: '2px solid rgba(34, 197, 94, 0.35)' }}
                          >
                            <span className="text-2xl font-bold" style={{ color: '#22C55E' }}>9</span>
                          </motion.div>
                        </TooltipTrigger>
                        <TooltipContent><p>Engineering</p></TooltipContent>
                      </Tooltip>
                    </div>
                    
                    {/* Row 2 - two bubbles */}
                    <div className="flex justify-center gap-4">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <motion.div 
                            initial={{ scale: 0 }} animate={{ scale: 1 }}
                            transition={{ duration: 0.4, delay: 0.35 }}
                            className="w-[70px] h-[70px] rounded-full flex items-center justify-center shadow-sm hover:scale-110 transition-transform cursor-pointer"
                            style={{ backgroundColor: 'rgba(34, 197, 94, 0.18)', border: '2px solid rgba(34, 197, 94, 0.3)' }}
                          >
                            <span className="text-xl font-bold" style={{ color: '#22C55E' }}>7</span>
                          </motion.div>
                        </TooltipTrigger>
                        <TooltipContent><p>Operations</p></TooltipContent>
                      </Tooltip>
                      
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <motion.div 
                            initial={{ scale: 0 }} animate={{ scale: 1 }}
                            transition={{ duration: 0.4, delay: 0.4 }}
                            className="w-[70px] h-[70px] rounded-full flex items-center justify-center shadow-sm hover:scale-110 transition-transform cursor-pointer"
                            style={{ backgroundColor: 'rgba(34, 197, 94, 0.18)', border: '2px solid rgba(34, 197, 94, 0.3)' }}
                          >
                            <span className="text-xl font-bold" style={{ color: '#22C55E' }}>6</span>
                          </motion.div>
                        </TooltipTrigger>
                        <TooltipContent><p>Sales</p></TooltipContent>
                      </Tooltip>
                    </div>
                    
                    {/* Row 3 - two bubbles */}
                    <div className="flex justify-center gap-4">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <motion.div 
                            initial={{ scale: 0 }} animate={{ scale: 1 }}
                            transition={{ duration: 0.4, delay: 0.45 }}
                            className="w-[60px] h-[60px] rounded-full flex items-center justify-center shadow-sm hover:scale-110 transition-transform cursor-pointer"
                            style={{ backgroundColor: 'rgba(34, 197, 94, 0.15)', border: '2px solid rgba(34, 197, 94, 0.25)' }}
                          >
                            <span className="text-lg font-bold" style={{ color: '#22C55E' }}>5</span>
                          </motion.div>
                        </TooltipTrigger>
                        <TooltipContent><p>Marketing</p></TooltipContent>
                      </Tooltip>
                      
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <motion.div 
                            initial={{ scale: 0 }} animate={{ scale: 1 }}
                            transition={{ duration: 0.4, delay: 0.5 }}
                            className="w-[54px] h-[54px] rounded-full flex items-center justify-center shadow-sm hover:scale-110 transition-transform cursor-pointer"
                            style={{ backgroundColor: 'rgba(34, 197, 94, 0.12)', border: '2px solid rgba(34, 197, 94, 0.2)' }}
                          >
                            <span className="text-lg font-bold" style={{ color: '#22C55E' }}>3</span>
                          </motion.div>
                        </TooltipTrigger>
                        <TooltipContent><p>Finance</p></TooltipContent>
                      </Tooltip>
                    </div>
                  </TooltipProvider>
                </div>
              </motion.div>
              
              {/* Nurture Lane */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.35 }}
                className="flex-1 flex flex-col items-center pt-6 px-6 cursor-pointer border-r border-border/30"
                style={{ backgroundColor: 'rgba(245, 158, 11, 0.06)' }}
                onClick={() => onTierClick?.("nurture")}
              >
                {/* Number first, then pill */}
                <div className="flex flex-col items-center mb-8">
                  <p className="text-5xl font-extrabold text-foreground mb-3">700</p>
                  <div className="flex items-center gap-2 px-4 py-1.5 rounded-full" style={{ backgroundColor: 'rgba(245, 158, 11, 0.15)', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
                    <TrendingUp className="w-4 h-4" style={{ color: '#F59E0B' }} />
                    <span className="text-xs font-bold uppercase tracking-wider" style={{ color: '#F59E0B' }}>Nurture</span>
                  </div>
                </div>
                
                {/* Department bubbles - honeycomb-inspired layout */}
                <div className="flex flex-col items-center gap-4">
                  <TooltipProvider delayDuration={0}>
                    {/* Row 1 - two largest bubbles */}
                    <div className="flex justify-center gap-4">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <motion.div 
                            initial={{ scale: 0 }} animate={{ scale: 1 }}
                            transition={{ duration: 0.4, delay: 0.4 }}
                            className="w-[88px] h-[88px] rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform cursor-pointer"
                            style={{ backgroundColor: 'rgba(245, 158, 11, 0.22)', border: '2px solid rgba(245, 158, 11, 0.35)' }}
                          >
                            <span className="text-2xl font-bold" style={{ color: '#F59E0B' }}>195</span>
                          </motion.div>
                        </TooltipTrigger>
                        <TooltipContent><p>Engineering</p></TooltipContent>
                      </Tooltip>
                      
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <motion.div 
                            initial={{ scale: 0 }} animate={{ scale: 1 }}
                            transition={{ duration: 0.4, delay: 0.45 }}
                            className="w-20 h-20 rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform cursor-pointer"
                            style={{ backgroundColor: 'rgba(245, 158, 11, 0.18)', border: '2px solid rgba(245, 158, 11, 0.3)' }}
                          >
                            <span className="text-xl font-bold" style={{ color: '#F59E0B' }}>160</span>
                          </motion.div>
                        </TooltipTrigger>
                        <TooltipContent><p>Operations</p></TooltipContent>
                      </Tooltip>
                    </div>
                    
                    {/* Row 2 - two bubbles */}
                    <div className="flex justify-center gap-4">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <motion.div 
                            initial={{ scale: 0 }} animate={{ scale: 1 }}
                            transition={{ duration: 0.4, delay: 0.5 }}
                            className="w-[70px] h-[70px] rounded-full flex items-center justify-center shadow-sm hover:scale-110 transition-transform cursor-pointer"
                            style={{ backgroundColor: 'rgba(245, 158, 11, 0.15)', border: '2px solid rgba(245, 158, 11, 0.25)' }}
                          >
                            <span className="text-xl font-bold" style={{ color: '#F59E0B' }}>140</span>
                          </motion.div>
                        </TooltipTrigger>
                        <TooltipContent><p>Sales</p></TooltipContent>
                      </Tooltip>
                      
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <motion.div 
                            initial={{ scale: 0 }} animate={{ scale: 1 }}
                            transition={{ duration: 0.4, delay: 0.55 }}
                            className="w-[64px] h-[64px] rounded-full flex items-center justify-center shadow-sm hover:scale-110 transition-transform cursor-pointer"
                            style={{ backgroundColor: 'rgba(245, 158, 11, 0.15)', border: '2px solid rgba(245, 158, 11, 0.25)' }}
                          >
                            <span className="text-lg font-bold" style={{ color: '#F59E0B' }}>110</span>
                          </motion.div>
                        </TooltipTrigger>
                        <TooltipContent><p>Marketing</p></TooltipContent>
                      </Tooltip>
                    </div>
                    
                    {/* Row 3 - one centered bubble */}
                    <div className="flex justify-center">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <motion.div 
                            initial={{ scale: 0 }} animate={{ scale: 1 }}
                            transition={{ duration: 0.4, delay: 0.6 }}
                            className="w-[54px] h-[54px] rounded-full flex items-center justify-center shadow-sm hover:scale-110 transition-transform cursor-pointer"
                            style={{ backgroundColor: 'rgba(245, 158, 11, 0.12)', border: '2px solid rgba(245, 158, 11, 0.2)' }}
                          >
                            <span className="text-lg font-bold" style={{ color: '#F59E0B' }}>95</span>
                          </motion.div>
                        </TooltipTrigger>
                        <TooltipContent><p>Finance</p></TooltipContent>
                      </Tooltip>
                    </div>
                  </TooltipProvider>
                </div>
              </motion.div>
              
              {/* Monitor Lane */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="flex-1 flex flex-col items-center pt-6 px-6 cursor-pointer rounded-r-xl"
                style={{ backgroundColor: 'rgba(139, 92, 246, 0.06)' }}
                onClick={() => onTierClick?.("monitor")}
              >
                {/* Number first, then pill */}
                <div className="flex flex-col items-center mb-8">
                  <p className="text-5xl font-extrabold text-foreground mb-3">1,500</p>
                  <div className="flex items-center gap-2 px-4 py-1.5 rounded-full" style={{ backgroundColor: 'rgba(139, 92, 246, 0.15)', border: '1px solid rgba(139, 92, 246, 0.3)' }}>
                    <Users className="w-4 h-4" style={{ color: '#8B5CF6' }} />
                    <span className="text-xs font-bold uppercase tracking-wider" style={{ color: '#8B5CF6' }}>Monitor</span>
                  </div>
                </div>
                
                {/* Department bubbles - honeycomb-inspired layout */}
                <div className="flex flex-col items-center gap-4">
                  <TooltipProvider delayDuration={0}>
                    {/* Row 1 - two largest bubbles */}
                    <div className="flex justify-center gap-4">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <motion.div 
                            initial={{ scale: 0 }} animate={{ scale: 1 }}
                            transition={{ duration: 0.4, delay: 0.55 }}
                            className="w-[96px] h-[96px] rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform cursor-pointer"
                            style={{ backgroundColor: 'rgba(139, 92, 246, 0.22)', border: '2px solid rgba(139, 92, 246, 0.35)' }}
                          >
                            <span className="text-2xl font-bold" style={{ color: '#8B5CF6' }}>420</span>
                          </motion.div>
                        </TooltipTrigger>
                        <TooltipContent><p>Engineering</p></TooltipContent>
                      </Tooltip>
                      
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <motion.div 
                            initial={{ scale: 0 }} animate={{ scale: 1 }}
                            transition={{ duration: 0.4, delay: 0.6 }}
                            className="w-[84px] h-[84px] rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform cursor-pointer"
                            style={{ backgroundColor: 'rgba(139, 92, 246, 0.18)', border: '2px solid rgba(139, 92, 246, 0.3)' }}
                          >
                            <span className="text-2xl font-bold" style={{ color: '#8B5CF6' }}>340</span>
                          </motion.div>
                        </TooltipTrigger>
                        <TooltipContent><p>Operations</p></TooltipContent>
                      </Tooltip>
                    </div>
                    
                    {/* Row 2 - three bubbles */}
                    <div className="flex justify-center gap-3">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <motion.div 
                            initial={{ scale: 0 }} animate={{ scale: 1 }}
                            transition={{ duration: 0.4, delay: 0.65 }}
                            className="w-[70px] h-[70px] rounded-full flex items-center justify-center shadow-sm hover:scale-110 transition-transform cursor-pointer"
                            style={{ backgroundColor: 'rgba(139, 92, 246, 0.15)', border: '2px solid rgba(139, 92, 246, 0.25)' }}
                          >
                            <span className="text-xl font-bold" style={{ color: '#8B5CF6' }}>280</span>
                          </motion.div>
                        </TooltipTrigger>
                        <TooltipContent><p>Sales</p></TooltipContent>
                      </Tooltip>
                      
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <motion.div 
                            initial={{ scale: 0 }} animate={{ scale: 1 }}
                            transition={{ duration: 0.4, delay: 0.7 }}
                            className="w-[64px] h-[64px] rounded-full flex items-center justify-center shadow-sm hover:scale-110 transition-transform cursor-pointer"
                            style={{ backgroundColor: 'rgba(139, 92, 246, 0.15)', border: '2px solid rgba(139, 92, 246, 0.25)' }}
                          >
                            <span className="text-lg font-bold" style={{ color: '#8B5CF6' }}>220</span>
                          </motion.div>
                        </TooltipTrigger>
                        <TooltipContent><p>Marketing</p></TooltipContent>
                      </Tooltip>
                      
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <motion.div 
                            initial={{ scale: 0 }} animate={{ scale: 1 }}
                            transition={{ duration: 0.4, delay: 0.75 }}
                            className="w-[54px] h-[54px] rounded-full flex items-center justify-center shadow-sm hover:scale-110 transition-transform cursor-pointer"
                            style={{ backgroundColor: 'rgba(139, 92, 246, 0.12)', border: '2px solid rgba(139, 92, 246, 0.2)' }}
                          >
                            <span className="text-base font-bold" style={{ color: '#8B5CF6' }}>140</span>
                          </motion.div>
                        </TooltipTrigger>
                        <TooltipContent><p>Finance</p></TooltipContent>
                      </Tooltip>
                    </div>
                    
                    {/* Row 3 - one centered bubble */}
                    <div className="flex justify-center">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <motion.div 
                            initial={{ scale: 0 }} animate={{ scale: 1 }}
                            transition={{ duration: 0.4, delay: 0.8 }}
                            className="w-12 h-12 rounded-full flex items-center justify-center shadow-sm hover:scale-110 transition-transform cursor-pointer"
                            style={{ backgroundColor: 'rgba(139, 92, 246, 0.1)', border: '2px solid rgba(139, 92, 246, 0.18)' }}
                          >
                            <span className="text-base font-bold" style={{ color: '#8B5CF6' }}>100</span>
                          </motion.div>
                        </TooltipTrigger>
                        <TooltipContent><p>Human Resources</p></TooltipContent>
                      </Tooltip>
                    </div>
                  </TooltipProvider>
                </div>
              </motion.div>
            </div>
          </div>

          {/* AI Insight */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.8 }}
            className="mt-8 pt-5 border-t border-border"
          >
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-accent-magenta/10 flex-shrink-0">
                <Sparkles className="w-5 h-5 text-accent-magenta" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground mb-1">AI Insight</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  <span className="font-semibold text-foreground">Engineering</span> leads pipeline representation across all tiers, 
                  while <span className="font-semibold text-foreground">Marketing</span> shows the highest conversion rate to Accelerate. 
                  Consider cross-functional development programs.
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Tier Cards Section - V7 Style */}
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

export default ActivePipelinePageV9;
