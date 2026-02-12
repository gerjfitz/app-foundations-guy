import { useState } from "react";
import { ArrowLeft, Home, TrendingUp, TrendingDown, Minus, MessageSquare } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Behavior {
  name: string;
  signal: "Strong" | "Medium" | "Low";
  trend: "up" | "down" | "stable";
  description: string;
}

interface BehaviorDetailPageProps {
  behavior: Behavior;
  categoryName: string;
  categoryDescription: string;
  allBehaviors: Behavior[];
  onBack: () => void;
}

const signalColors = {
  Strong: "bg-[#1E4195] text-white",
  Medium: "bg-[#d4e0f4] text-[#1E4195]",
  Low: "bg-slate-200 text-slate-600",
};

const signalBarColors = {
  Strong: "bg-emerald-500",
  Medium: "bg-sky-400",
  Low: "bg-slate-400",
};

// Mock data for top leaders
const topLeaders = [
  {
    id: "1",
    name: "David Okonjo",
    role: "VP Customer Success",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    signalStrength: "High" as const,
    quote: "Consistent champion for customer feedback loops in product meetings.",
  },
  {
    id: "2",
    name: "Sarah Chen",
    role: "Director, Product",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
    signalStrength: "High" as const,
    quote: "Prioritizes features that directly address user pain points.",
  },
];

// Mock recognition data
const recognitionMoments = [
  {
    id: "1",
    from: "Michael Ross",
    role: "SVP of Global Engineering",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    date: "Nov 15, 2024",
    behavior: "Industry Expertise",
    quote: "Sarah's deep understanding of market trends helped us pivot our strategy before competitors. Her analysis of the fintech landscape was instrumental in our Q3 planning.",
    highlightedText: "deep understanding of market trends",
  },
  {
    id: "2",
    from: "Elena Rodriguez",
    role: "CMO",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face",
    date: "Oct 28, 2024",
    behavior: "Operational Knowledge",
    quote: "Incredible work streamlining our internal processes. Sarah's comprehensive grasp of how departments interconnect made the restructuring seamless.",
    highlightedText: "comprehensive grasp of how departments interconnect",
  },
  {
    id: "3",
    from: "David Kim",
    role: "VP of Operations",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
    date: "Sep 12, 2024",
    behavior: "Industry Expertise",
    quote: "Sarah brought competitive intelligence that shaped our entire product roadmap. Her industry expertise is unmatched.",
    highlightedText: "competitive intelligence",
  },
  {
    id: "4",
    from: "Amanda Foster",
    role: "Chief Marketing Officer",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    date: "Aug 20, 2024",
    behavior: "Operational Knowledge",
    quote: "The process improvements Sarah implemented have saved us countless hours. She truly understands our operational workflows.",
    highlightedText: "process improvements",
  },
];

const TrendIcon = ({ trend }: { trend: "up" | "down" | "stable" }) => {
  if (trend === "up") return <TrendingUp className="h-4 w-4 text-emerald-500" />;
  if (trend === "down") return <TrendingDown className="h-4 w-4 text-destructive" />;
  return <Minus className="h-4 w-4 text-muted-foreground" />;
};

const SignalBar = ({ signal }: { signal: "Strong" | "Medium" | "Low" }) => {
  const width = signal === "Strong" ? "100%" : signal === "Medium" ? "66%" : "33%";
  return (
    <div className="flex items-center gap-3 mt-2">
      <div className="text-xs text-muted-foreground">Signal Strength</div>
      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
        <div 
          className={cn("h-full rounded-full transition-all", signalBarColors[signal])}
          style={{ width }}
        />
      </div>
      <div className="text-xs font-medium text-foreground">
        {signal === "Strong" ? "High" : signal}
      </div>
    </div>
  );
};

const SignalIndicator = ({ signal }: { signal: "Strong" | "Medium" | "Low" }) => {
  const width = signal === "Strong" ? "w-16" : signal === "Medium" ? "w-10" : "w-6";
  return (
    <div className="flex flex-col items-end gap-1.5">
      <span className={cn(
        "px-3 py-1 rounded-full text-xs font-semibold uppercase",
        signalColors[signal]
      )}>
        {signal}
      </span>
      <div className="flex items-center gap-2">
        <div className={cn("h-1.5 rounded-full", signalBarColors[signal], width)} />
      </div>
    </div>
  );
};

