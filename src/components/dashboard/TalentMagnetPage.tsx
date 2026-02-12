import { useState } from "react";
import { motion } from "framer-motion";
import { Magnet, Users, TrendingUp, AlertTriangle, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import SignalAISidebar from "./SignalAISidebar";


/* ─── Types ─── */
interface DirectReport {
  name: string;
  tier: "accelerate" | "nurture" | "monitor";
  evidence: string;
}

interface TalentMagnet {
  name: string;
  role: string;
  image: string;
  accelerate: number;
  nurture: number;
  monitor: number;
  magnetScore: number;
  insight: string;
  category: "standout" | "strong" | "gap";
  directReports: DirectReport[];
}

/* ─── Data from PDF ─── */
const magnets: TalentMagnet[] = [
  {
    name: "Sara Morales",
    role: "SVP, People & Communities",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop&crop=face",
    accelerate: 3, nurture: 2, monitor: 0,
    magnetScore: 96,
    insight: "Strongest magnet — diverse paths, consistent outcomes. Three different career archetypes all developing Accelerate-tier profiles under the same manager.",
    category: "standout",
    directReports: [
      { name: "Jen Scherler-Gormley", tier: "accelerate", evidence: "Led Splunk integration across 36 countries; sponsorship from EVP and multiple SVPs over a decade" },
      { name: "Barry Wiley II", tier: "accelerate", evidence: "Bold pivot from services sales into P&C; recognized by five SVP-level leaders; CMO stated he is 'working at the VP level'" },
      { name: "Anh Thu Inman", tier: "accelerate", evidence: "IC to Senior Director in ~3.5 years — one of the fastest trajectories in the dataset" },
      { name: "Dr. LaTricia Frederick", tier: "nurture", evidence: "Stepped up to maintain SLT momentum during a leadership transition; owns the DIP Portal and Workforce Scenario Model" },
      { name: "Stephen Powell", tier: "nurture", evidence: "SVP and EVP recognition spanning nearly a decade; driving P&C transformation change management" },
    ],
  },
  {
    name: "Megan Bazan",
    role: "VP, People & Communities",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop&crop=face",
    accelerate: 1, nurture: 7, monitor: 0,
    magnetScore: 91,
    insight: "Deepest bench — several near breakthrough. Eight directors showing meaningful VP potential with zero Monitor-tier leaders.",
    category: "standout",
    directReports: [
      { name: "Maddie Underwood", tier: "nurture", evidence: "Recognition from the CEO (twice), multiple EVPs and SVPs across unrelated functions — rare breadth of trust" },
      { name: "Mandy Sullivan", tier: "nurture", evidence: "IC to Director in ~28 months; called a 'thought leader, consultant, and connector' by an SVP" },
    ],
  },
  {
    name: "Chris Dexter",
    role: "VP, Engineering",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
    accelerate: 2, nurture: 3, monitor: 0,
    magnetScore: 85,
    insight: "Quality over quantity in engineering. Shows that engineering leaders can build cross-enterprise visibility with deliberate program-level ownership.",
    category: "strong",
    directReports: [
      { name: "Ullie Versavel", tier: "accelerate", evidence: "Overcame 14-year plateau to earn Pinnacle Award and three international Stevie Awards; EVP/COO recognition" },
      { name: "Ram Jayaram", tier: "accelerate", evidence: "Drove the Omega licensing transformation; COO-level recognition as an ONExcellence finalist" },
    ],
  },
  {
    name: "Heather Dickinson",
    role: "VP, Corporate Communications",
    image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=200&h=200&fit=crop&crop=face",
    accelerate: 2, nurture: 2, monitor: 0,
    magnetScore: 82,
    insight: "Exceptional talent, structural path question. Both Accelerate leaders are VP+ caliber but path depends on functional head role opening.",
    category: "strong",
    directReports: [
      { name: "Robyn Blum", tier: "accelerate", evidence: "Over $33,000 in recognition from the CEO alone; described as the leader 'at the helm' of business-critical communications" },
      { name: "Meredith Corley", tier: "accelerate", evidence: "Nine separate recognitions from EVP Jeetu Patel; led communications through Ukraine crisis and Log4j" },
    ],
  },
  {
    name: "Brian Tippens",
    role: "SVP, People & Communities",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face",
    accelerate: 1, nurture: 6, monitor: 0,
    magnetScore: 80,
    insight: "Strong talent, domain-breadth question. Recurring question is whether specialized domains (CSR, DEI) offer a clear path to VP+ scope.",
    category: "strong",
    directReports: [
      { name: "Taryn Petryk", tier: "nurture", evidence: "Led the DEI organization on an interim basis; orchestrated enterprise-wide Executive Orders response across 112 meetings" },
    ],
  },
  {
    name: "Ty Thorsen",
    role: "SVP, Engineering",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face",
    accelerate: 1, nurture: 6, monitor: 0,
    magnetScore: 78,
    insight: "Solid pipeline, uneven readiness. Strong bench depth but leaders are at varying stages of development.",
    category: "strong",
    directReports: [],
  },
  {
    name: "Surbhi Kaul",
    role: "VP, CX Product Management",
    image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=200&h=200&fit=crop&crop=face",
    accelerate: 0, nurture: 5, monitor: 5,
    magnetScore: 38,
    insight: "Organizational design issue — momentum fades. Five leaders show the same peaked-and-faded arc, raising structural questions about sustained development.",
    category: "gap",
    directReports: [
      { name: "Hope Ferguson", tier: "monitor", evidence: "Went from EVP recognition for CX P&L Transformation → $100 awards for 'helping with comm items'" },
      { name: "Matt Lewis", tier: "monitor", evidence: "Went from 'ground-breaking product management work' → modest peer recognition for shift coverage" },
    ],
  },
  {
    name: "Gary Hall",
    role: "VP, Sales Strategy & Planning",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&h=200&fit=crop&crop=face",
    accelerate: 0, nurture: 1, monitor: 5,
    magnetScore: 22,
    insight: "Role design issue — support vs. leadership. Sales Strategy may be structured where dominant work product is operational enablement, not transformation ownership.",
    category: "gap",
    directReports: [
      { name: "Virginia Wallen", tier: "monitor", evidence: "Over $16,000 from SVPs but entirely for logistics — 'amazing GSX event,' 'well coordinated events'" },
    ],
  },
  {
    name: "Neerka Tandon",
    role: "Director, Software Engineering",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=face",
    accelerate: 0, nurture: 2, monitor: 5,
    magnetScore: 25,
    insight: "Altitude ceiling — needs external visibility. A Director managing Directors creates a structural ceiling where leaders lack SVP/VP-level recognition.",
    category: "gap",
    directReports: [],
  },
];

const tierColors = {
  accelerate: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", dot: "bg-emerald-500" },
  nurture: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200", dot: "bg-amber-500" },
  monitor: { bg: "bg-slate-100", text: "text-slate-600", border: "border-slate-200", dot: "bg-slate-400" },
};

const categoryStyles = {
  standout: { color: "#22c55e", label: "Standout", icon: TrendingUp },
  strong: { color: "#3b82f6", label: "Strong Signal", icon: Users },
  gap: { color: "#f59e0b", label: "Needs Attention", icon: AlertTriangle },
};

/* ─── Magnet Card ─── */
const MagnetCard = ({ magnet, index }: { magnet: TalentMagnet; index: number }) => {
  const [expanded, setExpanded] = useState(false);
  const style = categoryStyles[magnet.category];
  const total = magnet.accelerate + magnet.nurture + magnet.monitor;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      className="bg-white rounded-2xl border border-border overflow-hidden hover:shadow-md transition-shadow flex flex-col"
    >
      <div className="p-7 flex flex-col flex-1">
        {/* Top row */}
        <div className="flex items-start gap-4">
          <img src={magnet.image} alt={magnet.name} className="w-14 h-14 rounded-xl object-cover border border-border" />
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-foreground text-base truncate mb-1">{magnet.name}</h3>
            <p className="text-sm text-muted-foreground">{magnet.role}</p>
          </div>
          <span
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold border flex-shrink-0"
            style={{ color: style.color, backgroundColor: `${style.color}10`, borderColor: `${style.color}30` }}
          >
            <style.icon className="w-3.5 h-3.5" />
            {style.label}
          </span>
        </div>

        {/* Tier breakdown */}
        <div className="flex items-center gap-3 mt-6">
          {([
            { key: "accelerate" as const, label: "Accelerate", count: magnet.accelerate },
            { key: "nurture" as const, label: "Nurture", count: magnet.nurture },
            { key: "monitor" as const, label: "Monitor", count: magnet.monitor },
          ]).filter((t) => t.count > 0).map((t) => (
            <div
              key={t.key}
              className={cn("inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border", tierColors[t.key].bg, tierColors[t.key].border)}
            >
              <span className={cn("text-sm font-bold", tierColors[t.key].text)}>{t.count}</span>
              <span className={cn("text-[11px] font-semibold capitalize", tierColors[t.key].text)}>{t.label}</span>
            </div>
          ))}
        </div>

        {/* Insight */}
        <p className="text-sm text-foreground/80 mt-5 leading-relaxed flex-1">{magnet.insight}</p>

        {/* Expand toggle — pinned to bottom */}
        {magnet.directReports.length > 0 && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1 mt-6 pt-4 border-t border-border/50 text-[12px] font-semibold text-muted-foreground hover:text-foreground transition-colors w-full"
          >
            {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            {expanded ? "Hide" : "View"} key leaders ({magnet.directReports.length})
          </button>
        )}
      </div>

      {/* Expanded direct reports */}
      {expanded && magnet.directReports.length > 0 && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          transition={{ duration: 0.25 }}
          className="border-t border-border bg-muted/20"
        >
          <div className="p-5 space-y-4">
            {magnet.directReports.map((dr) => {
              const tc = tierColors[dr.tier];
              return (
                <div key={dr.name} className="flex items-start gap-0">
                  <span className={cn("w-[80px] flex-shrink-0 mt-0.5 inline-flex items-center justify-center px-2.5 py-1 rounded text-[10px] font-semibold capitalize border", tc.bg, tc.text, tc.border)}>
                    {dr.tier}
                  </span>
                  <div className="min-w-0 pl-4">
                    <p className="text-sm font-bold text-foreground">{dr.name}</p>
                    <p className="text-[12px] text-muted-foreground leading-relaxed mt-0.5">{dr.evidence}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

/* ─── Main Page ─── */
const TalentMagnetPage = () => {
  const standouts = magnets.filter((m) => m.category === "standout");
  const strong = magnets.filter((m) => m.category === "strong");
  const gaps = magnets.filter((m) => m.category === "gap");

  return (
    <div className="h-full bg-white flex overflow-hidden">
      {/* Left: main scrollable */}
      <div className="flex-1 overflow-y-auto">
        {/* Hero */}
        <div className="bg-white border-b border-border relative overflow-hidden">
          {/* Giant magnet icon as subtle background */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="absolute right-[-60px] top-[-40px] pointer-events-none"
          >
            <Magnet className="w-[340px] h-[340px] text-purple-500/[0.04]" strokeWidth={1} />
          </motion.div>

          <div className="relative z-10 flex justify-center">
            <div className="w-full max-w-[1020px] px-8 pt-12 pb-12 text-center">
              <div className="flex items-center justify-center gap-3 mb-5">
                <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center">
                  <Magnet className="w-6 h-6 text-purple-500" />
                </div>
              </div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Talent Magnet Analysis</span>
              <h1 className="text-4xl font-bold text-foreground mt-3 mb-4">Who Attracts Future Leaders?</h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Some leaders consistently attract and develop future VPs. When high-potential directors cluster under one manager, it's worth asking what they're doing that others can learn from.
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex justify-center">
          <div className="w-full max-w-[1020px] py-8 px-8 space-y-14">
            {/* Standouts */}
            <section>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-emerald-500" />
                </div>
                <h2 className="text-2xl font-bold text-foreground">Standout Magnets</h2>
              </div>
              <p className="text-[11px] uppercase tracking-widest text-muted-foreground mb-6 ml-12">
                Leaders producing the highest concentration of VP+ potential with zero Monitor-tier reports
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                {standouts.map((m, i) => <MagnetCard key={m.name} magnet={m} index={i} />)}
              </div>
            </section>

            {/* Strong */}
            <section>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">
                  <Users className="w-5 h-5 text-blue-500" />
                </div>
                <h2 className="text-2xl font-bold text-foreground">Strong Signals</h2>
              </div>
              <p className="text-[11px] uppercase tracking-widest text-muted-foreground mb-6 ml-12">
                Leaders with quality pipelines and strategic questions to address
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                {strong.map((m, i) => <MagnetCard key={m.name} magnet={m} index={i} />)}
              </div>
            </section>

            {/* Gaps */}
            <section>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-amber-500" />
                </div>
                <h2 className="text-2xl font-bold text-foreground">Where the Gaps Are</h2>
              </div>
              <p className="text-[11px] uppercase tracking-widest text-muted-foreground mb-6 ml-12">
                Teams where structural or design issues may be limiting leader development
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                {gaps.map((m, i) => <MagnetCard key={m.name} magnet={m} index={i} />)}
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* Right: AI sidebar */}
      <div className="w-[410px] flex-shrink-0">
        <SignalAISidebar
          categoryName="Talent Magnet"
          categoryColor="#a855f7"
          aiSummary="Leaders who naturally attract, develop, and retain future VPs at a higher rate than peers. When multiple high-potential directors cluster under one manager, it signals deliberate development behavior worth replicating."
          suggestedPrompts={[
            "What makes Sara Morales the strongest talent magnet?",
            "Which managers have structural barriers limiting their teams?",
            "How can we replicate standout magnet behaviors?",
            "Which Nurture-tier leaders are closest to Accelerate?",
          ]}
        />
      </div>
    </div>
  );
};

export default TalentMagnetPage;
