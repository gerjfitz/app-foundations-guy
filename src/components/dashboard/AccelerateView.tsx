import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Rocket, Signal, ChevronRight, TrendingUp, Users, Award, Briefcase } from "lucide-react";

/* ───────────── Accelerate Leaders Data ───────────── */

const accelerateLeaders = [
  {
    id: "carlos-mendez",
    name: "Carlos Mendez",
    role: "Senior Director, Growth",
    image: "https://i.pravatar.cc/80?u=cl-carlos",
    tenure: "6 years",
    readiness: "High",
    cleadEvidence: [
      {
        theme: "Accelerate",
        color: "#10b981",
        title: "Drove 3x pipeline growth across EMEA",
        detail: "Communicated the new growth strategy with such clarity that every regional team knew exactly how to execute. Scaled enablement programs from 2 to 14 markets in one quarter.",
        date: "Q4 2025",
      },
      {
        theme: "Collaborate",
        color: "#3b82f6",
        title: "Cross-functional alignment on GTM strategy",
        detail: "Brought together Product, Marketing, and Sales leadership to co-create a unified go-to-market motion, reducing time-to-launch by 40%.",
        date: "Q3 2025",
      },
      {
        theme: "Execute",
        color: "#f97316",
        title: "Decisive resource reallocation",
        detail: "Made the tough call to sunset two underperforming programs and redirect investment into high-growth segments, resulting in 28% improved ROI.",
        date: "Q2 2025",
      },
    ],
    genomeEvidence: [
      {
        category: "Strategic Scope & Ownership",
        color: "#0ea5e9",
        signal: "Enterprise Reach",
        detail: "Influence spans 4 business units and 3 geographies. Recognized by peers across engineering, sales, and operations.",
        strength: 88,
      },
      {
        category: "Leadership Presence",
        color: "#f59e0b",
        signal: "Vision & Transformation",
        detail: "Consistently cited as the leader who 'paints the picture' — articulates strategy in ways that energize teams at every level.",
        strength: 92,
      },
      {
        category: "Organizational Influence",
        color: "#10b981",
        signal: "Advocacy Breadth",
        detail: "Named as a top-3 advocate by 7 different senior leaders across functions. Unusually broad sponsorship footprint.",
        strength: 85,
      },
    ],
  },
  {
    id: "priya-sharma",
    name: "Priya Sharma",
    role: "VP, Customer Success",
    image: "https://i.pravatar.cc/80?u=cl-priya",
    tenure: "8 years",
    readiness: "High",
    cleadEvidence: [
      {
        theme: "Accelerate",
        color: "#10b981",
        title: "Scaled CS operations globally",
        detail: "Built the capability framework that enabled CS teams in 6 new regions to reach full productivity 50% faster than historical benchmarks.",
        date: "Q4 2025",
      },
      {
        theme: "Learn",
        color: "#8b5cf6",
        title: "Coaching program for emerging leaders",
        detail: "Designed and personally facilitated a 12-week coaching cohort for 8 high-potential managers, with 6 earning promotions within the year.",
        date: "Q3 2025",
      },
      {
        theme: "Disrupt",
        color: "#ec4899",
        title: "AI-first customer engagement model",
        detail: "Championed the shift to predictive engagement, replacing reactive support with proactive outreach powered by usage analytics.",
        date: "Q1 2025",
      },
    ],
    genomeEvidence: [
      {
        category: "Career Development",
        color: "#6366f1",
        signal: "Progression Tempo",
        detail: "Moved from individual contributor to VP in 7 years — top 5% velocity for her cohort. Each transition marked by expanded scope.",
        strength: 94,
      },
      {
        category: "Organizational Influence",
        color: "#10b981",
        signal: "Talent Development",
        detail: "6 of her direct reports have been promoted to director-level roles. Strong pattern of developing successors.",
        strength: 91,
      },
      {
        category: "Leadership Impact Trajectory",
        color: "#ec4899",
        signal: "Impact Theme Evolution",
        detail: "Impact themes have evolved from operational excellence → strategic transformation → organizational capability building over 3 years.",
        strength: 87,
      },
    ],
  },
  {
    id: "james-okonkwo",
    name: "James Okonkwo",
    role: "Senior Director, Platform Engineering",
    image: "https://i.pravatar.cc/80?u=cl-james",
    tenure: "5 years",
    readiness: "Emerging",
    cleadEvidence: [
      {
        theme: "Accelerate",
        color: "#10b981",
        title: "Platform velocity improvement",
        detail: "Communicated a clear technical vision that aligned 4 engineering squads, resulting in a 60% improvement in deployment frequency.",
        date: "Q4 2025",
      },
      {
        theme: "Execute",
        color: "#f97316",
        title: "Zero-downtime migration leadership",
        detail: "Led the migration of 200+ microservices to the new infrastructure with zero customer-facing downtime across a 6-month execution window.",
        date: "Q2 2025",
      },
      {
        theme: "Collaborate",
        color: "#3b82f6",
        title: "Engineering–Product partnership model",
        detail: "Created a new embedded partnership model between engineering and product teams that reduced feature cycle time by 35%.",
        date: "Q1 2025",
      },
    ],
    genomeEvidence: [
      {
        category: "Execution & Expertise",
        color: "#f97316",
        signal: "Technical Depth",
        detail: "Deep platform architecture expertise combined with growing strategic influence. Recognized as the go-to for complex system decisions.",
        strength: 96,
      },
      {
        category: "Strategic Scope & Ownership",
        color: "#0ea5e9",
        signal: "Strategic Program Ownership",
        detail: "Owns the company's largest infrastructure program ($12M budget). Successfully expanded scope from single-platform to enterprise-wide.",
        strength: 83,
      },
      {
        category: "Leadership Presence",
        color: "#f59e0b",
        signal: "Ownership & Agency",
        detail: "Consistently takes ownership beyond his mandate. Proactively identified and resolved 3 cross-team bottlenecks that weren't in his remit.",
        strength: 80,
      },
    ],
  },
];

