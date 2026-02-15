import { useState } from "react";
import { motion } from "framer-motion";
import { Magnet, Users, TrendingUp, AlertTriangle, ChevronDown, ChevronUp, UserMinus, UserCheck, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import SignalAISidebar from "./SignalAISidebar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

/* ─── Types ─── */
interface PipelinePerson {
  name: string;
  tier: "accelerate" | "nurture" | "monitor";
  evidence: string;
}

interface DepartedPerson {
  name: string;
  lastRole: string;
  departure: string;
  note: string;
}

interface AlumniPerson {
  name: string;
  currentRole: string;
  periodUnder: string;
  note: string;
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
  directReports: PipelinePerson[];
  departed: DepartedPerson[];
  alumni: AlumniPerson[];
}

/* ─── Data ─── */
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
      { name: "Barry Wiley II", tier: "accelerate", evidence: "Bold pivot from services sales into P&C; recognized by five SVP-level leaders" },
      { name: "Anh Thu Inman", tier: "accelerate", evidence: "IC to Senior Director in ~3.5 years — one of the fastest trajectories in the dataset" },
      { name: "Dr. LaTricia Frederick", tier: "nurture", evidence: "Stepped up to maintain SLT momentum during a leadership transition" },
      { name: "Stephen Powell", tier: "nurture", evidence: "SVP and EVP recognition spanning nearly a decade" },
    ],
    departed: [
      { name: "Tanya Richardson", lastRole: "Director, Talent Programs", departure: "Left 2024", note: "Joined a Series B startup as VP People; cited Sara as key mentor" },
    ],
    alumni: [
      { name: "Marcus Chen", currentRole: "VP, People Ops at Datadog", periodUnder: "2019–2022", note: "Reported to Sara for 3 years; credits her for his VP readiness" },
      { name: "Diana Kowalski", currentRole: "CHRO at Notion", periodUnder: "2017–2020", note: "Sara's first Director hire; now a C-suite executive" },
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
      { name: "Maddie Underwood", tier: "nurture", evidence: "Recognition from the CEO (twice), multiple EVPs and SVPs across unrelated functions" },
      { name: "Mandy Sullivan", tier: "nurture", evidence: "IC to Director in ~28 months; called a 'thought leader, consultant, and connector'" },
    ],
    departed: [
      { name: "Jessica Park", lastRole: "Sr. Director, L&D", departure: "Left 2023", note: "Now VP Learning at Stripe; built the leadership academy under Megan" },
    ],
    alumni: [
      { name: "Raj Patel", currentRole: "Director, People at Figma", periodUnder: "2020–2022", note: "Transferred to engineering org then departed; still credits Megan" },
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
      { name: "Ullie Versavel", tier: "accelerate", evidence: "Overcame 14-year plateau to earn Pinnacle Award and three international Stevie Awards" },
      { name: "Ram Jayaram", tier: "accelerate", evidence: "Drove the Omega licensing transformation; COO-level recognition" },
    ],
    departed: [],
    alumni: [
      { name: "Amy Torres", currentRole: "VP Eng at Cloudflare", periodUnder: "2018–2021", note: "Built the platform reliability team under Chris" },
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
      { name: "Robyn Blum", tier: "accelerate", evidence: "Over $33,000 in recognition from the CEO alone" },
      { name: "Meredith Corley", tier: "accelerate", evidence: "Nine separate recognitions from EVP Jeetu Patel" },
    ],
    departed: [
      { name: "Kyle Martin", lastRole: "Director, Exec Comms", departure: "Left 2024", note: "Joined Meta as Head of Internal Communications" },
    ],
    alumni: [],
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
      { name: "Taryn Petryk", tier: "nurture", evidence: "Led the DEI organization on an interim basis; orchestrated enterprise-wide Executive Orders response" },
    ],
    departed: [],
    alumni: [
      { name: "Nina Sharma", currentRole: "VP DEI at Salesforce", periodUnder: "2016–2019", note: "Grew from Manager to Director under Brian" },
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
    departed: [
      { name: "Sam Reddy", lastRole: "Sr. Director, Platform", departure: "Left 2023", note: "Now CTO at an AI startup; was Ty's longest-tenured report" },
    ],
    alumni: [],
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
      { name: "Matt Lewis", tier: "monitor", evidence: "Went from 'ground-breaking product management work' → modest peer recognition" },
    ],
    departed: [
      { name: "Priya Nair", lastRole: "Director, CX Strategy", departure: "Left 2023", note: "Joined competitor; cited lack of growth opportunities" },
      { name: "Jordan Blake", lastRole: "Sr. Manager, CX Ops", departure: "Left 2024", note: "Moved to a smaller company for a Director title" },
    ],
    alumni: [],
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
    departed: [
      { name: "Tom Nguyen", lastRole: "Manager, Planning", departure: "Left 2024", note: "Left for a Director role at a mid-stage startup" },
    ],
    alumni: [],
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
    departed: [],
    alumni: [],
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

