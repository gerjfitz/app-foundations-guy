import { cn } from "@/lib/utils";
import { Users, Building2 } from "lucide-react";

interface Candidate {
  name: string;
  role: string;
  image: string;
  readinessPercent: number;
}

interface Department {
  id: string;
  name: string;
  targetRole: string;
  readinessPercent: number;
  candidates: Candidate[];
}

const departments: Department[] = [
  { 
    id: "engineering", 
    name: "Engineering", 
    targetRole: "VP Engineering",
    readinessPercent: 88,
    candidates: [
      { name: "Sarah Chen", role: "Sr. Director Engineering", image: "https://i.pravatar.cc/150?img=1", readinessPercent: 92 },
      { name: "Michael Torres", role: "Director Platform", image: "https://i.pravatar.cc/150?img=2", readinessPercent: 78 },
      { name: "Kevin Liu", role: "Principal Engineer", image: "https://i.pravatar.cc/150?img=11", readinessPercent: 71 },
    ]
  },
  { 
    id: "design", 
    name: "Design", 
    targetRole: "VP Design",
    readinessPercent: 84,
    candidates: [
      { name: "Emily Zhang", role: "Sr. Design Director", image: "https://i.pravatar.cc/150?img=5", readinessPercent: 88 },
    ]
  },
  { 
    id: "sales", 
    name: "Sales", 
    targetRole: "VP Sales",
    readinessPercent: 67,
    candidates: [
      { name: "James Wilson", role: "Director of Sales", image: "https://i.pravatar.cc/150?img=3", readinessPercent: 72 },
      { name: "Rachel Adams", role: "Sr. Sales Manager", image: "https://i.pravatar.cc/150?img=9", readinessPercent: 61 },
    ]
  },
  { 
    id: "customer-success", 
    name: "Customer Success", 
    targetRole: "VP Customer Success",
    readinessPercent: 61,
    candidates: [
      { name: "Lisa Park", role: "Director CS", image: "https://i.pravatar.cc/150?img=10", readinessPercent: 65 },
      { name: "Tom Bradley", role: "Sr. CS Manager", image: "https://i.pravatar.cc/150?img=12", readinessPercent: 58 },
    ]
  },
  { 
    id: "marketing", 
    name: "Marketing", 
    targetRole: "VP Marketing",
    readinessPercent: 58,
    candidates: [
      { name: "David Kim", role: "Sr. Marketing Director", image: "https://i.pravatar.cc/150?img=4", readinessPercent: 62 },
    ]
  },
  { 
    id: "finance", 
    name: "Finance", 
    targetRole: "VP Finance",
    readinessPercent: 48,
    candidates: [
      { name: "Jennifer Liu", role: "Finance Director", image: "https://i.pravatar.cc/150?img=6", readinessPercent: 52 },
    ]
  },
  { 
    id: "operations", 
    name: "Operations", 
    targetRole: "VP Operations",
    readinessPercent: 45,
    candidates: [
      { name: "Robert Chen", role: "Director Ops", image: "https://i.pravatar.cc/150?img=7", readinessPercent: 48 },
    ]
  },
  { 
    id: "it-security", 
    name: "IT & Security", 
    targetRole: "VP IT / CISO",
    readinessPercent: 43,
    candidates: [
      { name: "Alex Thompson", role: "Security Director", image: "https://i.pravatar.cc/150?img=8", readinessPercent: 45 },
    ]
  },
  { 
    id: "hr", 
    name: "HR", 
    targetRole: "VP People",
    readinessPercent: 31,
    candidates: []
  },
];

const getCoverageStatus = (count: number) => {
  if (count >= 2) return {
    bg: "bg-emerald-500",
    bgLight: "bg-emerald-500/10",
    text: "text-emerald-600",
    border: "border-emerald-500/20",
    label: "Strong"
  };
  if (count === 1) return {
    bg: "bg-amber-500",
    bgLight: "bg-amber-500/10",
    text: "text-amber-600",
    border: "border-amber-500/20",
    label: "Limited"
  };
  return {
    bg: "bg-slate-400",
    bgLight: "bg-slate-400/10",
    text: "text-slate-500",
    border: "border-slate-400/20",
    label: "No Coverage"
  };
};

const getReadinessColor = (percent: number) => {
  if (percent >= 70) return {
    bg: "bg-emerald-500",
    bgLight: "bg-emerald-500/10",
    text: "text-emerald-600",
    border: "border-emerald-500/20",
    label: "Ready"
  };
  if (percent >= 50) return {
    bg: "bg-amber-500",
    bgLight: "bg-amber-500/10",
    text: "text-amber-600",
    border: "border-amber-500/20",
    label: "Developing"
  };
  return {
    bg: "bg-slate-400",
    bgLight: "bg-slate-400/10",
    text: "text-slate-500",
    border: "border-slate-400/20",
    label: "At Risk"
  };
};

