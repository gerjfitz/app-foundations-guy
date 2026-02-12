import { ChevronRight, Crown, Compass, Megaphone, Rocket, Users, AlertTriangle, Sparkles, Building2, Eye, X, TrendingUp, Target, ChevronDown, Lightbulb, Zap, Award } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import LeadershipGenome from "./LeadershipGenome";
import GenomeStrand from "./GenomeStrand";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

interface Signal {
  name: string;
  strength?: "strong" | "medium" | "emerging";
  description?: string;
  evidence?: string[];
  actions?: string[];
}

interface SignalCategory {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  aiSummary: string;
  signals: Signal[];
  color: string;
  bgColor: string;
  iconBg: string;
}

// Observed Signals - derived from AI analysis of recognition activity
const observedSignals: SignalCategory[] = [
  {
    id: "executive-access",
    name: "Executive Access & Recognition",
    icon: <Crown className="w-5 h-5" />,
    description: "Direct visibility and recognition from senior leadership",
    aiSummary: "Strong executive access patterns indicate leaders who are building visibility with C-suite stakeholders.",
    color: "text-amber-600",
    bgColor: "bg-amber-50 dark:bg-amber-900/20",
    iconBg: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
    signals: [
      { name: "CEO/C-Suite Direct Access", strength: "strong", description: "Direct recognition and visibility with C-level executives.", evidence: ["3 direct mentions in CEO town halls", "Invited to executive strategy sessions"], actions: ["Continue building executive relationships", "Seek stretch assignments with C-suite visibility"] },
      { name: "SVP Recognition + Global Scope", strength: "strong", description: "Recognition from senior VPs with global organizational impact.", evidence: ["SVP recognition for APAC expansion", "Led global initiative rollout"], actions: ["Document global impact metrics", "Build cross-regional relationships"] },
      { name: "Multiple VP Sources (Cross-Functional)", strength: "medium", description: "Recognition from VPs across different functions.", evidence: ["VP Sales recognition", "VP Engineering collaboration acknowledgment"], actions: ["Expand cross-functional partnerships", "Lead more joint initiatives"] },
      { name: "CFO + Vision Alignment", strength: "medium", description: "Financial leadership recognition and strategic alignment.", evidence: ["Presented to CFO on cost optimization", "Budget proposal accepted"], actions: ["Deepen financial acumen", "Align projects with financial goals"] },
      { name: "Regional President Recognition", strength: "emerging", description: "Visibility with regional leadership.", evidence: ["Mentioned in regional review"], actions: ["Seek regional leadership projects"] },
      { name: "Senior Leadership Visit Hosting", strength: "emerging", description: "Selected to host executive site visits.", evidence: ["Hosted CEO site visit Q3"], actions: ["Prepare for future hosting opportunities"] },
    ],
  },
  {
    id: "strategic-positioning",
    name: "Strategic Positioning",
    icon: <Compass className="w-5 h-5" />,
    description: "Enterprise-level strategic impact and market influence",
    aiSummary: "Leaders show strong strategic positioning through enterprise transformation roles and cross-regional deployment.",
    color: "text-purple-600",
    bgColor: "bg-purple-50 dark:bg-purple-900/20",
    iconBg: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
    signals: [
      { name: "Enterprise Transformation Programme Role", strength: "strong", description: "Leading organization-wide transformation initiatives.", evidence: ["Led digital transformation workstream", "Change management across 5 departments"], actions: ["Document transformation outcomes", "Mentor others in change leadership"] },
      { name: "Technical → Advisor Role Transition", strength: "medium", description: "Evolution from technical contributor to strategic advisor.", evidence: ["Invited to strategy discussions", "Consulted on technical direction"], actions: ["Develop advisory presence", "Build strategic communication skills"] },
      { name: "Cross-Regional Deployment", strength: "medium", description: "Operating effectively across multiple regions.", evidence: ["EMEA and APAC project coordination"], actions: ["Expand regional network", "Learn cultural nuances"] },
      { name: "Investor-Facing Work", strength: "emerging", description: "Exposure to investor relations and communications.", evidence: ["Prepared materials for investor day"], actions: ["Seek more investor-facing opportunities"] },
      { name: "Market/Industry Creation", strength: "emerging", description: "Contributing to new market or industry development.", evidence: ["New market segment proposal"], actions: ["Develop market analysis skills"] },
    ],
  },
  {
    id: "voice-influence",
    name: "Voice & Influence",
    icon: <Megaphone className="w-5 h-5" />,
    description: "Speaking up and shaping organizational direction",
    aiSummary: "Voice and influence signals reveal leaders who demonstrate courageous presence in senior forums.",
    color: "text-blue-600",
    bgColor: "bg-blue-50 dark:bg-blue-900/20",
    iconBg: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
    signals: [
      { name: "Courageous Voice in Senior Forums", strength: "strong", description: "Speaking up constructively in leadership meetings.", evidence: ["Raised strategic concerns in exec meeting", "Proposed alternative approach to leadership"], actions: ["Continue advocating for improvement", "Balance courage with diplomacy"] },
      { name: "Honest/Balanced View Recognition", strength: "medium", description: "Known for providing balanced, honest perspectives.", evidence: ["Recognized for fair assessment of projects"], actions: ["Maintain objectivity", "Document decision rationale"] },
      { name: "Partnership Language (Not Service)", strength: "medium", description: "Communicating as a strategic partner, not just service provider.", evidence: ["Reframed team positioning to leadership"], actions: ["Coach team on partnership mindset"] },
      { name: "Organization Design Language", strength: "emerging", description: "Contributing to organizational structure discussions.", evidence: ["Input on team restructuring"], actions: ["Study org design principles"] },
      { name: "Speaking Up for Others", strength: "strong", description: "Advocating for team members and underrepresented voices.", evidence: ["Championed team member for promotion", "Raised equity concerns"], actions: ["Continue advocacy", "Mentor others to speak up"] },
    ],
  },
  {
    id: "transformation-impact",
    name: "Transformation & Impact",
    icon: <Rocket className="w-5 h-5" />,
    description: "Driving organizational change and sustained excellence",
    aiSummary: "Transformation signals are exceptionally strong, with leaders demonstrating sustained excellence over 3+ years.",
    color: "text-orange-600",
    bgColor: "bg-orange-50 dark:bg-orange-900/20",
    iconBg: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300",
    signals: [
      { name: "Organizational Transformation Leadership", strength: "strong", description: "Leading major organizational change initiatives.", evidence: ["Led restructuring of operations team", "Change adoption rate: 92%"], actions: ["Share transformation playbook", "Mentor change leaders"] },
      { name: "Enterprise Geographic Scope", strength: "medium", description: "Impact spanning multiple geographic regions.", evidence: ["Initiative deployed across 3 regions"], actions: ["Document global rollout learnings"] },
      { name: "Sustained Excellence (3+ Years)", strength: "strong", description: "Consistent high performance over extended period.", evidence: ["Top performer 3 consecutive years", "Consistent exceed expectations ratings"], actions: ["Mentor others on sustained performance"] },
      { name: "Role Model Recognition", strength: "medium", description: "Cited as example for others to follow.", evidence: ["Featured in leadership newsletter", "Asked to share approach with peers"], actions: ["Formalize best practices", "Lead training sessions"] },
      { name: "Cross-Functional Implementation", strength: "medium", description: "Successfully implementing changes across functions.", evidence: ["Cross-team process improvement"], actions: ["Expand cross-functional influence"] },
    ],
  },
  {
    id: "people-leadership",
    name: "People Leadership",
    icon: <Users className="w-5 h-5" />,
    description: "Developing talent and supporting team wellbeing",
    aiSummary: "People leadership signals reveal a strong culture of development and mentorship.",
    color: "text-teal-600",
    bgColor: "bg-teal-50 dark:bg-teal-900/20",
    iconBg: "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300",
    signals: [
      { name: "Technical + Relational Excellence", strength: "strong", description: "Balancing technical skills with relationship building.", evidence: ["High team engagement scores", "Technical mentorship recognition"], actions: ["Continue balanced approach", "Coach others on this balance"] },
      { name: "People Development & Mentorship", strength: "strong", description: "Actively developing team members and mentees.", evidence: ["3 direct reports promoted this year", "Formal mentorship of 5 mentees"], actions: ["Expand mentorship reach", "Create development programs"] },
      { name: "Team Wellbeing Advocacy", strength: "medium", description: "Championing team wellness and work-life balance.", evidence: ["Implemented flexible work policies", "Team burnout reduced 40%"], actions: ["Share wellbeing practices", "Advocate for org-wide policies"] },
      { name: "Senior Leader Transition Support", strength: "emerging", description: "Helping leaders transition to new roles.", evidence: ["Supported VP onboarding"], actions: ["Formalize transition support approach"] },
      { name: "Team Morale During Crisis", strength: "medium", description: "Maintaining team morale through difficult periods.", evidence: ["Team retention during restructuring: 95%"], actions: ["Document crisis leadership approach"] },
    ],
  },
  {
    id: "anti-patterns",
    name: "Anti-Patterns",
    icon: <AlertTriangle className="w-5 h-5" />,
    description: "Signals that may indicate execution focus over leadership",
    aiSummary: "Anti-patterns help identify where leaders may be excelling at execution but not yet demonstrating true leadership signals.",
    color: "text-rose-600",
    bgColor: "bg-rose-50 dark:bg-rose-900/20",
    iconBg: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300",
    signals: [
      { name: "High-Volume Service Recognition", description: "Recognition focused on service delivery rather than leadership.", evidence: ["Multiple 'helpful' recognitions"], actions: ["Shift focus to strategic impact"] },
      { name: "Single VP Source (Same Person)", description: "Recognition coming from only one senior leader.", evidence: ["All executive recognition from same VP"], actions: ["Diversify executive relationships"] },
      { name: "Technical Tool Excellence Only", description: "Praised only for technical skills, not leadership.", evidence: ["Recognition limited to tool proficiency"], actions: ["Seek leadership opportunities"] },
      { name: "Crisis Execution (Not Leadership)", description: "Crisis management through execution, not leadership.", evidence: ["Recognized for doing the work, not leading"], actions: ["Delegate more, lead from front"] },
      { name: "Digital Product Ownership Only", description: "Focused on product delivery without broader influence.", evidence: ["Limited scope of impact"], actions: ["Expand influence beyond product"] },
      { name: "Peer-Level Recognition Dominant", description: "Recognition mainly from peers, less from leaders.", evidence: ["High peer recognition, low upward visibility"], actions: ["Build upward visibility"] },
      { name: "Service Provider Language", description: "Communication positions as service provider.", evidence: ["'Supporting the business' framing"], actions: ["Reframe as strategic partner"] },
    ],
  },
];

