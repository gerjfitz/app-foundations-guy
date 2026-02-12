import { useState, useEffect } from "react";
import { ArrowLeft, ArrowRight, Users, TrendingUp, Rocket, AlertTriangle, Target, Sparkles, Lightbulb, Zap, Award, ChevronDown, Brain, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import AIAssistantDrawer from "./AIAssistantDrawer";

interface ActivePipelinePageV10Props {
  onBack: () => void;
  onTierClick?: (tier: "monitor" | "nurture" | "accelerate") => void;
}

// Accelerate people data for hover cards
const acceleratePeople = [
  { name: "Victoria Reynolds", role: "Senior Director, R&D", image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop&crop=face", timeInPipeline: "8 months", insight: "Exceptional strategic vision—delivering 40% efficiency gains." },
  { name: "Michael Chang", role: "VP Engineering", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face", timeInPipeline: "6 months", insight: "Strong cross-functional leadership with 12 team recognitions." },
  { name: "Elizabeth Hart", role: "Director, Product", image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&h=100&fit=crop&crop=face", timeInPipeline: "1.2 years", insight: "Driving innovation with 3 successful product launches." },
  { name: "Daniel Kim", role: "Head of Strategy", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face", timeInPipeline: "10 months", insight: "Demonstrated executive presence in board presentations." },
  { name: "Sarah Chen", role: "Senior Director, Finance", image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop&crop=face", timeInPipeline: "5 months", insight: "Financial acumen driving strategic decisions." },
  { name: "James Wilson", role: "Director, Operations", image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop&crop=face", timeInPipeline: "1.5 years", insight: "Operational excellence with 25% cost reduction." },
  { name: "Amanda Foster", role: "Head of Marketing", image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=100&h=100&fit=crop&crop=face", timeInPipeline: "9 months", insight: "Brand leadership with 40% engagement increase." },
  { name: "Robert Taylor", role: "Senior Director, Sales", image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop&crop=face", timeInPipeline: "7 months", insight: "Revenue growth champion—exceeded targets by 35%." },
  { name: "Michelle Lee", role: "Director, HR", image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face", timeInPipeline: "1.1 years", insight: "Culture transformation leader with high retention." },
  { name: "David Park", role: "Head of Innovation", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face", timeInPipeline: "4 months", insight: "Spearheading 5 key innovation initiatives." },
  { name: "Jennifer Adams", role: "Senior Director, Legal", image: "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=100&h=100&fit=crop&crop=face", timeInPipeline: "1.3 years", insight: "Risk management expertise protecting company interests." },
  { name: "Christopher Brown", role: "Director, IT", image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=face", timeInPipeline: "6 months", insight: "Digital transformation leader modernizing infrastructure." },
  { name: "Emily Rodriguez", role: "Head of Customer Success", image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face", timeInPipeline: "8 months", insight: "Customer advocacy driving 95% retention rate." },
  { name: "Marcus Thompson", role: "Senior Director, Data", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face", timeInPipeline: "2 years", insight: "Data-driven decision making across all departments." },
  { name: "Sofia Martinez", role: "Director, Partnerships", image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face", timeInPipeline: "5 months", insight: "Strategic alliances generating new revenue streams." },
  { name: "Andrew Johnson", role: "Head of Quality", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face", timeInPipeline: "11 months", insight: "Quality standards leader with zero defect record." },
  { name: "Rachel Green", role: "Senior Director, Design", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face", timeInPipeline: "7 months", insight: "Design thinking champion transforming UX." },
  { name: "Kevin Liu", role: "Director, Security", image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop&crop=face", timeInPipeline: "1.4 years", insight: "Cybersecurity excellence protecting company assets." },
  { name: "Laura White", role: "Head of Training", image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop&crop=face", timeInPipeline: "9 months", insight: "Learning & development driving skill growth." },
  { name: "Thomas Garcia", role: "Senior Director, Supply Chain", image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop&crop=face", timeInPipeline: "6 months", insight: "Supply chain optimization reducing costs 20%." },
  { name: "Nicole Brown", role: "Director, Communications", image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=100&h=100&fit=crop&crop=face", timeInPipeline: "1 year", insight: "Internal communications excellence building culture." },
  { name: "Brian Miller", role: "Head of Analytics", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face", timeInPipeline: "8 months", insight: "Analytics insights driving business strategy." },
  { name: "Catherine Davis", role: "Senior Director, Compliance", image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face", timeInPipeline: "1.6 years", insight: "Regulatory compliance ensuring business continuity." },
  { name: "Steven Clark", role: "Director, Engineering", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face", timeInPipeline: "4 months", insight: "Engineering leadership scaling technical teams." },
  { name: "Monica Hall", role: "Head of Research", image: "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=100&h=100&fit=crop&crop=face", timeInPipeline: "10 months", insight: "Research innovation driving competitive advantage." },
  { name: "Jason Wright", role: "Senior Director, Procurement", image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=face", timeInPipeline: "7 months", insight: "Strategic sourcing generating significant savings." },
  { name: "Angela Turner", role: "Director, Sustainability", image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face", timeInPipeline: "5 months", insight: "ESG leadership enhancing company reputation." },
  { name: "Patrick Moore", role: "Head of PMO", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face", timeInPipeline: "1.2 years", insight: "Project delivery excellence across organization." },
  { name: "Diana Ross", role: "Senior Director, CX", image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face", timeInPipeline: "9 months", insight: "Customer experience transformation leader." },
  { name: "Gregory Evans", role: "Director, Architecture", image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop&crop=face", timeInPipeline: "6 months", insight: "Enterprise architecture modernization champion." },
];

const projectedAvatars = [
  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&h=100&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
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
    arcColor: "hsl(var(--success))",
    topPeople: [
      { name: "Victoria Reynolds", image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop&crop=face" },
      { name: "Michael Chang", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face" },
      { name: "Elizabeth Hart", image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&h=100&fit=crop&crop=face" },
      { name: "Daniel Kim", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face" },
    ],
    aiInsight: "Your Accelerate tier shows exceptional readiness. 30 leaders are prepared for executive roles with 70% VP+ prediction confidence. Prioritize executive sponsorship and stretch assignments to fast-track their development.",
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
    arcColor: "hsl(var(--warning))",
    topPeople: [
      { name: "Amanda Foster", image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=100&h=100&fit=crop&crop=face" },
      { name: "James Wilson", image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop&crop=face" },
      { name: "Michelle Lee", image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop&crop=face" },
      { name: "Christopher Brown", image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop&crop=face" },
    ],
    aiInsight: "The Nurture tier contains 700 emerging leaders with medium signal strength. Focus on formal leadership development programs and cross-functional exposure to help them reach Accelerate status within 12-18 months.",
  },
  {
    id: "monitor" as const,
    title: "Monitor",
    count: 1500,
    percent: "4.8%",
    description: "Employees showing early leadership signals. Encourage through recognition, mentorship, and visibility opportunities.",
    icon: Users,
    pillColor: "bg-violet-600 text-white",
    countBg: "bg-violet-50",
    iconColor: "text-violet-600",
    borderColor: "border-violet-200",
    arcColor: "hsl(262, 83%, 58%)",
    topPeople: [
      { name: "Emily Chen", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face" },
      { name: "Marcus Johnson", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face" },
      { name: "Sarah Williams", image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face" },
      { name: "David Park", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face" },
    ],
    aiInsight: "Your Monitor tier has identified 1,500 employees showing early leadership signals. Encourage their development through recognition, mentorship, and visibility opportunities to nurture future pipeline growth.",
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

// Generate dots for each tier - time in pipeline determines distance from center
// More dots near center (shorter tenure), fewer toward edge (longer tenure)
const generateTierDots = (
  tier: "monitor" | "nurture" | "accelerate", 
  centerX: number, 
  centerY: number, 
  maxRadius: number, 
  minRadius: number,
  legendAvoidanceAngle: number = 0
) => {
  const dots: { x: number; y: number; size: number; opacity: number; isGroup?: boolean; count?: number; personIndex?: number }[] = [];
  
  // Use exponential distribution to cluster more dots near center
  const getWeightedRadius = () => {
    // This creates a distribution where ~50% of dots are in inner 30%, ~30% in middle, ~20% in outer
    const random = Math.random();
    const weighted = Math.pow(random, 0.6); // Lower power = more concentration at center
    return minRadius + weighted * (maxRadius - minRadius);
  };

  // Generate angle that avoids the right side legend area
  const getAngle = (index: number, total: number) => {
    const baseAngle = (index / total) * Math.PI * 2;
    // Avoid the right side (around 0 radians) where legends are
    const avoidStart = -legendAvoidanceAngle;
    const avoidEnd = legendAvoidanceAngle;
    
    // If angle falls in avoid zone, redistribute
    let angle = baseAngle + Math.random() * 0.4 - 0.2;
    if (angle > Math.PI * 2 - legendAvoidanceAngle || angle < legendAvoidanceAngle) {
      // Shift to safe zone
      angle = legendAvoidanceAngle + Math.random() * (Math.PI * 2 - legendAvoidanceAngle * 2);
    }
    return angle;
  };
  
  if (tier === "accelerate") {
    // 30 individual dots for accelerate - clustered more toward center
    for (let i = 0; i < 30; i++) {
      const angle = getAngle(i, 30);
      const radius = getWeightedRadius();
      dots.push({
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius,
        size: 12 + Math.random() * 6,
        opacity: 0.85 + Math.random() * 0.15,
        personIndex: i, // Add person index for hover cards
      });
    }
  } else if (tier === "nurture") {
    // Simulated groups for 700 - show ~25 groups with weighted distribution
    const groupSizes = [45, 38, 42, 35, 50, 32, 28, 40, 55, 30, 48, 36, 44, 33, 52, 29, 47, 41, 37, 31, 43, 39, 46, 34, 25];
    for (let i = 0; i < groupSizes.length; i++) {
      const angle = getAngle(i, groupSizes.length);
      const radius = getWeightedRadius();
      const size = 14 + (groupSizes[i] / 7);
      dots.push({
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius,
        size,
        opacity: 0.75 + Math.random() * 0.2,
        isGroup: true,
        count: groupSizes[i],
      });
    }
  } else {
    // Simulated groups for 1500 - show ~35 groups with weighted distribution
    const groupSizes = [65, 55, 70, 48, 82, 45, 72, 58, 90, 42, 68, 75, 52, 85, 40, 78, 62, 95, 38, 73, 56, 88, 44, 67, 80, 50, 76, 60, 92, 35, 71, 54, 86, 47, 64];
    for (let i = 0; i < groupSizes.length; i++) {
      const angle = getAngle(i, groupSizes.length);
      const radius = getWeightedRadius();
      const size = 16 + (groupSizes[i] / 5);
      dots.push({
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius,
        size,
        opacity: 0.65 + Math.random() * 0.25,
        isGroup: true,
        count: groupSizes[i],
      });
    }
  }
  
  return dots;
};

// Nested Donut Chart Visualization Component - Version 1
const NestedDonutVisualization = ({ 
  selectedTier, 
  onTierSelect,
  onTierClick
}: { 
  selectedTier: "monitor" | "nurture" | "accelerate";
  onTierSelect: (tier: "monitor" | "nurture" | "accelerate") => void;
  onTierClick?: (tier: "monitor" | "nurture" | "accelerate") => void;
}) => {
  const svgSize = 600;
  const center = svgSize / 2;
  
  // AI insights for each tier
  const tierInsights = {
    accelerate: "30 leaders prepared for executive roles with 70% VP+ prediction confidence. Prioritize executive sponsorship and stretch assignments.",
    nurture: "700 emerging leaders with medium signal strength. Focus on formal leadership programs and cross-functional exposure.",
    monitor: "1,500 employees showing early leadership signals. Encourage through recognition, mentorship, and visibility opportunities.",
  };
  
  // Tier data with percentages (relative to total workforce of ~31,000)
  const tierArcs = [
    { 
      id: "accelerate" as const, 
      title: "Accelerate", 
      count: 30, 
      percent: 0.1, 
      color: "#22C55E",
      radius: 110,
      strokeWidth: 44,
    },
    { 
      id: "nurture" as const, 
      title: "Nurture", 
      count: 700, 
      percent: 2.3, 
      color: "#F59E0B",
      radius: 168,
      strokeWidth: 44,
    },
    { 
      id: "monitor" as const, 
      title: "Monitor", 
      count: 1500, 
      percent: 4.8, 
      color: "#8B5CF6",
      radius: 226,
      strokeWidth: 44,
    },
  ];

  // Calculate arc path for a percentage
  const getArcPath = (radius: number, percent: number) => {
    const maxAngle = 300;
    const angle = (percent / 7) * maxAngle;
    const startAngle = 120;
    const endAngle = startAngle + angle;
    
    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;
    
    const x1 = center + radius * Math.cos(startRad);
    const y1 = center + radius * Math.sin(startRad);
    const x2 = center + radius * Math.cos(endRad);
    const y2 = center + radius * Math.sin(endRad);
    
    const largeArcFlag = angle > 180 ? 1 : 0;
    
    return `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`;
  };

  // Background arc (full ring)
  const getBackgroundArcPath = (radius: number) => {
    const startAngle = 120;
    const endAngle = 420;
    
    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;
    
    const x1 = center + radius * Math.cos(startRad);
    const y1 = center + radius * Math.sin(startRad);
    const x2 = center + radius * Math.cos(endRad);
    const y2 = center + radius * Math.sin(endRad);
    
    return `M ${x1} ${y1} A ${radius} ${radius} 0 1 1 ${x2} ${y2}`;
  };

  const selectedArc = tierArcs.find(t => t.id === selectedTier)!;

  return (
    <div className="flex gap-6 items-center pl-8 relative">
      {/* Background image with horizontal flip and 30% opacity - fades in with donut */}
      <motion.div 
        className="absolute inset-0 rounded-2xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.25 }}
        transition={{ duration: 1.5, delay: 0.3, ease: "easeOut" }}
        style={{
          backgroundImage: 'url(https://res.cloudinary.com/dzsj78i8v/image/upload/v1765276434/Culture_Hub_Topics_32_1_viecjf.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          transform: 'scaleX(-1)',
        }}
      />
      
      {/* Left side - Compact Accordion Tier list */}
      <div className="w-[330px] flex-shrink-0 space-y-2 relative z-10">
        {tierArcs.map((tier) => {
          const isSelected = tier.id === selectedTier;
          
          return (
            <motion.div
              key={tier.id}
              layout
              className="rounded-xl overflow-hidden cursor-pointer"
              style={{
                backgroundColor: 'white',
                borderLeft: `4px solid ${tier.color}`,
              }}
            >
              {/* Accordion Header - Compact */}
              <motion.div
                onClick={() => onTierSelect(tier.id)}
                className="flex items-center justify-between p-3 relative overflow-hidden"
                whileHover={{ backgroundColor: `${tier.color}08` }}
              >
                {/* Active gradient background */}
                <AnimatePresence>
                  {isSelected && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        background: `linear-gradient(to right, ${tier.color}15, ${tier.color}08, transparent)`,
                      }}
                    />
                  )}
                </AnimatePresence>
                
                <div className="flex items-center gap-3 relative z-10">
                  {/* Count indicator instead of percentage */}
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0"
                    style={{ 
                      backgroundColor: `${tier.color}15`,
                      color: tier.color,
                    }}
                  >
                    {tier.count.toLocaleString()}
                  </div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-sm text-foreground">{tier.title}</h4>
                    <span 
                      className="px-1.5 py-0.5 rounded-full text-xs font-medium"
                      style={{ backgroundColor: `${tier.color}20`, color: tier.color }}
                    >
                      {tier.percent}%
                    </span>
                  </div>
                </div>
              </motion.div>
              
              {/* Accordion Content - AI Insight */}
              <AnimatePresence initial={false}>
                {isSelected && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5 pt-3">
                      <p className="text-xs text-foreground leading-relaxed">
                        {tierInsights[tier.id]}
                      </p>
                      <button 
                        onClick={(e) => { e.stopPropagation(); onTierClick?.(tier.id); }}
                        className="mt-4 text-xs font-semibold transition-colors"
                        style={{ color: tier.color }}
                      >
                        View Pipeline →
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
        
        {/* Total workforce context */}
        <div className="pt-3">
          <p className="text-[10px] text-muted-foreground">
            Percentage of <span className="font-semibold text-foreground">31,000</span> total workforce
          </p>
        </div>
      </div>

      {/* Right side - Nested Donut Chart - Larger with overflow visible */}
      <div className="flex-1 flex items-center justify-center relative z-10 overflow-visible">
        <div className="relative overflow-visible" style={{ width: svgSize, height: svgSize }}>
          <svg 
            className="overflow-visible" 
            style={{ width: svgSize, height: svgSize }}
            viewBox={`0 0 ${svgSize} ${svgSize}`}
          >
            <defs>
              {/* Gradient definitions for each tier */}
              {tierArcs.map((tier) => (
                <linearGradient key={`gradient-${tier.id}`} id={`gradient-${tier.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={tier.color} stopOpacity="1" />
                  <stop offset="100%" stopColor={tier.color} stopOpacity="0.85" />
                </linearGradient>
              ))}
            </defs>
            
            {/* Background rings */}
            {tierArcs.map((tier) => (
              <motion.path
                key={`bg-${tier.id}`}
                d={getBackgroundArcPath(tier.radius)}
                fill="none"
                stroke={tier.color}
                strokeWidth={tier.strokeWidth}
                strokeLinecap="round"
                opacity={0.12}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1, delay: 0.2 }}
              />
            ))}
            
            {/* Foreground arcs with animation */}
            {tierArcs.map((tier, index) => {
              const isSelected = tier.id === selectedTier;
              return (
                <motion.path
                  key={`arc-${tier.id}`}
                  d={getArcPath(tier.radius, tier.percent)}
                  fill="none"
                  stroke={tier.color}
                  strokeWidth={tier.strokeWidth}
                  strokeLinecap="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ 
                    pathLength: 1, 
                    opacity: isSelected ? 1 : 0.5,
                  }}
                  transition={{ 
                    pathLength: { duration: 1.2, delay: 0.3 + index * 0.15, ease: "easeOut" },
                    opacity: { duration: 0.3 },
                  }}
                  className="cursor-pointer"
                  onClick={() => onTierSelect(tier.id)}
                />
              );
            })}
          </svg>

          {/* Center content */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedTier}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="text-center rounded-full flex flex-col items-center justify-center border-4"
                style={{ 
                  width: 150, 
                  height: 150,
                  backgroundColor: 'white',
                  borderColor: selectedArc.color,
                }}
              >
                <motion.div
                  className="text-[2.85rem] font-bold"
                  style={{ color: selectedArc.color }}
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  {selectedArc.count.toLocaleString()}
                </motion.div>
                <motion.div 
                  className="text-xs font-semibold text-muted-foreground uppercase tracking-wider"
                  initial={{ y: 5, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {selectedArc.title}
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

// Pipeline Spotlight Carousel - Version 2 visualization
const pipelineSpotlightPeople = [
  { name: "Victoria Reynolds", role: "Senior Director, R&D", tier: "accelerate" as const, image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop&crop=face", timeInPipeline: "8 months", insight: "Victoria has shown exceptional strategic vision, delivering 40% efficiency gains across her department. Her cross-functional influence has grown significantly, with recognition from 12 different teams in the past quarter." },
  { name: "Marcus Thompson", role: "VP Operations", tier: "nurture" as const, image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face", timeInPipeline: "6 months", insight: "Marcus demonstrates strong operational excellence with 25% cost reduction achievements. His leadership DNA suggests executive readiness within 12-18 months with targeted development." },
  { name: "Amanda Foster", role: "Head of Marketing", tier: "accelerate" as const, image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=100&h=100&fit=crop&crop=face", timeInPipeline: "9 months", insight: "Amanda's brand leadership has driven 40% engagement increase. Her peer recognition network has expanded 3x, signaling growing organizational influence beyond her direct reports." },
  { name: "David Park", role: "Head of Innovation", tier: "monitor" as const, image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face", timeInPipeline: "4 months", insight: "David is spearheading 5 key innovation initiatives. Early signals show strong creative leadership, with potential to move to Nurture tier within 6 months based on current trajectory." },
  { name: "Jennifer Adams", role: "Senior Director, Legal", tier: "accelerate" as const, image: "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=100&h=100&fit=crop&crop=face", timeInPipeline: "1.3 years", insight: "Jennifer's risk management expertise has protected significant company interests. Her board presentations demonstrate executive presence and strategic thinking aligned with C-suite expectations." },
];

const RadialSpotlightVisualization = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [pulseKey, setPulseKey] = useState(0);
  const currentPerson = pipelineSpotlightPeople[currentIndex];
  
  // Auto-rotate every 6 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % pipelineSpotlightPeople.length);
      setPulseKey((prev) => prev + 1); // Trigger pulse animation
    }, 6000);
    return () => clearInterval(timer);
  }, []);
  
  const getTierColor = (tier: string) => {
    switch(tier) {
      case "accelerate": return "#22C55E";
      case "nurture": return "#F59E0B";
      case "monitor": return "#8B5CF6";
      default: return "#22C55E";
    }
  };

  const getTierLabel = (tier: string) => {
    switch(tier) {
      case "accelerate": return "Accelerate";
      case "nurture": return "Nurture";
      case "monitor": return "Monitor";
      default: return "Accelerate";
    }
  };

  const tierColor = getTierColor(currentPerson.tier);
  const tierLabel = getTierLabel(currentPerson.tier);
  
  // Consistent ring spacing (44px apart)
  const centerRadius = 70;
  const ringSpacing = 44;
  const rings = [
    centerRadius + ringSpacing,      // 114
    centerRadius + ringSpacing * 2,  // 158
    centerRadius + ringSpacing * 3,  // 202
    centerRadius + ringSpacing * 4,  // 246
  ];
  
  return (
    <div className="relative h-[500px] flex items-center overflow-hidden py-6 px-10">
      {/* Blown-up radar background - positioned right, partially visible, larger and moved up */}
      <div className="absolute right-[-155px] top-[calc(50%-40px)] -translate-y-1/2 pointer-events-none">
        {/* Fade overlay at top of radar */}
        <div 
          className="absolute inset-0 z-10 pointer-events-none"
          style={{
            background: 'linear-gradient(to bottom, hsl(var(--card)) 0%, hsl(var(--card)) 5%, transparent 25%)',
          }}
        />
        <svg width="640" height="640" viewBox="0 0 560 560">
          <defs>
            {/* Pulse wave gradient */}
            <radialGradient id="pulseGradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={tierColor} stopOpacity="0.4" />
              <stop offset="70%" stopColor={tierColor} stopOpacity="0.1" />
              <stop offset="100%" stopColor={tierColor} stopOpacity="0" />
            </radialGradient>
          </defs>
          
          {/* Gradient-filled concentric rings - pulse outward on person change */}
          {rings.map((r, index) => (
            <motion.circle
              key={`ring-fill-${index}-${pulseKey}`}
              cx={280}
              cy={280}
              r={r}
              fill={tierColor}
              initial={{ opacity: 0.12 - index * 0.02, scale: 1 }}
              animate={{ 
                opacity: 0.08 - index * 0.015,
                scale: [1, 1.03, 1],
              }}
              transition={{ 
                opacity: { duration: 0.8, delay: 0.3 + index * 0.1 },
                scale: { duration: 0.8, delay: index * 0.08, ease: "easeInOut" }
              }}
              style={{ transformOrigin: '280px 280px' }}
            />
          ))}
          
          {/* Concentric ring strokes - pulse outward on person change */}
          {rings.map((r, index) => (
            <motion.circle 
              key={`ring-stroke-${index}-${pulseKey}`}
              cx={280} 
              cy={280} 
              r={r} 
              fill="none" 
              stroke={tierColor} 
              strokeWidth="1.5"
              initial={{ opacity: 0.3 - index * 0.05, scale: 1 }}
              animate={{ 
                opacity: 0.25 - index * 0.04, 
                scale: [1, 1.04, 1],
              }}
              transition={{ 
                opacity: { duration: 0.6, delay: 0.2 + index * 0.1 },
                scale: { duration: 0.7, delay: index * 0.1, ease: [0.4, 0, 0.2, 1] }
              }}
              style={{ transformOrigin: '280px 280px' }}
            />
          ))}
          
          {/* Outer boundary */}
          <motion.circle 
            cx={280} 
            cy={280} 
            r={rings[3] + ringSpacing / 2} 
            fill="none" 
            stroke={tierColor} 
            strokeWidth="1.5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.04 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          />
          
          {/* Center circle with tier label - animated on person change */}
          <motion.circle
            key={`center-circle-${currentIndex}`}
            cx={280}
            cy={280}
            r={centerRadius}
            fill="white"
            stroke={tierColor}
            strokeWidth="2"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 0.9, scale: 1 }}
            transition={{ duration: 0.4 }}
          />
          <AnimatePresence mode="wait">
            <motion.text
              key={`tier-label-${currentIndex}`}
              x={280}
              y={280}
              textAnchor="middle"
              dominantBaseline="middle"
              fill={tierColor}
              fontSize="14"
              fontWeight="600"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.3 }}
            >
              {tierLabel}
            </motion.text>
          </AnimatePresence>
        </svg>
      </div>
      
      {/* Content area - no cards, clean layout */}
      <div className="relative z-10 flex items-start gap-14 max-w-[665px]">
        {/* Person Profile */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.5 }}
            className="flex-shrink-0"
          >
            {/* Avatar with glow - larger size */}
            <div className="relative mb-6">
              <div 
                className="absolute -inset-4 rounded-full blur-xl"
                style={{ backgroundColor: `${tierColor}25` }}
              />
              <img 
                src={currentPerson.image}
                alt={currentPerson.name}
                className="relative w-32 h-32 rounded-full object-cover"
                style={{ borderColor: tierColor, borderWidth: '4px', borderStyle: 'solid' }}
              />
            </div>
            
            {/* Name & Role */}
            <h4 className="text-xl font-bold text-foreground mb-1">{currentPerson.name}</h4>
            <p className="text-sm text-muted-foreground mb-4">{currentPerson.role}</p>
            
            {/* Tier badge & time */}
            <div className="flex items-center gap-3">
              <span 
                className="px-3 py-1.5 rounded-full text-xs font-semibold text-white"
                style={{ backgroundColor: tierColor }}
              >
                {tierLabel}
              </span>
              <span className="text-xs text-muted-foreground">
                {currentPerson.timeInPipeline} in pipeline
              </span>
            </div>
          </motion.div>
        </AnimatePresence>
        
        {/* AI Insight - clean text block */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`insight-${currentIndex}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex-1 pt-2"
          >
            <div className="flex items-center gap-2 mb-3">
              <Brain className="w-5 h-5" style={{ color: tierColor }} />
              <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">AI Insight</span>
            </div>
            
            <p className="text-base text-foreground leading-relaxed">
              {currentPerson.insight}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
      
      {/* Navigation - bottom left, dots aligned with name/pill content */}
      <div className="absolute bottom-6 left-10 flex items-center gap-2">
        {pipelineSpotlightPeople.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`h-2 rounded-full transition-all ${
              idx === currentIndex ? "w-8" : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"
            }`}
            style={idx === currentIndex ? { backgroundColor: tierColor } : undefined}
          />
        ))}
      </div>
    </div>
  );
};

// Stacked Cards Visualization Component - Version 3 (Pyramid cards - small at top, large at bottom)
const StackedCardsVisualization = ({ onTierClick }: { onTierClick?: (tier: "monitor" | "nurture" | "accelerate") => void }) => {
  const cardTiers = [
    { 
      id: "accelerate" as const, 
      title: "Accelerate", 
      percent: "0.1%",
      count: 30, 
      color: "#22C55E",
      bgColor: "rgba(34, 197, 94, 0.08)",
      borderColor: "rgba(34, 197, 94, 0.3)",
      width: "55%",
    },
    { 
      id: "nurture" as const, 
      title: "Nurture", 
      percent: "2.3%",
      count: 700, 
      color: "#F59E0B",
      bgColor: "rgba(245, 158, 11, 0.08)",
      borderColor: "rgba(245, 158, 11, 0.3)",
      width: "75%",
    },
    { 
      id: "monitor" as const, 
      title: "Monitor", 
      percent: "4.8%",
      count: 1500, 
      color: "#8B5CF6",
      bgColor: "rgba(139, 92, 246, 0.08)",
      borderColor: "rgba(139, 92, 246, 0.3)",
      width: "100%",
    },
  ];

  return (
    <div className="flex flex-col items-center py-10 px-8 relative min-h-[400px]">
      {/* Background image */}
      <motion.div 
        className="absolute inset-0 rounded-2xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.25 }}
        transition={{ duration: 1.5, delay: 0.3, ease: "easeOut" }}
        style={{
          backgroundImage: 'url(https://res.cloudinary.com/dzsj78i8v/image/upload/v1765276434/Culture_Hub_Topics_32_1_viecjf.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          transform: 'scaleX(-1)',
        }}
      />
      
      {/* Stacked Cards */}
      <div className="relative z-10 w-full max-w-2xl flex flex-col items-center gap-4">
        {cardTiers.map((tier, index) => (
          <motion.div
            key={tier.id}
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ 
              duration: 0.6, 
              delay: index * 0.15,
              ease: [0.25, 0.46, 0.45, 0.94]
            }}
            onClick={() => onTierClick?.(tier.id)}
            className="rounded-2xl cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-[1.02] h-[88px] flex items-center p-6"
            style={{ 
              width: tier.width,
              backgroundColor: tier.bgColor,
              border: `2px solid ${tier.borderColor}`,
            }}
          >
            <div className="flex items-center gap-5 w-full">
              {/* Count badge */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ 
                  duration: 0.4, 
                  delay: index * 0.15 + 0.3,
                  type: "spring",
                  stiffness: 200
                }}
                className="flex-shrink-0 rounded-xl p-3 flex items-center justify-center min-w-[70px]"
                style={{ 
                  backgroundColor: `${tier.color}20`,
                  border: `1px solid ${tier.color}40`,
                }}
              >
                <span 
                  className="font-bold text-3xl"
                  style={{ color: tier.color }}
                >
                  {tier.count.toLocaleString()}
                </span>
              </motion.div>
              
              {/* Title and percent */}
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: index * 0.15 + 0.4 }}
                className="flex-1"
              >
                <h4 className="font-bold text-foreground text-lg">
                  {tier.title}
                </h4>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {tier.percent} of company
                </p>
              </motion.div>
            </div>
          </motion.div>
        ))}
      </div>
      
      {/* Connecting lines between cards */}
      <div className="absolute z-5 left-1/2 top-[4.5rem] -translate-x-1/2 flex flex-col items-center pointer-events-none">
        {[0, 1].map((i) => (
          <motion.div
            key={i}
            initial={{ scaleY: 0, opacity: 0 }}
            animate={{ scaleY: 1, opacity: 0.3 }}
            transition={{ duration: 0.4, delay: 0.6 + i * 0.2 }}
            className="w-px bg-gradient-to-b from-muted-foreground/40 to-transparent"
            style={{ 
              height: i === 0 ? '3.5rem' : '3.5rem',
              marginTop: i === 0 ? '4.5rem' : '3rem',
              transformOrigin: 'top'
            }}
          />
        ))}
      </div>
    </div>
  );
};

// Horizontal Stacked Bar Visualization Component - Version 4
const HorizontalBarVisualization = ({ onTierClick }: { onTierClick?: (tier: "monitor" | "nurture" | "accelerate") => void }) => {
  const [shimmerKey, setShimmerKey] = useState(0);
  
  // Trigger shimmer every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setShimmerKey(prev => prev + 1);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const barTiers = [
    { 
      id: "accelerate" as const, 
      title: "Accelerate", 
      count: 30, 
      color: "#22C55E",
      minWidth: "calc(6% + 15px)", // Added 15px to accelerate section
    },
    { 
      id: "nurture" as const, 
      title: "Nurture", 
      count: 700, 
      color: "#F59E0B",
      widthPercent: 28,
    },
    { 
      id: "monitor" as const, 
      title: "Monitor", 
      count: 1500, 
      color: "#8B5CF6",
      flex: 1, // Takes remaining space
    },
  ];

  return (
    <div className="py-12 px-8 relative min-h-[400px] flex flex-col justify-center">
      {/* Background image */}
      <motion.div 
        className="absolute inset-0 rounded-2xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.25 }}
        transition={{ duration: 1.5, delay: 0.3, ease: "easeOut" }}
        style={{
          backgroundImage: 'url(https://res.cloudinary.com/dzsj78i8v/image/upload/v1765276434/Culture_Hub_Topics_32_1_viecjf.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          transform: 'scaleX(-1)',
        }}
      />
      
      <div className="relative z-10">
        {/* AI Insight above pipeline */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8 flex items-start gap-3 bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-border/50"
        >
          <div className="p-2 rounded-lg bg-fuchsia-50 flex-shrink-0">
            <Brain className="w-5 h-5 text-fuchsia-500" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground mb-1">AI Insight</p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Your pipeline shows healthy progression with 30 leaders ready for executive roles. 
              The Nurture tier has strong momentum with 8 leaders advancing in the last 90 days.
            </p>
          </div>
        </motion.div>
        
        {/* Stacked horizontal bar - with improved load animation */}
        <div className="relative flex h-24 rounded-full overflow-hidden shadow-lg mb-8">
          {barTiers.map((tier, index) => (
            <motion.div
              key={tier.id}
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ 
                duration: 0.8, 
                delay: index * 0.2 + 0.3,
                ease: [0.34, 1.56, 0.64, 1], // Spring-like easing
              }}
              onClick={() => onTierClick?.(tier.id)}
              className="relative flex items-center justify-center cursor-pointer hover:brightness-110 transition-all origin-left"
              style={{ 
                backgroundColor: tier.color,
                ...(tier.minWidth ? { minWidth: tier.minWidth, width: tier.minWidth } : {}),
                ...(tier.widthPercent ? { width: `${tier.widthPercent}%` } : {}),
                ...(tier.flex ? { flex: tier.flex } : {}),
              }}
            >
              {/* Count with scale animation */}
              <motion.span
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ 
                  duration: 0.5, 
                  delay: index * 0.2 + 0.7,
                  type: "spring",
                  stiffness: 300,
                  damping: 15
                }}
                className="text-white font-bold text-2xl"
              >
                {tier.count.toLocaleString()}
              </motion.span>
              
              {/* Arrow connectors between segments */}
              {index < barTiers.length - 1 && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: index * 0.2 + 0.9, duration: 0.3, type: "spring" }}
                  className="absolute -right-4 z-10 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md"
                >
                  <ArrowLeft className="w-4 h-4 text-muted-foreground" />
                </motion.div>
              )}
            </motion.div>
          ))}
          
          {/* Shimmer overlay */}
          <motion.div
            key={shimmerKey}
            className="absolute inset-0 pointer-events-none"
            initial={{ x: "-100%" }}
            animate={{ x: "200%" }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            style={{
              background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)",
              width: "50%",
            }}
          />
        </div>
        
        {/* Labels below bar - positioned under each segment */}
        <div className="flex">
          {barTiers.map((tier, index) => (
            <motion.div
              key={tier.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.8 + index * 0.1 }}
              className="text-center"
              style={{ 
                ...(tier.minWidth ? { minWidth: tier.minWidth, width: tier.minWidth } : {}),
                ...(tier.widthPercent ? { width: `${tier.widthPercent}%` } : {}),
                ...(tier.flex ? { flex: tier.flex } : {}),
              }}
            >
              <p className="font-bold" style={{ color: tier.color }}>{tier.title}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

const ActivePipelinePageV10 = ({ onBack, onTierClick }: ActivePipelinePageV10Props) => {
  const [selectedTier, setSelectedTier] = useState<"monitor" | "nurture" | "accelerate">("accelerate");
  const [visualVersion, setVisualVersion] = useState<"v1" | "v2" | "v3" | "v4">("v1");
  const [showAIDrawer, setShowAIDrawer] = useState(false);
  
  const pipelinePrompts = [
    "Which leaders in the Accelerate tier are at risk of stagnation?",
    "What development actions should I prioritize for the Nurture tier?",
    "How does our pipeline compare to industry benchmarks?",
    "Who are the top candidates for executive succession planning?",
    "What patterns indicate high potential in the Monitor tier?",
  ];
  const selectedStage = pipelineStages.find(s => s.id === selectedTier)!;

  return (
    <div className="py-12 px-8 bg-page-background min-h-full">
      <div className="max-w-[1100px] mx-auto">
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


        {/* Overview Content (tabs removed - showing overview by default) */}
        <>
            {/* Interactive Radial Time Visualization */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mb-10 bg-card border border-border rounded-2xl p-6"
            >
              <div className="mb-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-foreground">Leadership Pipeline</h3>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Select value={visualVersion} onValueChange={(value: "v1" | "v2" | "v3" | "v4") => setVisualVersion(value)}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="v1">Version 1</SelectItem>
                      <SelectItem value="v2">Version 2</SelectItem>
                      <SelectItem value="v3">Version 3</SelectItem>
                      <SelectItem value="v4">Version 4</SelectItem>
                    </SelectContent>
                  </Select>
                  <button
                    onClick={() => setShowAIDrawer(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-fuchsia-50 text-fuchsia-500 text-sm font-medium hover:bg-fuchsia-100 transition-all"
                  >
                    <Sparkles className="w-4 h-4" />
                    Ask AI
                  </button>
                </div>
              </div>
              
              {visualVersion === "v1" ? (
                <NestedDonutVisualization 
                  selectedTier={selectedTier}
                  onTierSelect={setSelectedTier}
                  onTierClick={onTierClick}
                />
              ) : visualVersion === "v2" ? (
                <RadialSpotlightVisualization />
              ) : visualVersion === "v3" ? (
                <StackedCardsVisualization onTierClick={onTierClick} />
              ) : (
                <HorizontalBarVisualization onTierClick={onTierClick} />
              )}
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
        
      </div>

      {/* AI Assistant Drawer */}
      <AIAssistantDrawer
        isOpen={showAIDrawer}
        onClose={() => setShowAIDrawer(false)}
        context="Leadership Pipeline"
        suggestedPrompts={pipelinePrompts}
      />
    </div>
  );
};

export default ActivePipelinePageV10;
