import { ArrowRight, Users, TrendingUp, Rocket, AlertTriangle, Target, Sparkles, Search, Building2, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useMemo } from "react";
import { AIAssistantBadge } from "./AIAssistantDrawer";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ActivePipelinePageV5Props {
  onBack: () => void;
  onTierClick?: (tier: "monitor" | "nurture" | "accelerate") => void;
  onPersonClick?: (personId: string) => void;
}

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
];

const tierConfig = {
  accelerate: { 
    label: "Accelerate",
    count: 30,
    percent: "0.1%",
    color: "hsl(var(--success))", 
    bgColor: "bg-success",
    borderColor: "border-success",
    lightBg: "bg-success/10",
    fullDescription: "Strong signals with ~70% VP+ prediction confidence. Fast-track with executive sponsorship and stretch assignments.",
    icon: Rocket,
  },
  nurture: { 
    label: "Nurture",
    count: 700,
    percent: "2.3%",
    color: "hsl(var(--warning))", 
    bgColor: "bg-warning",
    borderColor: "border-warning",
    lightBg: "bg-warning/10",
    fullDescription: "Medium signal strength. Prioritize for formal leadership development programs and cross-functional exposure.",
    icon: TrendingUp,
  },
  monitor: { 
    label: "Monitor",
    count: 1500,
    percent: "4.8%",
    color: "hsl(var(--muted-foreground))", 
    bgColor: "bg-slate-500",
    borderColor: "border-slate-300",
    lightBg: "bg-card",
    fullDescription: "Employees showing early leadership signals. Encourage through recognition, mentorship, and visibility opportunities.",
    icon: Users,
  },
};