// Stated Signals - provided by company values
const statedSignals: SignalCategory[] = [
  {
    id: "respect",
    name: "Respect",
    icon: <Users className="w-5 h-5" />,
    description: "Treating others with dignity and valuing diverse perspectives",
    aiSummary: "Respect signals track leaders who foster inclusive environments and value every voice.",
    color: "text-emerald-600",
    bgColor: "bg-emerald-50 dark:bg-emerald-900/20",
    iconBg: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
    signals: [
      { name: "Inclusive Meeting Facilitation", strength: "strong", description: "Ensuring all voices are heard in meetings.", evidence: ["Praised for inclusive leadership style"], actions: ["Continue fostering inclusion"] },
      { name: "Diverse Team Building", strength: "medium", description: "Building diverse, high-performing teams.", evidence: ["Team diversity improved 25%"], actions: ["Expand diversity initiatives"] },
      { name: "Active Listening Recognition", strength: "strong", description: "Known for truly listening to others.", evidence: ["Multiple 'great listener' recognitions"], actions: ["Teach listening skills to others"] },
      { name: "Conflict Resolution Excellence", strength: "medium", description: "Resolving conflicts with respect for all parties.", evidence: ["Successfully mediated team conflicts"], actions: ["Develop mediation skills further"] },
      { name: "Cross-Cultural Sensitivity", strength: "emerging", description: "Navigating cultural differences effectively.", evidence: ["Positive feedback from global teams"], actions: ["Deepen cultural competency"] },
    ],
  },
  {
    id: "determination",
    name: "Determination",
    icon: <Target className="w-5 h-5" />,
    description: "Pursuing goals with resilience and commitment",
    aiSummary: "Determination signals identify leaders who persist through challenges and inspire others to do the same.",
    color: "text-blue-600",
    bgColor: "bg-blue-50 dark:bg-blue-900/20",
    iconBg: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
    signals: [
      { name: "Obstacle Overcoming", strength: "strong", description: "Pushing through significant obstacles.", evidence: ["Delivered project despite major blockers"], actions: ["Share perseverance stories"] },
      { name: "Goal Achievement Consistency", strength: "strong", description: "Consistently achieving ambitious goals.", evidence: ["100% goal achievement rate"], actions: ["Mentor others on goal setting"] },
      { name: "Recovery from Setbacks", strength: "medium", description: "Bouncing back from failures.", evidence: ["Turned around failing project"], actions: ["Document recovery approaches"] },
      { name: "Long-term Vision Pursuit", strength: "medium", description: "Maintaining focus on long-term objectives.", evidence: ["Multi-year initiative success"], actions: ["Communicate long-term vision"] },
      { name: "Team Motivation During Challenges", strength: "strong", description: "Keeping team motivated through difficulties.", evidence: ["Team morale maintained during restructuring"], actions: ["Share motivation techniques"] },
    ],
  },
  {
    id: "innovation",
    name: "Innovation",
    icon: <Lightbulb className="w-5 h-5" />,
    description: "Creating new solutions and challenging the status quo",
    aiSummary: "Innovation signals reveal leaders who drive creative solutions and embrace calculated risks.",
    color: "text-violet-600",
    bgColor: "bg-violet-50 dark:bg-violet-900/20",
    iconBg: "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300",
    signals: [
      { name: "Novel Solution Development", strength: "strong", description: "Creating innovative solutions to problems.", evidence: ["Developed new approach saving $2M"], actions: ["Patent or document innovations"] },
      { name: "Calculated Risk Taking", strength: "medium", description: "Taking smart risks to drive progress.", evidence: ["Piloted new technology successfully"], actions: ["Mentor others on risk assessment"] },
      { name: "Process Improvement Leadership", strength: "strong", description: "Continuously improving processes.", evidence: ["40% efficiency improvement"], actions: ["Formalize improvement methodology"] },
      { name: "Technology Adoption Pioneer", strength: "medium", description: "Early adopter of beneficial technologies.", evidence: ["Led AI tool adoption"], actions: ["Share adoption learnings"] },
      { name: "Creative Problem Solving", strength: "strong", description: "Finding creative solutions to challenges.", evidence: ["Solved seemingly impossible problem"], actions: ["Teach creative thinking methods"] },
    ],
  },
  {
    id: "service",
    name: "Service",
    icon: <Zap className="w-5 h-5" />,
    description: "Serving customers and colleagues with excellence",
    aiSummary: "Service signals track leaders who prioritize customer and colleague success.",
    color: "text-cyan-600",
    bgColor: "bg-cyan-50 dark:bg-cyan-900/20",
    iconBg: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300",
    signals: [
      { name: "Customer Advocacy", strength: "strong", description: "Championing customer needs internally.", evidence: ["Customer NPS improved 20 points"], actions: ["Expand customer advocacy role"] },
      { name: "Colleague Support Excellence", strength: "strong", description: "Going above and beyond for colleagues.", evidence: ["Multiple peer appreciation recognitions"], actions: ["Formalize support practices"] },
      { name: "Proactive Problem Prevention", strength: "medium", description: "Anticipating and preventing issues.", evidence: ["Prevented major customer issue"], actions: ["Document prevention strategies"] },
      { name: "Service Recovery Leadership", strength: "medium", description: "Turning service failures into wins.", evidence: ["Customer saved after major issue"], actions: ["Share recovery playbook"] },
      { name: "Cross-Team Collaboration", strength: "strong", description: "Collaborating effectively across teams.", evidence: ["Led successful cross-team initiative"], actions: ["Expand collaboration network"] },
    ],
  },
  {
    id: "excellence",
    name: "Excellence",
    icon: <Award className="w-5 h-5" />,
    description: "Striving for the highest standards of quality",
    aiSummary: "Excellence signals track leaders who consistently deliver high-quality outcomes and raise the bar.",
    color: "text-indigo-600",
    bgColor: "bg-indigo-50 dark:bg-indigo-900/20",
    iconBg: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300",
    signals: [
      { name: "Quality Standards Leadership", strength: "strong", description: "Setting and maintaining high quality standards.", evidence: ["Zero defects in major release"], actions: ["Document quality processes"] },
      { name: "Performance Excellence", strength: "strong", description: "Consistently exceeding performance expectations.", evidence: ["Top 10% performance rating"], actions: ["Mentor others on excellence"] },
      { name: "Best Practice Implementation", strength: "medium", description: "Implementing industry best practices.", evidence: ["Best practice adoption across team"], actions: ["Share best practices org-wide"] },
      { name: "Continuous Improvement", strength: "strong", description: "Always seeking to improve.", evidence: ["Quarterly improvement initiatives"], actions: ["Formalize improvement cadence"] },
      { name: "Recognition for Outstanding Work", strength: "strong", description: "Receiving recognition for exceptional work.", evidence: ["Multiple excellence awards"], actions: ["Pay forward recognition culture"] },
    ],
  },
  {
    id: "agility",
    name: "Agility",
    icon: <TrendingUp className="w-5 h-5" />,
    description: "Adapting quickly to change and uncertainty",
    aiSummary: "Agility signals identify leaders who thrive in dynamic environments and lead through change.",
    color: "text-amber-600",
    bgColor: "bg-amber-50 dark:bg-amber-900/20",
    iconBg: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
    signals: [
      { name: "Change Leadership", strength: "strong", description: "Leading effectively through change.", evidence: ["Successfully led team through restructuring"], actions: ["Document change leadership approach"] },
      { name: "Rapid Response", strength: "strong", description: "Responding quickly to emerging situations.", evidence: ["Fast response to market shift"], actions: ["Share rapid response framework"] },
      { name: "Flexibility Recognition", strength: "medium", description: "Known for adaptability and flexibility.", evidence: ["Multiple 'flexible' recognitions"], actions: ["Teach flexibility mindset"] },
      { name: "Pivoting Under Pressure", strength: "medium", description: "Successfully pivoting strategy when needed.", evidence: ["Successful mid-project pivot"], actions: ["Document pivot decision framework"] },
      { name: "Adaptive Planning", strength: "medium", description: "Creating plans that adapt to change.", evidence: ["Flexible planning approach praised"], actions: ["Share adaptive planning methods"] },
    ],
  },
];

