export interface DirectReport {
  name: string;
  tier: "accelerate" | "nurture" | "monitor";
  evidence: string;
  status?: "current" | "alumni" | "departed";
}

export interface TalentMagnet {
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
  // Extended influence data
  totalDeveloped: number;
  activeCurrent: number;
  internalAlumni: number;
  departed: number;
  yearsOfInfluence: number;
  timelineData: { year: number; entered: number; promoted: number }[];
}

export type ViewMode = "footprint" | "stats" | "timeline" | "combined";

export const tierColors = {
  accelerate: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", dot: "bg-emerald-500" },
  nurture: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200", dot: "bg-amber-500" },
  monitor: { bg: "bg-slate-100", text: "text-slate-600", border: "border-slate-200", dot: "bg-slate-400" },
};

export const categoryStyles = {
  standout: { color: "#22c55e", label: "Standout" },
  strong: { color: "#3b82f6", label: "Strong Signal" },
  gap: { color: "#f59e0b", label: "Needs Attention" },
};
