import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Signal } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const mockPeople: Record<string, { name: string; initials: string; photo: string }[]> = {
  executive: [
    { name: "Sarah Chen", initials: "SC", photo: "https://i.pravatar.cc/80?u=sarah-chen" },
    { name: "Marcus Rivera", initials: "MR", photo: "https://i.pravatar.cc/80?u=marcus-rivera" },
    { name: "Anika Patel", initials: "AP", photo: "https://i.pravatar.cc/80?u=anika-patel" },
    { name: "James Okonkwo", initials: "JO", photo: "https://i.pravatar.cc/80?u=james-okonkwo" },
  ],
  strategic: [
    { name: "Elena Vasquez", initials: "EV", photo: "https://i.pravatar.cc/80?u=elena-vasquez" },
    { name: "David Kim", initials: "DK", photo: "https://i.pravatar.cc/80?u=david-kim" },
    { name: "Priya Sharma", initials: "PS", photo: "https://i.pravatar.cc/80?u=priya-sharma" },
    { name: "Tom Andersen", initials: "TA", photo: "https://i.pravatar.cc/80?u=tom-andersen" },
    { name: "Lena Müller", initials: "LM", photo: "https://i.pravatar.cc/80?u=lena-muller" },
  ],
  voice: [
    { name: "Rachel Nguyen", initials: "RN", photo: "https://i.pravatar.cc/80?u=rachel-nguyen" },
    { name: "Omar Farah", initials: "OF", photo: "https://i.pravatar.cc/80?u=omar-farah" },
    { name: "Claire Dubois", initials: "CD", photo: "https://i.pravatar.cc/80?u=claire-dubois" },
  ],
  transformation: [
    { name: "Michael Torres", initials: "MT", photo: "https://i.pravatar.cc/80?u=michael-torres" },
    { name: "Fatima Al-Rashid", initials: "FA", photo: "https://i.pravatar.cc/80?u=fatima-alrashid" },
    { name: "Ben Hartley", initials: "BH", photo: "https://i.pravatar.cc/80?u=ben-hartley" },
    { name: "Yuki Tanaka", initials: "YT", photo: "https://i.pravatar.cc/80?u=yuki-tanaka" },
  ],
  people: [
    { name: "Lisa Johansson", initials: "LJ", photo: "https://i.pravatar.cc/80?u=lisa-johansson" },
    { name: "Carlos Mendez", initials: "CM", photo: "https://i.pravatar.cc/80?u=carlos-mendez" },
    { name: "Nina Petrov", initials: "NP", photo: "https://i.pravatar.cc/80?u=nina-petrov" },
  ],
  "anti-patterns": [
    { name: "Ryan Brooks", initials: "RB", photo: "https://i.pravatar.cc/80?u=ryan-brooks" },
    { name: "Sophie Laurent", initials: "SL", photo: "https://i.pravatar.cc/80?u=sophie-laurent" },
  ],
};

export interface SubSignal {
  name: string;
  description: string;
  predictiveStrength: number;
}

