import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Activity, GitCompareArrows, Dna } from "lucide-react";


/* ───────────── Genome category colors ───────────── */

const genomeCategoryColors: Record<string, string> = {
  "Organizational Leadership": "#10b981",
  "Leadership Presence": "#f59e0b",
  "Career Development": "#6366f1",
  "Leadership Impact Trajectory": "#ec4899",
  "Execution & Expertise": "#f97316",
  "Strategic Scope & Ownership": "#0ea5e9",
};

/* ───────────── Evidence quotes per mapping ───────────── */

const evidenceQuotes: Record<string, Record<string, string[]>> = {
  collaborate: {
    "Organizational Leadership": [
      '"Sarah built cross-functional alignment between engineering and product that hadn\'t existed before." — VP Engineering',
      '"Her ability to earn trust from skeptical stakeholders turned the integration around." — SVP Operations',
      '"Consistently cited as the connective tissue between siloed teams." — 360 Review',
    ],
    "Leadership Presence": [
      '"She commands the room not through authority but through genuine inclusion." — Peer Feedback',
      '"Her presence in cross-org meetings elevates the quality of collaboration." — Director, Strategy',
    ],
  },
  learn: {
    "Career Development": [
      '"Elena\'s mentorship program produced 3 promotions in one quarter." — HR Business Partner',
      '"She invests in others\' growth even when it means losing talent from her own team." — Skip-Level Feedback',
      '"Actively sought out stretch assignments to close her own strategy gap." — Manager Review',
    ],
    "Leadership Impact Trajectory": [
      '"Her coaching style has evolved from tactical to truly transformational." — Executive Coach',
      '"Year-over-year, her direct reports show the highest internal mobility rates." — Talent Analytics',
    ],
  },
  execute: {
    "Execution & Expertise": [
      '"Michael delivered the platform migration 6 weeks ahead of schedule with zero downtime." — CTO',
      '"His technical depth allows him to make decisions others defer for weeks." — Engineering Lead',
      '"Consistently the person called when a critical delivery is at risk." — Program Management',
    ],
    "Strategic Scope & Ownership": [
      '"He\'s moved beyond just delivering — he now shapes what we should build." — VP Product',
      '"His ownership of the enterprise architecture roadmap shows strategic thinking." — CIO',
    ],
  },
  accelerate: {
    "Strategic Scope & Ownership": [
      '"Carlos scaled the go-to-market playbook from one region to five in under a year." — CMO',
      '"His ability to translate strategy into scalable processes is rare at this level." — SVP Sales',
      '"Owns the capability-building agenda for the entire commercial organization." — CHRO',
    ],
    "Career Development": [
      '"He built a leadership bench that allowed three of his managers to take on global roles." — Talent Review',
      '"His development plans are the most rigorous I\'ve seen — he tracks leading indicators." — HR Director',
    ],
    "Organizational Leadership": [
      '"He builds organizational momentum — teams want to join his initiatives." — Employee Survey',
    ],
  },
  disrupt: {
    "Leadership Presence": [
      '"Omar challenges the status quo in a way that energizes rather than alienates." — Board Member',
      '"Her vision presentations at QBR consistently shift executive priorities." — CEO',
      '"They don\'t just propose change — they make you feel the urgency of it." — SVP Innovation',
    ],
    "Leadership Impact Trajectory": [
      '"The quality of their strategic proposals has escalated dramatically in 18 months." — Executive Sponsor',
      '"Their innovation portfolio has shifted from incremental to genuinely disruptive." — VP Strategy',
    ],
    "Strategic Scope & Ownership": [
      '"Starting to own outcomes beyond their immediate mandate." — Skip-Level Review',
    ],
  },
};

/* ───────────── Alignment Data ───────────── */

