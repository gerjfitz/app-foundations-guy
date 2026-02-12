import { ChevronLeft, ChevronRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Person {
  id: string;
  name: string;
  role: string;
  image: string;
  status: string;
  statusColor: "success" | "emerging" | "onpath" | "strong" | "likely";
}

interface LeaderCarouselProps {
  title: string;
  count: number;
  description: string;
  buttonLabel: string;
  people: Person[];
  showCheckmark?: boolean;
  onButtonClick?: () => void;
}

const statusStyles = {
  success: "bg-success/10 text-success border-success/30",
  emerging: "bg-muted border-border text-muted-foreground",
  onpath: "bg-accent-magenta/10 text-accent-magenta border-accent-magenta/30",
  strong: "bg-success/10 text-success border-success/30",
  likely: "bg-warning/10 text-warning border-warning/30",
};

const statusLabels: Record<string, string> = {
  success: "PROMOTED",
  emerging: "EMERGING",
  onpath: "ON PATH",
  strong: "STRONG",
  likely: "LIKELY",
};

const LeaderCarousel = ({
  title,
  count,
  description,
  buttonLabel,
  people,
  showCheckmark = false,
  onButtonClick,
}: LeaderCarouselProps) => {
  return (
    <section className="py-8">
      <div className="max-w-[1100px] mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-6">
            <span 
              className="text-7xl lg:text-8xl font-bold leading-none"
              style={{
                background: "linear-gradient(180deg, hsl(var(--accent-magenta)) 0%, hsl(var(--primary)) 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {count}
            </span>
            <div className="border-l-2 border-border pl-6">
              <h2 className="text-xl font-semibold text-foreground">{title}</h2>
              <p className="text-sm text-muted-foreground mt-1 max-w-md">
                {description}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button 
              variant="secondary"
              onClick={onButtonClick}
            >
              {buttonLabel}
            </Button>
            <Button variant="outline" size="icon" className="rounded-full">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="rounded-full">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {people.map((person) => (
            <div
              key={person.id}
              className="bg-card rounded-xl border border-border p-4 flex items-center gap-4 hover:shadow-md transition-shadow"
            >
              <div className="relative">
                <img
                  src={person.image}
                  alt={person.name}
                  className="h-20 w-20 rounded-lg object-cover"
                />
                {showCheckmark && (
                  <div className="absolute -top-1 -right-1">
                    <CheckCircle2 className="h-6 w-6 text-success fill-success stroke-card" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground truncate">
                  {person.name}
                </h3>
                <p className="text-sm text-muted-foreground truncate">
                  {person.role}
                </p>
                <span
                  className={`inline-block mt-2 px-3 py-1 text-xs font-semibold rounded-full border ${statusStyles[person.statusColor]}`}
                >
                  {person.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LeaderCarousel;
