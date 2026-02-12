import { useState } from "react";
import { ChevronLeft, Signal } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SignalAISidebar from "./SignalAISidebar";
import SubSignalModal from "./SubSignalModal";
import StrengthRing from "./StrengthRing";

interface AccelerateLeader {
  name: string;
  role: string;
  image: string;
  insight: string;
}

interface Behavior {
  name: string;
  description: string;
  strength: "strong" | "medium" | "emerging";
  predictiveStrength: number;
  leaders: AccelerateLeader[];
  summary?: string;
}

const getPredictiveLevel = (pct: number) => {
  if (pct >= 70) return { label: "High Predictive", semantic: "Strong", color: "#22c55e", bgColor: "rgba(34,197,94,0.08)", borderColor: "rgba(34,197,94,0.2)" };
  if (pct >= 40) return { label: "Medium Predictive", semantic: "Medium", color: "#f59e0b", bgColor: "rgba(245,158,11,0.08)", borderColor: "rgba(245,158,11,0.2)" };
  return { label: "Low Predictive", semantic: "Low", color: "#64748b", bgColor: "rgba(100,116,139,0.08)", borderColor: "rgba(100,116,139,0.2)" };
};

const MicroBars = ({ pct, color }: { pct: number; color: string }) => {
  const level = pct >= 70 ? 5 : pct >= 55 ? 4 : pct >= 40 ? 3 : pct >= 25 ? 2 : 1;
  const heights = [6, 10, 14, 18, 22];
  return (
    <div className="flex items-end gap-[3px]">
      {heights.map((h, i) => (
        <motion.div
          key={i}
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 0.3, delay: 0.3 + i * 0.05 }}
          className="w-[4px] rounded-sm origin-bottom"
          style={{
            height: h,
            backgroundColor: i < level ? color : `${color}1a`,
          }}
        />
      ))}
    </div>
  );
};

interface SignalCategoryData {
  id: string;
  name: string;
  description: string;
  aiSummary: string;
  color: string;
  iconBg: string;
  behaviors: Behavior[];
  accelerateLeaders: AccelerateLeader[];
}

