import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import Layout from "@/components/layout/Layout";
import ContentTabs from "@/components/dashboard/ContentTabs";
import FutureLeadersPage from "@/components/dashboard/FutureLeadersPage";
import LeakagePage from "@/components/dashboard/LeakagePage";
import CoveragePage from "@/components/dashboard/CoveragePage";
import PredictedPage from "@/components/dashboard/PredictedPage";
import TierDetailPage, { PersonData } from "@/components/dashboard/TierDetailPage";
import LeaderProfilePage from "@/components/dashboard/LeaderProfilePage";
import LeadershipDNAPage from "@/components/dashboard/LeadershipDNAPage";
import ProjectOxygenPage from "@/components/dashboard/ProjectOxygenPage";
import GrowthPage from "@/components/dashboard/MomentumPage";
import TalentMagnetPage from "@/components/dashboard/TalentMagnetPage";
import SignalCategoryPage from "@/components/dashboard/SignalCategoryPage";
import ProjectOxygenPageV2 from "@/components/dashboard/ProjectOxygenPageV2";

// Victoria Reynolds specific timeline - telling her leadership journey story
const victoriaTimeline = [
  {
    id: "join",
    date: "2019",
    type: "join" as const,
    title: "Joined Company",
    description: "Started as Senior Director, R&D",
  },
  {
    id: "recognition-1",
    date: "2020",
    type: "behavior" as const,
    badge: "RECOGNITION",
    title: "Cross-Team Excellence",
    description: "Recognized for outstanding collaboration across engineering and product teams.",
    recognition: {
      from: "Michael Ross",
      quote: "Victoria's ability to align teams around shared goals transformed how we deliver."
    },
    skills: ["Cross-Team Collaboration", "Initiative Taking"],
  },
  {
    id: "signal-1",
    date: "2021",
    type: "signal" as const,
    badge: "FIRST SIGNAL",
    title: "Leadership Signal Detected",
    description: "First indicators of executive leadership potential identified. Entered Detected tier.",
    evidence: "Demonstrated strategic thinking beyond immediate scope and influenced key business decisions.",
  },
  {
    id: "recognition-2",
    date: "2022",
    type: "behavior" as const,
    badge: "RECOGNITION",
    title: "Mentorship Impact",
    description: "Praised for developing high-potential team members into leadership roles.",
    recognition: {
      from: "Amanda Foster",
      quote: "Victoria's mentorship of junior leaders has become a model for our organization."
    },
    skills: ["Develops Others", "Coaching Excellence"],
  },
  {
    id: "signal-2",
    date: "2023",
    type: "signal" as const,
    badge: "ADVANCING",
    title: "Advancing Tier Achieved",
    description: "Progressed to Advancing tier with consistent demonstration of strategic leadership.",
    evidence: "Led successful org restructure and delivered 40% efficiency gains. Operating beyond current scope.",
  },
  {
    id: "recognition-3",
    date: "2024",
    type: "behavior" as const,
    badge: "RECOGNITION",
    title: "Strategic Vision Recognition",
    description: "Multiple recognitions for long-term strategic thinking and market foresight.",
    recognition: {
      from: "Elena Rodriguez",
      quote: "Her ability to translate market trends into actionable strategy is exceptional."
    },
    skills: ["Strategic Vision", "Business Acumen"],
  },
  {
    id: "signal-3",
    date: "Q1 2025",
    type: "signal" as const,
    badge: "ACCELERATE",
    title: "Accelerate Tier Achieved",
    description: "Reached Accelerate tier – demonstrating full readiness for VP role.",
    evidence: "Exhibits 8 of 10 key VP behaviors. Recognized by 15+ cross-functional leaders. Signal accelerating.",
  },
  {
    id: "gap-analysis",
    date: "Q2 2025",
    type: "gap" as const,
    badge: "GAP ANALYSIS",
    title: "Gap Analysis",
    description: "Critical competency gaps identified for VP transition.",
    gaps: ["External Network Building", "Industry Presence", "Board-Level Communication"],
  },
  {
    id: "target-role",
    date: "Q4 2025",
    type: "target" as const,
    badge: "TARGET ROLE",
    title: "VP Target",
    description: "Projected to reach VP level based on current trajectory and gap closure.",
  },
];

// Convert PersonData to LeaderProfile format
const convertToLeaderProfile = (person: PersonData) => {
  const isVictoria = person.name === "Victoria Reynolds";
  
  return {
    id: person.name.toLowerCase().replace(/\s+/g, '-'),
    name: person.name,
    role: person.role,
    image: person.image,
    readinessScore: person.readiness,
    predictedRole: person.predictedRole,
    status: "projected",
    tenure: isVictoria ? "6 years" : "5 years",
    department: person.department,
    currentLevel: "Director",
    timeInRole: "2.5 years",
    timeline: isVictoria ? victoriaTimeline : [
      {
        id: "join",
        date: "2019",
        type: "join" as const,
        title: "Joined Company",
        description: `Started as ${person.role}`,
      },
      {
        id: "signal-1",
        date: "2022",
        type: "signal" as const,
        badge: "FIRST SIGNAL",
        title: "Leadership Signal Detected",
        description: "First indicators of executive leadership potential identified.",
      },
      {
        id: "signal-2",
        date: "2024",
        type: "signal" as const,
        badge: "STRONG SIGNAL",
        title: "Strong Signal Confirmed",
        description: "Consistent demonstration of strategic thinking and cross-functional leadership.",
      },
    ],
  };
};