const alignmentData = [
  {
    id: "collaborate",
    name: "Collaborate",
    description: "Working across boundaries, building teams, and earning trust.",
    color: "#3b82f6",
    mappings: [
      { category: "Organizational Leadership", strength: 85 },
      { category: "Leadership Presence", strength: 60 },
    ],
  },
  {
    id: "learn",
    name: "Learn",
    description: "Developing personal skills and coaching others to grow.",
    color: "#8b5cf6",
    mappings: [
      { category: "Career Development", strength: 75 },
      { category: "Leadership Impact Trajectory", strength: 50 },
    ],
  },
  {
    id: "execute",
    name: "Execute",
    description: "Solving problems, making decisions, and demonstrating passion.",
    color: "#f97316",
    mappings: [
      { category: "Execution & Expertise", strength: 92 },
      { category: "Strategic Scope & Ownership", strength: 65 },
    ],
  },
  {
    id: "accelerate",
    name: "Accelerate",
    description: "Communicating goals and building capabilities at scale.",
    color: "#10b981",
    mappings: [
      { category: "Strategic Scope & Ownership", strength: 80 },
      { category: "Career Development", strength: 55 },
      { category: "Organizational Leadership", strength: 45 },
    ],
  },
  {
    id: "disrupt",
    name: "Disrupt",
    description: "Envisioning opportunities, innovating, and leading change.",
    color: "#ec4899",
    mappings: [
      { category: "Leadership Presence", strength: 70 },
      { category: "Leadership Impact Trajectory", strength: 65 },
      { category: "Strategic Scope & Ownership", strength: 40 },
    ],
  },
];

/* ───────────── Genome-Only Dimensions ───────────── */

const genomeDimensions = [
  {
    dimension: "Advocacy Escalation",
    tags: ["Rising Advocate Seniority", "Pre-Promotion Senior Acceleration"],
    captures: "Whether the seniority of leaders who champion you is rising over time.",
    gap: "C-LEAD is a point-in-time snapshot with no temporal dimension. It scores 'Collaborate: present' at every stage without seeing the trajectory.",
    example: "One candidate's recognition escalated from IC/Manager peers → Directors → SVP-920 → SVP-910 → EVP-101/CPO over 12 years. C-LEAD scores 'Collaborate: present' at every stage — without seeing the trajectory.",
    color: "#3b82f6",
  },
  {
    dimension: "Impact Theme Evolution",
    tags: ["Technical to Strategic Shift", "Scope Escalation Over Time"],
    captures: "Whether the nature of your recognized work changes from technical execution to strategic leadership.",
    gap: "C-LEAD asks 'are you learning?' but can't track whether your capabilities actually evolved over time.",
    example: "Early recognitions (2014) focused on analytics technical work and lab creation. By 2018+, recognitions shifted to strategy frameworks, LRSP planning, and transformation programs. C-LEAD scored 'Learn: absent'.",
    color: "#8b5cf6",
  },
  {
    dimension: "Progression Tempo",
    tags: ["Rapid Rise Pattern", "Plateau Detection"],
    captures: "The velocity of career progression — rapid rises, long plateaus, and acceleration patterns that predict future readiness.",
    gap: "C-LEAD evaluates current capability, not how quickly someone arrived. Two leaders rated 'strong' today have fundamentally different trajectories.",
    example: "Two leaders both rated 'Execute: strong' — but one reached VP in 4 years while the other took 12. The Genome detects this; C-LEAD cannot.",
    color: "#10b981",
  },
  {
    dimension: "Structural Ceiling Detection",
    tags: ["Execution Ceiling", "Linchpin Trap", "Sponsor Dependency"],
    captures: "When strong performance is actually keeping someone stuck — identifying structural barriers that snapshot models miss entirely.",
    gap: "C-LEAD treats all competency presence as positive. Being 'indispensable' or praised for 'reliable delivery' can mask a plateau.",
    example: "A leader praised for reliable delivery and responsiveness — but never for strategic ownership. C-LEAD scores 'Execute: present ✓'. The Genome flags a potential ceiling.",
    color: "#f97316",
  },
  {
    dimension: "Theme Stagnation",
    tags: ["Contribution Repetition", "Expertise Without Evolution"],
    captures: "Whether someone's recognized contributions are evolving or repeating the same theme cycle after cycle.",
    gap: "C-LEAD sees expertise as a strength. The Genome distinguishes between deep expertise and theme stagnation over extended periods.",
    example: "Being the 'M&A communications expert' for 11 years straight — C-LEAD sees expertise, the Genome sees stagnation and flags it as a risk signal.",
    color: "#ec4899",
  },
];

