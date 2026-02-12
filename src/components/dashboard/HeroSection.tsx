import { useState, useEffect } from "react";
import { AlertTriangle, TrendingUp, Users } from "lucide-react";

const insights = [
  {
    icon: AlertTriangle,
    iconBg: "bg-warning/10",
    iconColor: "text-warning",
    title: "Develop Tier Alert",
    subtitle: "Movement detected in Develop group...",
    message: "12 employees from the 700 Develop group are showing accelerated signals this quarter.",
    messageBg: "bg-warning/10",
    messageColor: "text-warning-foreground",
  },
  {
    icon: TrendingUp,
    iconBg: "bg-success/10",
    iconColor: "text-success",
    title: "Accelerate Update",
    subtitle: "Strong VP+ trajectory confirmed...",
    message: "3 of the 30 Accelerate group members promoted to VP roles in Q4, validating 70% accuracy.",
    messageBg: "bg-success/10",
    messageColor: "text-success",
  },
  {
    icon: Users,
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
    title: "Nurture Growth",
    subtitle: "New signals emerging...",
    message: "47 new employees added to Nurture tier (1,500 total) based on recognition patterns.",
    messageBg: "bg-primary/10",
    messageColor: "text-primary",
  },
];

const HeroSection = () => {
  const [activeInsight, setActiveInsight] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveInsight((prev) => (prev + 1) % insights.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const insight = insights[activeInsight];
  const Icon = insight.icon;

  return (
    <section className="relative pt-[94px] pb-12">
      <div className="max-w-[1100px] mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left content */}
          <div className="space-y-6">
            <p className="text-sm font-semibold tracking-widest text-muted-foreground uppercase">
              Workhuman Intelligence
            </p>
            <h1 className="text-4xl lg:text-5xl font-extrabold text-foreground leading-tight">
              Future Leaders
            </h1>
            <p className="text-lg text-muted-foreground max-w-lg leading-relaxed">
              Gives you predictive, evidence-based visibility into top leadership potential by analyzing millions of human connection points.
            </p>
          </div>

          {/* Right card */}
          <div className="flex justify-end">
            <div className="bg-card rounded-2xl shadow-lg border border-border p-8 max-w-md w-full">
              <div className="flex items-center gap-2 mb-8">
                <div className="h-2.5 w-2.5 rounded-full bg-accent-magenta animate-pulse" />
                <span className="text-base font-semibold text-accent-magenta uppercase tracking-wide">
                  Active AI Intelligence
                </span>
              </div>

              <div className="space-y-5 transition-all duration-500">
                <div className="flex items-start gap-4" key={activeInsight}>
                  <div className={`p-3 rounded-xl ${insight.iconBg}`}>
                    <Icon className={`h-6 w-6 ${insight.iconColor}`} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-foreground">{insight.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {insight.subtitle}
                    </p>
                  </div>
                </div>

                <div className={`${insight.messageBg} rounded-xl p-5`}>
                  <p className={`text-base font-medium ${insight.messageColor}`}>
                    "{insight.message}"
                  </p>
                </div>

                {/* Indicator dots */}
                <div className="flex justify-end gap-2 pt-2">
                  {insights.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveInsight(idx)}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        idx === activeInsight ? "w-8 bg-primary" : "w-2 bg-muted"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