const Index = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState("future-leaders");
  const [selectedTier, setSelectedTier] = useState<"monitor" | "nurture" | "accelerate" | null>(null);
  const [selectedPerson, setSelectedPerson] = useState<PersonData | null>(null);
  const [showPredicted, setShowPredicted] = useState(false);
  const [selectedSignal, setSelectedSignal] = useState<string | null>(null);
  const [oxygenVersion, setOxygenVersion] = useState("v1");

  const handleTierClick = (tier: "monitor" | "nurture" | "accelerate") => {
    setSelectedTier(tier);
    setSelectedPerson(null);
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setSelectedTier(null);
    setSelectedPerson(null);
    setShowPredicted(false);
    setSelectedSignal(null);
  };

  const handleBackFromTier = () => {
    setSelectedTier(null);
    setSelectedPerson(null);
  };

  const handlePersonClick = (person: PersonData) => {
    setSelectedPerson(person);
  };

  const handleBackFromProfile = () => {
    setSelectedPerson(null);
  };

  const handleViewPredicted = () => {
    setShowPredicted(true);
  };

  const handleBackFromPredicted = () => {
    setShowPredicted(false);
  };

  const handleSignalClick = (signalId: string) => {
    setSelectedSignal(signalId);
  };

  const handleBackFromSignal = () => {
    setSelectedSignal(null);
  };

  // Scroll to top when tier, person, signal, or predicted changes
  useEffect(() => {
    if (selectedTier || selectedPerson || showPredicted || selectedSignal) {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTo({ top: 0, behavior: "auto" });
      }
      window.scrollTo({ top: 0, behavior: "auto" });
    }
  }, [selectedTier, selectedPerson, showPredicted, selectedSignal]);

  return (
    <Layout>
      <div ref={scrollContainerRef} className="h-full bg-card flex flex-col overflow-hidden">
        <ContentTabs activeTab={activeTab} onTabChange={handleTabChange} oxygenVersion={oxygenVersion} onOxygenVersionChange={setOxygenVersion} />
        
        {/* Future Leaders Tab */}
        {activeTab === "future-leaders" && !selectedTier && !showPredicted && !selectedSignal && (
          <div className="flex-1 min-h-0 overflow-y-auto">
            <FutureLeadersPage 
              onTierClick={handleTierClick}
              onViewPredicted={handleViewPredicted}
              onSignalClick={handleSignalClick}
            />
          </div>
        )}

        {activeTab === "future-leaders" && selectedSignal && (
          <div className="flex-1 min-h-0">
            <SignalCategoryPage 
              categoryId={selectedSignal} 
              onBack={handleBackFromSignal} 
            />
          </div>
        )}

        {activeTab === "future-leaders" && !selectedTier && !selectedSignal && showPredicted && (
          <div className="flex-1 min-h-0 overflow-y-auto bg-page-background">
            <PredictedPage onBack={handleBackFromPredicted} />
          </div>
        )}

        {activeTab === "future-leaders" && selectedTier && !selectedPerson && (
          <div className="flex-1 min-h-0 overflow-y-auto">
            <TierDetailPage 
              tier={selectedTier} 
              onBack={handleBackFromTier} 
              onPersonClick={handlePersonClick}
            />
          </div>
        )}

        {activeTab === "future-leaders" && selectedTier && selectedPerson && (
          <div className="flex-1 min-h-0 overflow-y-auto">
            <LeaderProfilePage 
              leader={convertToLeaderProfile(selectedPerson)} 
              onBack={handleBackFromProfile} 
            />
          </div>
        )}

        {/* Genome Tab */}
        {activeTab === "genome" && (
          <div className="flex-1 min-h-0">
            <LeadershipDNAPage />
          </div>
        )}

        {/* Project Oxygen Tab */}
        {activeTab === "project-oxygen" && oxygenVersion === "v1" && (
          <div className="flex-1 min-h-0">
            <ProjectOxygenPage />
          </div>
        )}

        {activeTab === "project-oxygen" && oxygenVersion === "v2" && (
          <div className="flex-1 min-h-0">
            <ProjectOxygenPageV2 />
          </div>
        )}

        {/* Talent Magnet Tab */}
        {activeTab === "talent-magnet" && (
          <div className="flex-1 min-h-0">
            <TalentMagnetPage />
          </div>
        )}

        {/* Growth Tab — hidden, kept for future use */}
        {/* activeTab === "momentum" && (
          <div className="flex-1 min-h-0">
            <GrowthPage />
          </div>
        ) */}

        {/* Leakage Tab */}
        {activeTab === "leakage" && (
          <div className="flex-1 min-h-0">
            <LeakagePage />
          </div>
        )}

        {/* Coverage Tab */}
        {activeTab === "coverage" && (
          <div className="flex-1 min-h-0">
            <CoveragePage />
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Index;
