import { useState } from "react";
import { CheckCircle2, Activity, Sparkles, MessageSquare, ArrowRight, ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface PredictedLeader {
  id: string;
  name: string;
  role: string;
  image: string;
  readinessScore: number;
  promotionDate: string;
  leadershipType: string;
  leadershipJourney: string;
  dnaBehaviors: string[];
  signalYear?: string;
  promotedYear?: string;
}

interface PredictedLeaderCardProps {
  leader: PredictedLeader;
}

// Recognition timeline data for each leader
const leaderRecognitionTimeline: Record<string, {
  aiSummary: string;
  recognitions: {
    id: string;
    type: "received" | "given";
    date: string;
    person: { name: string; role: string; avatar: string };
    behavior: string;
    quote: string;
  }[];
}> = {
  "1": { // Michael Ross
    aiSummary: "Michael demonstrates exceptional strategic thinking and architectural vision. His recognition patterns show a consistent ability to anticipate problems before they escalate, with 78% of his recognition focused on proactive leadership. His transition to SVP was predicted 14 months in advance based on increasing cross-functional influence and board-level communication skills.",
    recognitions: [
      { id: "r1", type: "received", date: "Dec 2023", person: { name: "CEO David Park", role: "Chief Executive Officer", avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop" }, behavior: "Strategic Vision", quote: "Michael's architectural roadmap saved us $3M in technical debt. His foresight is unmatched." },
      { id: "r2", type: "given", date: "Nov 2023", person: { name: "Elena Martinez", role: "Senior Engineer", avatar: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=100&h=100&fit=crop" }, behavior: "Problem Anticipation", quote: "Elena identified the scaling issue weeks before it would have impacted production." },
      { id: "r3", type: "received", date: "Oct 2023", person: { name: "Sarah Chen", role: "VP Product", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop" }, behavior: "Decision Making", quote: "Michael made the call to pivot our infrastructure approach. It was bold and exactly right." },
      { id: "r4", type: "received", date: "Sep 2023", person: { name: "Board of Directors", role: "Executive Board", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop" }, behavior: "Strategic Vision", quote: "His presentation on our 5-year technical strategy was the most compelling we've seen." },
    ]
  },
  "2": { // Sarah Chen
    aiSummary: "Sarah's leadership DNA centers on emotional intelligence and cross-functional influence. Her recognition data reveals she receives 3x more praise from outside her immediate team than typical VPs, indicating exceptional bridge-building capabilities. The AI predicts her next role will leverage her unique ability to unite diverse stakeholders.",
    recognitions: [
      { id: "r1", type: "received", date: "May 2023", person: { name: "Michael Ross", role: "SVP Engineering", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop" }, behavior: "Cross-Functional Influence", quote: "Sarah brought engineering and product together in a way I've never seen. She's a natural unifier." },
      { id: "r2", type: "given", date: "Apr 2023", person: { name: "James Wilson", role: "VP Sales", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop" }, behavior: "Team Empowerment", quote: "James has transformed his team's approach to customer relationships. His coaching is exceptional." },
      { id: "r3", type: "received", date: "Mar 2023", person: { name: "Emily Zhang", role: "Head of Data Science", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop" }, behavior: "Emotional Intelligence", quote: "Sarah sensed our team was struggling before we said anything. Her support was timely and genuine." },
      { id: "r4", type: "received", date: "Feb 2023", person: { name: "Amanda Foster", role: "CMO", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop" }, behavior: "Cross-Functional Influence", quote: "The product-marketing alignment we have is largely thanks to Sarah's collaborative leadership." },
    ]
  },
  "3": { // Emily Zhang
    aiSummary: "Emily's recognition patterns highlight her visionary approach to AI and data strategy. 85% of her recognition mentions innovation or forward-thinking, making her one of our highest 'innovation signal' leaders. Her ability to translate complex technical concepts into business value has accelerated her leadership trajectory.",
    recognitions: [
      { id: "r1", type: "received", date: "Feb 2024", person: { name: "CEO David Park", role: "Chief Executive Officer", avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop" }, behavior: "Innovation Drive", quote: "Emily's AI strategy put us 2 years ahead of competitors. Her vision is transforming the company." },
      { id: "r2", type: "given", date: "Jan 2024", person: { name: "Marcus Johnson", role: "ML Engineer", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop" }, behavior: "Technical Excellence", quote: "Marcus built the most elegant ML pipeline I've ever reviewed. His code is poetry." },
      { id: "r3", type: "received", date: "Dec 2023", person: { name: "Sarah Chen", role: "VP Product", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop" }, behavior: "Strategic Vision", quote: "Emily sees patterns in data that others miss entirely. Her insights shaped our entire roadmap." },
    ]
  },
  "4": { // David Kim
    aiSummary: "David's leadership style emphasizes operational excellence and systematic improvement. His recognition data shows consistent praise for process optimization and team development, with a 40% reduction in operational cycle times attributed to his initiatives. He excels at building scalable, repeatable systems.",
    recognitions: [
      { id: "r1", type: "received", date: "Oct 2023", person: { name: "COO Jennifer Lee", role: "Chief Operations Officer", avatar: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=100&h=100&fit=crop" }, behavior: "Process Excellence", quote: "David's operational overhaul was textbook. He made complex changes look effortless." },
      { id: "r2", type: "given", date: "Sep 2023", person: { name: "Lisa Park", role: "Operations Manager", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop" }, behavior: "Team Empowerment", quote: "Lisa took full ownership of the APAC expansion. Her growth this year has been remarkable." },
      { id: "r3", type: "received", date: "Aug 2023", person: { name: "Michael Ross", role: "SVP Engineering", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop" }, behavior: "Decision Making", quote: "When the supply chain crisis hit, David's decisive action prevented major disruption." },
    ]
  },
  "5": { // Amanda Foster
    aiSummary: "Amanda's recognition profile reveals exceptional stakeholder influence and growth mindset. She receives cross-functional recognition at 2.5x the company average, indicating strong enterprise-wide impact. Her marketing initiatives drove 150% brand engagement growth, demonstrating her ability to translate strategy into measurable results.",
    recognitions: [
      { id: "r1", type: "received", date: "Jan 2024", person: { name: "CEO David Park", role: "Chief Executive Officer", avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop" }, behavior: "Strategic Vision", quote: "Amanda's rebrand strategy was bold and perfectly executed. She's earned her seat at the table." },
      { id: "r2", type: "given", date: "Dec 2023", person: { name: "Tom Richards", role: "Brand Director", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop" }, behavior: "Innovation Drive", quote: "Tom's campaign concept was the most creative work we've produced in years." },
      { id: "r3", type: "received", date: "Nov 2023", person: { name: "James Wilson", role: "VP Sales", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop" }, behavior: "Stakeholder Influence", quote: "Amanda's marketing support doubled our pipeline. She understands what drives revenue." },
    ]
  },
  "6": { // James Wilson
    aiSummary: "James demonstrates strong people leadership with exceptional team development outcomes. His recognition patterns show 60% of his praise goes to team members, indicating a coaching-first leadership style. Three of his direct reports have been promoted to director level within two years, showcasing his talent multiplication effect.",
    recognitions: [
      { id: "r1", type: "received", date: "Nov 2023", person: { name: "CRO Patricia Moore", role: "Chief Revenue Officer", avatar: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=100&h=100&fit=crop" }, behavior: "Results Orientation", quote: "James delivered 140% of target while building one of our strongest sales cultures." },
      { id: "r2", type: "given", date: "Oct 2023", person: { name: "Rachel Kim", role: "Account Executive", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop" }, behavior: "Emotional Intelligence", quote: "Rachel handled the most difficult negotiation of the year with grace and persistence." },
      { id: "r3", type: "received", date: "Sep 2023", person: { name: "Sarah Chen", role: "VP Product", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop" }, behavior: "Team Empowerment", quote: "James doesn't just hit numbers—he builds future leaders. His team is the gold standard." },
    ]
  },
};

const PredictedLeaderCard = ({ leader }: PredictedLeaderCardProps) => {
  const [showJourneyModal, setShowJourneyModal] = useState(false);
  
  const journeyData = leaderRecognitionTimeline[leader.id] || {
    aiSummary: "Leadership journey analysis in progress...",
    recognitions: []
  };

  return (
    <>
      <div className="bg-card rounded-2xl border border-border p-10 hover:shadow-lg transition-shadow">
        <div className="flex gap-10">
          {/* Left section - Photo */}
          <div className="flex flex-col items-center min-w-[180px]">
            <div className="relative mb-4">
              <img
                src={leader.image}
                alt={leader.name}
                className="h-44 w-44 rounded-[18px] object-cover"
              />
              <div className="absolute top-0 right-0">
                <CheckCircle2 className="h-7 w-7 text-success fill-success stroke-card" />
              </div>
            </div>

            <Badge 
              variant="outline" 
              className="bg-success/10 text-success border-success/20 font-semibold"
            >
              {leader.promotionDate}
            </Badge>
          </div>

          {/* Right section - Details */}
          <div className="flex-1">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-2xl font-semibold text-foreground">
                  {leader.name}
                </h3>
                <p className="text-muted-foreground">{leader.role}</p>
              </div>
              <Badge 
                variant="outline" 
                className="bg-primary/5 text-primary border-primary/20 font-semibold"
              >
                {leader.leadershipType}
              </Badge>
            </div>

            {/* Leadership Journey */}
            <div className="mb-6">
              <div className="border-l-4 border-accent-magenta/30 pl-4 py-2 bg-muted/30 rounded-r-lg">
                <p className="text-xs font-semibold text-muted-foreground tracking-wider uppercase mb-2">
                  Leadership Journey
                </p>
                <p className="text-foreground leading-relaxed">
                  "{leader.leadershipJourney}"
                </p>
              </div>
            </div>

            {/* Signal to Promotion Timeline */}
            {leader.signalYear && leader.promotedYear && (
              <div className="mb-6">
                <div className="flex items-center gap-4">
                  {/* Predicted Year */}
                  <div className="bg-muted/50 rounded-xl px-5 py-3 text-center min-w-[100px]">
                    <p className="text-2xl font-bold text-foreground">{leader.signalYear}</p>
                    <p className="text-xs text-muted-foreground font-medium">Predicted</p>
                  </div>
                  
                  {/* Dashed Line with Years Early Pill */}
                  <div className="flex-1 flex items-center gap-3">
                    <div className="flex-1 border-t-2 border-dashed border-muted-foreground/30" />
                    <div className="bg-success/10 text-success text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap">
                      {parseInt(leader.promotedYear) - parseInt(leader.signalYear)} Years Early
                    </div>
                    <div className="flex-1 border-t-2 border-dashed border-muted-foreground/30" />
                  </div>
                  
                  {/* Promoted Year */}
                  <div className="bg-success/10 rounded-xl px-5 py-3 text-center min-w-[100px]">
                    <p className="text-2xl font-bold text-success">{leader.promotedYear}</p>
                    <p className="text-xs text-success font-medium">Promoted</p>
                  </div>
                </div>
              </div>
            )}

            {/* Signals Profile */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <Activity className="h-4 w-4 text-primary" />
                <p className="text-xs font-semibold text-muted-foreground tracking-wider uppercase">
                  Signals
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {leader.dnaBehaviors.map((behavior) => (
                  <Badge 
                    key={behavior} 
                    className="bg-accent-magenta/10 text-accent-magenta border-accent-magenta/20 font-medium px-4 py-2 text-sm"
                  >
                    {behavior}
                  </Badge>
                ))}
              </div>
            </div>

            {/* View Leadership Journey CTA */}
            <Button
              variant="outline"
              onClick={() => setShowJourneyModal(true)}
              className="group"
            >
              View Leadership Journey
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </div>

      {/* Leadership Journey Modal */}
      <Dialog open={showJourneyModal} onOpenChange={setShowJourneyModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
          {/* Header with gradient */}
          <div className="bg-primary p-6 text-white">
            <div className="flex items-center gap-6">
              <img
                src={leader.image}
                alt={leader.name}
                className="h-20 w-20 rounded-full object-cover border-4 border-white/20"
              />
              <div className="flex-1">
                <DialogTitle className="text-2xl font-bold text-white mb-1">
                  {leader.name}
                </DialogTitle>
                <p className="text-white/80">{leader.role}</p>
                <Badge className="mt-2 bg-white/20 text-white border-white/30">
                  {leader.promotionDate}
                </Badge>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-8">
            {/* Signals Makeup */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Activity className="h-5 w-5 text-primary" />
                <h3 className="font-bold text-foreground">Leadership Signals</h3>
                <span className="text-sm text-muted-foreground">Strong Indicators</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {leader.dnaBehaviors.map((behavior) => (
                  <Badge 
                    key={behavior}
                    className="bg-[#1E4195] text-white px-4 py-2 text-sm"
                  >
                    {behavior}
                  </Badge>
                ))}
              </div>
            </div>

            {/* AI Summary */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="h-5 w-5 text-primary" />
                <h3 className="font-bold text-foreground">AI Summary</h3>
              </div>
              <div className="bg-gradient-to-br from-primary/5 to-accent-magenta/5 rounded-xl p-5 border border-primary/10">
                <p className="text-foreground leading-relaxed">
                  {journeyData.aiSummary}
                </p>
              </div>
            </div>

            {/* Recognition Timeline */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <MessageSquare className="h-5 w-5 text-amber-500" />
                <h3 className="font-bold text-foreground">Recognition Timeline</h3>
                <span className="text-sm text-muted-foreground">{journeyData.recognitions.length} moments</span>
              </div>
              <div className="space-y-4">
                {journeyData.recognitions.map((recognition) => (
                  <div 
                    key={recognition.id}
                    className={cn(
                      "rounded-xl p-4 border",
                      recognition.type === "received" 
                        ? "bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800" 
                        : "bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800"
                    )}
                  >
                    <div className="flex items-start gap-4">
                      <img
                        src={recognition.person.avatar}
                        alt={recognition.person.name}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          {recognition.type === "received" ? (
                            <ArrowDownLeft className="h-4 w-4 text-emerald-600" />
                          ) : (
                            <ArrowUpRight className="h-4 w-4 text-blue-600" />
                          )}
                          <span className="text-xs font-semibold text-muted-foreground uppercase">
                            {recognition.type === "received" ? "Received from" : "Given to"}
                          </span>
                          <span className="text-xs text-muted-foreground">{recognition.date}</span>
                        </div>
                        <p className="font-semibold text-foreground">{recognition.person.name}</p>
                        <p className="text-sm text-muted-foreground mb-2">{recognition.person.role}</p>
                        <Badge 
                          variant="outline" 
                          className={cn(
                            "mb-2",
                            recognition.type === "received" 
                              ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-700" 
                              : "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-700"
                          )}
                        >
                          {recognition.behavior}
                        </Badge>
                        <p className="text-sm text-foreground italic">"{recognition.quote}"</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PredictedLeaderCard;