/* ─── Modal Content ─── */
const TalentMagnetModal = ({ magnet, open, onClose }: { magnet: TalentMagnet; open: boolean; onClose: () => void }) => {
  const style = categoryStyles[magnet.category];
  const totalPipeline = magnet.accelerate + magnet.nurture + magnet.monitor;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-[860px] max-h-[85vh] overflow-y-auto p-0">
        {/* Header */}
        <div className="p-6 pb-4 border-b border-border">
          <DialogHeader>
            <div className="flex items-center gap-4">
              <img src={magnet.image} alt={magnet.name} className="w-14 h-14 rounded-xl object-cover border border-border" />
              <div className="flex-1">
                <DialogTitle className="text-xl">{magnet.name}</DialogTitle>
                <DialogDescription className="text-sm mt-1">{magnet.role}</DialogDescription>
              </div>
              <span
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold border"
                style={{ color: style.color, backgroundColor: `${style.color}10`, borderColor: `${style.color}30` }}
              >
                <style.icon className="w-3.5 h-3.5" />
                {style.label}
              </span>
            </div>
          </DialogHeader>
          <p className="text-sm text-muted-foreground mt-3 leading-relaxed">{magnet.insight}</p>
        </div>

        {/* Three lanes */}
        <div className="p-6 grid grid-cols-3 gap-4">
          {/* Current Pipeline */}
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center">
                <UserCheck className="w-4 h-4 text-emerald-600" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-foreground">Current Pipeline</h4>
                <p className="text-[10px] text-muted-foreground">{totalPipeline} in future leaders pool</p>
              </div>
            </div>
            <div className="space-y-2 flex-1">
              {magnet.directReports.length > 0 ? magnet.directReports.map((dr) => {
                const tc = tierColors[dr.tier];
                return (
                  <div key={dr.name} className="p-3 rounded-lg border border-border bg-card">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className={cn("px-2 py-0.5 rounded text-[9px] font-bold uppercase", tc.bg, tc.text, tc.border, "border")}>{dr.tier}</span>
                    </div>
                    <p className="text-sm font-semibold text-foreground">{dr.name}</p>
                    <p className="text-[11px] text-muted-foreground leading-relaxed mt-1">{dr.evidence}</p>
                  </div>
                );
              }) : (
                <div className="flex items-center justify-center h-20 rounded-lg border border-dashed border-border bg-muted/20">
                  <p className="text-xs text-muted-foreground">No current pipeline</p>
                </div>
              )}
            </div>
          </div>

          {/* Departed */}
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg bg-rose-50 flex items-center justify-center">
                <UserMinus className="w-4 h-4 text-rose-500" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-foreground">Departed</h4>
                <p className="text-[10px] text-muted-foreground">{magnet.departed.length} left the company</p>
              </div>
            </div>
            <div className="space-y-2 flex-1">
              {magnet.departed.length > 0 ? magnet.departed.map((d) => (
                <div key={d.name} className="p-3 rounded-lg border border-border bg-card">
                  <p className="text-sm font-semibold text-foreground">{d.name}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{d.lastRole}</p>
                  <p className="text-[10px] font-medium text-rose-500 mt-1">{d.departure}</p>
                  <p className="text-[11px] text-muted-foreground leading-relaxed mt-1.5">{d.note}</p>
                </div>
              )) : (
                <div className="flex items-center justify-center h-20 rounded-lg border border-dashed border-border bg-muted/20">
                  <p className="text-xs text-muted-foreground">No departures recorded</p>
                </div>
              )}
            </div>
          </div>

          {/* Alumni */}
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center">
                <RotateCcw className="w-4 h-4 text-blue-500" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-foreground">Alumni Network</h4>
                <p className="text-[10px] text-muted-foreground">{magnet.alumni.length} former reports</p>
              </div>
            </div>
            <div className="space-y-2 flex-1">
              {magnet.alumni.length > 0 ? magnet.alumni.map((a) => (
                <div key={a.name} className="p-3 rounded-lg border border-border bg-card">
                  <p className="text-sm font-semibold text-foreground">{a.name}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{a.currentRole}</p>
                  <p className="text-[10px] font-medium text-blue-500 mt-1">{a.periodUnder}</p>
                  <p className="text-[11px] text-muted-foreground leading-relaxed mt-1.5">{a.note}</p>
                </div>
              )) : (
                <div className="flex items-center justify-center h-20 rounded-lg border border-dashed border-border bg-muted/20">
                  <p className="text-xs text-muted-foreground">No alumni tracked</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

/* ─── Magnet Card ─── */
const MagnetCard = ({ magnet, index }: { magnet: TalentMagnet; index: number }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const style = categoryStyles[magnet.category];
  const total = magnet.accelerate + magnet.nurture + magnet.monitor;
  const totalInfluence = total + magnet.departed.length + magnet.alumni.length;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: index * 0.06 }}
        onClick={() => setModalOpen(true)}
        className="bg-white rounded-2xl border border-border overflow-hidden hover:shadow-md transition-shadow flex flex-col h-[320px] cursor-pointer group"
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

          {/* Current Pipeline pills */}
          <div className="mt-5">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">Current Pipeline</p>
            <div className="flex items-center gap-2 flex-wrap">
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
              {total === 0 && (
                <span className="text-xs text-muted-foreground italic">No pipeline members</span>
              )}
            </div>
          </div>

          {/* Insight */}
          <p className="text-sm text-foreground/80 mt-4 leading-relaxed flex-1 line-clamp-3">{magnet.insight}</p>

          {/* Footer hint */}
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/50">
            <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
              {magnet.departed.length > 0 && (
                <span className="flex items-center gap-1">
                  <UserMinus className="w-3 h-3" /> {magnet.departed.length} departed
                </span>
              )}
              {magnet.alumni.length > 0 && (
                <span className="flex items-center gap-1">
                  <RotateCcw className="w-3 h-3" /> {magnet.alumni.length} alumni
                </span>
              )}
            </div>
            <span className="text-[11px] font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">View details →</span>
          </div>
        </div>
      </motion.div>

      <TalentMagnetModal magnet={magnet} open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
};

/* ─── Main Page ─── */
const TalentMagnetPage = () => {
  const standouts = magnets.filter((m) => m.category === "standout");
  const strong = magnets.filter((m) => m.category === "strong");
  

  return (
    <div className="h-full bg-white flex overflow-hidden">
      {/* Left: main scrollable */}
      <div className="flex-1 overflow-y-auto">
        {/* Hero */}
        <div className="bg-white border-b border-border relative overflow-hidden">
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {strong.map((m, i) => <MagnetCard key={m.name} magnet={m} index={i} />)}
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
