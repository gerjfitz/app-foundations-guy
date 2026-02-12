import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Crown, Compass, Megaphone, Rocket, Users, Star, TrendingUp, Target, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface FutureLeadersPageProps {
  onTierClick: (tier: "monitor" | "nurture" | "accelerate") => void;
  onViewPredicted: () => void;
  onSignalClick?: (signalId: string) => void;
}

// Pipeline tier data
const pipelineStages = [
  {
    id: "accelerate" as const,
    title: "Accelerate",
    count: "30",
    percent: "0.1%",
    description: "Strong signals with ~70% VP+ prediction confidence. Fast-track with executive sponsorship and stretch assignments.",
    icon: Rocket,
    pillLabel: "TOP TIER",
    pillIcon: Star,
    accentColor: "rgb(34, 197, 94)",
    borderColor: "border-emerald-200",
    bgGradient: "from-emerald-50 to-emerald-100/50",
    countBg: "bg-emerald-500/10",
    countText: "text-emerald-600",
    ringColor: "rgba(34, 197, 94",
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
    count: "700",
    percent: "2.3%",
    description: "Medium signal strength. Prioritize for formal leadership development programs and cross-functional exposure.",
    icon: TrendingUp,
    accentColor: "rgb(249, 115, 22)",
    borderColor: "border-orange-200",
    bgGradient: "from-orange-50 to-orange-100/50",
    countBg: "bg-orange-500/10",
    countText: "text-orange-600",
    ringColor: "rgba(249, 115, 22",
    topPeople: [
      { name: "Amanda Foster", image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=100&h=100&fit=crop&crop=face" },
      { name: "James Wilson", image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop&crop=face" },
      { name: "Michelle Lee", image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop&crop=face" },
      { name: "Chris Brown", image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop&crop=face" },
    ],
  },
  {
    id: "monitor" as const,
    title: "Monitor",
    count: "1,500",
    percent: "4.8%",
    description: "Employees showing early leadership signals. Encourage through recognition, mentorship, and visibility opportunities.",
    icon: Users,
    accentColor: "rgb(139, 92, 246)",
    borderColor: "border-violet-200",
    bgGradient: "from-violet-50 to-violet-100/50",
    countBg: "bg-violet-500/10",
    countText: "text-violet-600",
    ringColor: "rgba(139, 92, 246",
    topPeople: [
      { name: "Emily Chen", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face" },
      { name: "Marcus Johnson", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face" },
      { name: "Sarah Williams", image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face" },
      { name: "David Park", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face" },
    ],
  },
];

// Predicted leaders data
const predictedLeaders = [
  {
    id: "1",
    name: "Dr. Sarah Mitchell",
    role: "Senior Researcher",
    currentRole: "VP of R&D",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face",
    yearsEarly: 5,
    signalYear: 2001,
    promotedYear: 2006,
  },
  {
    id: "2",
    name: "James Chen",
    role: "Engineering Lead",
    currentRole: "SVP of Manufacturing",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
    yearsEarly: 6,
    signalYear: 2003,
    promotedYear: 2009,
  },
  {
    id: "3",
    name: "Maria Rodriguez",
    role: "Product Manager",
    currentRole: "Chief Product Officer",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop&crop=face",
    yearsEarly: 6,
    signalYear: 2005,
    promotedYear: 2011,
  },
  {
    id: "4",
    name: "David Kim",
    role: "Sales Director",
    currentRole: "EVP of Global Sales",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face",
    yearsEarly: 6,
    signalYear: 2008,
    promotedYear: 2014,
  },
];

// Strong signals data for genome with IDs for navigation
const strongSignals = [
  {
    id: "executive-access",
    name: "Executive Access",
    icon: Crown,
    count: 24,
    color: "text-amber-500",
    bg: "bg-amber-500",
  },
  {
    id: "strategic-positioning",
    name: "Strategic Impact",
    icon: Compass,
    count: 18,
    color: "text-purple-500",
    bg: "bg-purple-500",
  },
  {
    id: "voice-influence",
    name: "Voice & Influence",
    icon: Megaphone,
    count: 31,
    color: "text-blue-500",
    bg: "bg-blue-500",
  },
  {
    id: "transformation-impact",
    name: "Transformation",
    icon: Rocket,
    count: 42,
    color: "text-orange-500",
    bg: "bg-orange-500",
  },
  {
    id: "people-leadership",
    name: "People Leadership",
    icon: Users,
    count: 37,
    color: "text-teal-500",
    bg: "bg-teal-500",
  },
];

const FutureLeadersPage = ({ onTierClick, onViewPredicted, onSignalClick }: FutureLeadersPageProps) => {
  return (
    <div className="min-h-full bg-page-background">
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="pt-12 pb-10 px-8 bg-card border-b border-border"
      >
        <div className="max-w-[1100px] mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <p className="text-sm font-semibold tracking-widest text-muted-foreground uppercase mb-4">
              Leadership Pipeline
            </p>
            <h1 className="text-4xl lg:text-5xl font-extrabold text-foreground leading-tight mb-4">
              Spot the Leaders Who Will<br />Shape What's Next
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              AI-powered leadership intelligence that identifies and develops your next generation
              of executive talent. Powered by the Workhuman Ascend model.
            </p>
          </motion.div>
        </div>
      </motion.section>

      {/* Pipeline Section */}
      <section className="py-10 px-8 bg-card border-y border-border">
        <div className="max-w-[1100px] mx-auto">
          {/* Accelerate Card - Full Width Featured - Green gradient from right */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            onClick={() => onTierClick("accelerate")}
              className="mb-6 rounded-3xl overflow-hidden cursor-pointer group transition-all hover:shadow-2xl border-2 border-emerald-200"
            style={{
              background: 'linear-gradient(to left, rgba(34, 197, 94, 0.15) 0%, rgba(34, 197, 94, 0.05) 40%, rgba(255, 255, 255, 1) 100%)'
            }}
          >
              <div className="p-10 flex gap-10 items-center min-h-[300px]">
              {/* Left: Avatars Grid */}
              <div className="flex-shrink-0">
                <div className="grid grid-cols-2 gap-3">
                  {pipelineStages[0].topPeople.map((person, index) => (
                    <motion.img 
                      key={person.name}
                      src={person.image}
                      alt={person.name}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
                      className="w-20 h-20 rounded-2xl object-cover shadow-lg border-3 border-white group-hover:scale-105 transition-transform"
                    />
                  ))}
                </div>
              </div>

              {/* Middle: Content */}
              <div className="flex-1 flex flex-col justify-center">
                {/* Large Accelerate Label */}
                <h2 className="text-3xl font-bold text-foreground mb-3">Accelerate</h2>

                <p className="text-sm text-muted-foreground mb-1">Leaders with strong signals</p>
                <p className="text-muted-foreground leading-relaxed max-w-xl">
                  {pipelineStages[0].description}
                </p>

                <button className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-foreground hover:text-primary transition-colors group-hover:gap-3">
                  View accelerate leaders
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>
              </div>

              {/* Right: Animated Circular Counter - Larger */}
              <div className="flex-shrink-0 relative">
                {/* Outer glow */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="absolute inset-[-32px] rounded-full"
                  style={{
                    background: 'radial-gradient(circle, rgba(34, 197, 94, 0.25) 0%, transparent 70%)',
                  }}
                />
                
                {/* Outer ring - Larger */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                  className="relative w-56 h-56"
                >
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 200 200">
                    {/* Background ring */}
                    <circle
                      cx="100"
                      cy="100"
                      r="90"
                      fill="none"
                      stroke="rgba(34, 197, 94, 0.15)"
                      strokeWidth="8"
                    />
                    {/* Full progress ring */}
                    <motion.circle
                      cx="100"
                      cy="100"
                      r="90"
                      fill="none"
                      stroke="rgba(34, 197, 94, 0.5)"
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray={2 * Math.PI * 90}
                      initial={{ strokeDashoffset: 2 * Math.PI * 90 }}
                      animate={{ strokeDashoffset: 0 }}
                      transition={{ duration: 1.2, delay: 0.4, ease: "easeOut" }}
                    />
                    {/* Inner ring */}
                    <circle
                      cx="100"
                      cy="100"
                      r="72"
                      fill="none"
                      stroke="rgba(34, 197, 94, 0.1)"
                      strokeWidth="3"
                    />
                  </svg>
                  
                  {/* Center circle with count - Larger */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.5, type: "spring", stiffness: 200 }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <div 
                      className="w-36 h-36 rounded-full flex flex-col items-center justify-center shadow-lg"
                      style={{ background: 'linear-gradient(135deg, rgb(74, 222, 128) 0%, rgb(34, 197, 94) 100%)' }}
                    >
                      <motion.span 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.7 }}
                        className="text-5xl font-bold text-white"
                      >
                        {pipelineStages[0].count}
                      </motion.span>
                      <motion.span 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.4, delay: 0.8 }}
                        className="text-sm font-semibold text-white/90"
                      >
                        Accelerate
                      </motion.span>
                    </div>
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Nurture & Monitor - Side by Side */}
          <div className="grid grid-cols-2 gap-6">
            {pipelineStages.slice(1).map((stage, index) => {
              // Create gradient based on stage color
              const gradientStyle = stage.id === "nurture" 
                ? { background: 'linear-gradient(to left, rgba(249, 115, 22, 0.12) 0%, rgba(249, 115, 22, 0.03) 40%, rgba(255, 255, 255, 1) 100%)' }
                : { background: 'linear-gradient(to left, rgba(139, 92, 246, 0.12) 0%, rgba(139, 92, 246, 0.03) 40%, rgba(255, 255, 255, 1) 100%)' };
              
              return (
                <motion.div
                  key={stage.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                  onClick={() => onTierClick(stage.id)}
                  className="rounded-2xl p-6 cursor-pointer group transition-all hover:shadow-xl border border-border"
                  style={gradientStyle}
                >
                  {/* Header with Avatars and Count */}
                  <div className="flex items-center justify-between mb-5">
                    {/* Avatars Grid */}
                    <div className="grid grid-cols-2 gap-2">
                      {stage.topPeople.map((person, idx) => (
                        <img 
                          key={person.name}
                          src={person.image}
                          alt={person.name}
                          className="w-12 h-12 rounded-xl object-cover border-2 border-white shadow-md"
                        />
                      ))}
                    </div>
                    
                    {/* Count Circle - Larger */}
                    <div className={cn("w-20 h-20 rounded-full flex items-center justify-center", stage.countBg)}>
                      <span className={cn("text-2xl font-bold", stage.countText)}>{stage.count}</span>
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-foreground mb-2">{stage.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                    {stage.description}
                  </p>

                  <button className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-muted/50 text-sm font-semibold text-foreground hover:bg-muted transition-colors">
                    View pipeline
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Predicted Leaders Section - New Design */}
      <section className="py-12 px-8">
        <div className="max-w-[1100px] mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">Successfully Predicted</h2>
              <p className="text-muted-foreground">See how our model identified leaders before they were promoted</p>
            </div>
            <button 
              onClick={onViewPredicted}
              className="flex items-center gap-2 text-sm font-semibold hover:opacity-70 transition-opacity"
              style={{ color: '#1E4195' }}
            >
              View all
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-4 gap-5">
            {predictedLeaders.map((leader, index) => (
              <motion.div
                key={leader.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 + index * 0.1 }}
                className="bg-card rounded-2xl p-5 border border-border hover:shadow-xl hover:border-primary/20 transition-all group cursor-pointer"
              >
                {/* Avatar and Badge - Smaller */}
                <div className="relative mb-4">
                  <div className="w-20 h-20 mx-auto rounded-2xl overflow-hidden">
                    <img 
                      src={leader.image}
                      alt={leader.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  
                  {/* Years Early Badge */}
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-primary shadow-lg">
                    <span className="text-xs font-bold text-primary-foreground">{leader.yearsEarly} years early</span>
                  </div>
                </div>

                {/* Name and Role */}
                <div className="text-center mt-4 mb-3">
                  <h4 className="font-bold text-foreground text-sm">{leader.name}</h4>
                  <p className="text-xs text-muted-foreground">{leader.role}</p>
                </div>

                {/* Timeline - Smaller */}
                <div className="flex items-center justify-between text-xs mb-2">
                  <div className="text-center">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-1">
                      <Target className="h-3 w-3 text-primary" />
                    </div>
                    <span className="font-bold text-primary text-xs">{leader.signalYear}</span>
                  </div>
                  <div className="flex-1 mx-2 border-t-2 border-dashed border-muted-foreground/30" />
                  <div className="text-center">
                    <div className="w-6 h-6 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-1">
                      <Zap className="h-3 w-3 text-success" />
                    </div>
                    <span className="font-bold text-success text-xs">{leader.promotedYear}</span>
                  </div>
                </div>

                {/* Current Role */}
                <div className="pt-2 border-t border-border">
                  <div className="flex items-center justify-center gap-1.5">
                    <Sparkles className="h-3 w-3 text-success" />
                    <span className="text-xs font-medium text-success">Now {leader.currentRole}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};

export default FutureLeadersPage;
