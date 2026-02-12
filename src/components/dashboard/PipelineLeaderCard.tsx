import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface PipelineLeader {
  id: string;
  name: string;
  role: string;
  image: string;
  readinessScore: number;
  predictedRole: string;
  status: "projected" | "advancing" | "detected";
}

const statusStyles = {
  projected: {
    label: "PROJECTED",
    badgeClass: "bg-success/10 text-success border border-success/30",
    progressClass: "bg-success",
  },
  advancing: {
    label: "ADVANCING",
    badgeClass: "bg-warning/10 text-warning border border-warning/30",
    progressClass: "bg-warning",
  },
  detected: {
    label: "DETECTED",
    badgeClass: "bg-slate-100 text-slate-600 border border-slate-200",
    progressClass: "bg-slate-500",
  },
};

interface PipelineLeaderCardProps {
  leader: PipelineLeader;
}

const PipelineLeaderCard = ({ leader }: PipelineLeaderCardProps) => {
  const status = statusStyles[leader.status];

  return (
    <div className="bg-card rounded-xl border border-border p-5 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <img
          src={leader.image}
          alt={leader.name}
          className="h-16 w-16 rounded-lg object-cover"
        />
        <Badge variant="outline" className={status.badgeClass}>{status.label}</Badge>
      </div>

      <h3 className="text-lg font-semibold text-foreground">{leader.name}</h3>
      <p className="text-sm text-muted-foreground mb-4">{leader.role}</p>

      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-muted-foreground">Readiness Score</span>
            <span className="font-semibold text-foreground">{leader.readinessScore}%</span>
          </div>
          <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
            <div 
              className={cn("h-full rounded-full transition-all", status.progressClass)}
              style={{ width: `${leader.readinessScore}%` }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Predicted Role</span>
          <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
            {leader.predictedRole}
          </Badge>
        </div>
      </div>
    </div>
  );
};

export default PipelineLeaderCard;
