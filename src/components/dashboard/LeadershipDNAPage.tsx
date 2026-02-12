import { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { CheckCircle, Sparkles, ChevronRight, ChevronDown, X, TrendingUp, Target, Layers, LayoutGrid } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import GenomeVisual, { signalCategories } from "./GenomeVisual";
import SignalExplorer from "./SignalExplorer";
import BehaviorDetailPage from "./BehaviorDetailPage";
import SignalCategoryPage from "./SignalCategoryPage";
import GenomeStrand from "./GenomeStrand";

interface Behavior {
  name: string;
  signal: "Strong" | "Medium" | "Low";
  trend: "up" | "down" | "stable";
  description: string;
  evidence?: string[];
  actions?: string[];
}

interface DNACategory {
  id: string;
  name: string;
  overallSignal: "Strong" | "Medium" | "Low";
  description: string;
  score: number;
  behaviors: Behavior[];
}

// Company Signals - Core competencies defined by HR (reduced to 5)
const statedValues: DNACategory[] = [
  {
    id: "business",
    name: "Knows Our Business",
    overallSignal: "Strong",
    score: 82,
    description: "Continuously builds business and financial acumen. Effectively operates within a global, matrixed company.",
    behaviors: [
      { name: "Industry Expertise", signal: "Strong", trend: "stable", description: "Demonstrates deep understanding of market dynamics and competitive forces.", evidence: ["Industry report contributions...", "Speaking engagement at conference..."], actions: ["Publish thought leadership content", "Attend industry conferences"] },
      { name: "Operational Knowledge", signal: "Strong", trend: "up", description: "Comprehensive grasp of internal processes and systems.", evidence: ["Process improvement savings of $2M...", "Cross-training program developed..."], actions: ["Lead process optimization initiative", "Create knowledge base documentation"] },
    ],
  },
  {
    id: "customer",
    name: "Keeps Customer Promises",
    overallSignal: "Strong",
    score: 78,
    description: "Deeply passionate about Prudential's purpose. Intimately understands our evolving customer / client base.",
    behaviors: [
      { name: "Customer Advocacy", signal: "Strong", trend: "up", description: "Deeply passionate about our purpose and understands unique financial challenges of clients.", evidence: ["Demonstrated clearly during Q3 planning...", "Recognized by 5 peers for this specific behavior..."], actions: ["Lead customer feedback sessions quarterly", "Mentor junior team members on customer focus"] },
      { name: "Trust Building", signal: "Medium", trend: "stable", description: "Delivers on commitments consistently to build long-term loyalty.", evidence: ["Consistently meets deadlines...", "Client retention rate above 95%..."], actions: ["Document and share best practices", "Participate in trust-building workshops"] },
    ],
  },
  {
    id: "talent",
    name: "Develops Talent",
    overallSignal: "Strong",
    score: 74,
    description: "Invests in growing people, building high-performing teams, and creating continuous learning.",
    behaviors: [
      { name: "Coaching & Mentoring", signal: "Strong", trend: "up", description: "Actively develops others through feedback and guidance.", evidence: ["4 direct reports promoted...", "Mentoring 3 high-potentials..."], actions: ["Formalize mentoring program", "Seek coaching certification"] },
      { name: "Team Building", signal: "Strong", trend: "stable", description: "Creates cohesive, high-performing teams.", evidence: ["Team engagement score 92%...", "Zero attrition in 18 months..."], actions: ["Facilitate team building offsite", "Implement team rituals"] },
    ],
  },
  {
    id: "integrity",
    name: "Acts with Integrity",
    overallSignal: "Strong",
    score: 76,
    description: "Demonstrates ethical leadership and builds trust through transparent decision-making.",
    behaviors: [
      { name: "Ethical Decision Making", signal: "Strong", trend: "stable", description: "Consistently makes decisions aligned with company values.", evidence: ["Led compliance initiative...", "Recognized for transparent communication..."], actions: ["Lead ethics training session", "Mentor on compliance best practices"] },
      { name: "Accountability", signal: "Strong", trend: "up", description: "Takes ownership of outcomes and admits mistakes openly.", evidence: ["Post-mortem leadership...", "Team trust scores improved..."], actions: ["Implement retrospectives", "Document lessons learned"] },
    ],
  },
  {
    id: "shareholder",
    name: "Delivers Shareholder Value",
    overallSignal: "Medium",
    score: 65,
    description: "Seeks a competitive edge through continuous innovation, agility and smart risk-taking for long-term value.",
    behaviors: [
      { name: "Smart Risk-Taking", signal: "Medium", trend: "up", description: "Balances innovation with calculated risk assessment.", evidence: ["Proposed 2 new initiatives with clear ROI...", "Risk assessment framework adopted..."], actions: ["Complete risk management certification", "Lead cross-functional risk review"] },
      { name: "Long-term Value", signal: "Strong", trend: "stable", description: "Prioritizes sustainable growth over short-term gains.", evidence: ["5-year strategy contribution...", "Sustainability initiatives launched..."], actions: ["Develop long-term roadmap", "Present at strategy offsite"] },
    ],
  },
];

// Explorer categories with more variety
const explorerCategories: DNACategory[] = [
  {
    id: "strategic",
    name: "Strategic Leadership & Transformation",
    overallSignal: "Strong",
    score: 85,
    description: "Drives organizational change and strategic initiatives.",
    behaviors: [
      { name: "Organizational Transformation", signal: "Strong", trend: "up", description: "Leads large-scale change initiatives successfully.", evidence: ["Led digital transformation program...", "Change adoption rate of 89%..."], actions: ["Lead transformation workstream", "Seek change management certification"] },
      { name: "Strategic Business Transition", signal: "Strong", trend: "up", description: "Leads the shift from legacy models to digital-first approaches.", evidence: ["Demonstrated clearly during Q3 planning...", "Recognized by 3 peers for this specific behavior..."], actions: ["Lead a cross-functional retro to practice this skill", "Seek feedback from skip-level manager regarding strategic impact"] },
      { name: "Strategic Planning Cadence", signal: "Medium", trend: "stable", description: "Establishes and maintains strategic planning rhythms.", evidence: ["Quarterly planning process established...", "OKR framework implemented..."], actions: ["Facilitate strategic planning sessions", "Improve planning documentation"] },
      { name: "Business Model Innovation", signal: "Low", trend: "up", description: "Explores new business models and revenue streams.", evidence: ["Pilot program proposed...", "Innovation lab participation..."], actions: ["Complete innovation training", "Lead business model canvas workshop"] },
    ],
  },
  {
    id: "customer-success",
    name: "Customer Success & Relationship Management",
    overallSignal: "Medium",
    score: 72,
    description: "Builds and maintains strong customer relationships.",
    behaviors: [
      { name: "CX Operations Excellence", signal: "Strong", trend: "up", description: "Delivers exceptional customer experience operations.", evidence: ["NPS improved by 15 points...", "Response time reduced by 40%..."], actions: ["Implement CX improvements", "Lead customer journey mapping"] },
      { name: "Market Validation", signal: "Medium", trend: "stable", description: "Validates market opportunities and customer needs.", evidence: ["Customer research conducted...", "Market validation framework..."], actions: ["Lead customer discovery sessions", "Create validation playbook"] },
      { name: "Sales-CS Alignment", signal: "Low", trend: "up", description: "Ensures sales and customer success work together.", evidence: ["Joint planning sessions started...", "Handoff process improved..."], actions: ["Establish regular sync meetings", "Create shared success metrics"] },
    ],
  },
  {
    id: "people-dev",
    name: "People Development & HR Excellence",
    overallSignal: "Strong",
    score: 88,
    description: "Develops talent and fosters organizational growth.",
    behaviors: [
      { name: "Talent Pipeline Development", signal: "Strong", trend: "up", description: "Builds and maintains strong talent pipelines.", evidence: ["4 high-potentials identified...", "Development program launched..."], actions: ["Formalize talent review process", "Create development curriculum"] },
      { name: "Inclusive Leadership Practices", signal: "Medium", trend: "up", description: "Fosters a diverse and psychologically safe team environment that encourages innovation and risk-taking.", evidence: ["Demonstrated clearly during Q3 planning...", "Recognized by 3 peers for this specific behavior..."], actions: ["Lead a cross-functional retro to practice this skill", "Seek feedback from skip-level manager regarding strategic impact"] },
    ],
  },
  {
    id: "innovation",
    name: "Innovation & Product Leadership",
    overallSignal: "Medium",
    score: 68,
    description: "Drives innovation and product excellence.",
    behaviors: [
      { name: "Product Vision", signal: "Strong", trend: "up", description: "Creates compelling product visions.", evidence: ["Product roadmap developed...", "Vision presentation at all-hands..."], actions: ["Refine product vision statement", "Conduct vision workshops"] },
      { name: "Rapid Prototyping", signal: "Medium", trend: "stable", description: "Quickly tests and validates ideas.", evidence: ["3 prototypes shipped...", "User testing conducted..."], actions: ["Learn new prototyping tools", "Establish rapid testing process"] },
    ],
  },
  {
    id: "operations",
    name: "Operations & Process Excellence",
    overallSignal: "Medium",
    score: 70,
    description: "Optimizes processes and operational efficiency.",
    behaviors: [
      { name: "Process Optimization", signal: "Strong", trend: "up", description: "Continuously improves operational processes.", evidence: ["20% efficiency gain...", "New workflows implemented..."], actions: ["Lead process audit", "Implement automation"] },
      { name: "Quality Management", signal: "Medium", trend: "stable", description: "Ensures high quality standards.", evidence: ["Quality metrics improved...", "Audit compliance achieved..."], actions: ["Establish quality framework", "Lead quality reviews"] },
    ],
  },
  {
    id: "collaboration",
    name: "Cross-Functional Collaboration",
    overallSignal: "Strong",
    score: 82,
    description: "Works effectively across organizational boundaries.",
    behaviors: [
      { name: "Stakeholder Management", signal: "Strong", trend: "up", description: "Effectively manages diverse stakeholders.", evidence: ["Stakeholder satisfaction high...", "Cross-team projects successful..."], actions: ["Develop stakeholder map", "Improve communication cadence"] },
      { name: "Knowledge Sharing", signal: "Medium", trend: "up", description: "Shares knowledge across teams.", evidence: ["Documentation created...", "Training sessions delivered..."], actions: ["Create knowledge base", "Lead lunch & learns"] },
    ],
  },
];

// Observed Signals - matching genome graph labels (reduced to 5)
const observedBehaviors = [
  {
    id: "executive",
    name: "Executive Access",
    signal: "Strong" as const,
    description: "Direct engagement with senior leadership and strategic decision-makers.",
  },
  {
    id: "strategic",
    name: "Strategic Impact",
    signal: "Strong" as const,
    description: "Driving initiatives that shape long-term organizational direction.",
  },
  {
    id: "voice",
    name: "Voice & Influence",
    signal: "Medium" as const,
    description: "Shaping decisions and outcomes through persuasion and thought leadership.",
  },
  {
    id: "transformation",
    name: "Transformation",
    signal: "Medium" as const,
    description: "Leading change initiatives and organizational evolution.",
  },
  {
    id: "people",
    name: "People Leadership",
    signal: "Strong" as const,
    description: "Building and developing high-performing teams and talent pipelines.",
  },
];

const signalColors = {
  Strong: { bg: "bg-primary", text: "text-primary", badge: "bg-primary text-primary-foreground" },
  Medium: { bg: "bg-warning", text: "text-warning", badge: "bg-warning/20 text-warning border-warning/30" },
  Low: { bg: "bg-muted-foreground", text: "text-muted-foreground", badge: "bg-muted text-muted-foreground" },
};

const getScoreColor = (score: number) => {
  if (score >= 80) return "text-primary";
  if (score >= 60) return "text-primary";
  return "text-muted-foreground";
};

// Split View Component
const SplitView = ({ onCategoryClick }: { onCategoryClick: (category: DNACategory) => void }) => (
  <div className="grid grid-cols-2 gap-8">
    {/* Left Column - Stated Values */}
    <div>
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border">
        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
          <CheckCircle className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-foreground">Company Signals</h2>
          <p className="text-sm text-muted-foreground">Core competencies defined by HR</p>
        </div>
      </div>

      <div className="space-y-3">
        {statedValues.map((value) => (
          <div
            key={value.id}
            onClick={() => onCategoryClick(value)}
            className="bg-white dark:bg-card rounded-2xl p-5 shadow-sm hover:shadow-md transition-all cursor-pointer group border border-border/50 h-[140px] flex flex-col justify-between"
          >
            <div>
              <h3 className="font-semibold text-base text-foreground group-hover:text-primary transition-colors leading-tight mb-2">
                {value.name}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                {value.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Right Column - Observed Behaviors */}
    <div>
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border">
        <div className="h-10 w-10 rounded-full bg-warning/20 flex items-center justify-center">
          <Sparkles className="h-5 w-5 text-warning" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-foreground">Observed Signals</h2>
          <p className="text-sm text-muted-foreground">Emerging patterns detected by AI</p>
        </div>
      </div>

      <div className="space-y-3">
        {observedBehaviors.map((behavior) => (
          <div
            key={behavior.id}
            className="bg-gradient-to-br from-success/5 to-success/10 rounded-2xl p-5 border border-success/20 hover:shadow-md transition-all cursor-pointer group h-[140px] flex flex-col justify-between"
          >
            <div>
              <h3 className="font-semibold text-base text-foreground group-hover:text-success transition-colors leading-tight mb-2">
                {behavior.name}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                {behavior.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Explorer View Component
const ExplorerView = () => {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [selectedBehavior, setSelectedBehavior] = useState<{ behavior: Behavior; categoryId: string } | null>(null);
  const [lines, setLines] = useState<{ id: string; path: string }[]>([]);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const categoryRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const behaviorRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
        if (selectedBehavior?.categoryId === categoryId) {
          setSelectedBehavior(null);
        }
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  // Calculate line paths
  const updateLines = useCallback(() => {
    if (!containerRef.current) return;
    
    const containerRect = containerRef.current.getBoundingClientRect();
    const newLines: { id: string; path: string }[] = [];

    expandedCategories.forEach(categoryId => {
      const category = explorerCategories.find(c => c.id === categoryId);
      const categoryEl = categoryRefs.current.get(categoryId);
      
      if (!category || !categoryEl) return;

      const categoryRect = categoryEl.getBoundingClientRect();
      const startX = categoryRect.right - containerRect.left + 8;
      const startY = categoryRect.top + categoryRect.height / 2 - containerRect.top;

      category.behaviors.forEach((_, idx) => {
        const behaviorEl = behaviorRefs.current.get(`${categoryId}-${idx}`);
        if (!behaviorEl) return;

        const behaviorRect = behaviorEl.getBoundingClientRect();
        const endX = behaviorRect.left - containerRect.left - 8;
        const endY = behaviorRect.top + behaviorRect.height / 2 - containerRect.top;

        // Create smooth bezier curve
        const midX = startX + (endX - startX) * 0.5;

        newLines.push({
          id: `${categoryId}-${idx}`,
          path: `M ${startX} ${startY} C ${midX} ${startY}, ${midX} ${endY}, ${endX} ${endY}`
        });
      });
    });

    setLines(newLines);
  }, [expandedCategories]);

  useEffect(() => {
    const timer = setTimeout(updateLines, 150);
    const resizeTimer = setTimeout(updateLines, 400);
    window.addEventListener('resize', updateLines);
    return () => {
      clearTimeout(timer);
      clearTimeout(resizeTimer);
      window.removeEventListener('resize', updateLines);
    };
  }, [updateLines]);

  const hasExpandedCategories = expandedCategories.size > 0;

  return (
    <div className="relative" ref={containerRef}>
      {/* Grid background pattern */}
      <div className="absolute inset-0 opacity-30" style={{
        backgroundImage: `radial-gradient(circle, hsl(var(--border)) 1px, transparent 1px)`,
        backgroundSize: '24px 24px'
      }} />

      {/* SVG for connection lines */}
      <svg 
        className="absolute inset-0 w-full h-full pointer-events-none z-10" 
        style={{ overflow: 'visible' }}
      >
        {lines.map((line, idx) => (
          <path
            key={line.id}
            d={line.path}
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth="2"
            strokeOpacity="0.35"
            strokeLinecap="round"
            style={{
              transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
              transitionDelay: `${idx * 30}ms`,
            }}
          />
        ))}
      </svg>

      <div className="relative flex gap-8">
        {/* Main Explorer Content */}
        <div className="flex-1">
          {/* Category rows with inline behaviors */}
          <div className="space-y-4">
            {explorerCategories.map((category) => {
              const isExpanded = expandedCategories.has(category.id);
              const behaviorCount = category.behaviors.length;
              // Calculate height based on behaviors (each behavior ~72px + gaps)
              const expandedHeight = behaviorCount * 72 + (behaviorCount - 1) * 12;
              
              return (
                <div 
                  key={category.id} 
                  className="flex items-start gap-16"
                  style={{
                    minHeight: isExpanded ? `${Math.max(expandedHeight, 56)}px` : 'auto',
                    transition: 'min-height 400ms cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                >
                  {/* Left - Category Node */}
                  <div 
                    className="w-[340px] flex-shrink-0"
                    style={{
                      paddingTop: isExpanded ? `${(expandedHeight - 56) / 2}px` : '0px',
                      transition: 'padding-top 400ms cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
                  >
                    <div
                      ref={el => { if (el) categoryRefs.current.set(category.id, el); }}
                      onClick={() => toggleCategory(category.id)}
                      className="w-full flex items-center justify-between px-5 py-4 rounded-xl bg-white dark:bg-card cursor-pointer border-l-4 border-l-[#1E4195] hover:bg-slate-50 dark:hover:bg-card/80 shadow-sm"
                      style={{
                        boxShadow: isExpanded ? '0 4px 12px -4px hsl(var(--foreground) / 0.1)' : '0 1px 3px rgba(0,0,0,0.08)',
                        transition: 'box-shadow 300ms ease, background-color 200ms ease',
                      }}
                    >
                      <span className="font-semibold text-sm text-foreground">
                        {category.name}
                      </span>
                      <ChevronRight 
                        className="h-4 w-4 text-muted-foreground"
                        style={{
                          transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
                          transition: 'transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
                        }}
                      />
                    </div>
                  </div>

                  {/* Right - Behaviors */}
                  <div className="flex-1 min-w-0 flex items-center">
                    {isExpanded && (
                      <div className="flex flex-col gap-3 w-full">
                        {category.behaviors.map((behavior, idx) => {
                          const isSelected =
                            selectedBehavior?.behavior.name === behavior.name &&
                            selectedBehavior?.categoryId === category.id;
                          
                          // Low signal - white card
                          if (behavior.signal === "Low") {
                            return (
                              <button
                                key={`${category.id}-${idx}`}
                                ref={(el) => {
                                  if (el) behaviorRefs.current.set(`${category.id}-${idx}`, el);
                                }}
                                onClick={() => setSelectedBehavior({ behavior, categoryId: category.id })}
                                className={cn(
                                  "flex items-center justify-between w-full max-w-[600px] px-6 py-5 text-left rounded-2xl border",
                                  isSelected
                                    ? "bg-slate-100 border-slate-300 shadow-md"
                                    : "bg-white border-slate-200 hover:bg-slate-50 hover:shadow-sm"
                                )}
                                style={{
                                  opacity: 1,
                                  transform: "translate3d(0, 0, 0)",
                                  transition: `opacity 360ms ease, background-color 160ms ease`,
                                  transitionDelay: `${idx * 60}ms`,
                                }}
                              >
                                <span className="font-semibold text-sm text-foreground">
                                  {behavior.name}
                                </span>
                                <span className="ml-3 text-xs font-semibold shrink-0 px-3 py-1 rounded-full bg-slate-200 text-slate-600">
                                  {behavior.signal}
                                </span>
                              </button>
                            );
                          }
                          
                          // Medium signal - light blue card
                          if (behavior.signal === "Medium") {
                            return (
                              <button
                                key={`${category.id}-${idx}`}
                                ref={(el) => {
                                  if (el) behaviorRefs.current.set(`${category.id}-${idx}`, el);
                                }}
                                onClick={() => setSelectedBehavior({ behavior, categoryId: category.id })}
                                className={cn(
                                  "flex items-center justify-between w-full max-w-[600px] px-6 py-5 rounded-2xl text-left",
                                  isSelected ? "shadow-lg" : "hover:shadow-md"
                                )}
                                style={{
                                  backgroundColor: isSelected ? '#b8c9e8' : '#d4e0f4',
                                  opacity: 1,
                                  transform: "translate3d(0, 0, 0)",
                                  willChange: "transform, opacity",
                                  transition: `opacity 360ms ease, transform 520ms cubic-bezier(0.16, 1, 0.3, 1), background-color 160ms ease, box-shadow 160ms ease`,
                                  transitionDelay: `${idx * 60}ms`,
                                }}
                                onMouseEnter={(e) => { if (!isSelected) e.currentTarget.style.backgroundColor = '#c5d5ed'; }}
                                onMouseLeave={(e) => { if (!isSelected) e.currentTarget.style.backgroundColor = '#d4e0f4'; }}
                              >
                                <span className="font-semibold text-sm text-[#1E4195]">
                                  {behavior.name}
                                </span>
                                <span className="ml-3 text-xs font-semibold shrink-0 px-3 py-1 rounded-full bg-[#1E4195]/20 text-[#1E4195]">
                                  {behavior.signal}
                                </span>
                              </button>
                            );
                          }
                          
                          // Strong signal - dark blue card (#1E4195)
                          return (
                            <button
                              key={`${category.id}-${idx}`}
                              ref={(el) => {
                                if (el) behaviorRefs.current.set(`${category.id}-${idx}`, el);
                              }}
                              onClick={() => setSelectedBehavior({ behavior, categoryId: category.id })}
                              className={cn(
                                "flex items-center justify-between w-full max-w-[600px] px-6 py-5 rounded-2xl text-left text-white",
                                isSelected ? "shadow-lg" : "hover:shadow-md"
                              )}
                              style={{
                                backgroundColor: isSelected ? '#152d6b' : '#1E4195',
                                opacity: 1,
                                transform: "translate3d(0, 0, 0)",
                                willChange: "transform, opacity",
                                transition: `opacity 360ms ease, transform 520ms cubic-bezier(0.16, 1, 0.3, 1), background-color 160ms ease, box-shadow 160ms ease`,
                                transitionDelay: `${idx * 60}ms`,
                              }}
                              onMouseEnter={(e) => { if (!isSelected) e.currentTarget.style.backgroundColor = '#172f70'; }}
                              onMouseLeave={(e) => { if (!isSelected) e.currentTarget.style.backgroundColor = '#1E4195'; }}
                            >
                              <span className="font-semibold text-sm">
                                {behavior.name}
                              </span>
                              <span className="ml-3 text-xs font-semibold shrink-0 px-3 py-1 rounded-full bg-white/20">
                                {behavior.signal}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Empty State - shown when no categories expanded */}
          {!hasExpandedCategories && (
            <div className="absolute right-0 top-0 left-[400px] flex items-center justify-center min-h-[400px]">
              <div className="text-center max-w-md">
                <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                  <Layers className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">
                  Explore Behavior Categories
                </h3>
                <p className="text-muted-foreground mb-6">
                  Click on any category to expand and discover the specific behaviors that define leadership DNA in your organization.
                </p>
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <ChevronRight className="h-4 w-4" />
                  <span>Select a category to begin</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right - Detail Panel */}
        <div className={cn(
          "w-[360px] flex-shrink-0 ml-8 transition-all duration-500 ease-out sticky top-4 self-start",
          selectedBehavior ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8 pointer-events-none"
        )}>
          {selectedBehavior ? (
            <div className="bg-white dark:bg-card rounded-2xl border-t-4 border-t-primary border border-border shadow-xl overflow-hidden">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-xl font-bold text-foreground pr-4">
                    {selectedBehavior.behavior.name}
                  </h3>
                  <button 
                    onClick={() => setSelectedBehavior(null)}
                    className="p-1.5 hover:bg-muted rounded-lg transition-colors"
                  >
                    <X className="h-5 w-5 text-muted-foreground" />
                  </button>
                </div>

                <Badge className={cn(
                  "mb-4",
                  selectedBehavior.behavior.signal === "Strong"
                    ? "bg-primary text-primary-foreground"
                    : selectedBehavior.behavior.signal === "Medium"
                    ? "bg-warning/20 text-warning border-warning/30"
                    : "bg-muted text-muted-foreground"
                )}>
                  {selectedBehavior.behavior.signal.toUpperCase()} SIGNAL
                </Badge>

                <p className="text-muted-foreground mb-6 leading-relaxed">
                  {selectedBehavior.behavior.description}
                </p>

                {selectedBehavior.behavior.evidence && selectedBehavior.behavior.evidence.length > 0 && (
                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-3">
                      <TrendingUp className="h-4 w-4 text-primary" />
                      <h4 className="font-semibold text-foreground">Recent Evidence</h4>
                    </div>
                    <div className="bg-muted/30 rounded-xl p-4 space-y-3">
                      {selectedBehavior.behavior.evidence.map((item, idx) => (
                        <p key={idx} className="text-sm text-muted-foreground italic">
                          "{item}"
                        </p>
                      ))}
                    </div>
                  </div>
                )}

                {selectedBehavior.behavior.actions && selectedBehavior.behavior.actions.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Target className="h-4 w-4 text-success" />
                      <h4 className="font-semibold text-foreground">Development Actions</h4>
                    </div>
                    <ul className="space-y-2">
                      {selectedBehavior.behavior.actions.map((action, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <div className="h-1.5 w-1.5 rounded-full bg-success mt-2 flex-shrink-0" />
                          {action}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Empty state hint */
            <div className="text-center border-2 border-dashed border-border rounded-2xl p-8">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Target className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">
                Explore Leadership DNA
              </h3>
              <p className="text-sm text-muted-foreground">
                Select a category on the left to expand, then click a behavior to see details.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Map genome signal IDs to signal category page IDs
const genomeToSignalMap: Record<string, string> = {
  executive: "executive-access",
  strategic: "strategic-positioning",
  voice: "voice-influence",
  transformation: "transformation-impact",
  people: "people-leadership",
  "anti-patterns": "anti-patterns",
};

const LeadershipDNAPage = () => {
  const [selectedCategory, setSelectedCategory] = useState<DNACategory | null>(null);
  const [activeView, setActiveView] = useState<"split" | "explorer">("split");
  const [selectedSignal, setSelectedSignal] = useState<string | null>(null);

  const handleBehaviorClick = (category: DNACategory) => {
    setSelectedCategory(category);
  };

  const handleSignalClick = (signalId: string) => {
    const mappedId = genomeToSignalMap[signalId] || signalId;
    setSelectedSignal(mappedId);
  };

  if (selectedSignal) {
    return (
      <div className="h-full">
        <SignalCategoryPage
          categoryId={selectedSignal}
          onBack={() => setSelectedSignal(null)}
        />
      </div>
    );
  }

  if (selectedCategory) {
    return (
      <BehaviorDetailPage
        behavior={selectedCategory.behaviors[0]}
        categoryName={selectedCategory.name}
        categoryDescription={selectedCategory.description}
        allBehaviors={selectedCategory.behaviors}
        onBack={() => setSelectedCategory(null)}
      />
    );
  }

  return (
    <div className="h-full overflow-y-auto min-h-full bg-page-background">
      {/* Hero Section - White Background with Tabs */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="pt-12 pb-8 px-8 bg-card border-b border-border"
      >
        <div className="max-w-[1100px] mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {/* DNA strand graphic */}
            <GenomeStrand />
            <h1 className="text-4xl lg:text-5xl font-extrabold text-foreground mb-4">
              Leadership Genome
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Leadership Genome is the unique set of signals observed from your senior leaders over time & used to identify Future Leaders
            </p>
          </motion.div>

          {/* View Toggle - Inside Hero */}
          <div className="flex justify-center">
            <div className="bg-muted/50 rounded-xl border border-border p-1.5 flex gap-1">
              <button
                onClick={() => setActiveView("split")}
                className={cn(
                  "flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all",
                  activeView === "split"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
              >
                <LayoutGrid className="h-4 w-4" />
                Signals
              </button>
              <button
                onClick={() => setActiveView("explorer")}
                className={cn(
                  "flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all",
                  activeView === "explorer"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
              >
                <Layers className="h-4 w-4" />
                Explorer
              </button>
            </div>
          </div>
        </div>
      </motion.section>

      <div className="max-w-[1200px] mx-auto py-10 px-4">
        {/* Explanation Panel */}
        {activeView === "split" && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="relative rounded-2xl border border-border/30 p-6 mb-8 overflow-hidden"
            style={{
              background: "linear-gradient(135deg, rgba(249, 115, 22, 0.06), rgba(168, 85, 247, 0.04) 50%, rgba(168, 85, 247, 0.06))",
            }}
          >
            {/* Subtle decorative glow */}
            <div className="absolute top-0 right-0 w-40 h-40 rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(168, 85, 247, 0.1), transparent 70%)" }} />
            <div className="flex items-start gap-4 relative z-10">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-sm font-bold text-foreground">AI Insight</h3>
                  <span className="text-[10px] font-medium uppercase tracking-wider text-primary/70 bg-primary/10 rounded-full px-2 py-0.5">iQ Analysis</span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  These leadership signals are derived from the recognition patterns happening across your organisation. Workhuman iQ analyses peer-to-peer recognition data to surface emerging leadership behaviors that traditional assessments miss.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Content based on active view */}
        {activeView === "split" ? (
          <GenomeVisual onSignalClick={handleSignalClick} />
        ) : (
          <div className="pb-16">
            <SignalExplorer />
          </div>
        )}
      </div>
    </div>
  );
};

export default LeadershipDNAPage;