export const signalCategories = [
  {
    id: "executive",
    name: "Executive Access & Recognition",
    description: "CEO/C-Suite direct access, SVP recognition, and senior leadership visibility.",
    color: "#f59e0b",
    colorLight: "rgba(251, 191, 36, 0.06)",
    ringColor: "rgba(251, 191, 36, 0.25)",
    strength: 85,
    subSignals: [
      { name: "CEO/C-Suite Direct Access", description: "Regular interaction and recognition from C-level executives", predictiveStrength: 95 },
      { name: "SVP Recognition + Global Scope", description: "Recognition from senior VPs with global organizational impact", predictiveStrength: 97 },
      { name: "Multiple VP Sources (Cross-Functional)", description: "Recognition from VPs across different functional areas", predictiveStrength: 85 },
      { name: "CFO + Vision Alignment", description: "Financial leadership recognition and strategic alignment", predictiveStrength: 69 },
      { name: "Regional President Recognition", description: "Visibility with regional leadership across geographies", predictiveStrength: 60 },
      { name: "Senior Leadership Visit Hosting", description: "Trusted to host and represent during executive visits", predictiveStrength: 68 },
    ] as SubSignal[],
  },
  {
    id: "strategic",
    name: "Strategic Positioning",
    description: "Enterprise transformation, technical-to-advisor transitions, and market creation.",
    color: "#a855f7",
    colorLight: "rgba(168, 85, 247, 0.06)",
    ringColor: "rgba(168, 85, 247, 0.25)",
    strength: 92,
    subSignals: [
      { name: "Enterprise Transformation Programme Role", description: "Leading organization-wide change initiatives", predictiveStrength: 88 },
      { name: "Technical → Advisor Role Transition", description: "Moving from technical execution to strategic advisory", predictiveStrength: 82 },
      { name: "Cross-Regional Deployment", description: "Strategic impact across multiple geographies", predictiveStrength: 64 },
      { name: "Investor-Facing Work", description: "Exposure to investor relations and communications", predictiveStrength: 35 },
      { name: "Market/Industry Creation", description: "Contributing to new market or industry development", predictiveStrength: 28 },
    ] as SubSignal[],
  },
  {
    id: "voice",
    name: "Voice & Influence",
    description: "Courageous voice in senior forums, partnership language, and speaking up for others.",
    color: "#3b82f6",
    colorLight: "rgba(59, 130, 246, 0.06)",
    ringColor: "rgba(59, 130, 246, 0.25)",
    strength: 58,
    subSignals: [
      { name: "Courageous Voice in Senior Forums", description: "Speaking truth to power and challenging status quo", predictiveStrength: 91 },
      { name: "Honest/Balanced View Recognition", description: "Providing balanced, objective perspectives", predictiveStrength: 76 },
      { name: "Partnership Language (Not Service)", description: "Communicating as strategic partner, not service provider", predictiveStrength: 52 },
      { name: "Organization Design Language", description: "Contributing to organizational structure discussions", predictiveStrength: 34 },
      { name: "Speaking Up for Others", description: "Advocating for team members and peers", predictiveStrength: 58 },
    ] as SubSignal[],
  },
  {
    id: "transformation",
    name: "Transformation & Impact",
    description: "Organizational transformation leadership, sustained excellence, and cross-functional implementation.",
    color: "#f97316",
    colorLight: "rgba(249, 115, 22, 0.06)",
    ringColor: "rgba(249, 115, 22, 0.25)",
    strength: 74,
    subSignals: [
      { name: "Organizational Transformation Leadership", description: "Leading fundamental change in how the organization operates", predictiveStrength: 93 },
      { name: "Enterprise Geographic Scope", description: "Impact spanning multiple geographic regions", predictiveStrength: 62 },
      { name: "Sustained Excellence (3+ Years)", description: "Consistent high performance over extended period", predictiveStrength: 89 },
      { name: "Role Model Recognition", description: "Cited as example for others to follow", predictiveStrength: 56 },
      { name: "Cross-Functional Implementation", description: "Successfully implementing changes across functions", predictiveStrength: 67 },
    ] as SubSignal[],
  },
  {
    id: "people",
    name: "People Leadership",
    description: "Technical and relational excellence, mentorship, wellbeing advocacy, and team morale.",
    color: "#14b8a6",
    colorLight: "rgba(20, 184, 166, 0.06)",
    ringColor: "rgba(20, 184, 166, 0.25)",
    strength: 68,
    subSignals: [
      { name: "Technical + Relational Excellence", description: "Balancing technical skills with relationship building", predictiveStrength: 72 },
      { name: "People Development & Mentorship", description: "Actively growing and mentoring team members", predictiveStrength: 90 },
      { name: "Team Wellbeing Advocacy", description: "Prioritizing team health and work-life balance", predictiveStrength: 48 },
      { name: "Senior Leader Transition Support", description: "Helping leaders transition to new roles", predictiveStrength: 55 },
      { name: "Team Morale During Crisis", description: "Maintaining team morale through difficult periods", predictiveStrength: 44 },
    ] as SubSignal[],
  },
  {
    id: "anti-patterns",
    name: "Anti-Patterns",
    description: "Signals that may indicate execution focus over true leadership development.",
    color: "#ef4444",
    colorLight: "rgba(239, 68, 68, 0.06)",
    ringColor: "rgba(239, 68, 68, 0.25)",
    strength: 42,
    subSignals: [
      { name: "High-Volume Service Recognition", description: "Recognition focused on service delivery rather than leadership", predictiveStrength: 15 },
      { name: "Single VP Source (Same Person)", description: "Recognition coming from only one senior leader", predictiveStrength: 22 },
      { name: "Technical Tool Excellence Only", description: "Excelling at tools but not strategic thinking", predictiveStrength: 12 },
      { name: "Crisis Execution (Not Leadership)", description: "Firefighting without leading through change", predictiveStrength: 18 },
      { name: "Digital Product Ownership Only", description: "Product focus without broader organizational impact", predictiveStrength: 20 },
      { name: "Peer-Level Recognition Dominant", description: "Primarily recognized by peers, not senior leaders", predictiveStrength: 25 },
      { name: "Service Provider Language", description: "Using service-oriented rather than partnership language", predictiveStrength: 14 },
    ] as SubSignal[],
  },
];