// People data for each tier
const allPeople = [
  // Accelerate tier
  { id: "1", name: "Victoria Reynolds", role: "Senior Director, R&D", tier: "accelerate", department: "Engineering", signals: ["Strategic Vision", "Develops Others", "Executive Communication"], image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop&crop=face" },
  { id: "2", name: "Richard Lee", role: "VP, R&D Operations", tier: "accelerate", department: "Engineering", signals: ["Strategic Vision", "Cross-Functional Leadership", "Business Acumen"], image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face" },
  { id: "3", name: "Daniel Kim", role: "Senior Director, Manufacturing", tier: "accelerate", department: "Operations", signals: ["Drive Results", "Change Leadership", "Stakeholder Management"], image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face" },
  { id: "4", name: "Michael Chang", role: "VP, Commercial Strategy", tier: "accelerate", department: "Sales", signals: ["Business Acumen", "Strategic Vision", "Cross-Functional Leadership"], image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop&crop=face" },
  { id: "5", name: "Andrew Walsh", role: "Executive Director, R&D", tier: "accelerate", department: "Engineering", signals: ["Strategic Vision", "Develops Others", "Decision Making"], image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop&crop=face" },
  { id: "6", name: "Elizabeth Hart", role: "Executive Director, Medical", tier: "accelerate", department: "Medical", signals: ["Emotional Intelligence", "Executive Communication", "Stakeholder Management"], image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&h=100&fit=crop&crop=face" },
  { id: "7", name: "Katherine Moore", role: "VP, Corporate Development", tier: "accelerate", department: "Finance", signals: ["Business Acumen", "Strategic Vision", "Decision Making"], image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop&crop=face" },
  { id: "8", name: "Patricia Young", role: "Senior Director, Strategy", tier: "accelerate", department: "Strategy", signals: ["Strategic Vision", "Cross-Functional Leadership", "Business Acumen"], image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=100&h=100&fit=crop&crop=face" },
  { id: "9", name: "William Chen", role: "Senior Director, Global Supply", tier: "accelerate", department: "Operations", signals: ["Drive Results", "Stakeholder Management", "Change Leadership"], image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face" },
  // Nurture tier
  { id: "10", name: "Amanda Foster", role: "Director, Product", tier: "nurture", department: "Product", signals: ["Strategic Vision", "Develops Others"], image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=100&h=100&fit=crop&crop=face" },
  { id: "11", name: "James Wilson", role: "Director, Engineering", tier: "nurture", department: "Engineering", signals: ["Technical Leadership", "Team Building"], image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop&crop=face" },
  { id: "12", name: "Michelle Lee", role: "Senior Manager, Marketing", tier: "nurture", department: "Marketing", signals: ["Cross-Functional Leadership", "Communication"], image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop&crop=face" },
  { id: "13", name: "Christopher Brown", role: "Director, Sales", tier: "nurture", department: "Sales", signals: ["Business Acumen", "Stakeholder Management"], image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop&crop=face" },
  { id: "14", name: "Jennifer Davis", role: "Manager, Operations", tier: "nurture", department: "Operations", signals: ["Process Improvement", "Team Leadership"], image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face" },
  { id: "15", name: "Robert Taylor", role: "Senior Manager, Finance", tier: "nurture", department: "Finance", signals: ["Analytical Thinking", "Decision Making"], image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face" },
  // Monitor tier
  { id: "16", name: "Emily Chen", role: "Senior Engineer", tier: "monitor", department: "Engineering", signals: ["Technical Excellence", "Mentorship"], image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face" },
  { id: "17", name: "Marcus Johnson", role: "Product Manager", tier: "monitor", department: "Product", signals: ["Strategic Thinking", "Communication"], image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face" },
  { id: "18", name: "Sarah Williams", role: "Marketing Specialist", tier: "monitor", department: "Marketing", signals: ["Creativity", "Initiative"], image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face" },
  { id: "19", name: "David Park", role: "Sales Representative", tier: "monitor", department: "Sales", signals: ["Client Relations", "Drive Results"], image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face" },
  { id: "20", name: "Lisa Anderson", role: "Analyst", tier: "monitor", department: "Finance", signals: ["Analytical Skills", "Problem Solving"], image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop&crop=face" },
];

const departments = ["All Departments", "Engineering", "Product", "Sales", "Marketing", "Operations", "Finance", "Medical", "Strategy"];
const signalFilters = ["All Signals", "Strategic Vision", "Develops Others", "Business Acumen", "Cross-Functional Leadership", "Executive Communication"];

const ActivePipelinePageV5 = ({ onBack, onTierClick, onPersonClick }: ActivePipelinePageV5Props) => {
  const [activeTab, setActiveTab] = useState<"accelerate" | "nurture" | "monitor">("accelerate");
  const [searchQuery, setSearchQuery] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("All Departments");
  const [signalFilter, setSignalFilter] = useState("All Signals");

  const filteredPeople = useMemo(() => {
    return allPeople.filter(person => {
      const matchesTier = person.tier === activeTab;
      const matchesSearch = person.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           person.role.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDepartment = departmentFilter === "All Departments" || person.department === departmentFilter;
      const matchesSignal = signalFilter === "All Signals" || person.signals.includes(signalFilter);
      return matchesTier && matchesSearch && matchesDepartment && matchesSignal;
    });
  }, [activeTab, searchQuery, departmentFilter, signalFilter]);

  const currentTierConfig = tierConfig[activeTab];
  
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
          {/* Top Row - 2 Metrics + Ask AI */}
          <div className="grid grid-cols-3 gap-8">
            {healthMetrics.map((metric, index) => {
              const Icon = metric.icon;
              return (
                <motion.div 
                  key={metric.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 + index * 0.05 }}
                  className="text-center border-r border-border"
                >
                  <div className="flex justify-center mb-4">
                    <div className="p-2.5 rounded-lg bg-muted">
                      <Icon className={`h-6 w-6 ${metric.iconColor}`} />
                    </div>
                  </div>
                  <div className="flex items-center justify-center mb-1">
                    <span className="text-5xl font-bold text-foreground">
                      {metric.value}
                    </span>
                  </div>
                  <p className="text-base font-medium text-foreground mb-1">{metric.label}</p>
                  <p className="text-sm text-muted-foreground">{metric.description}</p>
                </motion.div>
              );
            })}
            
            {/* Ask AI Panel */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="rounded-xl p-5 bg-gradient-to-br from-accent-magenta/5 via-primary/5 to-accent-magenta/10"
            >
              <div className="flex items-start gap-3 mb-4">
                <div className="p-2 rounded-lg bg-accent-magenta/10">
                  <Sparkles className="w-5 h-5 text-accent-magenta" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">Ask AI</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Get personalized insights about your pipeline and development recommendations.
                  </p>
                </div>
              </div>
              <div className="flex justify-end">
                <AIAssistantBadge 
                  context="Leadership Pipeline V5 - Tier exploration with Accelerate, Nurture, and Monitor groups"
                  suggestedPrompts={[
                    "Which leaders are at risk of stagnating?",
                    "Show me development recommendations for Nurture tier",
                    "What patterns do you see in my Accelerate leaders?",
                  ]}
                />
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Tier Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-6"
        >
          <div className="grid grid-cols-3 gap-4">
            {(Object.keys(tierConfig) as Array<keyof typeof tierConfig>).map((tier) => {
              const config = tierConfig[tier];
              const isActive = activeTab === tier;
              const Icon = config.icon;
              
              return (
                <button
                  key={tier}
                  onClick={() => setActiveTab(tier)}
                  className={`
                    relative flex items-center justify-center gap-3 px-6 py-4 rounded-2xl font-semibold transition-all duration-300
                    ${isActive 
                      ? `${config.lightBg} ${config.borderColor} border-2 shadow-lg` 
                      : 'bg-card border border-border hover:border-muted-foreground/30 hover:shadow-md'
                    }
                  `}
                >
                  <Icon className={`w-5 h-5 ${isActive ? '' : 'text-muted-foreground'}`} style={{ color: isActive ? config.color : undefined }} />
                  <span className={`text-lg ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {config.label}
                  </span>
                  <span className={`
                    px-2.5 py-0.5 rounded-full text-sm font-bold
                    ${isActive 
                      ? `${config.bgColor} text-white` 
                      : 'bg-muted text-muted-foreground'
                    }
                  `}>
                    {config.count}
                  </span>
                  {isActive && (
                    <motion.div
                      layoutId="activeTabIndicator"
                      className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 rounded-full ${config.bgColor}`}
                      style={{ bottom: '-2px' }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Group Info Panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="mb-6"
        >
          <div className={`${currentTierConfig.lightBg} rounded-2xl p-6`}>
            <div className="flex items-start gap-5">
              <div className={`${currentTierConfig.bgColor} p-4 rounded-xl`}>
                <currentTierConfig.icon className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-1">
                  {currentTierConfig.label} Group
                </h2>
                <p className="text-base text-muted-foreground mb-3">
                  <span className="font-semibold text-foreground">{currentTierConfig.count}</span> employees ({currentTierConfig.percent} of workforce)
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {currentTierConfig.fullDescription}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Search and Filters + People Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-card border border-border rounded-2xl p-6 mb-10"
        >
          {/* Search and Filters */}
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or role..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-background"
              />
            </div>
            
            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger className="w-[180px] bg-background">
                <Building2 className="w-4 h-4 mr-2 text-muted-foreground" />
                <SelectValue placeholder="Departments" />
              </SelectTrigger>
              <SelectContent>
                {departments.map((dept) => (
                  <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={signalFilter} onValueChange={setSignalFilter}>
              <SelectTrigger className="w-[200px] bg-background">
                <Zap className="w-4 h-4 mr-2 text-muted-foreground" />
                <SelectValue placeholder="Leadership Signals" />
              </SelectTrigger>
              <SelectContent>
                {signalFilters.map((signal) => (
                  <SelectItem key={signal} value={signal}>{signal}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* People Count */}
          <div className="flex items-center gap-3 mb-6">
            <Users className="w-5 h-5 text-muted-foreground" />
            <span className="text-lg font-semibold text-foreground">All People</span>
            <span className="px-2.5 py-0.5 rounded-full bg-foreground text-background text-sm font-bold">
              {filteredPeople.length} people
            </span>
          </div>

          {/* People Grid */}
          <div className="grid grid-cols-3 gap-4">
            {filteredPeople.map((person, index) => (
              <motion.div
                key={person.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.05 * index }}
                className="bg-background border border-border rounded-xl p-5 cursor-pointer hover:shadow-lg hover:border-muted-foreground/30 transition-all group"
                onClick={() => onPersonClick?.(person.id)}
              >
                <div className="flex items-start gap-4 mb-4">
                  <img
                    src={person.image}
                    alt={person.name}
                    className="w-14 h-14 rounded-xl object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-base font-semibold text-foreground truncate">{person.name}</h3>
                      <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-success/10 text-success text-xs font-medium whitespace-nowrap">
                        <Sparkles className="w-3 h-3" />
                        Strong
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{person.role}</p>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {person.signals.slice(0, 3).map((signal) => (
                    <span 
                      key={signal}
                      className="px-2.5 py-1 rounded-lg bg-muted text-xs text-muted-foreground"
                    >
                      {signal}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Empty State */}
          {filteredPeople.length === 0 && (
            <div className="text-center py-16">
              <Users className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
              <p className="text-lg font-medium text-foreground mb-2">No people found</p>
              <p className="text-muted-foreground">Try adjusting your search or filters</p>
            </div>
          )}
        </motion.div>

      </div>
    </div>
  );
};

export default ActivePipelinePageV5;