const BehaviorDetailPage = ({ 
  behavior, 
  categoryName, 
  categoryDescription,
  allBehaviors, 
  onBack 
}: BehaviorDetailPageProps) => {
  const [activeTab, setActiveTab] = useState<"overview" | "recognition">("overview");
  
  // Sort behaviors: Strong first, then Medium, then Low
  const sortedBehaviors = [...allBehaviors].sort((a, b) => {
    const order = { Strong: 0, Medium: 1, Low: 2 };
    return order[a.signal] - order[b.signal];
  });

  // Helper to highlight text in quote
  const highlightQuote = (quote: string, highlighted: string) => {
    const parts = quote.split(new RegExp(`(${highlighted})`, 'gi'));
    return parts.map((part, i) => 
      part.toLowerCase() === highlighted.toLowerCase() 
        ? <mark key={i} className="bg-primary/20 text-primary px-0.5 rounded">{part}</mark>
        : part
    );
  };

  return (
    <div className="min-h-full bg-page-background">
      <div className="max-w-[1100px] mx-auto py-8 px-6">
        {/* Back Button */}
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to DNA
        </button>

        {/* Header */}
        <div className="flex items-start gap-6 mb-8">
          <div className="h-20 w-20 rounded-2xl bg-[#1E4195] flex items-center justify-center shrink-0">
            <Home className="h-10 w-10 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">{categoryName}</h1>
            <p className="text-muted-foreground max-w-2xl">{categoryDescription}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-border mb-8">
          <div className="flex gap-8">
            <button 
              onClick={() => setActiveTab("overview")}
              className={cn(
                "pb-4 text-sm font-medium transition-colors",
                activeTab === "overview" 
                  ? "border-b-2 border-primary text-primary" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              SIGNALS
            </button>
            <button 
              onClick={() => setActiveTab("recognition")}
              className={cn(
                "pb-4 text-sm font-medium transition-colors",
                activeTab === "recognition" 
                  ? "border-b-2 border-primary text-primary" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              EVIDENCE
            </button>
          </div>
        </div>

        {activeTab === "overview" && (
          <>
            {/* Top Emerging Leaders */}
            <div className="mb-10">
              <div className="flex items-baseline gap-3 mb-6">
                <h2 className="text-xl font-semibold text-foreground">Top Emerging Leaders</h2>
                <span className="text-sm text-muted-foreground">Demonstrating this capability strongly</span>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                {topLeaders.map((leader) => (
                  <div 
                    key={leader.id}
                    className="bg-card rounded-xl border border-border p-6"
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <img 
                        src={leader.avatar} 
                        alt={leader.name}
                        className="h-12 w-12 rounded-full object-cover"
                      />
                      <div>
                        <h3 className="font-semibold text-foreground">{leader.name}</h3>
                        <p className="text-sm text-muted-foreground">{leader.role}</p>
                      </div>
                    </div>
                    <SignalBar signal="Strong" />
                    <div className="mt-4 p-4 bg-muted/30 rounded-lg">
                      <p className="text-sm text-muted-foreground italic">"{leader.quote}"</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Category Behaviours */}
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-6">{categoryName} Behaviours</h2>
              
              <div className="space-y-4">
                {sortedBehaviors.map((b) => (
                  <div 
                    key={b.name}
                    className="flex items-center gap-5 bg-card rounded-xl border border-border p-5"
                  >
                    {/* Icon with proper padding and rounded corners */}
                    <div className="h-14 w-14 rounded-xl bg-[#1E4195] flex items-center justify-center shrink-0">
                      <Home className="h-6 w-6 text-white" />
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground mb-1">{b.name}</h3>
                      <p className="text-sm text-muted-foreground">{b.description}</p>
                    </div>

                    {/* Right section: Signal indicator */}
                    <div className="flex items-center gap-4 shrink-0">
                      <SignalIndicator signal={b.signal} />
                      <Button variant="outline" size="sm">
                        Behaviour insight
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {activeTab === "recognition" && (
          <div>
            <div className="flex items-baseline gap-3 mb-6">
              <h2 className="text-xl font-semibold text-foreground">Recognition Moments</h2>
              <span className="text-sm text-muted-foreground">{recognitionMoments.length} recognitions identifying these behaviours</span>
            </div>

            <div className="space-y-4">
              {recognitionMoments.map((recognition) => (
                <div 
                  key={recognition.id}
                  className="bg-card rounded-xl border border-border p-6"
                >
                  {/* Header with avatar and behavior pill */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <img 
                        src={recognition.avatar} 
                        alt={recognition.from}
                        className="h-12 w-12 rounded-full object-cover"
                      />
                      <div>
                        <h3 className="font-semibold text-foreground">{recognition.from}</h3>
                        <p className="text-sm text-muted-foreground">{recognition.role}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="secondary" className="bg-[#1E4195] text-white hover:bg-[#1E4195]/90">
                        {recognition.behavior}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{recognition.date}</span>
                    </div>
                  </div>

                  {/* Quote with highlighted text */}
                  <div className="flex items-start gap-3 p-4 bg-muted/30 rounded-lg">
                    <MessageSquare className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                    <p className="text-sm text-foreground leading-relaxed">
                      "{highlightQuote(recognition.quote, recognition.highlightedText)}"
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BehaviorDetailPage;
