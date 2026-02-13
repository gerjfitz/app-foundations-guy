/* Shared data for all alignment layout variants */

export const genomeCategoryColors: Record<string, string> = {
  "Organizational Leadership": "#10b981",
  "Leadership Presence": "#f59e0b",
  "Career Development": "#6366f1",
  "Leadership Impact Trajectory": "#ec4899",
  "Execution & Expertise": "#f97316",
  "Strategic Scope & Ownership": "#0ea5e9",
};

export const evidenceQuotes: Record<string, Record<string, string[]>> = {
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

export const alignmentData = [
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

export const genomeDimensions = [
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

/* Unique genome categories across all alignmentData */
export const allGenomeCategories = Array.from(
  new Set(alignmentData.flatMap((d) => d.mappings.map((m) => m.category)))
);