interface GenomeVisualProps {
  onSignalClick?: (signalId: string) => void;
}

const SignalCard = ({
  signal,
  index,
  onSignalClick,
}: {
  signal: (typeof signalCategories)[0];
  index: number;
  onSignalClick?: (signalId: string) => void;
}) => {
  const signalCount = signal.subSignals.length;
  const people = mockPeople[signal.id] || [];
  const displayPeople = people.slice(0, 4);
  const extraCount = people.length - displayPeople.length;

  return (
    <motion.button
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.06 }}
      onClick={() => onSignalClick?.(signal.id)}
      className={cn(
        "relative rounded-2xl bg-card text-left overflow-hidden",
        "group transition-all duration-300 border border-border/40",
        "hover:border-border/80",
        "flex flex-col p-7 pb-10 h-[370px]"
      )}
    >
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at 50% 20%, ${signal.colorLight}, transparent 70%)`,
        }}
      />
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.4, delay: index * 0.06 + 0.1, type: "spring", stiffness: 180 }}
        className="relative z-10 mb-6 w-[144px] h-[144px] flex-shrink-0 flex items-center justify-center aspect-square"
      >
        <div className="absolute inset-0 rounded-full" style={{ backgroundColor: signal.color, opacity: 0.08 }} />
        <div className="absolute inset-[12px] rounded-full" style={{ backgroundColor: signal.color, opacity: 0.12 }} />
        <div className="absolute inset-[24px] rounded-full" style={{ backgroundColor: signal.color, opacity: 0.18 }} />
        <div className="absolute inset-[36px] rounded-full" style={{ backgroundColor: signal.color, opacity: 0.25 }} />
        <div className="relative w-[62px] h-[62px] rounded-full bg-card flex flex-col items-center justify-center">
          <span className="text-2xl font-bold leading-none" style={{ color: signal.color }}>{signalCount}</span>
          <span className="text-[8px] font-semibold uppercase tracking-wider text-muted-foreground/70 mt-1">Signals</span>
        </div>
      </motion.div>
      <h3 className="relative z-10 font-semibold text-foreground tracking-tight leading-snug text-lg mb-1">{signal.name}</h3>
      <p className="relative z-10 text-muted-foreground/70 leading-relaxed text-xs line-clamp-2 min-h-[2.5rem] mb-auto">{signal.description}</p>
      <div className="relative z-10 border-t border-border/30 mx-1 mb-4 mt-4" />
      <div className="relative z-10 flex items-center gap-2.5 mb-4">
        <div className="flex -space-x-2 flex-shrink-0">
          {displayPeople.map((person) => (
            <Avatar key={person.initials} className="w-7 h-7 rounded-full border-2 border-card">
              <AvatarImage src={person.photo} alt={person.name} className="rounded-full" />
              <AvatarFallback className="text-[9px] font-semibold rounded-full" style={{ backgroundColor: signal.colorLight, color: signal.color }}>{person.initials}</AvatarFallback>
            </Avatar>
          ))}
          {extraCount > 0 && (
            <div className="w-7 h-7 rounded-full border-2 border-card flex items-center justify-center text-[9px] font-semibold" style={{ backgroundColor: signal.colorLight, color: signal.color }}>+{extraCount}</div>
          )}
        </div>
        <p className="text-[11px] leading-snug text-muted-foreground/70">
          <span className="font-medium text-foreground/80">{displayPeople.map(p => p.name.split(" ")[0]).join(", ")}</span>{" "}showing this signal
        </p>
      </div>
      <div className="absolute bottom-0 left-0 h-1 rounded-b-2xl transition-all duration-500" style={{ width: `${signal.strength}%`, backgroundColor: signal.color }} />
    </motion.button>
  );
};

const GenomeVisual = ({ onSignalClick }: GenomeVisualProps) => {
  return (
    <div className="w-full">
      <div className="grid grid-cols-3 gap-4">
        {signalCategories.map((signal, i) => (
          <SignalCard key={signal.id} signal={signal} index={i} onSignalClick={onSignalClick} />
        ))}
      </div>
    </div>
  );
};

export default GenomeVisual;