/* ───────────── Leader Card Component ───────────── */

const LeaderCard = ({ leader }: { leader: typeof accelerateLeaders[0] }) => {
  const [evidenceLens, setEvidenceLens] = useState<"clead" | "genome">("clead");

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-2xl border border-border/50 bg-card overflow-hidden"
    >
      {/* Leader Header */}
      <div className="p-6 pb-4 flex items-center gap-4">
        <img
          src={leader.image}
          alt={leader.name}
          className="w-14 h-14 rounded-xl object-cover border-2 border-border/30"
        />
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-foreground text-base">{leader.name}</h3>
          <p className="text-sm text-muted-foreground">{leader.role}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">{leader.tenure}</span>
          <span
            className={cn(
              "text-[11px] font-semibold px-2.5 py-1 rounded-full",
              leader.readiness === "High"
                ? "bg-emerald-50 text-emerald-700"
                : "bg-amber-50 text-amber-700"
            )}
          >
            {leader.readiness}
          </span>
        </div>
      </div>

      {/* Lens Toggle */}
      <div className="px-6 pb-4">
        <div className="bg-muted/40 rounded-lg border border-border/30 p-1 flex gap-1">
          <button
            onClick={() => setEvidenceLens("clead")}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md text-xs font-medium transition-all",
              evidenceLens === "clead"
                ? "bg-card text-foreground shadow-sm border border-border/30"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Rocket className="w-3.5 h-3.5" />
            C-LEAD Evidence
          </button>
          <button
            onClick={() => setEvidenceLens("genome")}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md text-xs font-medium transition-all",
              evidenceLens === "genome"
                ? "bg-card text-foreground shadow-sm border border-border/30"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Signal className="w-3.5 h-3.5" />
            Genome Signals
          </button>
        </div>
      </div>

      {/* Evidence Content */}
      <div className="px-6 pb-6">
        <AnimatePresence mode="wait">
          {evidenceLens === "clead" ? (
            <motion.div
              key="clead"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 8 }}
              transition={{ duration: 0.2 }}
              className="space-y-3"
            >
              {leader.cleadEvidence.map((ev, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-border/30 p-4 relative overflow-hidden group hover:border-border/60 transition-colors"
                >
                  <div
                    className="absolute top-0 left-0 w-1 h-full rounded-l-xl"
                    style={{ backgroundColor: ev.color }}
                  />
                  <div className="ml-3">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span
                        className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md"
                        style={{ color: ev.color, backgroundColor: `${ev.color}12` }}
                      >
                        {ev.theme}
                      </span>
                      <span className="text-[11px] text-muted-foreground">{ev.date}</span>
                    </div>
                    <h4 className="text-sm font-semibold text-foreground mb-1">{ev.title}</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">{ev.detail}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="genome"
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.2 }}
              className="space-y-3"
            >
              {leader.genomeEvidence.map((ev, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-border/30 p-4 relative overflow-hidden group hover:border-border/60 transition-colors"
                >
                  <div
                    className="absolute top-0 left-0 w-1 h-full rounded-l-xl"
                    style={{ backgroundColor: ev.color }}
                  />
                  <div className="ml-3">
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md"
                        style={{ color: ev.color, backgroundColor: `${ev.color}12` }}
                      >
                        {ev.category}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <Signal className="w-3.5 h-3.5 text-muted-foreground" />
                      <h4 className="text-sm font-semibold text-foreground">{ev.signal}</h4>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed mb-2.5">{ev.detail}</p>
                    {/* Strength indicator */}
                    <div className="flex items-center gap-1.5">
                      {[...Array(5)].map((_, j) => (
                        <div
                          key={j}
                          className="h-1.5 flex-1 rounded-full transition-all"
                          style={{
                            backgroundColor: j < Math.round(ev.strength / 20)
                              ? ev.color
                              : "hsl(var(--muted))",
                            opacity: j < Math.round(ev.strength / 20) ? 0.8 + (j * 0.05) : 0.3,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

/* ───────────── Accelerate View ───────────── */

const AccelerateView = () => {
  return (
    <div>
      {/* Section intro */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: "rgba(16, 185, 129, 0.08)" }}>
            <Rocket className="w-4.5 h-4.5" style={{ color: "#10b981" }} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground">Accelerate Leaders</h2>
            <p className="text-xs text-muted-foreground">Leaders demonstrating momentum through C-LEAD, with Genome signal context</p>
          </div>
        </div>
      </motion.div>

      {/* Leader Cards */}
      <div className="space-y-6">
        {accelerateLeaders.map((leader, i) => (
          <motion.div
            key={leader.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
          >
            <LeaderCard leader={leader} />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default AccelerateView;
