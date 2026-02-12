import { useState, useMemo } from "react";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import PredictedLeaderCard from "./PredictedLeaderCard";
import { AIAssistantBadge } from "./AIAssistantDrawer";

interface PredictedPageProps {
  onBack: () => void;
}

const predictedLeaders = [
  {
    id: "1",
    name: "Michael Ross",
    role: "SVP of Global Engineering",
    department: "Engineering",
    roleLevel: "SVP",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
    readinessScore: 99,
    promotionDate: "PROMOTED JAN 2024",
    leadershipType: "STRATEGIC LEADER",
    leadershipJourney: "Michael consistently moved from identifying technical debt to proposing enterprise-level architectural shifts. His pattern of 'Problem Anticipation' signaled executive readiness well prior to his SVP promotion.",
    dnaBehaviors: ["Strategic Vision", "Decision Making", "Problem Anticipation"],
    signalYear: "2021",
    promotedYear: "2024",
  },
  {
    id: "2",
    name: "Sarah Chen",
    role: "VP of Product Innovation",
    department: "Product",
    roleLevel: "VP",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face",
    readinessScore: 95,
    promotionDate: "PROMOTED JUN 2023",
    leadershipType: "CONNECTOR",
    leadershipJourney: "Sarah displayed a unique ability to bridge departmental silos early in her tenure. Her recognition data shows a high density of cross-functional praise 18 months before her VP promotion.",
    dnaBehaviors: ["Emotional Intelligence", "Team Empowerment", "Cross-Functional Influence"],
    signalYear: "2020",
    promotedYear: "2023",
  },
  {
    id: "3",
    name: "Emily Zhang",
    role: "Head of Data Science",
    department: "Engineering",
    roleLevel: "Director",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face",
    readinessScore: 94,
    promotionDate: "PROMOTED MAR 2024",
    leadershipType: "VISIONARY",
    leadershipJourney: "Emily demonstrated exceptional foresight in identifying emerging AI trends. Her ability to translate complex technical concepts into business value made her a natural choice for leadership.",
    dnaBehaviors: ["Strategic Vision", "Innovation Drive", "Technical Excellence"],
    signalYear: "2022",
    promotedYear: "2024",
  },
  {
    id: "4",
    name: "David Kim",
    role: "Director of Operations",
    department: "Operations",
    roleLevel: "Director",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face",
    readinessScore: 92,
    promotionDate: "PROMOTED NOV 2023",
    leadershipType: "OPERATIONAL EXCELLENCE",
    leadershipJourney: "David streamlined cross-regional operations, reducing cycle times by 40%. His systematic approach to problem-solving and team development accelerated his path to senior leadership.",
    dnaBehaviors: ["Decision Making", "Process Excellence", "Team Empowerment"],
    signalYear: "2021",
    promotedYear: "2023",
  },
  {
    id: "5",
    name: "Amanda Foster",
    role: "Chief Marketing Officer",
    department: "Marketing",
    roleLevel: "C-Suite",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=face",
    readinessScore: 97,
    promotionDate: "PROMOTED FEB 2024",
    leadershipType: "GROWTH DRIVER",
    leadershipJourney: "Amanda transformed digital marketing strategies, driving 150% growth in brand engagement. Her innovative campaigns and data-driven decisions positioned her as a key executive voice.",
    dnaBehaviors: ["Strategic Vision", "Innovation Drive", "Stakeholder Influence"],
    signalYear: "2020",
    promotedYear: "2024",
  },
  {
    id: "6",
    name: "James Wilson",
    role: "VP of Sales",
    department: "Sales",
    roleLevel: "VP",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face",
    readinessScore: 91,
    promotionDate: "PROMOTED DEC 2023",
    leadershipType: "REVENUE LEADER",
    leadershipJourney: "James consistently exceeded targets while building a high-performing sales culture. His mentorship approach developed three future directors within his first two years.",
    dnaBehaviors: ["Team Empowerment", "Emotional Intelligence", "Results Orientation"],
    signalYear: "2019",
    promotedYear: "2023",
  },
];

const departments = ["All Departments", "Engineering", "Product", "Operations", "Marketing", "Sales"];
const roleLevels = ["All Levels", "Director", "VP", "SVP", "C-Suite"];

const predictedPagePrompts = [
  "What patterns do proven leaders share?",
  "Which behaviors most strongly predict promotion success?",
  "How long before promotion were these leaders identified?",
  "Compare leadership DNA across departments",
  "What development gaps should we address in the current pipeline?",
];

const PredictedPage = ({ onBack }: PredictedPageProps) => {
  const [departmentFilter, setDepartmentFilter] = useState("All Departments");
  const [roleLevelFilter, setRoleLevelFilter] = useState("All Levels");

  const filteredLeaders = useMemo(() => {
    return predictedLeaders.filter((leader) => {
      const matchesDepartment = departmentFilter === "All Departments" || leader.department === departmentFilter;
      const matchesRoleLevel = roleLevelFilter === "All Levels" || leader.roleLevel === roleLevelFilter;
      return matchesDepartment && matchesRoleLevel;
    });
  }, [departmentFilter, roleLevelFilter]);

  return (
    <div className="py-12 max-w-[1100px] mx-auto">
      {/* Back button */}
      <Button
        variant="ghost"
        onClick={onBack}
        className="mb-6 -ml-2 text-muted-foreground hover:text-foreground"
      >
        <ChevronLeft className="h-4 w-4 mr-1" />
        Back
      </Button>

      {/* Header */}
      <div className="mb-10 text-center">
        <h1 className="text-4xl lg:text-5xl font-extrabold mb-4">
          <span className="text-foreground">Proven </span>
          <span className="text-primary">Predictions</span>
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Individuals who were identified as high-potential leaders and successfully transitioned into senior roles.
        </p>
      </div>

      {/* Ask AI Badge + Filters row */}
      <div className="flex items-center justify-between gap-4 mb-8">
        <AIAssistantBadge 
          context="Proven Predictions" 
          suggestedPrompts={predictedPagePrompts}
        />

        <div className="flex items-center gap-4">
          <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
            <SelectTrigger className="w-[200px] bg-white dark:bg-card">
              <SelectValue placeholder="All Departments" />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-card z-50">
              {departments.map((dept) => (
                <SelectItem key={dept} value={dept}>
                  {dept}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={roleLevelFilter} onValueChange={setRoleLevelFilter}>
            <SelectTrigger className="w-[180px] bg-white dark:bg-card">
              <SelectValue placeholder="All Levels" />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-card z-50">
              {roleLevels.map((level) => (
                <SelectItem key={level} value={level}>
                  {level}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Leader cards */}
      <div className="space-y-8">
        {filteredLeaders.length > 0 ? (
          filteredLeaders.map((leader) => (
            <PredictedLeaderCard key={leader.id} leader={leader} />
          ))
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            No leaders match the selected filters.
          </div>
        )}
      </div>
    </div>
  );
};

export default PredictedPage;