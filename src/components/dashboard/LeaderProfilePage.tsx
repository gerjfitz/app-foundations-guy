import { useEffect, useState } from "react";
import { ChevronLeft, Zap, Check, RefreshCw, AlertTriangle, Star, Sparkles, TrendingUp, TrendingDown, Minus, MessageSquare, Crown, Compass, Megaphone, Rocket, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface TimelineEvent {
  id: string;
  date: string;
  type: "join" | "behavior" | "signal" | "promotion" | "gap" | "target";
  badge?: string;
  title: string;
  description: string;
  evidence?: string;
  recognition?: {
    from: string;
    quote: string;
  };
  skills?: string[];
  gaps?: string[];
}

interface LeaderProfile {
  id: string;
  name: string;
  role: string;
  image: string;
  readinessScore: number;
  predictedRole: string;
  status: string;
  tenure: string;
  department: string;
  currentLevel: string;
  timeInRole: string;
  timeline: TimelineEvent[];
}

interface LeaderProfilePageProps {
  leader: LeaderProfile;
  onBack: () => void;
}

const typeIcons = {
  join: Zap,
  behavior: RefreshCw,
  signal: Zap,
  promotion: Check,
  gap: AlertTriangle,
  target: Star,
};

const typeColors = {
  join: "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-2 border-slate-200 dark:border-slate-700",
  behavior: "bg-primary/10 text-primary border-2 border-primary/20",
  signal: "bg-accent-magenta/10 text-accent-magenta border-2 border-accent-magenta/20",
  promotion: "bg-success/10 text-success border-2 border-success/20",
  gap: "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 border-2 border-amber-300 dark:border-amber-700",
  target: "bg-sky-100 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400 border-2 border-sky-300 dark:border-sky-700",
};

const badgeColors: Record<string, string> = {
  "LEADERSHIP BEHAVIOR": "bg-primary/10 text-primary border-primary/20",
  "FIRST SIGNAL": "bg-accent-magenta/10 text-accent-magenta border-accent-magenta/20",
  "STRONG SIGNAL": "bg-warning/10 text-warning border-warning/20",
  "PROMOTION": "bg-success/10 text-success border-success/20",
  "GAP ANALYSIS": "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 border-amber-300",
  "TARGET ROLE": "bg-sky-100 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400 border-sky-300",
};

// Signal Behaviors for the profile mapping - matching the taxonomy
interface SignalBehavior {
  name: string;
  description: string;
  strength: number; // 0-100 percentage
  trend: "up" | "down" | "stable";
}

interface SignalCategory {
  id: string;
  category: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  progressColor: string;
  behaviors: SignalBehavior[];
}

const signalCategories: SignalCategory[] = [
  { 
    id: "executive-access",
    category: "Executive Access", 
    icon: <Crown className="w-5 h-5" />,
    color: "text-amber-600",
    bgColor: "bg-amber-50 dark:bg-amber-900/20",
    progressColor: "bg-amber-500",
    behaviors: [
      { name: "CEO/C-Suite Direct Access", description: "Regularly interacts with and receives recognition from C-level executives, indicating trust at the highest levels.", strength: 88, trend: "up" },
      { name: "SVP Recognition + Global Scope", description: "Recognized by senior VPs for work with global organizational impact.", strength: 82, trend: "stable" },
    ]
  },
  { 
    id: "strategic-positioning",
    category: "Strategic", 
    icon: <Compass className="w-5 h-5" />,
    color: "text-purple-600",
    bgColor: "bg-purple-50 dark:bg-purple-900/20",
    progressColor: "bg-purple-500",
    behaviors: [
      { name: "Enterprise Transformation Programme Role", description: "Leads organization-wide change initiatives that reshape how the business operates.", strength: 92, trend: "up" },
      { name: "Technical → Advisor Role Transition", description: "Successfully transitioned from technical execution to strategic advisory, demonstrating executive readiness.", strength: 78, trend: "up" },
    ]
  },
  { 
    id: "voice-influence",
    category: "Voice & Influence", 
    icon: <Megaphone className="w-5 h-5" />,
    color: "text-blue-600",
    bgColor: "bg-blue-50 dark:bg-blue-900/20",
    progressColor: "bg-blue-500",
    behaviors: [
      { name: "Courageous Voice in Senior Forums", description: "Speaks truth to power and challenges the status quo in executive settings.", strength: 85, trend: "up" },
      { name: "Speaking Up for Others", description: "Actively advocates for team members and peers, amplifying voices that might otherwise go unheard.", strength: 72, trend: "stable" },
    ]
  },
  { 
    id: "transformation-impact",
    category: "Transformation", 
    icon: <Rocket className="w-5 h-5" />,
    color: "text-orange-600",
    bgColor: "bg-orange-50 dark:bg-orange-900/20",
    progressColor: "bg-orange-500",
    behaviors: [
      { name: "Sustained Excellence (3+ Years)", description: "Consistently delivers exceptional results over an extended period, demonstrating reliability and commitment.", strength: 94, trend: "up" },
      { name: "Organizational Transformation Leadership", description: "Leads fundamental change in how the organization operates, driving lasting impact.", strength: 80, trend: "up" },
    ]
  },
  { 
    id: "people-leadership",
    category: "People", 
    icon: <Users className="w-5 h-5" />,
    color: "text-teal-600",
    bgColor: "bg-teal-50 dark:bg-teal-900/20",
    progressColor: "bg-teal-500",
    behaviors: [
      { name: "People Development & Mentorship", description: "Actively grows and mentors team members, creating development opportunities that accelerate careers.", strength: 88, trend: "up" },
      { name: "Team Wellbeing Advocacy", description: "Prioritizes team health and work-life balance, championing policies that support sustainable performance.", strength: 65, trend: "stable" },
    ]
  },
];

// Helper function to get signal level from strength
const getSignalLevel = (strength: number): "Strong" | "Medium" | "Low" => {
  if (strength >= 75) return "Strong";
  if (strength >= 50) return "Medium";
  return "Low";
};

// Recognition data for each signal behavior
const behaviorRecognitions: Record<string, { summary: string; recognitions: { from: string; role: string; quote: string; date: string }[] }> = {
  "CEO/C-Suite Direct Access": {
    summary: "Regularly interacts with and receives recognition from C-level executives, indicating trust and visibility at the highest organizational levels.",
    recognitions: [
      { from: "Michael Ross", role: "CEO", quote: "Victoria presents quarterly to the board. Her strategic insights are invaluable.", date: "Nov 2024" },
      { from: "Elena Rodriguez", role: "CFO", quote: "She's become my go-to advisor on R&D investment decisions.", date: "Sep 2024" },
    ]
  },
  "SVP Recognition + Global Scope": {
    summary: "Recognized by senior VPs for work with global organizational impact, demonstrating influence beyond regional boundaries.",
    recognitions: [
      { from: "James Wilson", role: "SVP Global Operations", quote: "Victoria's global transformation initiative has set a new standard.", date: "Dec 2024" },
    ]
  },
  "Enterprise Transformation Programme Role": {
    summary: "Leads organization-wide change initiatives that fundamentally reshape how the business operates and delivers value.",
    recognitions: [
      { from: "Michael Ross", role: "CEO", quote: "Victoria's transformation of our R&D pipeline is the most significant change in a decade.", date: "Nov 2024" },
      { from: "David Kim", role: "VP of Operations", quote: "Her enterprise-wide approach to change management is exemplary.", date: "Oct 2024" },
    ]
  },
  "Technical → Advisor Role Transition": {
    summary: "Successfully transitioned from technical execution to strategic advisory, demonstrating executive readiness and business acumen.",
    recognitions: [
      { from: "Emily Zhang", role: "Head of Data Science", quote: "Victoria went from lab scientist to strategic advisor seamlessly. A rare transition.", date: "Sep 2024" },
    ]
  },
  "Courageous Voice in Senior Forums": {
    summary: "Speaks truth to power and challenges the status quo in executive settings, driving important conversations.",
    recognitions: [
      { from: "Amanda Foster", role: "CMO", quote: "Victoria raised the difficult question no one else would. That's leadership.", date: "Nov 2024" },
      { from: "Marcus Johnson", role: "Director of Engineering", quote: "She challenges assumptions constructively, even with senior executives.", date: "Oct 2024" },
    ]
  },
  "Speaking Up for Others": {
    summary: "Actively advocates for team members and peers, amplifying voices that might otherwise go unheard.",
    recognitions: [
      { from: "Elena Rodriguez", role: "CFO", quote: "Victoria ensured her team's contributions were visible at the board level.", date: "Sep 2024" },
    ]
  },
  "Sustained Excellence (3+ Years)": {
    summary: "Consistently delivers exceptional results over an extended period, demonstrating reliability, commitment, and sustained impact.",
    recognitions: [
      { from: "James Wilson", role: "SVP Global Operations", quote: "Five years of exceeding targets. That's not luck, that's excellence.", date: "Dec 2024" },
      { from: "Michael Ross", role: "CEO", quote: "Victoria's track record speaks for itself. Consistently outstanding.", date: "Nov 2024" },
    ]
  },
  "Organizational Transformation Leadership": {
    summary: "Leads fundamental change in how the organization operates, driving lasting impact across teams and functions.",
    recognitions: [
      { from: "David Kim", role: "VP of Operations", quote: "She transformed manufacturing efficiency across 3 sites simultaneously.", date: "Oct 2024" },
    ]
  },
  "People Development & Mentorship": {
    summary: "Actively grows and mentors team members, creating development opportunities and providing feedback that accelerates careers.",
    recognitions: [
      { from: "Marcus Johnson", role: "Director of Engineering", quote: "Three of my top performers came from Victoria's team. She builds leaders.", date: "Oct 2024" },
      { from: "Amanda Foster", role: "CMO", quote: "Victoria's mentorship of junior leaders has become a model for our organization.", date: "Sep 2024" },
    ]
  },
  "Team Wellbeing Advocacy": {
    summary: "Prioritizes team health and work-life balance, championing policies that support sustainable high performance.",
    recognitions: [
      { from: "Emily Zhang", role: "Head of Data Science", quote: "Victoria instituted 'no meeting Fridays' and team morale soared.", date: "Aug 2024" },
    ]
  },
};

// Senior leaders strong in each signal behavior
const seniorLeadersForBehavior: Record<string, { name: string; role: string; image: string }[]> = {
  "CEO/C-Suite Direct Access": [
    { name: "Michael Ross", role: "CEO", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face" },
    { name: "Amanda Foster", role: "CMO", image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=face" },
  ],
  "SVP Recognition + Global Scope": [
    { name: "James Wilson", role: "SVP Global Operations", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face" },
  ],
  "Enterprise Transformation Programme Role": [
    { name: "Michael Ross", role: "CEO", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face" },
    { name: "David Kim", role: "VP of Operations", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face" },
  ],
  "Technical → Advisor Role Transition": [
    { name: "Emily Zhang", role: "Head of Data Science", image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face" },
  ],
  "Courageous Voice in Senior Forums": [
    { name: "Amanda Foster", role: "CMO", image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=face" },
    { name: "Marcus Johnson", role: "Director of Engineering", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face" },
  ],
  "Speaking Up for Others": [
    { name: "Elena Rodriguez", role: "CFO", image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face" },
  ],
  "Sustained Excellence (3+ Years)": [
    { name: "James Wilson", role: "SVP Global Operations", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face" },
    { name: "Michael Ross", role: "CEO", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face" },
  ],
  "Organizational Transformation Leadership": [
    { name: "David Kim", role: "VP of Operations", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face" },
  ],
  "People Development & Mentorship": [
    { name: "Amanda Foster", role: "CMO", image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=face" },
    { name: "Emily Zhang", role: "Head of Data Science", image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face" },
  ],
  "Team Wellbeing Advocacy": [
    { name: "Emily Zhang", role: "Head of Data Science", image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face" },
  ],
};

const TrendIcon = ({ trend }: { trend: "up" | "down" | "stable" }) => {
  if (trend === "up") return <TrendingUp className="h-3 w-3 text-emerald-500" />;
  if (trend === "down") return <TrendingDown className="h-3 w-3 text-destructive" />;
  return <Minus className="h-3 w-3 text-muted-foreground" />;
};

const LeaderProfilePage = ({ leader, onBack }: LeaderProfilePageProps) => {
  const [activeTab, setActiveTab] = useState<"overview" | "timeline">("overview");
  const [selectedBehavior, setSelectedBehavior] = useState<SignalBehavior | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<SignalCategory | null>(null);

  useEffect(() => {
    // Ensure we always start at the top when entering a profile.
    requestAnimationFrame(() => {
      const container = document.getElementById("app-scroll-container");
      container?.scrollTo({ top: 0, left: 0, behavior: "auto" });
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    });
  }, [leader.id]);
  
  // Add gap analysis and target role to timeline if not present
  const enhancedTimeline = [...leader.timeline];
  if (!enhancedTimeline.find(e => e.type === "gap")) {
    enhancedTimeline.push({
      id: "gap-analysis",
      date: "Q2 2025",
      type: "gap",
      badge: "GAP ANALYSIS",
      title: "Gap Analysis",
      description: "Critical competency gaps identified for next role.",
      gaps: ["External Network Building", "Industry Presence", "Competitive Awareness"],
    });
  }
  if (!enhancedTimeline.find(e => e.type === "target")) {
    enhancedTimeline.push({
      id: "target-role",
      date: "Q3 2026",
      type: "target",
      badge: "TARGET ROLE",
      title: `${leader.predictedRole} Target`,
      description: "Projected role based on current momentum.",
    });
  }

  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(
    enhancedTimeline.find(e => e.type === "signal") || null
  );

  // Calculate signal stats
  const allBehaviors = signalCategories.flatMap(c => c.behaviors);
  const strongCount = allBehaviors.filter(b => b.strength >= 75).length;
  const mediumCount = allBehaviors.filter(b => b.strength >= 50 && b.strength < 75).length;
  const lowCount = allBehaviors.filter(b => b.strength < 50).length;

  // Calculate overall category strength
  const getCategoryStrength = (category: SignalCategory) => {
    const avg = category.behaviors.reduce((sum, b) => sum + b.strength, 0) / category.behaviors.length;
    return Math.round(avg);
  };

  const behaviorData = selectedBehavior ? behaviorRecognitions[selectedBehavior.name] : null;
  const seniorLeaders = selectedBehavior ? seniorLeadersForBehavior[selectedBehavior.name] || [] : [];

  return (
    <div className="min-h-full bg-page-background">
      <div className="max-w-[1100px] mx-auto py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-6 -ml-2 text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Pipeline
        </Button>

        {/* Hero Header Panel */}
        <div className="bg-card rounded-2xl border border-border p-6 mb-8">
          <div className="flex items-start justify-between gap-6">
            {/* Left Section - Avatar & Info */}
            <div className="flex items-start gap-6 flex-1">
              {/* Avatar with Tier Badge */}
              <div className="relative">
                <img
                  src={leader.image}
                  alt={leader.name}
                  className="h-36 w-36 rounded-full object-cover border-4 border-card shadow-lg"
                />
                <Badge 
                  className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-success text-white border-0 text-xs px-3 py-1 whitespace-nowrap uppercase font-semibold"
                >
                  Accelerate
                </Badge>
              </div>

              {/* Name & Role */}
              <div className="pt-2">
                <h1 className="text-3xl font-bold text-foreground">{leader.name}</h1>
                <p className="text-muted-foreground text-lg mb-4">{leader.role}</p>

                {/* Stats Cards */}
                <div className="flex gap-3">
                  <div className="bg-muted/50 rounded-lg px-4 py-2 border border-border">
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">Current Level</p>
                    <p className="font-semibold text-foreground">{leader.currentLevel || "Director"}</p>
                  </div>
                  <div className="bg-muted/50 rounded-lg px-4 py-2 border border-border">
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">Time in Role</p>
                    <p className="font-semibold text-foreground">{leader.timeInRole || leader.tenure}</p>
                  </div>
                  <div className="bg-primary/5 rounded-lg px-4 py-2 border border-primary/20">
                    <p className="text-xs text-primary uppercase tracking-wide">Predicted Role</p>
                    <p className="font-semibold text-primary">{leader.predictedRole}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Section - Ask AI Panel */}
            <div className="w-80 flex-shrink-0">
              <div className="rounded-xl p-5 border border-fuchsia-200/50" style={{ background: 'linear-gradient(135deg, rgba(199, 118, 207, 0.08) 0%, rgba(139, 92, 246, 0.05) 100%)' }}>
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, rgba(199, 118, 207, 0.15) 0%, rgba(139, 92, 246, 0.1) 100%)' }}>
                    <Sparkles className="w-5 h-5 text-fuchsia-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Ask AI</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Get personalized insights about {leader.name.split(' ')[0]}'s development path and potential.
                    </p>
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 bg-fuchsia-50 border-fuchsia-200 text-fuchsia-600 hover:bg-fuchsia-100 hover:text-fuchsia-700"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    Ask AI
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-8 border-b border-border mb-8">
          <button
            onClick={() => setActiveTab("overview")}
            className={cn(
              "pb-4 text-sm font-medium transition-colors relative",
              activeTab === "overview" ? "text-foreground" : "text-muted-foreground hover:text-foreground"
            )}
          >
            OVERVIEW
            {activeTab === "overview" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("timeline")}
            className={cn(
              "pb-4 text-sm font-medium transition-colors relative",
              activeTab === "timeline" ? "text-foreground" : "text-muted-foreground hover:text-foreground"
            )}
          >
            CAREER TIMELINE
            {activeTab === "timeline" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
            )}
          </button>
        </div>

        {/* Content */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* AI Summary and Signal Overview - Two separate panels */}
            <div className="grid grid-cols-3 gap-6">
              {/* Left: AI Summary Panel (larger) */}
              <div className="col-span-2 bg-card rounded-2xl border border-border p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, rgba(199, 118, 207, 0.2) 0%, rgba(139, 92, 246, 0.15) 100%)' }}>
                    <Sparkles className="h-5 w-5 text-fuchsia-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground">AI Leadership Summary</h3>
                    <p className="text-xs text-muted-foreground">Generated from behavioral signals and recognition data</p>
                  </div>
                </div>
                
                <p className="text-foreground leading-relaxed">
                  <span className="font-semibold">{leader.name}</span> is a high-potential leader demonstrating exceptional 
                  readiness for the <span className="font-semibold text-primary">{leader.predictedRole}</span> role. 
                  Over the past {leader.tenure}, they have consistently exhibited strong signals in customer advocacy, 
                  strategic decision-making, and cross-functional collaboration.
                </p>
              </div>

              {/* Right: Signal Overview Panel (smaller) */}
              <div className="col-span-1 bg-card rounded-2xl border border-border p-5">
                <p className="text-sm font-semibold text-foreground mb-4">Signal Overview</p>
                <ul className="space-y-2.5">
                  <li className="flex items-center gap-3 text-sm">
                    <div className="h-5 w-5 rounded-full bg-success/20 flex items-center justify-center flex-shrink-0">
                      <Check className="h-3 w-3 text-success" />
                    </div>
                    <span className="text-foreground">Demonstrates 8 of 10 key VP behaviors</span>
                  </li>
                  <li className="flex items-center gap-3 text-sm">
                    <div className="h-5 w-5 rounded-full bg-success/20 flex items-center justify-center flex-shrink-0">
                      <Check className="h-3 w-3 text-success" />
                    </div>
                    <span className="text-foreground">Recognized 4.2x per quarter (top 5%)</span>
                  </li>
                  <li className="flex items-center gap-3 text-sm">
                    <div className="h-5 w-5 rounded-full bg-success/20 flex items-center justify-center flex-shrink-0">
                      <Check className="h-3 w-3 text-success" />
                    </div>
                    <span className="text-foreground">Consistent pattern for 18 months</span>
                  </li>
                  <li className="flex items-center gap-3 text-sm">
                    <div className="h-5 w-5 rounded-full bg-success/20 flex items-center justify-center flex-shrink-0">
                      <Check className="h-3 w-3 text-success" />
                    </div>
                    <span className="text-foreground">Operating at VP scope while Director</span>
                  </li>
                  <li className="flex items-center gap-3 text-sm">
                    <div className="h-5 w-5 rounded-full bg-success/20 flex items-center justify-center flex-shrink-0">
                      <Check className="h-3 w-3 text-success" />
                    </div>
                    <span className="text-foreground">Recognized by 15+ people across org</span>
                  </li>
                  <li className="flex items-center gap-3 text-sm">
                    <div className="h-5 w-5 rounded-full bg-success/20 flex items-center justify-center flex-shrink-0">
                      <TrendingUp className="h-3 w-3 text-success" />
                    </div>
                    <span className="text-foreground">Signal accelerating (+18 points in 12mo)</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Leadership Signals - Card Grid Layout */}
            <div className="bg-card rounded-2xl border border-border p-6">
              <div className="mb-6">
                <h3 className="font-bold text-foreground text-lg">Leadership Signals</h3>
                <p className="text-sm text-muted-foreground">Signals {leader.name.split(' ')[0]} is demonstrating</p>
              </div>

              {/* Signal Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {signalCategories.flatMap((category) => 
                  category.behaviors.filter(b => b.strength >= 60).map((behavior) => {
                    const behaviorData = behaviorRecognitions[behavior.name];
                    const strengthLevel = getSignalLevel(behavior.strength);
                    const strengthColor = strengthLevel === "Strong" ? "bg-emerald-500" : strengthLevel === "Medium" ? "bg-sky-500" : "bg-slate-400";
                    
                    return (
                      <div 
                        key={behavior.name}
                        onClick={() => {
                          setSelectedBehavior(behavior);
                          setSelectedCategory(category);
                        }}
                        className={cn(
                          "relative overflow-hidden rounded-xl border border-border bg-white dark:bg-card hover:shadow-lg cursor-pointer transition-all duration-300 group",
                          selectedBehavior?.name === behavior.name && "ring-2 ring-primary border-primary"
                        )}
                      >
                        {/* Category accent bar at top */}
                        <div className={cn("h-1", category.progressColor)} />
                        
                        <div className="p-5">
                          {/* Header with category pill */}
                          <div className="flex items-start justify-between gap-3 mb-3">
                            <div className={cn(
                              "p-2 rounded-lg",
                              category.bgColor
                            )}>
                              <div className={category.color}>
                                {category.icon}
                              </div>
                            </div>
                            <span className={cn(
                              "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap",
                              category.bgColor,
                              category.color
                            )}>
                              {category.category}
                            </span>
                          </div>
                          
                          {/* Signal Name */}
                          <h4 className="font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                            {behavior.name}
                          </h4>
                          
                          {/* Description */}
                          <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-2">
                            {behaviorData?.summary || behavior.description}
                          </p>
                          
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Behavior Detail Modal */}
            <Dialog
              open={!!selectedBehavior}
              onOpenChange={(open) => {
                if (!open) setSelectedBehavior(null);
              }}
            >
              <DialogContent className="max-w-3xl p-0 overflow-hidden">
                {selectedBehavior && behaviorData && (
                  <div className="grid grid-cols-1 md:grid-cols-5">
                    {/* Left: header */}
                    <div
                      className={cn(
                        "md:col-span-2 p-6 text-foreground border-b md:border-b-0 md:border-r border-border",
                        selectedBehavior.strength >= 75
                          ? "bg-success/10"
                          : selectedBehavior.strength >= 50
                            ? "bg-primary/10"
                            : "bg-muted/60"
                      )}
                    >
                      <DialogHeader>
                        <DialogTitle className="text-xl font-bold">
                          {selectedBehavior.name}
                        </DialogTitle>
                      </DialogHeader>

                      <div className="mt-3">
                        <span className={cn(
                          "text-sm font-semibold px-3 py-1 rounded-full",
                          selectedBehavior.strength >= 75 ? "bg-emerald-100 text-emerald-700" :
                          selectedBehavior.strength >= 50 ? "bg-sky-100 text-sky-700" :
                          "bg-slate-100 text-slate-700"
                        )}>
                          {getSignalLevel(selectedBehavior.strength)} Signal
                        </span>
                      </div>

                      {/* Visual strength indicator */}
                      <div className="mt-4 flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((dot) => {
                          const filled = selectedBehavior.strength >= dot * 20;
                          const barColor = selectedBehavior.strength >= 75 ? "bg-emerald-500" 
                            : selectedBehavior.strength >= 50 ? "bg-sky-500" 
                            : "bg-slate-400";
                          return (
                            <div 
                              key={dot}
                              className={cn(
                                "h-2 flex-1 rounded-sm transition-all",
                                filled ? barColor : "bg-muted"
                              )}
                            />
                          );
                        })}
                      </div>

                      <div className="mt-5">
                        <p className="text-xs font-semibold text-muted-foreground tracking-wider uppercase mb-2">
                          How {leader.name.split(' ')[0]} Demonstrates This
                        </p>
                        <p className="text-sm leading-relaxed">
                          {behaviorData.summary}
                        </p>
                      </div>
                    </div>

                    {/* Right: evidence */}
                    <div className="md:col-span-3 p-6 bg-card">
                      <div className="flex items-center gap-2 mb-4">
                        <MessageSquare className="h-4 w-4 text-muted-foreground" />
                        <p className="text-xs font-semibold text-muted-foreground tracking-wider uppercase">
                          Recognition Evidence
                        </p>
                      </div>

                      {behaviorData.recognitions.length > 0 ? (
                        <div className="space-y-3 max-h-[60vh] overflow-auto pr-2">
                          {behaviorData.recognitions.map((rec, idx) => (
                            <div key={idx} className="rounded-xl border border-border bg-background p-4">
                              <div className="flex items-center justify-between gap-3 mb-2">
                                <p className="text-xs font-semibold text-foreground truncate">
                                  {rec.from} • {rec.role}
                                </p>
                                <span className="text-xs text-muted-foreground whitespace-nowrap">
                                  {rec.date}
                                </span>
                              </div>
                              <p className="text-sm text-foreground leading-relaxed italic">"{rec.quote}"</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="rounded-xl border border-border bg-muted/40 p-4">
                          <p className="text-sm text-muted-foreground">
                            No recognition data available yet for this signal.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </DialogContent>
            </Dialog>
          </div>
        )}

        {activeTab === "timeline" && (
          <div className="flex gap-8">
            {/* Timeline */}
            <div className="flex-1 max-w-xl">
              <div className="relative">
                {/* Vertical line - positioned to align with icon centers */}
                <div className="absolute left-[94px] top-8 bottom-8 w-0.5 bg-gradient-to-b from-slate-300 via-slate-200 to-sky-300 dark:from-slate-600 dark:via-slate-700 dark:to-sky-600" />

                {/* Events */}
                <div className="space-y-8">
                  {enhancedTimeline.map((event, index) => {
                    const Icon = typeIcons[event.type];
                    const isSelected = selectedEvent?.id === event.id;
                    const isLast = index === enhancedTimeline.length - 1;
                    const isSecondLast = index === enhancedTimeline.length - 2;
                    
                    return (
                      <div
                        key={event.id}
                        className={cn(
                          "flex items-start gap-4 cursor-pointer group transition-all",
                          isSelected ? "opacity-100" : "opacity-70 hover:opacity-100"
                        )}
                        onClick={() => setSelectedEvent(event)}
                      >
                        {/* Date */}
                        <div className="w-16 text-right flex-shrink-0 pt-3">
                          <span className="text-xs font-semibold text-muted-foreground uppercase">
                            {event.date}
                          </span>
                        </div>

                        {/* Icon Circle - centered on line */}
                        <div className="relative flex-shrink-0">
                          <div
                            className={cn(
                              "relative z-10 h-12 w-12 rounded-full flex items-center justify-center transition-all shadow-sm",
                              typeColors[event.type],
                              isSelected && "scale-110 shadow-lg"
                            )}
                          >
                            <Icon className="h-5 w-5" />
                          </div>
                        </div>

                        {/* Content Card */}
                        <div
                          className={cn(
                            "flex-1 bg-card rounded-xl border p-4 transition-all",
                            isSelected ? "border-primary shadow-lg" : "border-border shadow-sm",
                            (isLast || isSecondLast) && "border-l-4",
                            isSecondLast && "border-l-amber-400",
                            isLast && "border-l-sky-400"
                          )}
                        >
                          {event.badge && (
                            <Badge
                              variant="outline"
                              className={cn("mb-2 text-xs", badgeColors[event.badge] || "bg-muted")}
                            >
                              {event.badge}
                            </Badge>
                          )}
                          <h4 className="font-semibold text-foreground">{event.title}</h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            {event.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Detail Panel */}
            {selectedEvent && (
              <div className="w-96 sticky top-8 h-fit">
                <div className={cn(
                  "rounded-t-2xl p-6 text-white",
                  selectedEvent.type === "gap" ? "bg-gradient-to-r from-amber-500 to-orange-500" :
                  selectedEvent.type === "target" ? "bg-gradient-to-r from-sky-500 to-blue-500" :
                  "bg-gradient-to-r from-accent-magenta to-primary"
                )}>
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm opacity-80 uppercase tracking-wide">
                        {selectedEvent.date}
                      </p>
                      <h3 className="text-xl font-bold mt-1">{selectedEvent.title}</h3>
                    </div>
                    {selectedEvent.type === "gap" ? (
                      <AlertTriangle className="h-6 w-6 opacity-80" />
                    ) : selectedEvent.type === "target" ? (
                      <Star className="h-6 w-6 opacity-80" />
                    ) : (
                      <Zap className="h-6 w-6 opacity-80" />
                    )}
                  </div>
                </div>

                <div className="bg-card rounded-b-2xl border border-t-0 border-border p-6 space-y-6">
                  {selectedEvent.gaps && selectedEvent.gaps.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground tracking-wider uppercase mb-3">
                        Competency Gaps to Address
                      </p>
                      <div className="space-y-2">
                        {selectedEvent.gaps.map((gap) => (
                          <div key={gap} className="flex items-center gap-3 p-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800">
                            <AlertTriangle className="h-4 w-4 text-amber-600" />
                            <span className="text-sm text-foreground">{gap}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedEvent.type === "target" && (
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground tracking-wider uppercase mb-3">
                        Target Role Details
                      </p>
                      <div className="bg-sky-50 dark:bg-sky-950/30 rounded-lg p-4 border border-sky-200 dark:border-sky-800">
                        <p className="text-foreground">
                          Based on current trajectory and successful completion of gap areas, 
                          {leader.name.split(' ')[0]} is projected to reach {leader.predictedRole} 
                          level by {selectedEvent.date}.
                        </p>
                      </div>
                    </div>
                  )}

                  {selectedEvent.evidence && (
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground tracking-wider uppercase mb-2">
                        Behavioral Evidence
                      </p>
                      <p className="text-foreground">{selectedEvent.evidence}</p>
                    </div>
                  )}

                  {selectedEvent.recognition && (
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground tracking-wider uppercase mb-2">
                        Supporting Recognition
                      </p>
                      <div className="bg-warning/10 rounded-lg p-4 border-l-4 border-warning">
                        <p className="text-xs font-semibold text-warning-foreground mb-2">
                          FROM {selectedEvent.recognition.from.toUpperCase()}
                        </p>
                        <p className="text-foreground italic">
                          "{selectedEvent.recognition.quote}"
                        </p>
                      </div>
                    </div>
                  )}

                  {selectedEvent.skills && selectedEvent.skills.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {selectedEvent.skills.map((skill) => (
                        <Badge key={skill} variant="outline">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default LeaderProfilePage;