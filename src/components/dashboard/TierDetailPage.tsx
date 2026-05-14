import { useState, useMemo, useEffect } from "react";
import { ArrowLeft, Users, TrendingUp, Rocket, Building2, Search, Filter, ChevronDown, X, Sparkles, ChevronLeft, ChevronRight, Clock, Target, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { motion } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useEmblaCarousel from "embla-carousel-react";
import AIAssistantDrawer from "./AIAssistantDrawer";
import PipelineMovementCarousel, { type PipelinePerson } from "./PipelineMovementCarousel";

interface TierDetailPageProps {
  tier: "monitor" | "nurture" | "accelerate";
  onBack: () => void;
  onPersonClick?: (person: PersonData) => void;
}

export interface PersonData {
  name: string;
  role: string;
  department: string;
  location: string;
  image: string;
  signalStrength: number;
  readiness: number;
  monthsInTier: number;
  predictedRole: string;
  timeline: string;
  topSignals: string[];
}

// Leadership Signal Categories - The 6 main categories
const signalCategories = [
  { id: "executive-access", name: "Executive Access & Recognition", count: 24 },
  { id: "strategic-positioning", name: "Strategic Positioning", count: 18 },
  { id: "voice-influence", name: "Voice & Influence", count: 22 },
  { id: "transformation-impact", name: "Transformation & Impact", count: 20 },
  { id: "people-leadership", name: "People Leadership", count: 26 },
  { id: "anti-patterns", name: "Anti-Patterns", count: 8 },
];

const tierData = {
  monitor: {
    title: "Monitor",
    count: "1,500",
    percent: "4.8%",
    description: "Employees showing early leadership signals. Encourage through recognition, mentorship, and visibility opportunities.",
    icon: Users,
    bgColor: "bg-violet-50",
    headerBg: "bg-violet-100",
    iconColor: "text-violet-600",
    pillColor: "bg-violet-600",
    barColor: "from-violet-500 to-violet-500/20",
    accentColor: "violet",
  },
  nurture: {
    title: "Nurture",
    count: "700",
    percent: "2.3%",
    description: "Medium signal strength. Prioritize for formal leadership development programs and cross-functional exposure.",
    icon: TrendingUp,
    bgColor: "bg-warning/5",
    headerBg: "bg-warning/10",
    iconColor: "text-warning",
    pillColor: "bg-warning",
    barColor: "from-warning to-warning/20",
    accentColor: "warning",
  },
  accelerate: {
    title: "Accelerate",
    count: "30",
    percent: "0.1%",
    description: "Strong signals with ~70% VP+ prediction confidence. Fast-track with executive sponsorship and stretch assignments.",
    icon: Rocket,
    bgColor: "bg-success/5",
    headerBg: "bg-success/10",
    iconColor: "text-success",
    pillColor: "bg-success",
    barColor: "from-success to-success/20",
    accentColor: "success",
  },
};

const departmentBreakdown = {
  monitor: [
    { name: "Research & Development", shortName: "R&D", count: 420, percent: 28 },
    { name: "Manufacturing", shortName: "Manufacturing", count: 345, percent: 23 },
    { name: "Commercial Operations", shortName: "Commercial Ops", count: 285, percent: 19 },
    { name: "Medical Affairs", shortName: "Medical Affairs", count: 225, percent: 15 },
    { name: "Corporate Functions", shortName: "Corporate", count: 225, percent: 15 },
  ],
  nurture: [
    { name: "Research & Development", shortName: "R&D", count: 196, percent: 28 },
    { name: "Commercial Operations", shortName: "Commercial Ops", count: 161, percent: 23 },
    { name: "Manufacturing", shortName: "Manufacturing", count: 140, percent: 20 },
    { name: "Medical Affairs", shortName: "Medical Affairs", count: 112, percent: 16 },
    { name: "Corporate Functions", shortName: "Corporate", count: 91, percent: 13 },
  ],
  accelerate: [
    { name: "Research & Development", shortName: "R&D", count: 9, percent: 30 },
    { name: "Commercial Operations", shortName: "Commercial Ops", count: 8, percent: 27 },
    { name: "Medical Affairs", shortName: "Medical Affairs", count: 6, percent: 20 },
    { name: "Manufacturing", shortName: "Manufacturing", count: 4, percent: 13 },
    { name: "Corporate Functions", shortName: "Corporate", count: 3, percent: 10 },
  ],
};

const samplePeople: Record<string, PersonData[]> = {
  monitor: [
    { name: "Emily Chen", role: "Senior Scientist", department: "R&D", location: "Indianapolis", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face", signalStrength: 42, readiness: 45, monthsInTier: 6, predictedRole: "Director", timeline: "18-24 months", topSignals: ["Strategic Vision", "Develops Others", "Drive Results"] },
    { name: "Marcus Johnson", role: "Manufacturing Lead", department: "Manufacturing", location: "Research Triangle", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face", signalStrength: 38, readiness: 40, monthsInTier: 8, predictedRole: "Senior Manager", timeline: "24-30 months", topSignals: ["Change Leadership", "Drive Results", "Stakeholder Management"] },
    { name: "Sarah Williams", role: "Clinical Research Associate", department: "Medical Affairs", location: "Boston", image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face", signalStrength: 45, readiness: 48, monthsInTier: 4, predictedRole: "Associate Director", timeline: "12-18 months", topSignals: ["Executive Communication", "Emotional Intelligence", "Strategic Vision"] },
    { name: "David Park", role: "Commercial Analyst", department: "Commercial Ops", location: "Chicago", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face", signalStrength: 40, readiness: 42, monthsInTier: 10, predictedRole: "Manager", timeline: "24-30 months", topSignals: ["Business Acumen", "Decision Making", "Cross-Functional Leadership"] },
    { name: "Jennifer Martinez", role: "Quality Engineer", department: "Manufacturing", location: "Indianapolis", image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face", signalStrength: 35, readiness: 38, monthsInTier: 12, predictedRole: "Senior Engineer", timeline: "30-36 months", topSignals: ["Drive Results", "Decision Making", "Change Leadership"] },
    { name: "Robert Taylor", role: "Regulatory Specialist", department: "Corporate", location: "Indianapolis", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face", signalStrength: 37, readiness: 35, monthsInTier: 5, predictedRole: "Senior Specialist", timeline: "24-30 months", topSignals: ["Stakeholder Management", "Executive Communication", "Business Acumen"] },
    { name: "Lisa Wang", role: "Process Engineer", department: "Manufacturing", location: "Indianapolis", image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150&h=150&fit=crop&crop=face", signalStrength: 41, readiness: 44, monthsInTier: 7, predictedRole: "Engineering Manager", timeline: "18-24 months", topSignals: ["Change Leadership", "Develops Others", "Drive Results"] },
    { name: "Kevin Brown", role: "Research Analyst", department: "R&D", location: "San Diego", image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face", signalStrength: 39, readiness: 41, monthsInTier: 9, predictedRole: "Senior Analyst", timeline: "24-30 months", topSignals: ["Strategic Vision", "Business Acumen", "Decision Making"] },
  ],
  nurture: [
    { name: "Amanda Foster", role: "Associate Director, R&D", department: "R&D", location: "San Diego", image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150&h=150&fit=crop&crop=face", signalStrength: 68, readiness: 72, monthsInTier: 14, predictedRole: "Director", timeline: "8-12 months", topSignals: ["Strategic Vision", "Develops Others", "Executive Communication"] },
    { name: "James Wilson", role: "Senior Manager, Operations", department: "Manufacturing", location: "Indianapolis", image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face", signalStrength: 72, readiness: 75, monthsInTier: 18, predictedRole: "Director", timeline: "6-10 months", topSignals: ["Drive Results", "Change Leadership", "Stakeholder Management"] },
    { name: "Michelle Lee", role: "Director, Market Access", department: "Commercial Ops", location: "New York", image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face", signalStrength: 65, readiness: 68, monthsInTier: 10, predictedRole: "Senior Director", timeline: "12-18 months", topSignals: ["Cross-Functional Leadership", "Business Acumen", "Executive Communication"] },
    { name: "Christopher Brown", role: "Principal Scientist", department: "R&D", location: "Boston", image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop&crop=face", signalStrength: 70, readiness: 73, monthsInTier: 16, predictedRole: "Associate Director", timeline: "8-12 months", topSignals: ["Strategic Vision", "Decision Making", "Develops Others"] },
    { name: "Rachel Kim", role: "Senior Manager, Medical Affairs", department: "Medical Affairs", location: "Indianapolis", image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face", signalStrength: 67, readiness: 70, monthsInTier: 12, predictedRole: "Director", timeline: "10-14 months", topSignals: ["Emotional Intelligence", "Stakeholder Management", "Executive Communication"] },
    { name: "Thomas Anderson", role: "Director, Finance", department: "Corporate", location: "Indianapolis", image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face", signalStrength: 63, readiness: 66, monthsInTier: 8, predictedRole: "VP Finance", timeline: "12-18 months", topSignals: ["Business Acumen", "Decision Making", "Cross-Functional Leadership"] },
    { name: "Susan Clark", role: "Regional Sales Director", department: "Commercial Ops", location: "Chicago", image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face", signalStrength: 69, readiness: 71, monthsInTier: 15, predictedRole: "VP Sales", timeline: "6-10 months", topSignals: ["Drive Results", "Cross-Functional Leadership", "Stakeholder Management"] },
    { name: "Mark Davis", role: "Head of QA", department: "Manufacturing", location: "Research Triangle", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face", signalStrength: 66, readiness: 69, monthsInTier: 11, predictedRole: "Director", timeline: "10-14 months", topSignals: ["Change Leadership", "Drive Results", "Decision Making"] },
  ],
  accelerate: [
    { name: "Victoria Reynolds", role: "Senior Director, R&D", department: "R&D", location: "Indianapolis", image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face", signalStrength: 94, readiness: 96, monthsInTier: 14, predictedRole: "VP", timeline: "4-8 months", topSignals: ["Strategic Vision", "Develops Others", "Executive Communication"] },
    { name: "Richard Lee", role: "VP, R&D Operations", department: "R&D", location: "Indianapolis", image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop&crop=face", signalStrength: 93, readiness: 95, monthsInTier: 18, predictedRole: "SVP", timeline: "Overdue", topSignals: ["Strategic Vision", "Cross-Functional Leadership", "Business Acumen"] },
    { name: "Daniel Kim", role: "Senior Director, Manufacturing", department: "Manufacturing", location: "Research Triangle", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face", signalStrength: 92, readiness: 94, monthsInTier: 16, predictedRole: "VP", timeline: "4-8 months", topSignals: ["Drive Results", "Change Leadership", "Stakeholder Management"] },
    { name: "Michael Chang", role: "VP, Commercial Strategy", department: "Commercial Ops", location: "New York", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face", signalStrength: 91, readiness: 93, monthsInTier: 12, predictedRole: "SVP", timeline: "6-10 months", topSignals: ["Business Acumen", "Strategic Vision", "Cross-Functional Leadership"] },
    { name: "Andrew Walsh", role: "Executive Director, R&D", department: "R&D", location: "San Diego", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face", signalStrength: 90, readiness: 92, monthsInTier: 10, predictedRole: "VP", timeline: "6-10 months", topSignals: ["Strategic Vision", "Develops Others", "Decision Making"] },
    { name: "Elizabeth Hart", role: "Executive Director, Medical", department: "Medical Affairs", location: "Boston", image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face", signalStrength: 89, readiness: 91, monthsInTier: 8, predictedRole: "VP", timeline: "8-12 months", topSignals: ["Emotional Intelligence", "Executive Communication", "Stakeholder Management"] },
    { name: "Katherine Moore", role: "VP, Corporate Development", department: "Corporate", location: "Indianapolis", image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face", signalStrength: 88, readiness: 90, monthsInTier: 6, predictedRole: "SVP", timeline: "10-14 months", topSignals: ["Business Acumen", "Cross-Functional Leadership", "Strategic Vision"] },
    { name: "Patricia Young", role: "Senior Director, Strategy", department: "Commercial Ops", location: "Chicago", image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face", signalStrength: 87, readiness: 89, monthsInTier: 9, predictedRole: "VP", timeline: "8-12 months", topSignals: ["Strategic Vision", "Drive Results", "Executive Communication"] },
    { name: "William Chen", role: "Senior Director, Global Supply", department: "Manufacturing", location: "Indianapolis", image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face", signalStrength: 86, readiness: 88, monthsInTier: 11, predictedRole: "VP", timeline: "6-10 months", topSignals: ["Drive Results", "Stakeholder Management", "Business Acumen"] },
    { name: "Jennifer Liu", role: "Executive Director, Clinical", department: "Medical Affairs", location: "San Diego", image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face", signalStrength: 85, readiness: 87, monthsInTier: 13, predictedRole: "VP", timeline: "8-12 months", topSignals: ["Executive Communication", "Strategic Vision", "Develops Others"] },
    { name: "Robert Martinez", role: "VP, Sales Operations", department: "Commercial Ops", location: "Chicago", image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face", signalStrength: 84, readiness: 86, monthsInTier: 7, predictedRole: "SVP", timeline: "10-14 months", topSignals: ["Drive Results", "Cross-Functional Leadership", "Decision Making"] },
    { name: "Sarah Thompson", role: "Senior Director, Regulatory", department: "Corporate", location: "Indianapolis", image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face", signalStrength: 83, readiness: 85, monthsInTier: 15, predictedRole: "VP", timeline: "6-10 months", topSignals: ["Stakeholder Management", "Business Acumen", "Executive Communication"] },
    { name: "David Anderson", role: "Executive Director, Engineering", department: "R&D", location: "Boston", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face", signalStrength: 82, readiness: 84, monthsInTier: 10, predictedRole: "VP", timeline: "8-12 months", topSignals: ["Strategic Vision", "Change Leadership", "Develops Others"] },
    { name: "Michelle Park", role: "Senior Director, Marketing", department: "Commercial Ops", location: "New York", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face", signalStrength: 81, readiness: 83, monthsInTier: 12, predictedRole: "VP", timeline: "8-12 months", topSignals: ["Executive Communication", "Cross-Functional Leadership", "Business Acumen"] },
    { name: "James Robinson", role: "VP, Quality Assurance", department: "Manufacturing", location: "Research Triangle", image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop&crop=face", signalStrength: 80, readiness: 82, monthsInTier: 14, predictedRole: "SVP", timeline: "10-14 months", topSignals: ["Drive Results", "Decision Making", "Stakeholder Management"] },
    { name: "Emily Foster", role: "Executive Director, HR", department: "Corporate", location: "Indianapolis", image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150&h=150&fit=crop&crop=face", signalStrength: 79, readiness: 81, monthsInTier: 9, predictedRole: "VP", timeline: "6-10 months", topSignals: ["Develops Others", "Emotional Intelligence", "Executive Communication"] },
    { name: "Christopher Lee", role: "Senior Director, IT", department: "Corporate", location: "Indianapolis", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face", signalStrength: 78, readiness: 80, monthsInTier: 11, predictedRole: "VP", timeline: "8-12 months", topSignals: ["Change Leadership", "Strategic Vision", "Decision Making"] },
    { name: "Amanda White", role: "Executive Director, Finance", department: "Corporate", location: "New York", image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face", signalStrength: 77, readiness: 79, monthsInTier: 8, predictedRole: "VP", timeline: "10-14 months", topSignals: ["Business Acumen", "Decision Making", "Stakeholder Management"] },
    { name: "Thomas Garcia", role: "Senior Director, Research", department: "R&D", location: "San Diego", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face", signalStrength: 76, readiness: 78, monthsInTier: 13, predictedRole: "VP", timeline: "8-12 months", topSignals: ["Strategic Vision", "Develops Others", "Drive Results"] },
    { name: "Rachel Adams", role: "VP, Medical Communications", department: "Medical Affairs", location: "Boston", image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face", signalStrength: 75, readiness: 77, monthsInTier: 10, predictedRole: "SVP", timeline: "10-14 months", topSignals: ["Executive Communication", "Stakeholder Management", "Cross-Functional Leadership"] },
    { name: "Mark Johnson", role: "Executive Director, Supply Chain", department: "Manufacturing", location: "Indianapolis", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face", signalStrength: 74, readiness: 76, monthsInTier: 12, predictedRole: "VP", timeline: "6-10 months", topSignals: ["Drive Results", "Change Leadership", "Business Acumen"] },
    { name: "Laura Mitchell", role: "Senior Director, Analytics", department: "Commercial Ops", location: "Chicago", image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face", signalStrength: 73, readiness: 75, monthsInTier: 7, predictedRole: "VP", timeline: "8-12 months", topSignals: ["Business Acumen", "Strategic Vision", "Decision Making"] },
    { name: "Steven Brown", role: "VP, Global Operations", department: "Manufacturing", location: "Research Triangle", image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face", signalStrength: 72, readiness: 74, monthsInTier: 15, predictedRole: "SVP", timeline: "10-14 months", topSignals: ["Drive Results", "Cross-Functional Leadership", "Stakeholder Management"] },
    { name: "Karen Wilson", role: "Executive Director, Legal", department: "Corporate", location: "Indianapolis", image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face", signalStrength: 71, readiness: 73, monthsInTier: 9, predictedRole: "VP", timeline: "8-12 months", topSignals: ["Decision Making", "Stakeholder Management", "Business Acumen"] },
    { name: "Brian Taylor", role: "Senior Director, Process Dev", department: "R&D", location: "Indianapolis", image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face", signalStrength: 70, readiness: 72, monthsInTier: 11, predictedRole: "VP", timeline: "6-10 months", topSignals: ["Strategic Vision", "Change Leadership", "Develops Others"] },
    { name: "Nicole Davis", role: "VP, Investor Relations", department: "Corporate", location: "New York", image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face", signalStrength: 69, readiness: 71, monthsInTier: 8, predictedRole: "SVP", timeline: "10-14 months", topSignals: ["Executive Communication", "Stakeholder Management", "Business Acumen"] },
    { name: "Jason Miller", role: "Executive Director, Clinical Ops", department: "Medical Affairs", location: "San Diego", image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop&crop=face", signalStrength: 68, readiness: 70, monthsInTier: 14, predictedRole: "VP", timeline: "8-12 months", topSignals: ["Drive Results", "Develops Others", "Decision Making"] },
    { name: "Stephanie Clark", role: "Senior Director, Pricing", department: "Commercial Ops", location: "Chicago", image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face", signalStrength: 67, readiness: 69, monthsInTier: 10, predictedRole: "VP", timeline: "6-10 months", topSignals: ["Business Acumen", "Cross-Functional Leadership", "Strategic Vision"] },
    { name: "Gregory Harris", role: "VP, Manufacturing Excellence", department: "Manufacturing", location: "Indianapolis", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face", signalStrength: 66, readiness: 68, monthsInTier: 12, predictedRole: "SVP", timeline: "10-14 months", topSignals: ["Change Leadership", "Drive Results", "Stakeholder Management"] },
    { name: "Diana Martinez", role: "Executive Director, Compliance", department: "Corporate", location: "Indianapolis", image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150&h=150&fit=crop&crop=face", signalStrength: 65, readiness: 67, monthsInTier: 7, predictedRole: "VP", timeline: "8-12 months", topSignals: ["Decision Making", "Stakeholder Management", "Executive Communication"] },
  ],
};

// Leadership behavior insights for featured people
const leadershipInsights: Record<string, string> = {
  "Victoria Reynolds": "Exceptional at building cross-functional coalitions. Recently led a 50-person initiative that increased R&D velocity by 40%.",
  "Richard Lee": "Transforms complex technical challenges into strategic opportunities. Known for developing 3 future directors in the past 2 years.",
  "Daniel Kim": "Master of operational excellence with a talent for culture change. Led the largest manufacturing transformation in company history.",
  "Michael Chang": "Visionary commercial strategist who consistently exceeds targets. Pioneered the market access approach now used globally.",
  "Andrew Walsh": "Combines deep scientific expertise with business acumen. Patents holder who also drove $200M in new revenue.",
  "Elizabeth Hart": "Exceptional stakeholder management across C-suite and board. Key voice in shaping company's medical strategy.",
  "Katherine Moore": "Strategic dealmaker responsible for 3 major acquisitions. Builds high-performing teams from diverse backgrounds.",
  "Patricia Young": "Data-driven strategist who identifies market opportunities early. Mentors 8 emerging leaders across the organization.",
  "William Chen": "Supply chain innovator who reduced costs by 25% while improving quality. Known for calm leadership under pressure.",
  "Amanda Foster": "Rising star with exceptional people development skills. Her team has the highest engagement scores in R&D.",
  "James Wilson": "Operations leader who drives results through empowerment. Transformed manufacturing efficiency across 3 sites.",
  "Michelle Lee": "Cross-functional collaborator who breaks down silos. Led the successful market launch of 2 major products.",
  "Emily Chen": "Emerging scientific leader with strong peer influence. Recognized for innovative approaches to complex research problems.",
  "Marcus Johnson": "Manufacturing talent showing strong initiative in process improvement. Natural mentor to junior team members.",
};

// Featured Leaders Carousel Component
const FeaturedLeadersCarousel = ({ 
  people, 
  tierConfig,
  onPersonClick 
}: { 
  people: PersonData[]; 
  tierConfig: { barColor: string; pillColor: string; iconColor: string; };
  onPersonClick: (person: PersonData) => void;
}) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: false, 
    align: "start",
    slidesToScroll: 1,
  });
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);

  useEffect(() => {
    if (!emblaApi) return;
    
    const onSelect = () => {
      setCanScrollPrev(emblaApi.canScrollPrev());
      setCanScrollNext(emblaApi.canScrollNext());
    };
    
    emblaApi.on("select", onSelect);
    onSelect();
    
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  const scrollPrev = () => emblaApi?.scrollPrev();
  const scrollNext = () => emblaApi?.scrollNext();

  const formatTimeInRole = (months: number) => {
    if (months < 12) return `${months} months`;
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    if (remainingMonths === 0) return `${years} year${years > 1 ? 's' : ''}`;
    return `${years}y ${remainingMonths}m`;
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-foreground">Featured Leaders</h2>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-full"
            onClick={scrollPrev}
            disabled={!canScrollPrev}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-full"
            onClick={scrollNext}
            disabled={!canScrollNext}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-5">
          {people.map((person, index) => (
            <div 
              key={person.name}
              className="flex-none w-[340px] bg-white rounded-2xl overflow-hidden cursor-pointer group transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border border-border"
              onClick={() => onPersonClick(person)}
            >
              {/* Accent top bar */}
              <div className={`h-1.5 bg-gradient-to-r ${tierConfig.barColor}`} />
              
              <div className="p-6">
                {/* Header with avatar and info */}
                <div className="flex items-start gap-4 mb-5">
                  <div className="relative">
                    <img
                      src={person.image}
                      alt={person.name}
                      className="w-18 h-18 rounded-2xl object-cover shadow-md group-hover:shadow-lg transition-shadow"
                      style={{ width: '72px', height: '72px' }}
                    />
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-white shadow-sm flex items-center justify-center">
                      <span className="text-xs font-bold text-success">#{index + 1}</span>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0 pt-1">
                    <h3 className="text-lg font-bold text-foreground leading-tight mb-0.5">{person.name}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{person.role}</p>
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-muted/50">
                      <Clock className="w-3 h-3 text-muted-foreground" />
                      <span className="text-xs font-medium text-muted-foreground">
                        {formatTimeInRole(person.monthsInTier)} in tier
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Leadership Insight - styled as a quote */}
                <div className="relative bg-gradient-to-br from-accent-magenta/5 to-primary/5 rounded-xl p-4 mb-4">
                  <div className="absolute top-3 left-3 text-accent-magenta/20 text-4xl font-serif leading-none">"</div>
                  <div className="relative">
                    <div className="flex items-center gap-1.5 mb-2">
                      <Sparkles className="w-3.5 h-3.5 text-accent-magenta" />
                      <span className="text-xs font-semibold text-accent-magenta uppercase tracking-wide">AI Insight</span>
                    </div>
                    <p className="text-sm text-foreground/80 leading-relaxed line-clamp-3 pl-1">
                      {leadershipInsights[person.name] || `Strong performer demonstrating ${person.topSignals[0]} and ${person.topSignals[1]} capabilities.`}
                    </p>
                  </div>
                </div>
                
                {/* Top Signals - pill style */}
                <div className="flex flex-wrap gap-2">
                  {person.topSignals.slice(0, 3).map((signal) => (
                    <span 
                      key={signal} 
                      className="px-3 py-1.5 rounded-full text-xs font-medium bg-muted text-foreground/70 border border-border/50"
                    >
                      {signal}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Pipeline Movement visualization data for Accelerate tier
const pipelineMovementData: PipelinePerson[] = [
  {
    name: "Victoria Reynolds",
    role: "Senior Director, R&D",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop&crop=face",
    joinedAccelerate: "High signals",
    newSignals: [
      { label: "Cross-Functional Leadership", icon: "users" },
      { label: "Strategic Influence", icon: "lightbulb" },
      { label: "Developing Others", icon: "userplus" },
    ],
    recentActivity: [
      { label: "Recognitions", value: 6, icon: "award" },
      { label: "Recognizers", value: 5, icon: "lightbulb" },
      { label: "Functions", value: 3, icon: "network" },
      { label: "Sr. leaders", value: 2, icon: "crown" },
    ],
    summary:
      "Victoria was recognized by the Sr. Vice President - Talent and Inclusion for stepping up to lead an HR workstream on the Future of Work project while maintaining her full-time responsibilities. This adds to her already strong profile of transformational leadership and capability-building, now demonstrating initiative to take on enterprise-level strategic work beyond her core role.",
  },
  {
    name: "Richard Lee",
    role: "VP, R&D Operations",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face",
    joinedAccelerate: "High signals",
    newSignals: [
      { label: "Executive Access", icon: "users" },
      { label: "Enterprise Vision", icon: "lightbulb" },
    ],
    recentActivity: [
      { label: "Recognitions", value: 5, icon: "award" },
      { label: "Recognizers", value: 4, icon: "lightbulb" },
      { label: "Functions", value: 4, icon: "network" },
      { label: "Sr. leaders", value: 3, icon: "crown" },
    ],
    summary:
      "Richard led a cross-regional operations review presented directly to the COO, surfacing a $12M efficiency opportunity. Multiple SVPs cited his ability to translate technical complexity into board-ready narrative — a hallmark Accelerate signal.",
  },
  {
    name: "Daniel Kim",
    role: "Senior Director, Manufacturing",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
    joinedAccelerate: "High signals",
    newSignals: [
      { label: "Operational Excellence", icon: "lightbulb" },
      { label: "Talent Development", icon: "userplus" },
    ],
    recentActivity: [
      { label: "Recognitions", value: 4, icon: "award" },
      { label: "Recognizers", value: 4, icon: "lightbulb" },
      { label: "Functions", value: 2, icon: "network" },
      { label: "Sr. leaders", value: 2, icon: "crown" },
    ],
    summary:
      "Daniel was named delivery lead for the new Singapore facility ramp, with the SVP Supply Chain highlighting his coaching of two emerging plant managers. Strong combination of execution and people-development signals this quarter.",
  },
  {
    name: "Michael Chang",
    role: "VP, Commercial Strategy",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face",
    joinedAccelerate: "High signals",
    newSignals: [
      { label: "Market Creation", icon: "lightbulb" },
      { label: "Cross-Functional Leadership", icon: "users" },
    ],
    recentActivity: [
      { label: "Recognitions", value: 5, icon: "award" },
      { label: "Recognizers", value: 3, icon: "lightbulb" },
      { label: "Functions", value: 3, icon: "network" },
      { label: "Sr. leaders", value: 2, icon: "crown" },
    ],
    summary:
      "Michael shaped the GTM thesis for the new APAC commercial segment, cited by the Chief Commercial Officer in the latest investor update. His ability to align Product, Marketing and Sales around a single strategic narrative continues to stand out.",
  },
  {
    name: "Andrew Walsh",
    role: "Executive Director, R&D",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&h=200&fit=crop&crop=face",
    joinedAccelerate: "High signals",
    newSignals: [
      { label: "Strategic Influence", icon: "lightbulb" },
      { label: "Developing Others", icon: "userplus" },
    ],
    recentActivity: [
      { label: "Recognitions", value: 4, icon: "award" },
      { label: "Recognizers", value: 3, icon: "lightbulb" },
      { label: "Functions", value: 2, icon: "network" },
      { label: "Sr. leaders", value: 2, icon: "crown" },
    ],
    summary:
      "Andrew co-authored the platform R&D roadmap and ran two technical mentoring circles for early-career scientists. SVP R&D specifically called out his shift from individual technical authority to multiplier-style leadership.",
  },
  {
    name: "Elizabeth Hart",
    role: "Executive Director, Medical",
    image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=200&h=200&fit=crop&crop=face",
    joinedAccelerate: "High signals",
    newSignals: [
      { label: "Cross-Functional Leadership", icon: "users" },
      { label: "Enterprise Vision", icon: "lightbulb" },
    ],
    recentActivity: [
      { label: "Recognitions", value: 4, icon: "award" },
      { label: "Recognizers", value: 3, icon: "lightbulb" },
      { label: "Functions", value: 3, icon: "network" },
      { label: "Sr. leaders", value: 2, icon: "crown" },
    ],
    summary:
      "Elizabeth represented Medical Affairs in the cross-functional pricing committee and was recognized by the CMO for her clarity in regulatory-strategy trade-offs. Increasing visibility with both commercial and executive leadership.",
  },
];

const TierDetailPage = ({ tier, onBack, onPersonClick }: TierDetailPageProps) => {
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
  const [selectedSignals, setSelectedSignals] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"overview" | "matrix">("overview");
  const [showAIDrawer, setShowAIDrawer] = useState(false);
  
  const tierPrompts: Record<string, string[]> = {
    accelerate: [
      "Which Accelerate leaders are at risk of stagnation?",
      "What development actions should I prioritize for these leaders?",
      "Who are the top candidates for executive succession?",
      "How can I better support Rising Stars in this tier?",
    ],
    nurture: [
      "Which Nurture leaders are closest to moving to Accelerate?",
      "What skills should Nurture leaders focus on developing?",
      "How can I increase engagement in this tier?",
      "What leadership programs would benefit this group?",
    ],
    monitor: [
      "Which Monitor leaders show the most promise?",
      "What early signals indicate high potential?",
      "How can I encourage leadership development in this tier?",
      "What mentorship opportunities should I consider?",
    ],
  };
  const data = tierData[tier];
  const departments = departmentBreakdown[tier];
  const allPeople = samplePeople[tier];
  const Icon = data.icon;

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    const container = document.querySelector('.overflow-y-auto');
    if (container) {
      container.scrollTo({ top: 0, behavior: "auto" });
    }
  }, [tier]);

  // Filter people by departments, signals, and search
  const filteredPeople = useMemo(() => {
    return allPeople.filter((person) => {
      const matchesDepartment = selectedDepartments.length === 0 || selectedDepartments.includes(person.department);
      const matchesSearch = !searchQuery || 
        person.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        person.role.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSignals = selectedSignals.length === 0 || 
        selectedSignals.every(signal => person.topSignals.includes(signal));
      return matchesDepartment && matchesSearch && matchesSignals;
    });
  }, [allPeople, selectedDepartments, searchQuery, selectedSignals]);

  // Top 6 for signals graph (sorted by readiness)
  const top6 = [...allPeople].sort((a, b) => b.readiness - a.readiness).slice(0, 6);

  const toggleSignal = (signalName: string) => {
    setSelectedSignals(prev => 
      prev.includes(signalName) 
        ? prev.filter(s => s !== signalName)
        : [...prev, signalName]
    );
  };

  const toggleDepartment = (deptName: string) => {
    setSelectedDepartments(prev => 
      prev.includes(deptName) 
        ? prev.filter(d => d !== deptName)
        : [...prev, deptName]
    );
  };

  const clearFilters = () => {
    setSelectedSignals([]);
    setSelectedDepartments([]);
    setSearchQuery("");
  };

  const activeFiltersCount = selectedSignals.length + selectedDepartments.length;

  const handlePersonClick = (person: PersonData) => {
    if (onPersonClick) {
      onPersonClick(person);
    }
  };

  return (
    <div className="min-h-full" style={{ backgroundColor: '#F6F7FB' }}>
      {/* Header */}
      <div 
        className="px-8 py-8"
        style={{
          background: tier === "accelerate" 
            ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.15) 0%, rgba(74, 222, 128, 0.1) 25%, rgba(187, 247, 208, 0.08) 50%, rgba(220, 252, 231, 0.05) 75%, rgba(240, 253, 244, 0.03) 100%)'
            : tier === "nurture"
            ? 'linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(251, 191, 36, 0.1) 25%, rgba(254, 215, 170, 0.08) 50%, rgba(255, 237, 213, 0.05) 75%, rgba(255, 247, 237, 0.03) 100%)'
            : 'linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(167, 139, 250, 0.1) 25%, rgba(196, 181, 253, 0.08) 50%, rgba(221, 214, 254, 0.05) 75%, rgba(245, 243, 255, 0.03) 100%)'
        }}
      >
        <div className="max-w-[1100px] mx-auto">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Overview
          </button>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-5">
              <div 
                className="rounded-2xl flex items-center justify-center" 
                style={{ 
                  height: '72px', 
                  width: '72px',
                  background: tier === "accelerate" 
                    ? 'linear-gradient(135deg, #22C55E 0%, #16A34A 50%, #15803D 100%)'
                    : tier === "nurture"
                    ? 'linear-gradient(135deg, #F59E0B 0%, #D97706 50%, #B45309 100%)'
                    : 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 50%, #6D28D9 100%)',
                  boxShadow: tier === "accelerate" 
                    ? '0 8px 32px -8px rgba(34, 197, 94, 0.5)'
                    : tier === "nurture"
                    ? '0 8px 32px -8px rgba(245, 158, 11, 0.5)'
                    : '0 8px 32px -8px rgba(139, 92, 246, 0.5)'
                }}
              >
                <Icon className="h-9 w-9 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-foreground">{data.title} Group</h1>
                <p className="text-lg text-muted-foreground">
                  <span className="font-semibold text-foreground">{data.count}</span> employees ({data.percent} of workforce)
                </p>
              </div>
            </div>

            {/* Employee Count Card */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
              className="relative flex flex-col items-center justify-center rounded-2xl px-10 py-6"
              style={{
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.7) 100%)',
                backdropFilter: 'blur(8px)',
                border: tier === "accelerate" 
                  ? '1px solid rgba(34, 197, 94, 0.2)'
                  : tier === "nurture"
                  ? '1px solid rgba(245, 158, 11, 0.2)'
                  : '1px solid rgba(139, 92, 246, 0.2)',
                boxShadow: tier === "accelerate" 
                  ? '0 4px 24px -4px rgba(34, 197, 94, 0.15)'
                  : tier === "nurture"
                  ? '0 4px 24px -4px rgba(245, 158, 11, 0.15)'
                  : '0 4px 24px -4px rgba(139, 92, 246, 0.15)',
              }}
            >
              <motion.span 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
                className="text-6xl font-extrabold"
                style={{
                  background: tier === "accelerate" 
                    ? 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)'
                    : tier === "nurture"
                    ? 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)'
                    : 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                {data.count}
              </motion.span>
              <motion.span 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.6 }}
                className="text-sm font-medium text-muted-foreground mt-1"
              >
                Future Leaders
              </motion.span>
            </motion.div>
          </div>

          <p className="mt-2 text-muted-foreground max-w-2xl">
            {data.description}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="px-8 py-8">
        <div className="max-w-[1100px] mx-auto space-y-8">
          
          {/* Tabs for Accelerate tier only */}
          {tier === "accelerate" && (
            <div className="flex justify-center mb-10">
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
              </div>
            </div>
          )}

          {/* Overview Tab Content (or default for non-accelerate tiers) */}
          {(tier !== "accelerate" || activeTab === "overview") && (
            <>
              {/* Pipeline Movement Section (replaces Featured Leaders for Accelerate) */}
              {tier === "accelerate" ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  {/* Movement Visualization */}
                  <div className="bg-white rounded-xl p-10">
                    {/* Header with Ask AI button */}
                    <div className="flex items-start justify-between mb-14">
                      <div className="flex-1" />
                      <div className="text-center flex-1">
                        <h2 className="text-sm font-bold tracking-widest text-muted-foreground uppercase mb-2">
                          Pipeline Movement
                        </h2>
                        <p className="text-muted-foreground">
                          Individuals with high signal activity this quarter
                        </p>
                      </div>
                      <div className="flex-1 flex justify-end">
                        <button
                          onClick={() => setShowAIDrawer(true)}
                          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-fuchsia-50 text-fuchsia-500 text-sm font-medium hover:bg-fuchsia-100 transition-all"
                        >
                          <Sparkles className="w-4 h-4" />
                          Ask AI
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex items-start justify-between gap-6">
                      {pipelineMovementData.map((person, index) => (
                        <motion.div
                          key={person.name}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: index * 0.1 }}
                          className="flex flex-col items-center flex-1 group cursor-pointer"
                        >
                          {/* Avatar at top */}
                          <div className="relative z-10">
                            <img
                              src={person.image}
                              alt={person.name}
                              className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg transition-transform group-hover:scale-110"
                            />
                            <div className="absolute -top-1 -right-1 w-6 h-6 bg-success rounded-full flex items-center justify-center border-2 border-white shadow-md">
                              <TrendingUp className="w-3 h-3 text-white" />
                            </div>
                          </div>

                          {/* Movement Bar - animates down from avatar */}
                          <div className="relative w-12 -mt-2 overflow-hidden" style={{ height: '140px' }}>
                            <motion.div
                              initial={{ height: 0 }}
                              animate={{ height: '140px' }}
                              transition={{ duration: 0.8, delay: 0.3 + index * 0.15, ease: "easeOut" }}
                              className="absolute top-0 left-0 right-0 rounded-b-xl"
                              style={{
                                background: 'linear-gradient(to bottom, rgba(34, 197, 94, 0.9) 0%, rgba(34, 197, 94, 0.7) 30%, rgba(34, 197, 94, 0.2) 70%, rgba(34, 197, 94, 0.02) 90%, rgba(255, 255, 255, 0) 100%)',
                              }}
                            />
                          </div>

                          {/* Name and Role */}
                          <h4 className="font-semibold text-foreground text-sm text-center group-hover:text-success transition-colors mt-4">
                            {person.name}
                          </h4>
                          <p className="text-xs text-muted-foreground text-center truncate max-w-[120px]">
                            {person.role}
                          </p>
                          
                          {/* Time Panel */}
                          <div className="mt-2 px-3 py-1.5 bg-success/10 rounded-full">
                            <span className="text-xs font-medium text-success">
                              {person.joinedAccelerate}
                            </span>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    {/* AI Insight */}
                    <div className="mt-10 pt-6 border-t border-border">
                      <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-success/5 to-transparent rounded-xl">
                        <Sparkles className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-foreground mb-1">AI Movement Insight</p>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            6 leaders show exceptionally high signal activity this quarter. Strong patterns in Executive Access and Strategic Positioning signals correlate with VP-level recognition. Victoria Reynolds demonstrates the most consistent cross-functional signals—consider her for executive sponsorship.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : (
                /* Featured Leaders Carousel for non-accelerate tiers */
                <FeaturedLeadersCarousel 
                  people={top6} 
                  tierConfig={data}
                  onPersonClick={handlePersonClick}
                />
              )}

          {/* Combined Filters + People Grid Panel */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            {/* Filters Section */}
            <div className="p-6 border-b border-border">
              <div className="flex items-center gap-4 flex-wrap">
                {/* Search */}
                <div className="relative flex-1 min-w-64 max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search by name or role..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 h-10"
                  />
                </div>

                {/* Department Filter - Multi-select */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="gap-2 h-10">
                      <Building2 className="h-4 w-4" />
                      Departments
                      {selectedDepartments.length > 0 && (
                        <Badge className="ml-1 h-5 w-5 p-0 flex items-center justify-center text-xs">
                          {selectedDepartments.length}
                        </Badge>
                      )}
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-64 bg-card">
                    <div className="p-3 space-y-1">
                      {departments.map((dept) => (
                        <label
                          key={dept.name}
                          className="flex items-center gap-3 px-2 py-2 rounded-md hover:bg-muted cursor-pointer"
                        >
                          <Checkbox
                            checked={selectedDepartments.includes(dept.shortName)}
                            onCheckedChange={() => toggleDepartment(dept.shortName)}
                          />
                          <span className="text-sm flex-1">{dept.shortName}</span>
                          <span className="text-xs text-muted-foreground">{dept.count}</span>
                        </label>
                      ))}
                      {selectedDepartments.length > 0 && (
                        <div className="pt-2 border-t border-border mt-2">
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="w-full text-muted-foreground"
                            onClick={() => setSelectedDepartments([])}
                          >
                            Clear selection
                          </Button>
                        </div>
                      )}
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Leadership Signals Filter - Taller */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="gap-2 h-10">
                      <Sparkles className="h-4 w-4" />
                      Leadership Signals
                      {selectedSignals.length > 0 && (
                        <Badge className="ml-1 h-5 w-5 p-0 flex items-center justify-center text-xs">
                          {selectedSignals.length}
                        </Badge>
                      )}
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-80 bg-card" style={{ maxHeight: '520px', overflowY: 'auto' }}>
                    <div className="p-4 space-y-5">
                      <p className="text-sm font-semibold text-foreground">Filter by Leadership Signals</p>
                      
                      <div className="space-y-1">
                        {signalCategories.map((signal) => (
                          <label
                            key={signal.id}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted cursor-pointer transition-colors"
                          >
                            <Checkbox
                              checked={selectedSignals.includes(signal.name)}
                              onCheckedChange={() => toggleSignal(signal.name)}
                            />
                            <span className="text-sm flex-1">{signal.name}</span>
                            <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                              {signal.count}
                            </span>
                          </label>
                        ))}
                      </div>

                      <div className="flex gap-2 pt-3 border-t border-border">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="flex-1"
                          onClick={() => setSelectedSignals([])}
                        >
                          Clear All
                        </Button>
                      </div>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Active Filters */}
                {activeFiltersCount > 0 && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={clearFilters}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Clear all
                  </Button>
                )}
              </div>

              {/* Selected Filters Pills */}
              {(selectedSignals.length > 0 || selectedDepartments.length > 0) && (
                <div className="flex flex-wrap gap-2 mt-4">
                          {selectedDepartments.map((dept) => (
                    <Badge
                      key={dept}
                      variant="outline"
                      className="gap-1 cursor-pointer bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
                      onClick={() => toggleDepartment(dept)}
                    >
                      {dept}
                      <X className="h-3 w-3" />
                    </Badge>
                  ))}
                  {selectedSignals.map((signal) => (
                    <Badge
                      key={signal}
                      variant="outline"
                      className="gap-1 cursor-pointer bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
                      onClick={() => toggleSignal(signal)}
                    >
                      {signal}
                      <X className="h-3 w-3" />
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* People Section */}
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-muted-foreground" />
                  <h2 className="text-lg font-semibold text-foreground">All People</h2>
                  <Badge variant="secondary" className="ml-2">
                    {filteredPeople.length} people
                  </Badge>
                </div>
              </div>

              {/* Narrow filter message */}
              {selectedSignals.length >= 5 && filteredPeople.length <= 5 && (
                <div className="bg-accent-magenta/10 border border-accent-magenta/20 rounded-lg p-3 mb-4 flex items-center gap-2">
                  <Filter className="h-4 w-4 text-accent-magenta" />
                  <p className="text-sm text-foreground">
                    <span className="font-semibold">{filteredPeople.length} people</span> match all selected signals. Consider broadening your criteria.
                  </p>
                </div>
              )}

              {filteredPeople.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Filter className="h-10 w-10 mx-auto mb-3 opacity-50" />
                  <p>No people match your filters</p>
                  <Button variant="link" onClick={clearFilters} className="mt-2">
                    Clear all filters
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-5">
                  {filteredPeople.map((person) => (
                    <div 
                      key={person.name}
                      className="p-6 rounded-2xl border border-border bg-card hover:shadow-lg hover:border-border/80 transition-all cursor-pointer group relative"
                      onClick={() => handlePersonClick(person)}
                    >

                      {/* Avatar and Info */}
                      <div className="flex items-start gap-4">
                        <img 
                          src={person.image}
                          alt={person.name}
                          className="w-14 h-14 rounded-xl object-cover group-hover:scale-105 transition-transform"
                        />
                        <div className="flex-1 min-w-0 pt-1 pr-16">
                          <h3 className="font-semibold text-foreground text-base leading-tight">{person.name}</h3>
                          <p className="text-sm text-muted-foreground mt-0.5">{person.role}</p>
                        </div>
                      </div>

                      {/* Top Signals */}
                      <div className="mt-6">
                        <div className="flex flex-wrap gap-2">
                          {person.topSignals.slice(0, 3).map((signal) => (
                            <span 
                              key={signal} 
                              className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                                selectedSignals.includes(signal) 
                                  ? 'bg-blue-50 border-blue-200 text-blue-700 font-medium' 
                                  : 'bg-muted/50 border-border text-muted-foreground'
                              }`}
                            >
                              {signal}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
            </>
          )}

          {/* Accelerate Matrix Tab Content */}
          {tier === "accelerate" && activeTab === "matrix" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mt-6"
            >
              {/* Quadrant Visualization */}
              <div className="relative bg-white rounded-xl p-10">
                {/* Header with Ask AI button */}
                <div className="flex items-start justify-between mb-10">
                  <div className="flex-1" />
                  <div className="text-center flex-1">
                    <h2 className="text-sm font-bold tracking-widest text-muted-foreground uppercase mb-2">
                      Accelerate Matrix
                    </h2>
                    <p className="text-muted-foreground whitespace-nowrap">
                      Track leader progression across tenure. Understand who is rising fast
                    </p>
                    <p className="text-muted-foreground">
                      and those that might be static.
                    </p>
                  </div>
                  <div className="flex-1 flex justify-end">
                    <button
                      onClick={() => setShowAIDrawer(true)}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-fuchsia-50 text-fuchsia-500 text-sm font-medium hover:bg-fuchsia-100 transition-all"
                    >
                      <Sparkles className="w-4 h-4" />
                      Ask AI
                    </button>
                  </div>
                </div>
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

              {/* Leaders in This Matrix - White panel with cards */}
              <div className="mt-10 bg-white rounded-2xl p-8">
                <h3 className="text-sm font-bold tracking-widest text-muted-foreground uppercase mb-6">
                  Leaders in This Matrix
                </h3>
                <div className="grid grid-cols-3 gap-5">
                  {[
                    { name: "Sarah Mitchell", role: "Director, Engineering", quadrant: "Rising Stars", image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop&crop=face", insight: "Rapid progression with 3 executive recognitions in 6 months. High potential for VP role within 12 months." },
                    { name: "Sofia Rodriguez", role: "Head of Strategy", quadrant: "Rising Stars", image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop&crop=face", insight: "Strategic vision driving 40% revenue growth. Cross-functional influence expanding rapidly." },
                    { name: "Daniela Chen", role: "VP Product", quadrant: "Static", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face", insight: "Strong performer but signals plateauing. Consider stretch assignment to reinvigorate growth trajectory." },
                    { name: "Marcus Thompson", role: "Senior Director, Sales", quadrant: "Static", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face", insight: "Consistent high value contributor. Long tenure may benefit from executive coaching or role rotation." },
                    { name: "Tom Bradley", role: "Director, Operations", quadrant: "Static", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face", insight: "Operational excellence maintained over 3+ years. Explore innovation or mentorship opportunities." },
                    { name: "James Wilson", role: "Senior Manager, IT", quadrant: "Developing", image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop&crop=face", insight: "Early signals emerging. Focused development in executive communication could accelerate progression." },
                    { name: "Liam O'Connor", role: "Manager, Finance", quadrant: "Developing", image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop&crop=face", insight: "Growing leadership signals. Consider cross-functional exposure to broaden strategic perspective." },
                    { name: "Priya Sharma", role: "Director, HR", quadrant: "Stable Anchors", image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=100&h=100&fit=crop&crop=face", insight: "Consistent performance over extended tenure. Strong cultural contributor and mentor to others." },
                    { name: "Elena Vasquez", role: "Senior Director, Legal", quadrant: "Stable Anchors", image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face", insight: "Reliable anchor with deep institutional knowledge. Consider for advisory or governance roles." },
                  ].map((person, index) => {
                    const quadrantStyles: Record<string, { bg: string; text: string; border: string }> = {
                      "Rising Stars": { bg: "bg-success/10", text: "text-success", border: "border-success/30" },
                      "Static": { bg: "bg-destructive/10", text: "text-destructive", border: "border-destructive/30" },
                      "Developing": { bg: "bg-slate-100", text: "text-slate-600", border: "border-slate-200" },
                      "Stable Anchors": { bg: "bg-indigo-50", text: "text-indigo-600", border: "border-indigo-200" },
                    };
                    const style = quadrantStyles[person.quadrant];
                    
                    return (
                      <motion.div
                        key={person.name}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className="p-6 rounded-2xl border border-border bg-card hover:shadow-lg hover:border-border/80 transition-all cursor-pointer group relative"
                      >
                        {/* Quadrant Badge - Top Right */}
                        <div className="absolute top-5 right-5">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${style.bg} ${style.text}`}>
                            <Sparkles className="w-3 h-3" />
                            {person.quadrant}
                          </span>
                        </div>

                        {/* Avatar and Info */}
                        <div className="flex items-start gap-4">
                          <img 
                            src={person.image}
                            alt={person.name}
                            className="w-14 h-14 rounded-xl object-cover group-hover:scale-105 transition-transform"
                          />
                          <div className="flex-1 min-w-0 pt-1 pr-20">
                            <h3 className="font-semibold text-foreground text-base leading-tight">{person.name}</h3>
                            <p className="text-sm text-muted-foreground mt-0.5">{person.role}</p>
                          </div>
                        </div>

                        {/* AI Insight */}
                        <div className="mt-5 pt-4 border-t border-border">
                          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                            {person.insight}
                          </p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* AI Assistant Drawer */}
      <AIAssistantDrawer
        isOpen={showAIDrawer}
        onClose={() => setShowAIDrawer(false)}
        context={`${data.title} Tier`}
        suggestedPrompts={tierPrompts[tier]}
      />
    </div>
  );
};

export default TierDetailPage;