const signalCategoriesData: Record<string, SignalCategoryData> = {
  "executive-access": {
    id: "executive-access",
    name: "Executive Access & Recognition",
    description: "Direct visibility and recognition from senior leadership. Building influence at the highest levels of the organization.",
    aiSummary: "Strong executive access patterns indicate leaders who are building visibility with C-suite stakeholders. Multi-source VP recognition shows cross-functional impact.",
    color: "#f59e0b",
    iconBg: "bg-amber-500",
    behaviors: [
      {
        name: "CEO/C-Suite Direct Access",
        description: "Regular interaction and recognition from C-level executives",
        strength: "strong",
        predictiveStrength: 95,
        summary: "4 leaders showing strong signals with direct CEO visibility this quarter",
        leaders: [
          { name: "Victoria Reynolds", role: "Senior Director, R&D", image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop&crop=face", insight: "Presents quarterly to the CEO on innovation pipeline" },
          { name: "Michael Chang", role: "VP, Commercial Strategy", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face", insight: "Direct advisor to CEO on market expansion" },
        ],
      },
      {
        name: "SVP Recognition + Global Scope",
        description: "Recognition from senior VPs with global organizational impact",
        strength: "strong",
        predictiveStrength: 97,
        summary: "2 leaders recognized by SVPs for global transformation initiatives",
        leaders: [
          { name: "Richard Lee", role: "VP, R&D Operations", image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop&crop=face", insight: "Led global R&D transformation recognized by SVP" },
          { name: "Elizabeth Hart", role: "Executive Director, Medical", image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&h=100&fit=crop&crop=face", insight: "Global medical strategy advisor" },
        ],
      },
      {
        name: "Multiple VP Sources",
        description: "Recognition from VPs across different functional areas",
        strength: "medium",
        predictiveStrength: 85,
        summary: "Cross-functional visibility growing with 3 leaders recognized by 2+ VPs",
        leaders: [
          { name: "Daniel Kim", role: "Senior Director, Manufacturing", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face", insight: "Recognized by VPs in Operations, R&D, and Commercial" },
        ],
      },
      {
        name: "Senior Leadership Visit Hosting",
        description: "Trusted to host and represent during executive visits",
        strength: "emerging",
        predictiveStrength: 68,
        summary: "1 leader regularly hosting board members and investors",
        leaders: [
          { name: "Katherine Moore", role: "VP, Corporate Development", image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop&crop=face", insight: "Hosts board members and investors" },
        ],
      },
      {
        name: "CFO + Vision Alignment",
        description: "Financial leadership recognition and strategic alignment",
        strength: "medium",
        predictiveStrength: 69,
        summary: "2 leaders demonstrating strong financial acumen signals",
        leaders: [],
      },
      {
        name: "Regional President Access",
        description: "Visibility with regional leadership across geographies",
        strength: "emerging",
        predictiveStrength: 60,
        summary: "Emerging signal with 1 leader building regional presence",
        leaders: [],
      },
    ],
    accelerateLeaders: [
      { name: "Victoria Reynolds", role: "Senior Director, R&D", image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop&crop=face", insight: "Exceptional strategic vision with CEO-level visibility" },
      { name: "Michael Chang", role: "VP, Commercial Strategy", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face", insight: "Drives market strategy with direct C-suite partnership" },
      { name: "Richard Lee", role: "VP, R&D Operations", image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop&crop=face", insight: "Global transformation leader with SVP sponsorship" },
      { name: "Elizabeth Hart", role: "Executive Director, Medical", image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&h=100&fit=crop&crop=face", insight: "Trusted medical advisor to senior leadership" },
    ],
  },
  "strategic-positioning": {
    id: "strategic-positioning",
    name: "Strategic Positioning",
    description: "Enterprise-level strategic impact and market influence. Leaders who shape organizational direction.",
    aiSummary: "Leaders show strong strategic positioning through enterprise transformation roles and cross-regional deployment. Technical-to-advisor transitions signal executive readiness.",
    color: "#a855f7",
    iconBg: "bg-purple-500",
    behaviors: [
      {
        name: "Enterprise Transformation",
        description: "Leading organization-wide change initiatives",
        strength: "strong",
        predictiveStrength: 88,
        summary: "3 leaders driving major enterprise-wide transformations",
        leaders: [
          { name: "Daniel Kim", role: "Senior Director, Manufacturing", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face", insight: "Led the largest manufacturing transformation in company history" },
        ],
      },
      {
        name: "Technical → Advisor Transition",
        description: "Moving from technical execution to strategic advisory",
        strength: "strong",
        predictiveStrength: 82,
        summary: "2 leaders successfully transitioned to advisory roles",
        leaders: [
          { name: "Victoria Reynolds", role: "Senior Director, R&D", image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop&crop=face", insight: "Transitioned from lab scientist to strategic R&D advisor" },
        ],
      },
      {
        name: "Cross-Regional Deployment",
        description: "Strategic impact across multiple geographies",
        strength: "medium",
        predictiveStrength: 64,
        summary: "4 leaders operating across 3+ regions",
        leaders: [
          { name: "William Chen", role: "Senior Director, Global Supply", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face", insight: "Manages supply chain across 12 countries" },
        ],
      },
      {
        name: "Investor-Facing Work",
        description: "Exposure to investor relations and communications",
        strength: "emerging",
        predictiveStrength: 35,
        summary: "Emerging signal with growing investor exposure",
        leaders: [],
      },
      {
        name: "Market/Industry Creation",
        description: "Contributing to new market or industry development",
        strength: "emerging",
        predictiveStrength: 28,
        summary: "1 leader exploring new market segments",
        leaders: [],
      },
      {
        name: "Board-Level Presentations",
        description: "Presenting to board of directors",
        strength: "medium",
        predictiveStrength: 55,
        summary: "2 leaders with board-level presentation experience",
        leaders: [],
      },
    ],
    accelerateLeaders: [
      { name: "Victoria Reynolds", role: "Senior Director, R&D", image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop&crop=face", insight: "Shapes R&D strategy at the enterprise level" },
      { name: "Daniel Kim", role: "Senior Director, Manufacturing", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face", insight: "Drives operational transformation globally" },
    ],
  },
  "voice-influence": {
    id: "voice-influence",
    name: "Voice & Influence",
    description: "Speaking up and shaping organizational direction. Leaders who have a voice beyond their role.",
    aiSummary: "Voice and influence signals reveal leaders who demonstrate courageous presence in senior forums and advocate for others.",
    color: "#3b82f6",
    iconBg: "bg-blue-500",
    behaviors: [
      {
        name: "Courageous Voice",
        description: "Speaking truth to power and challenging status quo",
        strength: "strong",
        predictiveStrength: 91,
        summary: "3 leaders recognized for speaking up in executive meetings",
        leaders: [
          { name: "Elizabeth Hart", role: "Executive Director, Medical", image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&h=100&fit=crop&crop=face", insight: "Known for raising difficult questions in executive meetings" },
        ],
      },
      {
        name: "Speaking Up for Others",
        description: "Advocating for team members and peers",
        strength: "medium",
        predictiveStrength: 58,
        summary: "5 leaders actively championing their teams",
        leaders: [
          { name: "Patricia Young", role: "Senior Director, Strategy", image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=100&h=100&fit=crop&crop=face", insight: "Champions emerging talent visibility" },
        ],
      },
      {
        name: "Honest/Balanced View",
        description: "Providing balanced, objective perspectives",
        strength: "strong",
        predictiveStrength: 76,
        summary: "4 leaders known for balanced decision making",
        leaders: [],
      },
      {
        name: "Partnership Language",
        description: "Communicating as strategic partner, not service provider",
        strength: "medium",
        predictiveStrength: 52,
        summary: "Growing signal among mid-level leaders",
        leaders: [],
      },
      {
        name: "Org Design Language",
        description: "Contributing to organizational structure discussions",
        strength: "emerging",
        predictiveStrength: 34,
        summary: "Emerging signal with 2 leaders involved",
        leaders: [],
      },
      {
        name: "External Speaking",
        description: "Representing organization at external events",
        strength: "emerging",
        predictiveStrength: 29,
        summary: "1 leader building external presence",
        leaders: [],
      },
    ],
    accelerateLeaders: [
      { name: "Elizabeth Hart", role: "Executive Director, Medical", image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&h=100&fit=crop&crop=face", insight: "Influential voice in medical strategy" },
    ],
  },
  "transformation-impact": {
    id: "transformation-impact",
    name: "Transformation & Impact",
    description: "Driving organizational change and sustained excellence. Creating lasting impact.",
    aiSummary: "Transformation signals are exceptionally strong, with leaders demonstrating sustained excellence over 3+ years.",
    color: "#f97316",
    iconBg: "bg-orange-500",
    behaviors: [
      {
        name: "Org Transformation Leadership",
        description: "Leading fundamental change in how the organization operates",
        strength: "strong",
        predictiveStrength: 93,
        summary: "5 leaders driving major organizational changes",
        leaders: [
          { name: "Daniel Kim", role: "Senior Director, Manufacturing", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face", insight: "Transformed manufacturing efficiency across 3 sites" },
          { name: "Richard Lee", role: "VP, R&D Operations", image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop&crop=face", insight: "Led R&D digital transformation" },
        ],
      },
      {
        name: "Sustained Excellence (3+ Years)",
        description: "Consistent high performance over extended period",
        strength: "strong",
        predictiveStrength: 89,
        summary: "8 leaders with 3+ years of top performance",
        leaders: [
          { name: "Victoria Reynolds", role: "Senior Director, R&D", image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop&crop=face", insight: "Top performer for 5 consecutive years" },
          { name: "Michael Chang", role: "VP, Commercial Strategy", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face", insight: "Exceeded targets every quarter for 4 years" },
        ],
      },
      {
        name: "Enterprise Geographic Scope",
        description: "Impact spanning multiple geographic regions",
        strength: "medium",
        predictiveStrength: 62,
        summary: "3 leaders with multi-region impact",
        leaders: [],
      },
      {
        name: "Role Model Recognition",
        description: "Cited as example for others to follow",
        strength: "medium",
        predictiveStrength: 56,
        summary: "4 leaders featured as organizational role models",
        leaders: [],
      },
      {
        name: "Cross-Functional Implementation",
        description: "Successfully implementing changes across functions",
        strength: "medium",
        predictiveStrength: 67,
        summary: "6 leaders with cross-functional project success",
        leaders: [],
      },
      {
        name: "Culture Change Leadership",
        description: "Leading cultural transformation initiatives",
        strength: "emerging",
        predictiveStrength: 38,
        summary: "Emerging signal with 2 leaders involved",
        leaders: [],
      },
    ],
    accelerateLeaders: [
      { name: "Daniel Kim", role: "Senior Director, Manufacturing", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face", insight: "Transformation leader with proven impact" },
      { name: "Victoria Reynolds", role: "Senior Director, R&D", image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop&crop=face", insight: "Sustained excellence in innovation" },
    ],
  },
  "people-leadership": {
    id: "people-leadership",
    name: "People Leadership",
    description: "Developing talent and supporting team wellbeing. Building the next generation of leaders.",
    aiSummary: "People leadership signals reveal a strong culture of development and mentorship. Leaders demonstrate both technical and relational excellence.",
    color: "#14b8a6",
    iconBg: "bg-teal-500",
    behaviors: [
      {
        name: "People Development & Mentorship",
        description: "Actively growing and mentoring team members",
        strength: "strong",
        predictiveStrength: 90,
        summary: "12 leaders actively mentoring emerging talent",
        leaders: [
          { name: "Elizabeth Hart", role: "Executive Director, Medical", image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&h=100&fit=crop&crop=face", insight: "Mentored 6 people to director level" },
          { name: "Patricia Young", role: "Senior Director, Strategy", image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=100&h=100&fit=crop&crop=face", insight: "Runs emerging leader development program" },
        ],
      },
      {
        name: "Team Wellbeing Advocacy",
        description: "Prioritizing team health and work-life balance",
        strength: "medium",
        predictiveStrength: 48,
        summary: "5 leaders championing wellbeing initiatives",
        leaders: [
          { name: "Katherine Moore", role: "VP, Corporate Development", image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop&crop=face", insight: "Champion of flexible work policies" },
        ],
      },
      {
        name: "Technical + Relational Excellence",
        description: "Balancing technical skills with relationship building",
        strength: "strong",
        predictiveStrength: 74,
        summary: "7 leaders demonstrating dual excellence",
        leaders: [],
      },
      {
        name: "Senior Leader Transition Support",
        description: "Helping leaders transition to new roles",
        strength: "emerging",
        predictiveStrength: 32,
        summary: "Emerging signal with 2 leaders involved",
        leaders: [],
      },
      {
        name: "Team Morale During Crisis",
        description: "Maintaining team morale through difficult periods",
        strength: "medium",
        predictiveStrength: 55,
        summary: "4 leaders recognized for crisis leadership",
        leaders: [],
      },
      {
        name: "Inclusive Team Culture",
        description: "Building diverse and inclusive teams",
        strength: "strong",
        predictiveStrength: 72,
        summary: "6 leaders driving DEI initiatives",
        leaders: [],
      },
    ],
    accelerateLeaders: [
      { name: "Elizabeth Hart", role: "Executive Director, Medical", image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&h=100&fit=crop&crop=face", insight: "Exceptional talent developer" },
      { name: "Patricia Young", role: "Senior Director, Strategy", image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=100&h=100&fit=crop&crop=face", insight: "Builds high-performing teams" },
    ],
  },
  "anti-patterns": {
    id: "anti-patterns",
    name: "Anti-Patterns",
    description: "Signals that may indicate execution focus over true leadership development.",
    aiSummary: "Anti-patterns help identify where leaders may be excelling at execution but not yet demonstrating true leadership signals.",
    color: "#ef4444",
    iconBg: "bg-rose-500",
    behaviors: [
      {
        name: "High-Volume Service Recognition",
        description: "Recognition focused on service delivery rather than leadership",
        strength: "emerging",
        predictiveStrength: 18,
        summary: "Watch signal - service over strategic focus",
        leaders: [],
      },
      {
        name: "Single VP Source",
        description: "All recognition coming from one VP only",
        strength: "emerging",
        predictiveStrength: 22,
        summary: "Limited visibility outside single relationship",
        leaders: [],
      },
      {
        name: "Technical Tool Excellence Only",
        description: "Praised only for technical skills, not leadership",
        strength: "emerging",
        predictiveStrength: 15,
        summary: "3 leaders may need leadership development",
        leaders: [],
      },
      {
        name: "Crisis Execution Only",
        description: "Crisis management through execution, not leadership",
        strength: "emerging",
        predictiveStrength: 20,
        summary: "Focus on execution over strategic leadership",
        leaders: [],
      },
      {
        name: "Peer-Level Recognition Dominant",
        description: "Recognition mainly from peers, less from leaders",
        strength: "emerging",
        predictiveStrength: 25,
        summary: "Building peer influence but limited upward visibility",
        leaders: [],
      },
      {
        name: "Service Provider Language",
        description: "Communication positions as service provider",
        strength: "emerging",
        predictiveStrength: 12,
        summary: "Opportunity to reframe as strategic partner",
        leaders: [],
      },
    ],
    accelerateLeaders: [],
  },
};

interface SignalCategoryPageProps {
  categoryId: string;
  onBack: () => void;
}

const strengthColors = {
  strong: { bg: "bg-success/10", border: "border-success/30", dot: "bg-success", text: "text-success" },
  medium: { bg: "bg-warning/10", border: "border-warning/30", dot: "bg-warning", text: "text-warning" },
  emerging: { bg: "bg-muted", border: "border-border", dot: "bg-muted-foreground", text: "text-muted-foreground" },
};

const SignalCategoryPage = ({ categoryId, onBack }: SignalCategoryPageProps) => {
  const [selectedBehavior, setSelectedBehavior] = useState<Behavior | null>(null);
  
  const category = signalCategoriesData[categoryId];
  
  if (!category) {
    return (
      <div className="min-h-full bg-white flex items-center justify-center">
        <p className="text-muted-foreground">Category not found</p>
      </div>
    );
  }

  // Use color from data instead of getCategoryColor

  const suggestedPrompts = [
    `Which leaders show the strongest ${category.name} signals?`,
    `What development actions should I take for this signal category?`,
    `How does this signal category impact promotion readiness?`,
    `Compare this signal across departments`,
  ];

  const handleCardClick = (behavior: Behavior) => {
    setSelectedBehavior(behavior);
  };

  const categoryColor = category.color;

  const getCardGradient = () => {
    const r = parseInt(categoryColor.slice(1, 3), 16);
    const g = parseInt(categoryColor.slice(3, 5), 16);
    const b = parseInt(categoryColor.slice(5, 7), 16);
    return `radial-gradient(ellipse 120px 120px at top left, rgba(${r}, ${g}, ${b}, 0.06) 0%, transparent 70%)`;
  };

  const recognitionMoments = [
    {
      from: "Sarah Mitchell", fromRole: "SVP, Commercial",
      fromImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
      to: "Victoria Reynolds", toRole: "Senior Director, R&D",
      toImage: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop&crop=face",
      title: "Exceptional executive presence",
      message: "Your leadership on the Q3 innovation pipeline was exceptional. The way you presented directly to the CEO showed real executive presence. Your ability to synthesize complex technical concepts for senior stakeholders is truly remarkable.",
      signal: "Enterprise Transformation", date: "2 weeks ago"
    },
    {
      from: "James Wilson", fromRole: "VP, Operations",
      fromImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
      to: "Michael Chang", toRole: "VP, Commercial Strategy",
      toImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
      title: "Strategic board presence",
      message: "Thanks for stepping up during the board presentation. Your strategic insights on market expansion were invaluable. The board was impressed with your command of the global landscape.",
      signal: "Technical → Advisor Transition", date: "3 weeks ago"
    },
    {
      from: "Emily Chen", fromRole: "Director, Finance",
      fromImage: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop&crop=face",
      to: "Richard Lee", toRole: "VP, R&D Operations",
      toImage: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop&crop=face",
      title: "Cross-functional leadership",
      message: "Your cross-functional collaboration on the global R&D transformation has been recognized by multiple VPs across the organization. Your ability to bridge technical and business perspectives is exceptional.",
      signal: "Cross-Regional Deployment", date: "1 month ago"
    },
    {
      from: "David Park", fromRole: "SVP, R&D",
      fromImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
      to: "Elizabeth Hart", toRole: "Executive Director, Medical",
      toImage: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&h=100&fit=crop&crop=face",
      title: "Executive hosting excellence",
      message: "Your ability to host senior leadership and represent our medical strategy to investors shows real executive readiness. You've become a trusted voice for our organization.",
      signal: "Board-Level Presentations", date: "1 month ago"
    },
    {
      from: "Lisa Johnson", fromRole: "CFO",
      fromImage: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=100&h=100&fit=crop&crop=face",
      to: "Daniel Kim", toRole: "Senior Director, Manufacturing",
      toImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
      title: "Strategic financial alignment",
      message: "Your strategic alignment with our financial goals and vision for manufacturing excellence has been outstanding. Your ROI-focused approach to operational decisions is exactly what we need.",
      signal: "Investor-Facing Work", date: "5 weeks ago"
    },
  ];

  return (
    <div className="h-full bg-white flex overflow-hidden">
      {/* Left: Main scrollable content */}
      <div className="flex-1 overflow-y-auto">
        {/* Full-width white header with layered signal bubble */}
        <div className="bg-white border-b border-border relative overflow-hidden min-h-[200px]">
          {/* Layered gradient bubble — subtle background */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="absolute -left-48 -bottom-48 pointer-events-none"
            style={{ width: '700px', height: '700px' }}
          >
            <div className="relative w-full h-full flex items-center justify-center">
              <div className="absolute inset-0 rounded-full" style={{ backgroundColor: categoryColor, opacity: 0.02 }} />
              <div className="absolute inset-[50px] rounded-full" style={{ backgroundColor: categoryColor, opacity: 0.03 }} />
              <div className="absolute inset-[100px] rounded-full" style={{ backgroundColor: categoryColor, opacity: 0.05 }} />
              <div className="absolute inset-[150px] rounded-full" style={{ backgroundColor: categoryColor, opacity: 0.08 }} />
              <div className="relative w-[300px] h-[300px] rounded-full bg-card" />
            </div>
          </motion.div>

          <div className="relative z-10 flex flex-col min-h-[200px]">
            <div className="flex justify-center">
              <div className="w-full max-w-[1020px] px-8 pt-6 pb-8 flex flex-col gap-6">
                <button 
                  className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors self-start"
                  onClick={onBack}
                >
                  <ChevronLeft className="w-4 h-4" />
                  Back to Signals
                </button>

                <div className="py-2">
                  <h1 className="text-3xl font-bold text-foreground mb-3">{category.name}</h1>
                  <p className="text-lg text-muted-foreground max-w-xl">{category.description}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content area — centered between left edge and AI sidebar */}
        <div className="flex justify-center">
          <div className="w-full max-w-[1020px] py-8 px-8">
            <Tabs defaultValue="overview" className="w-full">
              <div className="flex justify-start mb-8">
                <TabsList className="bg-white border border-border rounded-full p-1 h-auto shadow-sm">
                  <TabsTrigger 
                    value="overview" 
                    className="rounded-full px-6 py-2.5 text-sm font-medium data-[state=active]:bg-foreground data-[state=active]:text-white data-[state=inactive]:text-muted-foreground data-[state=inactive]:bg-transparent transition-all"
                  >
                    Signals
                  </TabsTrigger>
                  <TabsTrigger 
                    value="recognition"
                    className="rounded-full px-6 py-2.5 text-sm font-medium data-[state=active]:bg-foreground data-[state=active]:text-white data-[state=inactive]:text-muted-foreground data-[state=inactive]:bg-transparent transition-all"
                  >
                    Evidence
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="overview" className="mt-0">
                <h2 className="text-lg font-bold text-foreground mb-2">Signals</h2>
                <p className="text-[11px] uppercase tracking-widest text-muted-foreground mb-6">
                  Predictive strength shows how often each signal appears in leaders who advanced to VP+
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {category.behaviors.slice(0, 6).map((behavior, index) => {
                    const level = getPredictiveLevel(behavior.predictiveStrength);
                    return (
                      <motion.div
                        key={behavior.name}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.05 }}
                        className="bg-white rounded-2xl border border-border p-7 flex flex-col relative overflow-hidden cursor-pointer hover:border-border/80 hover:shadow-sm transition-all"
                        style={{ background: `white ${getCardGradient()}` }}
                        onClick={() => handleCardClick(behavior)}
                      >
                        <div 
                          className="absolute inset-0 pointer-events-none"
                          style={{ background: getCardGradient() }}
                        />
                        <div className="relative z-10 flex flex-col h-full">
                          {/* Title + description */}
                          <h3 className="font-bold text-foreground text-lg mb-1.5">{behavior.name}</h3>
                          <p className="text-sm text-muted-foreground mb-5 leading-relaxed">{behavior.description}</p>

                          {/* Predictive strength section */}
                          <div className="pt-5 border-t border-border mt-auto">
                            <div className="flex items-center gap-4">
                              {/* Strength ring as primary visual */}
                              <StrengthRing value={behavior.predictiveStrength} color={level.color} size={64} strokeWidth={4.5} />
                              <div className="flex flex-col gap-1.5">
                                {/* Pill badge */}
                                <span
                                  className="inline-flex items-center self-start px-3 py-1 rounded-full text-[11px] font-semibold border"
                                  style={{ color: level.color, backgroundColor: level.bgColor, borderColor: level.borderColor }}
                                >
                                  {level.label}
                                </span>
                                {/* Context line */}
                                <p className="text-[12px] text-muted-foreground leading-relaxed">
                                  Appears in {behavior.predictiveStrength}% of future VP+ leaders
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </TabsContent>

              <TabsContent value="recognition" className="mt-0">
                <h2 className="text-lg font-bold text-foreground mb-6">Recognition Moments</h2>
                <div className="bg-white rounded-2xl border border-border divide-y divide-border">
                  {recognitionMoments.map((moment, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="p-6"
                    >
                      <div className="flex items-center gap-4 mb-4">
                        <div className="flex items-center gap-2">
                          <img src={moment.fromImage} alt={moment.from} className="w-10 h-10 rounded-full object-cover border-2 border-border" />
                          <span className="text-muted-foreground text-sm">›</span>
                          <img src={moment.toImage} alt={moment.to} className="w-10 h-10 rounded-full object-cover border-2 border-border" />
                        </div>
                        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium" style={{ backgroundColor: `${categoryColor}10` }}>
                          <div className="w-5 h-5 rounded-md flex items-center justify-center" style={{ backgroundColor: categoryColor }}>
                            <Signal className="w-3 h-3 text-white" />
                          </div>
                          <span className="font-medium" style={{ color: categoryColor }}>{moment.signal}</span>
                        </div>
                        <div className="flex-1" />
                        <span className="text-xs text-muted-foreground">{moment.date}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        <span className="font-medium text-foreground underline">{moment.to}</span>
                        {" "}received recognition from{" "}
                        <span className="font-medium text-foreground underline">{moment.from}</span>
                      </p>
                      <h4 className="font-bold text-foreground text-base mb-2">{moment.title}</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 mb-2">{moment.message}</p>
                      <button className="text-sm font-medium text-foreground hover:text-primary transition-colors">Read more</button>
                    </motion.div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Right: AI Assistant — full height, no scroll needed for input */}
      <div className="w-[410px] flex-shrink-0">
        <SignalAISidebar
          categoryName={category.name}
          categoryColor={categoryColor}
          aiSummary={category.aiSummary}
          recognitionSummary={`Recognition for ${category.name.toLowerCase()} is strongest among senior-level interactions, with 78% coming from VP+ levels. Cross-functional recognition has increased 23% this quarter.`}
          suggestedPrompts={suggestedPrompts}
        />
      </div>

      {/* Sub-signal detail modal */}
      <SubSignalModal
        isOpen={!!selectedBehavior}
        onClose={() => setSelectedBehavior(null)}
        signalName={selectedBehavior?.name || ""}
        signalDescription={selectedBehavior?.description || ""}
        strength={selectedBehavior?.strength || "emerging"}
        summary={selectedBehavior?.summary}
        leaders={selectedBehavior?.leaders || []}
        categoryColor={categoryColor}
        categoryName={category.name}
      />
    </div>
  );
};

export default SignalCategoryPage;