// Explorer categories for the Signal Explorer tab
const explorerCategories = [
  {
    id: "strategic-leadership",
    name: "Strategic Leadership & Transformation",
    signals: [
      { name: "Enterprise Vision Setting", strength: "strong" as const, description: "Defining and communicating long-term organizational vision.", evidence: ["Led 5-year strategy development", "Vision adopted by executive team"], actions: ["Communicate vision at all levels", "Align team goals with vision"] },
      { name: "Change Management Excellence", strength: "strong" as const, description: "Leading successful organizational change initiatives.", evidence: ["95% change adoption rate", "Led 3 major transformations"], actions: ["Develop change leadership playbook", "Mentor other change leaders"] },
      { name: "Board-Level Communication", strength: "medium" as const, description: "Presenting effectively to board and senior stakeholders.", evidence: ["Quarterly board presentations", "Strategic initiative approval"], actions: ["Refine board communication skills", "Seek more board exposure"] },
    ],
  },
  {
    id: "customer-success",
    name: "Customer Success & Relationship Management",
    signals: [
      { name: "Customer Retention Leadership", strength: "strong" as const, description: "Driving customer retention and loyalty.", evidence: ["Retention rate improved to 98%", "NPS score +25"], actions: ["Document retention strategies", "Share best practices"] },
      { name: "Strategic Account Development", strength: "medium" as const, description: "Growing strategic customer relationships.", evidence: ["Account revenue +40%", "Executive sponsor relationships"], actions: ["Expand strategic account portfolio", "Develop account strategies"] },
      { name: "Customer Advocacy Program", strength: "emerging" as const, description: "Building customer advocacy and references.", evidence: ["10 customer references secured", "Case study development"], actions: ["Formalize advocacy program", "Increase reference base"] },
    ],
  },
  {
    id: "people-development",
    name: "People Development & HR Excellence",
    signals: [
      { name: "Talent Pipeline Development", strength: "strong" as const, description: "Builds and maintains strong talent pipelines.", evidence: ["4 high-potentials identified...", "Development program launched..."], actions: ["Formalize talent review process", "Create development curriculum"] },
      { name: "Inclusive Leadership Practices", strength: "medium" as const, description: "Fostering diverse and inclusive team culture.", evidence: ["Team diversity +30%", "Inclusion survey scores +15"], actions: ["Expand inclusion initiatives", "Train managers on inclusive practices"] },
      { name: "Succession Planning", strength: "medium" as const, description: "Developing future leaders for key roles.", evidence: ["Successor identified for each key role", "Leadership pipeline built"], actions: ["Accelerate successor development", "Create leadership rotations"] },
    ],
  },
  {
    id: "innovation-product",
    name: "Innovation & Product Leadership",
    signals: [
      { name: "Product Vision & Strategy", strength: "strong" as const, description: "Defining compelling product direction.", evidence: ["Product roadmap adopted", "Market share +15%"], actions: ["Communicate product vision broadly", "Align teams on product strategy"] },
      { name: "Innovation Pipeline Management", strength: "medium" as const, description: "Managing flow of innovative ideas to market.", evidence: ["5 innovations launched", "Patent applications filed"], actions: ["Formalize innovation process", "Increase idea throughput"] },
      { name: "Technology Trend Anticipation", strength: "emerging" as const, description: "Anticipating and leveraging technology trends.", evidence: ["Early AI adoption", "Technology thought leadership"], actions: ["Develop technology radar", "Share trend insights"] },
    ],
  },
  {
    id: "operations",
    name: "Operations & Process Excellence",
    signals: [
      { name: "Operational Efficiency Leadership", strength: "strong" as const, description: "Driving operational efficiency improvements.", evidence: ["Cost reduced 25%", "Process cycle time -40%"], actions: ["Document efficiency methods", "Expand efficiency initiatives"] },
      { name: "Quality Management Excellence", strength: "strong" as const, description: "Maintaining high quality standards.", evidence: ["Zero critical defects", "Quality awards received"], actions: ["Formalize quality processes", "Train teams on quality"] },
      { name: "Supply Chain Optimization", strength: "medium" as const, description: "Optimizing end-to-end supply chain.", evidence: ["Supply chain costs -20%", "Delivery time improved"], actions: ["Expand optimization scope", "Build supplier relationships"] },
    ],
  },
  {
    id: "cross-functional",
    name: "Cross-Functional Collaboration",
    signals: [
      { name: "Cross-Team Project Leadership", strength: "strong" as const, description: "Leading projects across multiple teams.", evidence: ["5 cross-team initiatives led", "High collaboration scores"], actions: ["Expand cross-functional network", "Mentor on collaboration"] },
      { name: "Stakeholder Alignment Excellence", strength: "medium" as const, description: "Aligning diverse stakeholders on goals.", evidence: ["Consensus achieved on key initiatives", "Conflict resolution success"], actions: ["Develop stakeholder maps", "Improve alignment techniques"] },
      { name: "Matrix Organization Navigation", strength: "medium" as const, description: "Operating effectively in matrix structures.", evidence: ["Successful in dotted-line relationships", "Influence without authority"], actions: ["Teach matrix navigation skills", "Build influence networks"] },
    ],
  },
];

