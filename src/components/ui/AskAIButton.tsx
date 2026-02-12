import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AskAIButtonProps {
  onClick?: () => void;
  className?: string;
  size?: "sm" | "default" | "lg";
}

const AskAIButton = ({ onClick, className, size = "default" }: AskAIButtonProps) => {
  const sizeClasses = {
    sm: "text-xs px-3 py-1.5",
    default: "text-sm px-4 py-2",
    lg: "text-base px-5 py-2.5",
  };

  const iconSizes = {
    sm: "w-3.5 h-3.5",
    default: "w-4 h-4",
    lg: "w-5 h-5",
  };

  return (
    <Button
      variant="outline"
      onClick={onClick}
      className={cn(
        "gap-2 bg-gradient-to-r from-accent-magenta/5 to-primary/5 border-accent-magenta/30 hover:border-accent-magenta/50 hover:from-accent-magenta/10 hover:to-primary/10 transition-all duration-200 group",
        sizeClasses[size],
        className
      )}
    >
      <Sparkles className={cn(iconSizes[size], "text-accent-magenta group-hover:scale-110 transition-transform")} />
      <span className="font-medium bg-gradient-to-r from-accent-magenta to-primary bg-clip-text text-transparent">
        Ask AI
      </span>
    </Button>
  );
};

export default AskAIButton;
