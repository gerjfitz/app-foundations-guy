import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import TrajectoryGraph from "./TrajectoryGraph";
import TalentMatrix from "./TalentMatrix";
import PipelineLeaderCard from "./PipelineLeaderCard";
import LeaderProfilePage from "./LeaderProfilePage";

interface ActivePipelinePageProps {
  onBack: () => void;
  onViewPredicted: () => void;
}

const trajectoryPeople = [
  { id: "1", name: "Sarah Chen", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face", level: "projected" as const, position: 25 },
  { id: "2", name: "Marcus Johnson", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face", level: "projected" as const, position: 35 },
  { id: "3", name: "Priya Patel", image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=face", level: "advancing" as const, position: 45 },
  { id: "4", name: "Tom Baker", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face", level: "advancing" as const, position: 55 },
  { id: "5", name: "Daniela Russo", image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face", level: "advancing" as const, position: 65 },
  { id: "6", name: "James Wilson", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face", level: "detected" as const, position: 50 },
  { id: "7", name: "Elena Rodriguez", image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&crop=face", level: "detected" as const, position: 65 },
  { id: "8", name: "Liam O'Connor", image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop&crop=face", level: "detected" as const, position: 80 },
];

const matrixPeople = [
  { id: "1", name: "Sarah Chen", role: "Director, Product Strategy", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face", tenure: 4.5, readinessScore: 96 },
  { id: "2", name: "Sofia Garcia", role: "HR Business Partner", image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=face", tenure: 3, readinessScore: 88 },
  { id: "3", name: "Daniela Russo", role: "Head of Brand", image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face", tenure: 7, readinessScore: 92 },
  { id: "4", name: "Marcus Johnson", role: "Director of Engineering", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face", tenure: 8.5, readinessScore: 82 },
  { id: "5", name: "Priya Patel", role: "Sr. Engineering Manager", image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&crop=face", tenure: 8, readinessScore: 72 },
  { id: "6", name: "Tom Baker", role: "Principal Architect", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face", tenure: 9, readinessScore: 74 },
  { id: "7", name: "James Wilson", role: "Product Lead", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face", tenure: 2, readinessScore: 68 },
  { id: "8", name: "Elena Rodriguez", role: "Regional VP Sales", image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop&crop=face", tenure: 5.5, readinessScore: 64 },
  { id: "9", name: "Liam O'Connor", role: "Sales Director", image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&h=200&fit=crop&crop=face", tenure: 1, readinessScore: 58 },
];

const pipelineLeaders = [
  { id: "1", name: "Sarah Chen", role: "Director, Product Strategy", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face", readinessScore: 96, predictedRole: "VP", status: "projected" as const },
  { id: "2", name: "Marcus Johnson", role: "Director of Engineering", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face", readinessScore: 92, predictedRole: "SVP", status: "projected" as const },
  { id: "3", name: "Sofia Garcia", role: "HR Business Partner", image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=face", readinessScore: 88, predictedRole: "Director", status: "advancing" as const },
  { id: "4", name: "Daniela Russo", role: "Head of Brand", image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face", readinessScore: 85, predictedRole: "VP", status: "advancing" as const },
  { id: "5", name: "Priya Patel", role: "Sr. Engineering Manager", image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&crop=face", readinessScore: 55, predictedRole: "Director", status: "advancing" as const },
  { id: "6", name: "Tom Baker", role: "Principal Architect", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face", readinessScore: 76, predictedRole: "Distinguished", status: "detected" as const },
  { id: "7", name: "James Wilson", role: "Product Lead", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face", readinessScore: 45, predictedRole: "Principal", status: "detected" as const },
  { id: "8", name: "Elena Rodriguez", role: "Regional VP Sales", image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop&crop=face", readinessScore: 58, predictedRole: "SVP", status: "detected" as const },
  { id: "9", name: "Liam O'Connor", role: "Sales Director", image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&h=200&fit=crop&crop=face", readinessScore: 38, predictedRole: "VP", status: "detected" as const },
];

// Full leader profiles with timeline data
const leaderProfiles = {
  "1": {
    id: "1",
    name: "Sarah Chen",
    role: "Director, Product Strategy",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face",
    readinessScore: 96,
    predictedRole: "VP",
    status: "Ready Now",
    tenure: "5.5 years",
    department: "Product",
    currentLevel: "Director",
    timeInRole: "1.8 Years",
    timeline: [
      { 
        id: "t1", 
        date: "AUG 2019", 
        type: "join" as const, 
        title: "Joined TechCorp", 
        description: "Hired as Senior Product Manager to lead the Platform Team.",
        evidence: "Sarah joined with 4 years of prior experience at a fast-growing startup, bringing deep expertise in agile methodologies and user-centric product development.",
        skills: ["Product Strategy", "Agile Methodologies", "Team Leadership"]
      },
      { 
        id: "t2", 
        date: "FEB 2020", 
        type: "behavior" as const, 
        badge: "LEADERSHIP BEHAVIOR", 
        title: "Agile Transformation", 
        description: "Received recognition from Engineering Leads for implementing new squad model reducing shipping time by 40%.",
        evidence: "Sarah redesigned the entire product development workflow, introducing cross-functional squads that improved collaboration between engineering, design, and product. The new model reduced feature delivery time from 6 weeks to under 4 weeks.",
        recognition: { from: "James Wilson (VP Engineering)", quote: "Sarah's squad model transformed how we ship products. She didn't just implement a process—she changed our culture." },
        skills: ["Process Innovation", "Change Management", "Cross-Functional Leadership"]
      },
      { 
        id: "t3", 
        date: "NOV 2020", 
        type: "signal" as const, 
        badge: "FIRST SIGNAL", 
        title: "Early VP Indicator", 
        description: "Demonstrated rare ability to align engineering and sales during 'Project Apollo'.",
        evidence: "Cross-functional unification is a primary indicator for VP readiness. Sarah achieved this 2 years ahead of cohort average. She mediated between competing priorities and created a shared roadmap that satisfied both teams.",
        recognition: { from: "Elena Rodriguez (CMO)", quote: "The way you navigated the conflict between Sales and Eng today was masterful. You didn't just compromise; you found a third way." },
        skills: ["Strategic Vision", "Cross-Collaboration", "Conflict Resolution", "Executive Communication"]
      },
      { 
        id: "t4", 
        date: "MAR 2021", 
        type: "promotion" as const, 
        badge: "PROMOTION", 
        title: "Promoted to Director", 
        description: "Expanded scope to oversee 3 product lines and a team of 25.",
        evidence: "Promotion came 18 months ahead of typical timeline, driven by exceptional performance and strong peer advocacy. Sarah's team had the highest engagement scores in the company.",
        recognition: { from: "Michael Ross (SVP Product)", quote: "Sarah's promotion was the fastest I've seen in my 15 years here. She earned every bit of it through consistent delivery and authentic leadership." },
        skills: ["People Leadership", "Strategic Planning", "Portfolio Management"]
      },
      { 
        id: "t5", 
        date: "JUL 2022", 
        type: "behavior" as const, 
        badge: "LEADERSHIP BEHAVIOR", 
        title: "Talent Magnet", 
        description: "Multiple peers recognized her for building a new data science vertical from scratch.",
        evidence: "Sarah recruited and developed a world-class data science team of 8 specialists, attracting talent from top tech companies. The team delivered $12M in measurable business impact within their first year.",
        recognition: { from: "Emily Zhang (Head of Data Science)", quote: "Sarah gave me the opportunity to build something from nothing. Her vision for data-driven product development was years ahead of the industry." },
        skills: ["Talent Acquisition", "Team Building", "Technical Strategy", "Mentorship"]
      },
      { 
        id: "t6", 
        date: "SEP 2023", 
        type: "signal" as const, 
        badge: "STRONG SIGNAL", 
        title: "Strong Executive Signal", 
        description: "Led the annual strategy planning, effectively standing in for the VP.",
        evidence: "When the VP was on extended leave, Sarah stepped up to lead the entire product organization's strategic planning. She presented to the board and secured $25M in additional investment for new initiatives.",
        recognition: { from: "CEO David Park", quote: "Sarah's board presentation was exceptional. She demonstrated the strategic thinking and executive presence we need at the VP level. I'm excited to see her continue to grow." },
        skills: ["Executive Presence", "Strategic Planning", "Board Communication", "Investment Justification"]
      },
      { 
        id: "t7", 
        date: "JAN 2024", 
        type: "behavior" as const, 
        badge: "LEADERSHIP BEHAVIOR", 
        title: "Customer Champion", 
        description: "Established new customer advisory program that improved NPS by 23 points.",
        evidence: "Sarah created a direct line between enterprise customers and the product team, personally conducting monthly executive briefings. This initiative transformed customer relationships and informed the product roadmap.",
        recognition: { from: "Amanda Foster (Chief Marketing Officer)", quote: "Sarah's customer obsession is infectious. She's made customer-centricity a core part of our product DNA." },
        skills: ["Customer Focus", "Executive Relationships", "Product-Market Fit"]
      },
    ],
  },
  "2": {
    id: "2",
    name: "Marcus Johnson",
    role: "Director of Engineering",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face",
    readinessScore: 92,
    predictedRole: "SVP",
    status: "Close to Ready",
    tenure: "8.5 years",
    department: "Engineering",
    currentLevel: "Director",
    timeInRole: "3.2 Years",
    timeline: [
      { id: "t1", date: "JAN 2016", type: "join" as const, title: "Joined as Engineer", description: "Started as Senior Software Engineer on the Core Platform team." },
      { id: "t2", date: "MAR 2018", type: "promotion" as const, badge: "PROMOTION", title: "Promoted to Tech Lead", description: "Led a team of 8 engineers on critical infrastructure projects." },
      { id: "t3", date: "JUN 2020", type: "behavior" as const, badge: "LEADERSHIP BEHAVIOR", title: "Crisis Leadership", description: "Navigated major system outage, coordinating cross-team response.", evidence: "Demonstrated exceptional composure under pressure and clear communication skills.", skills: ["Crisis Management", "Communication"] },
      { id: "t4", date: "SEP 2021", type: "promotion" as const, badge: "PROMOTION", title: "Promoted to Director", description: "Now overseeing 3 engineering teams with 40+ engineers." },
      { id: "t5", date: "DEC 2023", type: "signal" as const, badge: "STRONG SIGNAL", title: "Executive Visibility", description: "Presented technical roadmap directly to the board.", recognition: { from: "CTO", quote: "Marcus has the rare ability to translate complex technical concepts for any audience." }, skills: ["Executive Presence", "Strategic Thinking"] },
    ],
  },
};

// Generate default profile for leaders without specific data
const getLeaderProfile = (leader: typeof pipelineLeaders[0]) => {
  const profile = leaderProfiles[leader.id as keyof typeof leaderProfiles];
  if (profile) return profile;
  
  return {
    ...leader,
    status: leader.status === "projected" ? "Projected" : leader.status === "advancing" ? "Advancing" : "Detected",
    tenure: "3 years",
    department: "Operations",
    currentLevel: leader.role.split(',')[0].replace(/^(Sr\.|Senior)\s*/i, ''),
    timeInRole: "2.1 Years",
    timeline: [
      { id: "t1", date: "JAN 2022", type: "join" as const, title: `Joined as ${leader.role}`, description: "Started in current role with focus on strategic initiatives." },
      { id: "t2", date: "JUN 2023", type: "behavior" as const, badge: "LEADERSHIP BEHAVIOR", title: "Team Excellence", description: "Recognized for building high-performing team culture." },
      { id: "t3", date: "DEC 2024", type: "signal" as const, badge: "FIRST SIGNAL", title: "Leadership Potential", description: "Demonstrated emerging executive capabilities.", evidence: "Shows strong potential for advancement based on peer recognition patterns.", skills: ["Leadership", "Strategy"] },
    ],
  };
};

const ActivePipelinePage = ({ onBack, onViewPredicted }: ActivePipelinePageProps) => {
  const [viewMode, setViewMode] = useState<"trajectory" | "matrix">("trajectory");
  const [selectedLeader, setSelectedLeader] = useState<typeof pipelineLeaders[0] | null>(null);

  const handleSelectLeader = (leader: typeof pipelineLeaders[0]) => {
    setSelectedLeader(leader);
    // Scroll to top when navigating to profile
    window.scrollTo({ top: 0, behavior: "auto" });
    const container = document.getElementById("app-scroll-container");
    container?.scrollTo({ top: 0, behavior: "auto" });
  };

  if (selectedLeader) {
    const profile = getLeaderProfile(selectedLeader);
    return (
      <LeaderProfilePage
        leader={profile}
        onBack={() => setSelectedLeader(null)}
      />
    );
  }

  return (
    <div className="py-12 bg-page-background min-h-full">
      <div className="max-w-[1100px] mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-sm font-semibold tracking-widest text-muted-foreground uppercase mb-4">
            Talent Pipeline
          </p>
          <h1 className="text-4xl lg:text-5xl font-extrabold mb-4">
            <span className="text-foreground">Spot the Leaders Who Will</span>
            <br />
            <span className="text-foreground">Shape </span>
            <span
              style={{
                background: "linear-gradient(135deg, hsl(var(--accent-magenta)) 0%, hsl(var(--primary)) 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              What's Next
            </span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Predictive, evidence-based visibility into top leadership potential.
          </p>
        </div>

        {/* View toggle - Switch style, centered */}
        <div className="flex justify-center mb-12 mt-4">
          <div className="inline-flex bg-muted rounded-full p-1">
            <button
              onClick={() => setViewMode("trajectory")}
              className={cn(
                "px-6 py-2 text-sm font-semibold rounded-full transition-all",
                viewMode === "trajectory" 
                  ? "bg-primary text-primary-foreground shadow-sm" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              TRAJECTORY
            </button>
            <button
              onClick={() => setViewMode("matrix")}
              className={cn(
                "px-6 py-2 text-sm font-semibold rounded-full transition-all",
                viewMode === "matrix" 
                  ? "bg-primary text-primary-foreground shadow-sm" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              TALENT MATRIX
            </button>
          </div>
        </div>

        {/* Charts */}
        {viewMode === "trajectory" && (
          <div className="mb-12">
            <div className="text-center mb-6">
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Track leadership readiness progression over time. Each bar represents a candidate's growth trajectory from emerging to ready status.
              </p>
            </div>
            <TrajectoryGraph people={trajectoryPeople} />
          </div>
        )}

        {viewMode === "matrix" && (
          <div className="mb-12">
            <div className="text-center mb-6">
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Plot candidates by tenure and readiness score to identify high-potential leaders and succession planning opportunities.
              </p>
            </div>
            <TalentMatrix people={matrixPeople} />
          </div>
        )}

        {/* Leader Cards */}
        <div className="mt-12">
          <h2 className="text-xl font-bold text-foreground mb-6 text-center">Pipeline Leaders</h2>
          <div className="grid grid-cols-3 gap-6">
            {pipelineLeaders.map((leader) => (
              <div key={leader.id} onClick={() => handleSelectLeader(leader)} className="cursor-pointer">
                <PipelineLeaderCard leader={leader} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivePipelinePage;