interface SignalsPageProps {
  onCategoryClick?: (categoryId: string) => void;
}

const CategoryCard = ({ category, onClick, index, variant = "observed" }: { category: SignalCategory; onClick: () => void; index: number; variant?: "stated" | "observed" }) => {
  const isStated = variant === "stated";
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 + index * 0.05 }}
      className={cn(
        "rounded-2xl border overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer group h-[160px]",
        isStated 
          ? "bg-gradient-to-br from-slate-50 to-white dark:from-slate-900/50 dark:to-card border-slate-200 dark:border-slate-700 hover:border-slate-300"
          : "bg-gradient-to-br from-violet-50/50 to-white dark:from-violet-900/20 dark:to-card border-violet-100 dark:border-violet-800/30 hover:border-violet-200"
      )}
      onClick={onClick}
    >
      <div className="p-5 h-full flex flex-col">
        <div className="flex items-start justify-between flex-1">
          <div className="flex items-start gap-4 flex-1">
            <div className={cn(
              "w-11 h-11 rounded-xl flex items-center justify-center shrink-0",
              category.iconBg
            )}>
              {category.icon}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-bold text-foreground mb-2">
                {category.name}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                {category.aiSummary}
              </p>
            </div>
          </div>
          
          <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all shrink-0 ml-2" />
        </div>
      </div>
    </motion.div>
  );
};

