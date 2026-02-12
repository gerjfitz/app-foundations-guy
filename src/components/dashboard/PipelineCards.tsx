import { ArrowRight, Users, TrendingUp, Rocket } from "lucide-react";

interface PipelineCardsProps {
  onViewPipeline: () => void;
  onTierClick?: (tier: "monitor" | "nurture" | "accelerate") => void;
}

const pipelineStages = [
  {
    id: "accelerate" as const,
    title: "Accelerate",
    count: "30",
    percent: "0.1%",
    description: "Strong signals with ~70% VP+ prediction confidence. Fast-track with executive sponsorship and stretch assignments.",
    icon: Rocket,
    pillColor: "bg-success text-white",
    countBg: "bg-success/10",
    iconColor: "text-success",
    borderColor: "border-success/30",
    topPeople: [
      { name: "Victoria Reynolds", image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop&crop=face" },
      { name: "Michael Chang", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face" },
      { name: "Elizabeth Hart", image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&h=100&fit=crop&crop=face" },
      { name: "Daniel Kim", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face" },
    ],
  },
  {
    id: "nurture" as const,
    title: "Nurture",
    count: "700",
    percent: "2.3%",
    description: "Medium signal strength. Prioritize for formal leadership development programs and cross-functional exposure.",
    icon: TrendingUp,
    pillColor: "bg-warning text-white",
    countBg: "bg-warning/10",
    iconColor: "text-warning",
    borderColor: "border-warning/30",
    topPeople: [
      { name: "Amanda Foster", image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=100&h=100&fit=crop&crop=face" },
      { name: "James Wilson", image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop&crop=face" },
      { name: "Michelle Lee", image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop&crop=face" },
      { name: "Christopher Brown", image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop&crop=face" },
    ],
  },
  {
    id: "monitor" as const,
    title: "Monitor",
    count: "1,500",
    percent: "4.8%",
    description: "Employees showing early leadership signals. Encourage through recognition, mentorship, and visibility opportunities.",
    icon: Users,
    pillColor: "bg-violet-600 text-white",
    countBg: "bg-violet-50",
    iconColor: "text-violet-600",
    borderColor: "border-violet-200",
    topPeople: [
      { name: "Emily Chen", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face" },
      { name: "Marcus Johnson", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face" },
      { name: "Sarah Williams", image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face" },
      { name: "David Park", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face" },
    ],
  },
];

const PipelineCards = ({ onViewPipeline, onTierClick }: PipelineCardsProps) => {
  return (
    <section className="pt-16 pb-20 px-8" style={{ backgroundColor: '#F6F7FB' }}>
      <div className="max-w-[1100px] mx-auto">
        {/* Section Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-foreground mb-2">
            Leadership Pipeline
          </h2>
          <p className="text-muted-foreground">
            Three action-oriented tiers based on leadership signal strength
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-3 gap-6">
          {pipelineStages.map((stage) => {
            const Icon = stage.icon;
            return (
              <div 
                key={stage.id}
                onClick={() => onTierClick?.(stage.id)}
                className="bg-white rounded-3xl overflow-hidden cursor-pointer group transition-all hover:scale-[1.02] hover:shadow-xl flex flex-col shadow-md"
              >
                {/* Stacked Avatars Section */}
                <div className="relative bg-gradient-to-b from-muted/40 to-muted/10 p-6 pt-8 pb-8">
                  {/* Percent Badge */}
                  <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full text-xs font-semibold bg-white text-foreground shadow-sm">
                    {stage.percent}
                  </div>

                  {/* Stacked Avatars */}
                  <div className="flex justify-center items-center mt-4">
                    <div className="flex -space-x-4">
                      {stage.topPeople.map((person, index) => (
                        <img 
                          key={person.name}
                          src={person.image}
                          alt={person.name}
                          className="w-16 h-16 rounded-full object-cover border-3 border-white shadow-lg transition-transform hover:scale-105"
                          style={{ zIndex: 4 - index }}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-6 flex flex-col flex-1">
                  {/* Tier Header with Large Count */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Icon className={`h-5 w-5 ${stage.iconColor}`} />
                      <h3 className="text-xl font-bold text-foreground">
                        {stage.title}
                      </h3>
                    </div>
                    <div className={`${stage.countBg} ${stage.borderColor} border px-5 py-2.5 rounded-xl`}>
                      <span className={`text-3xl font-bold ${stage.iconColor}`}>{stage.count}</span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-5 flex-1 leading-relaxed">
                    {stage.description}
                  </p>
                  
                  {/* CTA Link */}
                  <button className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold transition-colors hover:opacity-70" style={{ color: '#1E4195' }}>
                    View {stage.title} Group
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default PipelineCards;