const ReadinessPage = () => {
  const sortedDepartments = [...departments].sort((a, b) => b.candidates.length - a.candidates.length);
  
  const totalFutureLeaders = departments.reduce((sum, d) => sum + d.candidates.length, 0);
  const coveredDepts = departments.filter(d => d.candidates.length >= 2).length;
  const atRiskDepts = departments.filter(d => d.candidates.length === 0).length;

  return (
    <div className="min-h-full bg-page-background">
      <div className="max-w-[1100px] mx-auto">
        {/* Hero Section */}
        <div className="text-center py-12 mb-4">
          <p className="text-sm font-semibold tracking-widest text-muted-foreground uppercase mb-4">
            Succession Planning
          </p>
          <h1 className="text-4xl lg:text-5xl font-extrabold text-foreground mb-4">
            Coverage
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Future leaders mapped to each department for leadership succession.
          </p>
        </div>

        {/* Summary Stats - Matching Leakage page style */}
        <div className="mb-10 bg-card border border-border rounded-2xl p-8">
          <div className="grid grid-cols-3 gap-8">
            <div className="text-center border-r border-border">
              <div className="flex justify-center mb-4">
                <div className="p-2.5 rounded-lg bg-primary/10">
                  <Users className="h-6 w-6 text-primary" />
                </div>
              </div>
              <div className="flex items-center justify-center mb-1">
                <span className="text-5xl font-bold text-foreground">
                  {totalFutureLeaders}
                </span>
              </div>
              <p className="text-sm font-medium text-foreground mb-1">Future Leaders in Pool</p>
              <p className="text-xs text-muted-foreground">Total candidates mapped</p>
            </div>

            <div className="text-center border-r border-border">
              <div className="flex justify-center mb-4">
                <div className="p-2.5 rounded-lg bg-emerald-500/10">
                  <Building2 className="h-6 w-6 text-emerald-500" />
                </div>
              </div>
              <div className="flex items-center justify-center mb-1">
                <span className="text-5xl font-bold text-emerald-500">
                  {coveredDepts}
                </span>
              </div>
              <p className="text-sm font-medium text-foreground mb-1">Depts with 2+ Successors</p>
              <p className="text-xs text-muted-foreground">Strong succession coverage</p>
            </div>

            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="p-2.5 rounded-lg bg-slate-400/10">
                  <Building2 className="h-6 w-6 text-slate-400" />
                </div>
              </div>
              <div className="flex items-center justify-center mb-1">
                <span className="text-5xl font-bold text-slate-500">
                  {atRiskDepts}
                </span>
              </div>
              <p className="text-sm font-medium text-foreground mb-1">Depts with No Coverage</p>
              <p className="text-xs text-muted-foreground">Requires immediate attention</p>
            </div>
          </div>
        </div>

        {/* Treemap Visualization */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold text-foreground mb-2">Future Leaders by Department</h2>
          <p className="text-sm text-muted-foreground mb-6">Number of future leaders mapped to each department</p>
          
          <div className="flex flex-col gap-3">
            {/* Row 1: Strong coverage (2+ people) - Green */}
            <div className="grid grid-cols-10 gap-3 h-[140px]">
              {/* Engineering - 3 people, largest */}
              <div className="col-span-4 rounded-xl p-4 flex flex-col justify-between bg-gradient-to-br from-emerald-400 to-emerald-500">
                <div>
                  <p className="font-semibold text-white text-lg">Engineering</p>
                  <p className="text-white/80 text-sm">VP Engineering</p>
                </div>
                <div>
                  <p className="text-4xl font-bold text-white">3</p>
                  <p className="text-white/80 text-sm">future leaders</p>
                </div>
              </div>
              
              {/* Sales - 2 people */}
              <div className="col-span-3 rounded-xl p-4 flex flex-col justify-between bg-gradient-to-br from-emerald-400 to-emerald-500">
                <div>
                  <p className="font-semibold text-white text-lg">Sales</p>
                  <p className="text-white/80 text-sm">VP Sales</p>
                </div>
                <div>
                  <p className="text-4xl font-bold text-white">2</p>
                  <p className="text-white/80 text-sm">future leaders</p>
                </div>
              </div>
              
              {/* Customer Success - 2 people (same size as Sales) */}
              <div className="col-span-3 rounded-xl p-4 flex flex-col justify-between bg-gradient-to-br from-emerald-400 to-emerald-500">
                <div>
                  <p className="font-semibold text-white">Customer Success</p>
                  <p className="text-white/80 text-sm">VP CS</p>
                </div>
                <div>
                  <p className="text-4xl font-bold text-white">2</p>
                  <p className="text-white/80 text-sm">future leaders</p>
                </div>
              </div>
            </div>
            
            {/* Row 2: Limited coverage (1 person) - Amber + HR (0) */}
            <div className="grid grid-cols-6 gap-3 h-[120px]">
              {/* Design - 1 person */}
              <div className="rounded-xl p-4 flex flex-col justify-between bg-gradient-to-br from-amber-400 to-amber-500">
                <div>
                  <p className="font-semibold text-white">Design</p>
                  <p className="text-white/80 text-sm">VP Design</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-white">1</p>
                  <p className="text-white/80 text-sm">future leader</p>
                </div>
              </div>
              
              {/* Marketing - 1 person */}
              <div className="rounded-xl p-4 flex flex-col justify-between bg-gradient-to-br from-amber-400 to-amber-500">
                <div>
                  <p className="font-semibold text-white">Marketing</p>
                  <p className="text-white/80 text-sm">VP Marketing</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-white">1</p>
                  <p className="text-white/80 text-sm">future leader</p>
                </div>
              </div>
              
              {/* Finance - 1 person */}
              <div className="rounded-xl p-4 flex flex-col justify-between bg-gradient-to-br from-amber-400 to-amber-500">
                <div>
                  <p className="font-semibold text-white">Finance</p>
                  <p className="text-white/80 text-sm">VP Finance</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-white">1</p>
                  <p className="text-white/80 text-sm">future leader</p>
                </div>
              </div>
              
              {/* Operations - 1 person */}
              <div className="rounded-xl p-4 flex flex-col justify-between bg-gradient-to-br from-amber-400 to-amber-500">
                <div>
                  <p className="font-semibold text-white">Operations</p>
                  <p className="text-white/80 text-sm">VP Ops</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-white">1</p>
                  <p className="text-white/80 text-sm">future leader</p>
                </div>
              </div>
              
              {/* IT & Security - 1 person */}
              <div className="rounded-xl p-4 flex flex-col justify-between bg-gradient-to-br from-amber-400 to-amber-500">
                <div>
                  <p className="font-semibold text-white">IT & Security</p>
                  <p className="text-white/80 text-sm">CISO</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-white">1</p>
                  <p className="text-white/80 text-sm">future leader</p>
                </div>
              </div>
              
              {/* HR - 0 people - Light grey with black text */}
              <div className="rounded-xl p-4 flex flex-col justify-between bg-slate-200">
                <div>
                  <p className="font-semibold text-slate-800">HR</p>
                  <p className="text-slate-600 text-sm">VP People</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-slate-800">0</p>
                  <p className="text-slate-600 text-sm">future leaders</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section Title */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-foreground mb-2">Department Succession Coverage</h2>
          <p className="text-sm text-muted-foreground">Each department's target role and mapped future leaders</p>
        </div>

        {/* Legend */}
        <div className="mb-6 flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-emerald-500" />
            <span className="text-sm text-muted-foreground">Strong (2+ successors)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-amber-500" />
            <span className="text-sm text-muted-foreground">Limited (1 successor)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-slate-400" />
            <span className="text-sm text-muted-foreground">No Coverage (0 successors)</span>
          </div>
        </div>

        {/* Department Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {sortedDepartments.map((dept) => {
            const coverageStatus = getCoverageStatus(dept.candidates.length);
            const readinessColors = getReadinessColor(dept.readinessPercent);
            
            return (
              <div
                key={dept.id}
                className="bg-card rounded-xl border border-border overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* Card Header */}
                <div className="p-5 border-b border-border/50">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-lg text-foreground">{dept.name}</h3>
                      <p className="text-sm text-muted-foreground mt-0.5">{dept.targetRole}</p>
                    </div>
                    <span className={cn(
                      "px-3 py-1 rounded-full text-xs font-medium",
                      coverageStatus.bgLight,
                      coverageStatus.text
                    )}>
                      {coverageStatus.label}
                    </span>
                  </div>
                  
                  {/* Coverage count */}
                  <div className="flex items-center gap-3">
                    <div className={cn("h-10 w-10 rounded-lg flex items-center justify-center", coverageStatus.bgLight)}>
                      <span className={cn("text-xl font-bold", coverageStatus.text)}>
                        {dept.candidates.length}
                      </span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {dept.candidates.length === 1 ? 'future leader mapped' : 'future leaders mapped'}
                    </span>
                  </div>
                </div>

                {/* Mapped Candidates */}
                <div className="p-5">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
                    Mapped Successors
                  </p>
                  
                  {dept.candidates.length > 0 ? (
                    <div className="space-y-3">
                      {dept.candidates.map((candidate, idx) => {
                        return (
                          <div key={idx} className="flex items-center gap-3">
                            <img 
                              src={candidate.image} 
                              alt={candidate.name}
                              className="h-9 w-9 rounded-full object-cover border-2 border-background shadow-sm"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-foreground truncate">{candidate.name}</p>
                              <p className="text-xs text-muted-foreground truncate">{candidate.role}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center py-4 bg-muted/30 rounded-lg border border-dashed border-border">
                      <p className="text-sm text-muted-foreground">No successors identified</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ReadinessPage;