// Insights for the carousel
const insights = [
  {
    title: "What the Signals Tell Us",
    content: "Your organization shows strong Transformation & Impact and Executive Access capabilities, indicating a performance-driven culture. Focus on developing People Leadership signals around mentorship and wellbeing."
  },
  {
    title: "Executive Visibility Trends",
    content: "Leaders with high Executive Access signals are 3x more likely to advance to senior roles. Your top performers show consistent C-suite recognition patterns over the past 12 months."
  },
  {
    title: "Development Opportunity",
    content: "Voice & Influence signals show room for growth. Encourage leaders to speak up in senior forums and advocate for their teams to strengthen this critical leadership dimension."
  }
];

const InsightsCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % insights.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="relative z-20 max-w-md ml-8 lg:ml-12"
    >
      <div className="p-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl font-bold text-foreground mb-4">{insights[currentIndex].title}</h2>
            <p className="text-base text-muted-foreground leading-relaxed">
              {insights[currentIndex].content}
            </p>
          </motion.div>
        </AnimatePresence>
        
        {/* Carousel indicators */}
        <div className="flex gap-2 mt-6">
          {insights.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                index === currentIndex 
                  ? "w-8" 
                  : "w-1.5 bg-muted-foreground/30 hover:bg-muted-foreground/50"
              )}
              style={index === currentIndex ? { backgroundColor: '#BE2BBE' } : undefined}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