/* ───────────── Alignment Card (Expandable) ───────────── */

const AlignmentCard = ({
  item,
  index,
}: {
  item: (typeof alignmentData)[0];
  index: number;
}) => {
  const [expanded, setExpanded] = useState(false);
  const quotes = evidenceQuotes[item.id] || {};

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.06 }}
      className="rounded-2xl border border-border/50 bg-card hover:border-border/80 hover:shadow-md transition-all group overflow-hidden"
    >
      <div
        className="p-8 flex flex-col md:flex-row md:items-start gap-8 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
        style={{
          background: `linear-gradient(135deg, ${item.color}0a 0%, ${item.color}03 50%, transparent 100%)`,
        }}
      >
        {/* Left side — principle info */}
        <div className="flex items-start gap-4 md:w-[35%] flex-shrink-0">
          <div
            className="w-3 h-3 rounded-full mt-1.5 flex-shrink-0"
            style={{ backgroundColor: item.color }}
          />
          <div>
            <h3 className="font-bold text-2xl text-foreground leading-tight">
              {item.name}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed mt-2">
              {item.description}
            </p>
          </div>
        </div>

        {/* Dotted connector */}
        <div className="hidden md:flex items-center flex-shrink-0 self-center">
          <div
            className="w-10 border-t-2 border-dashed"
            style={{ borderColor: `${item.color}40` }}
          />
        </div>

        {/* Right side — genome mappings */}
        <div className="flex-1 space-y-3">
          {item.mappings.map((mapping, mi) => {
            const catColor =
              genomeCategoryColors[mapping.category] || "#94a3b8";
            return (
              <motion.div
                key={mapping.category}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  duration: 0.3,
                  delay: index * 0.06 + mi * 0.08 + 0.15,
                }}
                className="flex items-center gap-3"
              >
                <div
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: catColor }}
                />
                <span className="text-xs font-medium text-foreground/80 w-[180px] flex-shrink-0 truncate">
                  {mapping.category}
                </span>
                <div className="flex-1 h-[6px] rounded-full bg-border/30 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${mapping.strength}%` }}
                    transition={{
                      duration: 0.6,
                      delay: index * 0.06 + mi * 0.08 + 0.2,
                      ease: [0.34, 1.56, 0.64, 1],
                    }}
                    className="h-full rounded-full"
                    style={{
                      backgroundColor: item.color,
                      opacity: 0.3 + (mapping.strength / 100) * 0.6,
                    }}
                  />
                </div>
                <span
                  className="text-[11px] font-bold tabular-nums w-[36px] text-right flex-shrink-0"
                  style={{ color: item.color }}
                >
                  {mapping.strength}%
                </span>
              </motion.div>
            );
          })}
        </div>

        {/* Expand indicator */}
        <div className="flex-shrink-0 self-center">
          <motion.div
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </motion.div>
        </div>
      </div>

      {/* Expanded evidence section */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-8 pb-8 pt-2 border-t border-border/30">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-5">
                Driving Evidence
              </p>
              <div className="space-y-6">
                {item.mappings.map((mapping) => {
                  const catColor =
                    genomeCategoryColors[mapping.category] || "#94a3b8";
                  const catQuotes = quotes[mapping.category] || [];
                  return (
                    <div key={mapping.category}>
                      <div className="flex items-center gap-2 mb-3">
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: catColor }}
                        />
                        <span className="text-xs font-semibold text-foreground/80">
                          {mapping.category}
                        </span>
                      </div>
                      {catQuotes.length > 0 ? (
                        <div className="space-y-2 pl-4">
                          {catQuotes.map((quote, qi) => (
                            <motion.div
                              key={qi}
                              initial={{ opacity: 0, x: -6 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.25, delay: qi * 0.05 }}
                              className="flex gap-3"
                            >
                              <div
                                className="w-[2px] rounded-full flex-shrink-0 mt-1"
                                style={{
                                  backgroundColor: item.color,
                                  opacity: 0.4,
                                  minHeight: "1rem",
                                }}
                              />
                              <p className="text-xs text-muted-foreground leading-relaxed italic">
                                {quote}
                              </p>
                            </motion.div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-muted-foreground/50 pl-4 italic">
                          No evidence quotes available
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

/* ───────────── Genome Dimension Card ───────────── */

const GenomeDimensionCard = ({
  dim,
  index,
}: {
  dim: (typeof genomeDimensions)[0];
  index: number;
}) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.06 }}
      className="rounded-2xl border border-border/50 bg-card hover:border-border/80 hover:shadow-md transition-all overflow-hidden cursor-pointer"
      onClick={() => setExpanded(!expanded)}
    >
      <div
        className="p-6"
        style={{
          background: `linear-gradient(135deg, ${dim.color}08 0%, transparent 100%)`,
        }}
      >
        {/* Header row */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 flex-1">
            <Activity
              className="h-4 w-4 mt-1 flex-shrink-0"
              style={{ color: dim.color }}
            />
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-sm text-foreground mb-2">
                {dim.dimension}
              </h4>
              <div className="flex flex-wrap gap-2 mb-3">
                {dim.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[11px] font-medium px-3 py-1 rounded-full border"
                    style={{
                      color: dim.color,
                      borderColor: `${dim.color}25`,
                      backgroundColor: `${dim.color}08`,
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {dim.captures}
              </p>
            </div>
          </div>
          <motion.div
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="flex-shrink-0 mt-1"
          >
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </motion.div>
        </div>
      </div>

      {/* Expanded detail */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 pt-2 border-t border-border/30 space-y-4">
              {/* Why C-LEAD misses it */}
              <div className="rounded-xl px-4 py-3 bg-muted/30 border border-border/30">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                  What C-LEAD can't see
                </p>
                <p className="text-xs text-foreground/70 leading-relaxed">
                  {dim.gap}
                </p>
              </div>

              {/* Example */}
              <div
                className="rounded-xl px-4 py-3 border"
                style={{
                  backgroundColor: `${dim.color}06`,
                  borderColor: `${dim.color}15`,
                }}
              >
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                  Real-world example
                </p>
                <p className="text-xs text-foreground/70 leading-relaxed italic">
                  {dim.example}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

/* ───────────── Main View ───────────── */

const AlignmentView = () => {
  return (
    <div className="space-y-16">
      {/* Section 1: C-LEAD ↔ Genome Alignment */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-9 h-9 rounded-lg bg-indigo-50 flex items-center justify-center">
            <GitCompareArrows className="w-5 h-5 text-indigo-500" />
          </div>
          <h2 className="text-2xl font-bold text-foreground">C-LEAD × Genome Alignment</h2>
        </div>
        <p className="text-[11px] uppercase tracking-widest text-muted-foreground mb-6 ml-12">
          Click any card to expand and see the evidence driving each connection
        </p>
        <div className="grid grid-cols-1 gap-4">
          {alignmentData.map((item, i) => (
            <AlignmentCard key={item.id} item={item} index={i} />
          ))}
        </div>
      </div>

      {/* Section 2: Genome-Only Dimensions */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-9 h-9 rounded-lg bg-purple-50 flex items-center justify-center">
            <Dna className="w-5 h-5 text-purple-500" />
          </div>
          <h2 className="text-2xl font-bold text-foreground">Genome-Only Dimensions</h2>
        </div>
        <p className="text-[11px] uppercase tracking-widest text-muted-foreground mb-6 ml-12 max-w-2xl">
          C-LEAD defines what great leadership looks like today — the Genome adds a temporal dimension, surfacing patterns that point-in-time assessments can't detect
        </p>

        <div className="grid grid-cols-1 gap-4">
          {genomeDimensions.map((dim, i) => (
            <GenomeDimensionCard key={dim.dimension} dim={dim} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AlignmentView;
