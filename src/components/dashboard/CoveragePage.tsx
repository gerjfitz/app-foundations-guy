import { motion } from "framer-motion";
import { LayoutGrid } from "lucide-react";
import { cn } from "@/lib/utils";
import SignalAISidebar from "./SignalAISidebar";

// Department data with target roles and mapped future leaders
const departmentData = [
  { dept: "Engineering", targetRole: "VP Engineering", count: 3, status: "strong" as const,
    successors: [
      { name: "Sarah Chen", role: "Sr. Director Engineering", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face" },
      { name: "Michael Torres", role: "Director Platform", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face" },
      { name: "Kevin Liu", role: "Principal Engineer", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face" },
    ]},
  { dept: "Sales", targetRole: "VP Sales", count: 2, status: "strong" as const,
    successors: [
      { name: "James Wilson", role: "Director of Sales", image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop&crop=face" },
      { name: "Rachel Adams", role: "Sr. Sales Manager", image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=100&h=100&fit=crop&crop=face" },
    ]},
  { dept: "Customer Success", targetRole: "VP Customer Success", count: 2, status: "strong" as const,
    successors: [
      { name: "Lisa Park", role: "Director CS", image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop&crop=face" },
      { name: "Tom Bradley", role: "Sr. CS Manager", image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop&crop=face" },
    ]},
  { dept: "Design", targetRole: "VP Design", count: 1, status: "limited" as const,
    successors: [
      { name: "Ana Rivera", role: "Design Lead", image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face" },
    ]},
  { dept: "Marketing", targetRole: "VP Marketing", count: 1, status: "limited" as const,
    successors: [
      { name: "David Park", role: "Sr. Marketing Manager", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face" },
    ]},
  { dept: "Finance", targetRole: "VP Finance", count: 1, status: "limited" as const,
    successors: [
      { name: "Karen Wu", role: "Finance Director", image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&h=100&fit=crop&crop=face" },
    ]},
  { dept: "Operations", targetRole: "VP Ops", count: 1, status: "limited" as const,
    successors: [
      { name: "Chris Nguyen", role: "Operations Lead", image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=face" },
    ]},
  { dept: "IT & Security", targetRole: "CISO", count: 1, status: "limited" as const,
    successors: [
      { name: "Raj Patel", role: "Security Lead", image: "https://images.unsplash.com/photo-1463453091185-61582044d556?w=100&h=100&fit=crop&crop=face" },
    ]},
  { dept: "HR", targetRole: "VP People", count: 0, status: "none" as const, successors: [] },
  { dept: "Legal", targetRole: "General Counsel", count: 0, status: "none" as const, successors: [] },
];

const coverageColor = "#10b981";

const suggestedPrompts = [
  "Are there areas of dense coverage?",
  "Are there areas of no coverage?",
  "Show signals with low occurrence",
  "Show signals with high occurrence",
];

const CoveragePage = () => {
  // Split data by tiers for the heatmap
  const strongDepts = departmentData.filter(d => d.status === "strong");
  const limitedDepts = departmentData.filter(d => d.status === "limited");
  const noneDepts = departmentData.filter(d => d.status === "none");

  return (
    <div className="h-full bg-white flex overflow-hidden">
      {/* Left: Main scrollable content */}
      <div className="flex-1 overflow-y-auto">
        {/* Hero Section */}
        <div className="bg-white">
          <div className="flex justify-center">
            <div className="w-full max-w-[1020px] px-8 pt-8 pb-10 flex flex-col gap-2 items-center text-center">
              <div className="flex justify-center mb-4">
                <div className="p-3 rounded-xl bg-emerald-50">
                  <LayoutGrid className="h-7 w-7 text-emerald-600" />
                </div>
              </div>
              <div className="py-2">
                <h1 className="text-4xl lg:text-5xl font-extrabold text-foreground leading-tight mb-3">Coverage</h1>
                <p className="text-lg text-muted-foreground max-w-xl mx-auto">
                  Understand the distribution of Future Leaders across your organization.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Content area */}
        <div className="flex justify-center">
          <div className="w-full max-w-[1020px] py-8 px-8 space-y-10">
            
            {/* Heatmap: Future Leaders by Department */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <h2 className="text-xl font-bold text-foreground mb-1">Future Leaders by Department</h2>
              <p className="text-sm text-muted-foreground mb-6">Number of future leaders mapped to each department</p>

              {/* Strong coverage - large tiles */}
              <div className="grid grid-cols-3 gap-4 mb-4">
                {strongDepts.map((dept, i) => (
                  <motion.div
                    key={dept.dept}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.15 + i * 0.05 }}
                    className="rounded-2xl p-5 text-white cursor-pointer hover:shadow-lg transition-shadow"
                    style={{ background: 'linear-gradient(135deg, #34d399 0%, #10b981 50%, #059669 100%)' }}
                  >
                    <h3 className="font-bold text-lg">{dept.dept}</h3>
                    <p className="text-white/80 text-sm">{dept.targetRole}</p>
                    <p className="text-4xl font-bold mt-3">{dept.count}</p>
                    <p className="text-white/80 text-sm">future leaders</p>
                  </motion.div>
                ))}
              </div>

              {/* Limited + None - smaller tiles */}
              <div className="grid grid-cols-5 gap-3">
                {[...limitedDepts, ...noneDepts].map((dept, i) => {
                  const isNone = dept.status === "none";
                  return (
                    <motion.div
                      key={dept.dept}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: 0.3 + i * 0.05 }}
                      className={cn(
                        "rounded-2xl p-4 cursor-pointer hover:shadow-lg transition-shadow",
                        isNone
                          ? "bg-slate-100 text-foreground border border-slate-200"
                          : "text-white"
                      )}
                      style={!isNone ? { background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #d97706 100%)' } : undefined}
                    >
                      <h3 className={cn("font-bold text-sm", isNone ? "text-foreground" : "text-white")}>{dept.dept}</h3>
                      <p className={cn("text-xs", isNone ? "text-muted-foreground" : "text-white/80")}>{dept.targetRole}</p>
                      <p className={cn("text-3xl font-bold mt-2", isNone ? "text-foreground" : "text-white")}>{dept.count}</p>
                      <p className={cn("text-xs", isNone ? "text-muted-foreground" : "text-white/80")}>
                        future leader{dept.count !== 1 ? "s" : ""}
                      </p>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            {/* Department Detail Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h2 className="text-xl font-bold text-foreground mb-1">Department Coverage Detail</h2>
              <p className="text-sm text-muted-foreground mb-4">Each department's target role and mapped future leaders</p>

              {/* Legend */}
              <div className="flex items-center gap-6 mb-6">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-emerald-500" />
                  <span className="text-xs text-muted-foreground">Strong (2+ successors)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-amber-500" />
                  <span className="text-xs text-muted-foreground">Limited (1 successor)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-slate-300" />
                  <span className="text-xs text-muted-foreground">No Coverage (0 successors)</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                {departmentData.filter(d => d.count > 0).map((dept, index) => {
                  const statusLabel = dept.status === "strong" ? "Strong" : "Limited";
                  const statusColor = dept.status === "strong" 
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200" 
                    : "bg-amber-50 text-amber-700 border-amber-200";
                  
                  return (
                    <motion.div
                      key={dept.dept}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.35 + index * 0.05 }}
                      className="bg-card border border-border rounded-2xl p-5 hover:shadow-lg transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-bold text-foreground text-lg">{dept.dept}</h3>
                          <p className="text-sm text-muted-foreground">{dept.targetRole}</p>
                        </div>
                        <span className={cn("text-xs font-semibold px-3 py-1 rounded-full border", statusColor)}>
                          {statusLabel}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 mb-4">
                        <div className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg",
                          dept.status === "strong" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                        )}>
                          {dept.count}
                        </div>
                        <span className="text-sm text-muted-foreground">future leaders mapped</span>
                      </div>

                      <div className="border-t border-border pt-3">
                        <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase mb-3">Mapped Successors</p>
                        <div className="space-y-2.5">
                          {dept.successors.map(s => (
                            <div key={s.name} className="flex items-center gap-3">
                              <img src={s.image} alt={s.name} className="w-8 h-8 rounded-full object-cover" />
                              <div>
                                <p className="text-sm font-semibold text-foreground">{s.name}</p>
                                <p className="text-xs text-muted-foreground">{s.role}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* No coverage departments */}
              {noneDepts.length > 0 && (
                <div className="grid grid-cols-3 gap-4 mt-4">
                  {noneDepts.map((dept, index) => (
                    <motion.div
                      key={dept.dept}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.5 + index * 0.05 }}
                      className="bg-slate-50 border border-slate-200 rounded-2xl p-5"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-bold text-foreground text-lg">{dept.dept}</h3>
                          <p className="text-sm text-muted-foreground">{dept.targetRole}</p>
                        </div>
                        <span className="text-xs font-semibold px-3 py-1 rounded-full border bg-slate-100 text-slate-500 border-slate-300">
                          No Coverage
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">No future leaders currently mapped to this role.</p>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Right: AI Assistant */}
      <div className="w-[410px] flex-shrink-0">
        <SignalAISidebar
          categoryName="Coverage Analysis"
          categoryColor={coverageColor}
          aiSummary="Engineering has the strongest coverage with 3 future leaders mapped. HR and Legal have no identified future leaders, creating potential gaps. Consider initiating talent reviews for these areas."
          recognitionSummary="Engineering has the strongest coverage with 3 future leaders mapped. HR and Legal have no identified future leaders — consider broadening development initiatives."
          suggestedPrompts={suggestedPrompts}
        />
      </div>
    </div>
  );
};

export default CoveragePage;