// Signal Explorer Component with accordion-style Sankey ribbons
const SignalExplorer = () => {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [selectedSignal, setSelectedSignal] = useState<{ category: string; signal: Signal } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => {
      const next = new Set(prev);
      if (next.has(categoryId)) next.delete(categoryId);
      else next.add(categoryId);
      return next;
    });
  };

  const getStrengthColor = (strength?: string) => {
    switch (strength) {
      case "strong":
        return { bg: "bg-emerald-500", text: "text-white", label: "Strong Signal" };
      case "medium":
        return { bg: "bg-amber-500", text: "text-white", label: "Medium" };
      case "emerging":
        return { bg: "bg-blue-500", text: "text-white", label: "Emerging" };
      default:
        return { bg: "bg-slate-500", text: "text-white", label: "Signal" };
    }
  };

  const getCategoryColor = (category: SignalCategory) => {
    if (category.color.includes("amber")) return "#d97706";
    if (category.color.includes("purple")) return "#9333ea";
    if (category.color.includes("blue")) return "#2563eb";
    if (category.color.includes("orange")) return "#ea580c";
    if (category.color.includes("teal")) return "#0d9488";
    if (category.color.includes("rose")) return "#e11d48";
    if (category.color.includes("emerald")) return "#059669";
    if (category.color.includes("violet")) return "#7c3aed";
    if (category.color.includes("cyan")) return "#0891b2";
    return "#BE2BBE";
  };

  // Generate Sankey ribbon path - tapered from hub (left) to signal (right)
  const generateRibbonPath = (
    startY: number,
    endY: number,
    startX: number,
    endX: number,
    endWidth: number = 10,
    startWidth: number = 3
  ) => {
    const controlPointOffset = (endX - startX) * 0.5;
    const topPath = `M ${startX} ${startY - startWidth / 2}
                     C ${startX + controlPointOffset} ${startY - startWidth / 2},
                       ${endX - controlPointOffset} ${endY - endWidth / 2},
                       ${endX} ${endY - endWidth / 2}`;
    const bottomPath = `L ${endX} ${endY + endWidth / 2}
                        C ${endX - controlPointOffset} ${endY + endWidth / 2},
                          ${startX + controlPointOffset} ${startY + startWidth / 2},
                          ${startX} ${startY + startWidth / 2} Z`;
    return topPath + bottomPath;
  };

  const SignalExplorerRow = ({ category }: { category: SignalCategory }) => {
    const isExpanded = expandedCategories.has(category.id);

    const rowRef = useRef<HTMLDivElement | null>(null);
    const catRef = useRef<HTMLDivElement | null>(null);
    const signalRefs = useRef<(HTMLDivElement | null)[]>([]);
    const [positions, setPositions] = useState<{ catY: number; signalYs: number[] } | null>(null);

    const signalCount = Math.min(category.signals.length, 5);
    // Collapsed: 72px for spacing between nodes; Expanded: tighter spacing for right signal cards
    const reservedHeight = isExpanded ? signalCount * 80 + 72 : 72;

    const measure = () => {
      if (!rowRef.current) return;
      if (!catRef.current) return;

      const rowRect = rowRef.current.getBoundingClientRect();
      const catRect = catRef.current.getBoundingClientRect();
      const catY = catRect.top - rowRect.top + catRect.height / 2;

      const signalYs = signalRefs.current
        .slice(0, signalCount)
        .map((el) => {
          if (!el) return 0;
          const rect = el.getBoundingClientRect();
          return rect.top - rowRect.top + rect.height / 2;
        })
        .filter((y) => y > 0);

      setPositions({ catY, signalYs });
    };

    // Measure ASAP after layout changes
    useLayoutEffect(() => {
      if (!isExpanded) return;
      measure();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isExpanded, signalCount, expandedCategories]);

    useEffect(() => {
      if (!isExpanded) {
        setPositions(null);
        return;
      }

      const raf = requestAnimationFrame(measure);
      const onReflow = () => requestAnimationFrame(measure);
      window.addEventListener("resize", onReflow);
      window.addEventListener("scroll", onReflow, true);

      const observers: ResizeObserver[] = [];
      if (rowRef.current) {
        const ro = new ResizeObserver(onReflow);
        ro.observe(rowRef.current);
        observers.push(ro);
      }
      if (containerRef.current) {
        const ro = new ResizeObserver(onReflow);
        ro.observe(containerRef.current);
        observers.push(ro);
      }

      return () => {
        cancelAnimationFrame(raf);
        window.removeEventListener("resize", onReflow);
        window.removeEventListener("scroll", onReflow, true);
        observers.forEach((o) => o.disconnect());
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isExpanded, signalCount, expandedCategories]);

    return (
      <motion.div
        ref={rowRef}
        key={category.id}
        initial={false}
        animate={{ height: reservedHeight }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="relative"
      >
        <div className="h-full flex gap-0">
          {/* Left lane: fixed-size node centered inside reserved space */}
          <div className="w-[280px] flex-shrink-0 relative h-full">
            <div
              ref={catRef}
              onClick={() => toggleCategory(category.id)}
              className={cn(
                "absolute left-0 right-0 top-1/2 -translate-y-1/2 flex items-center gap-3 px-4 py-4 rounded-xl cursor-pointer transition-colors border-l-4",
                isExpanded
                  ? "bg-white dark:bg-card shadow-lg z-10"
                  : "bg-card hover:bg-slate-50 dark:hover:bg-slate-800/50 border-slate-200 dark:border-slate-700"
              )}
              style={{ borderLeftColor: isExpanded ? getCategoryColor(category) : undefined }}
            >
              <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0", category.iconBg)}>
                {category.icon}
              </div>
              <span className="flex-1 font-medium text-sm text-foreground">{category.name}</span>
              <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
                <ChevronDown className="w-5 h-5 text-muted-foreground" />
              </motion.div>
            </div>
          </div>

          {/* Ribbon gutter (center-to-center) */}
          <div className="w-[100px] flex-shrink-0 relative h-full pointer-events-none">
            <AnimatePresence>
              {isExpanded && positions && positions.signalYs.length > 0 && (
                <svg className="absolute inset-0 w-full h-full overflow-visible">
                  <defs>
                    <linearGradient id={`ribbon-gradient-${category.id}`} x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor={getCategoryColor(category)} stopOpacity="0.5" />
                      <stop offset="100%" stopColor={getCategoryColor(category)} stopOpacity="0.15" />
                    </linearGradient>
                  </defs>

                  {positions.signalYs.map((signalY, idx) => (
                    <motion.path
                      key={idx}
                      d={generateRibbonPath(positions.catY, signalY, 0, 100, 10, 3)}
                      fill={`url(#ribbon-gradient-${category.id})`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.25, delay: idx * 0.03 }}
                    />
                  ))}
                </svg>
              )}
            </AnimatePresence>
          </div>

          {/* Right lane: cards centered inside reserved space */}
          <div className="flex-1 h-full flex items-center">
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="w-full"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center", category.iconBg)}>
                      {category.icon}
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">{category.name}</h4>
                      <p className="text-xs text-muted-foreground">{category.description}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {category.signals.slice(0, 5).map((signal, sigIndex) => (
                      <motion.div
                        key={signal.name}
                        ref={(el) => {
                          signalRefs.current[sigIndex] = el;
                        }}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.25, delay: sigIndex * 0.04 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedSignal({ category: category.name, signal });
                        }}
                        className={cn(
                          "flex items-start gap-3 p-4 rounded-xl cursor-pointer transition-all group",
                          "bg-white dark:bg-card border border-border/40 hover:border-primary/40 hover:shadow-md"
                        )}
                        style={{ borderLeftWidth: "3px", borderLeftColor: getCategoryColor(category) }}
                      >
                        <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0", category.iconBg)}>
                          {category.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className={cn("font-medium text-sm", category.color)}>{signal.name}</span>
                            <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all flex-shrink-0" />
                          </div>
                          {signal.description && (
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{signal.description}</p>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    );
  };

  const hasExpandedCategories = expandedCategories.size > 0;

  return (
    <div className="pt-6 signal-explorer-container relative" ref={containerRef}>
      {/* Empty State - shown when no categories are expanded */}
      <AnimatePresence>
        {!hasExpandedCategories && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute right-0 top-1/2 -translate-y-1/2 w-[calc(100%-400px)] flex items-center justify-center pointer-events-none z-10"
          >
            <div className="text-center px-8 py-12 max-w-md">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-100 to-fuchsia-100 dark:from-violet-900/30 dark:to-fuchsia-900/30 flex items-center justify-center mx-auto mb-5 shadow-lg shadow-violet-200/50 dark:shadow-violet-900/20">
                <Sparkles className="w-8 h-8 text-violet-600 dark:text-violet-400" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">Explore Leadership Signals</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Click on any signal category to reveal detailed behavioral indicators and evidence patterns.
              </p>
              <div className="flex items-center justify-center gap-2 mt-5 text-xs text-muted-foreground/70">
                <ChevronDown className="w-4 h-4 animate-bounce" />
                <span>Select a category to begin</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
            <Building2 className="w-5 h-5 text-amber-600 dark:text-amber-400" />
          </div>
          <h3 className="text-lg font-bold text-foreground">Prosaria Leadership Principles</h3>
        </div>
        <div className="space-y-2">
          {statedSignals.map((category) => (
            <SignalExplorerRow key={category.id} category={category} />
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center">
            <Eye className="w-5 h-5 text-violet-600 dark:text-violet-400" />
          </div>
          <h3 className="text-lg font-bold text-foreground">Observed Signals</h3>
        </div>
        <div className="space-y-2">
          {observedSignals.map((category) => (
            <SignalExplorerRow key={category.id} category={category} />
          ))}
        </div>
      </div>

      {/* Signal Detail Drawer */}
      <Sheet open={!!selectedSignal} onOpenChange={() => setSelectedSignal(null)}>
        <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
          {selectedSignal && (
            <div className="space-y-6">
              <SheetHeader>
                <SheetTitle className="text-2xl font-bold text-foreground pr-8">
                  {selectedSignal.signal.name}
                </SheetTitle>
              </SheetHeader>

              {selectedSignal.signal.strength && (
                <div>
                  <span
                    className={cn(
                      "inline-flex px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider",
                      getStrengthColor(selectedSignal.signal.strength).bg,
                      getStrengthColor(selectedSignal.signal.strength).text
                    )}
                  >
                    {getStrengthColor(selectedSignal.signal.strength).label}
                  </span>
                </div>
              )}

              {selectedSignal.signal.description && (
                <p className="text-base text-muted-foreground leading-relaxed">
                  {selectedSignal.signal.description}
                </p>
              )}

              {selectedSignal.signal.evidence && selectedSignal.signal.evidence.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingUp className="w-4 h-4 text-primary" />
                    <h3 className="font-semibold text-foreground">Recent Evidence</h3>
                  </div>
                  <div className="space-y-2 pl-6 border-l-2 border-muted">
                    {selectedSignal.signal.evidence.map((item, idx) => (
                      <p key={idx} className="text-sm text-muted-foreground italic">
                        &quot;{item}&quot;
                      </p>
                    ))}
                  </div>
                </div>
              )}

              {selectedSignal.signal.actions && selectedSignal.signal.actions.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Target className="w-4 h-4 text-emerald-500" />
                    <h3 className="font-semibold text-foreground">Development Actions</h3>
                  </div>
                  <ul className="space-y-2">
                    {selectedSignal.signal.actions.map((action, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0" />
                        {action}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="pt-4 border-t border-border">
                <p className="text-xs text-muted-foreground">
                  Part of <span className="font-medium text-foreground">{selectedSignal.category}</span>
                </p>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};


const SignalsPage = ({ onCategoryClick }: SignalsPageProps) => {
  const [activeTab, setActiveTab] = useState<"signals" | "explorer">("signals");
  
  const handleCategoryClick = (categoryId: string) => {
    if (onCategoryClick) {
      onCategoryClick(categoryId);
    }
  };

  return (
    <div className="min-h-full bg-page-background">
      <div className="max-w-[1200px] mx-auto py-12 px-4">
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          {/* DNA strand graphic */}
          <GenomeStrand />
          <h1 className="text-4xl lg:text-5xl font-extrabold text-foreground leading-tight mb-4">
            Leadership Genome
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Leadership Genome is the unique set of signals observed from your senior leaders over time & used to identify Future Leaders
          </p>
        </motion.div>

        {/* Tabs - Above radar, matching pipeline page style */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex items-center p-1.5 bg-muted/60 rounded-full border border-border/50">
            <button
              onClick={() => setActiveTab("signals")}
              className={cn(
                "px-5 py-2 rounded-full text-sm font-medium transition-all",
                activeTab === "signals"
                  ? "bg-slate-900 dark:bg-slate-800 text-white"
                  : "text-foreground hover:bg-muted/50"
              )}
            >
              Leadership Signals
            </button>
            <button
              onClick={() => setActiveTab("explorer")}
              className={cn(
                "px-5 py-2 rounded-full text-sm font-medium transition-all",
                activeTab === "explorer"
                  ? "bg-slate-900 dark:bg-slate-800 text-white"
                  : "text-foreground hover:bg-muted/50"
              )}
            >
              Signal Explorer
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === "signals" ? (
            <motion.div
              key="signals"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Radar Section wrapped in panel with background image */}
              <div className="rounded-2xl mb-16 overflow-hidden relative bg-white dark:bg-card">
                {/* Background image with horizontal flip and 15% opacity */}
                <div 
                  className="absolute inset-0"
                  style={{
                    backgroundImage: 'url(https://res.cloudinary.com/dzsj78i8v/image/upload/v1765276434/Culture_Hub_Topics_32_1_viecjf.png)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    transform: 'scaleX(-1)',
                    opacity: 0.35,
                  }}
                />
                
                <div className="relative h-[500px] flex items-center z-10">
                  {/* DNA Helix positioned to the right */}
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-[3%]">
                    <LeadershipGenome />
                  </div>
                  
                  {/* AI Insights Carousel - centered vertically on the left */}
                  <InsightsCarousel />
                </div>
              </div>

              {/* Two Column Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column - Stated Signals */}
                <div>
                  <div className="mb-10 flex flex-col items-center text-center">
                    <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mb-3">
                      <Building2 className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                    </div>
                    <h2 className="text-xl font-bold text-foreground">Prosaria Leadership Principles</h2>
                    <p className="text-sm text-muted-foreground">
                      Core leadership principles that we track activity against
                    </p>
                  </div>
                  <div className="space-y-4">
                    {statedSignals.map((category, index) => (
                      <CategoryCard 
                        key={category.id} 
                        category={category} 
                        onClick={() => handleCategoryClick(category.id)}
                        index={index}
                        variant="stated"
                      />
                    ))}
                  </div>
                </div>
                
                {/* Right Column - Observed Signals */}
                <div>
                  <div className="mb-10 flex flex-col items-center text-center">
                    <div className="w-12 h-12 rounded-xl bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center mb-3">
                      <Eye className="w-6 h-6 text-violet-600 dark:text-violet-400" />
                    </div>
                    <h2 className="text-xl font-bold text-foreground">Observed Signals</h2>
                    <p className="text-sm text-muted-foreground">
                      Signals derived from our AI analysis of recognition activity
                    </p>
                  </div>
                  <div className="space-y-4">
                    {observedSignals.map((category, index) => (
                      <CategoryCard 
                        key={category.id} 
                        category={category} 
                        onClick={() => handleCategoryClick(category.id)}
                        index={index}
                        variant="observed"
                      />
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="explorer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Signal Explorer */}
              <SignalExplorer />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SignalsPage;
