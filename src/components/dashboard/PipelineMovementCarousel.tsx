import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";
import {
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  Users,
  Lightbulb,
  UserPlus,
  Award,
  Network,
  Crown,
} from "lucide-react";

export interface PipelinePerson {
  name: string;
  role: string;
  image: string;
  joinedAccelerate: string;
  newSignals: { label: string; icon: "users" | "lightbulb" | "userplus" }[];
  recentActivity: { label: string; value: number; icon: "award" | "lightbulb" | "network" | "crown" }[];
  summary: string;
}

const signalIconMap = {
  users: Users,
  lightbulb: Lightbulb,
  userplus: UserPlus,
};

const signalIconColors = {
  users: { bg: "bg-purple-50", text: "text-purple-600" },
  lightbulb: { bg: "bg-blue-50", text: "text-blue-600" },
  userplus: { bg: "bg-emerald-50", text: "text-emerald-600" },
};

const activityIconMap = {
  award: Award,
  lightbulb: Lightbulb,
  network: Network,
  crown: Crown,
};

const activityIconColors = {
  award: { bg: "bg-purple-50", text: "text-purple-600" },
  lightbulb: { bg: "bg-blue-50", text: "text-blue-600" },
  network: { bg: "bg-emerald-50", text: "text-emerald-600" },
  crown: { bg: "bg-amber-50", text: "text-amber-600" },
};

interface Props {
  people: PipelinePerson[];
}

const PipelineMovementCarousel = ({ people }: Props) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: "start", loop: false, slidesToScroll: 1 });
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCanPrev(emblaApi.canScrollPrev());
    setCanNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  return (
    <div className="relative">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-6">
          {people.map((person, index) => (
            <motion.div
              key={person.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              className="flex-shrink-0 basis-full md:basis-1/2 xl:basis-1/3 min-w-0"
            >
              <div className="bg-white rounded-2xl border border-border/60 shadow-sm hover:shadow-md transition-shadow overflow-hidden h-full flex flex-col">
                {/* Top: avatar + green bar (preserved visual) */}
                <div className="flex flex-col items-center pt-8 px-6">
                  <div className="relative z-10">
                    <img
                      src={person.image}
                      alt={person.name}
                      className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg"
                    />
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-success rounded-full flex items-center justify-center border-2 border-white shadow-md">
                      <TrendingUp className="w-3 h-3 text-white" />
                    </div>
                  </div>

                  <div className="relative w-12 -mt-2 overflow-hidden" style={{ height: "90px" }}>
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: "90px" }}
                      transition={{ duration: 0.8, delay: 0.2 + index * 0.1, ease: "easeOut" }}
                      className="absolute top-0 left-0 right-0 rounded-b-xl"
                      style={{
                        background:
                          "linear-gradient(to bottom, rgba(34, 197, 94, 0.9) 0%, rgba(34, 197, 94, 0.6) 40%, rgba(34, 197, 94, 0.15) 80%, rgba(255, 255, 255, 0) 100%)",
                      }}
                    />
                  </div>

                  <h4 className="font-bold text-foreground text-base text-center mt-3">{person.name}</h4>
                  <p className="text-xs text-muted-foreground text-center">{person.role}</p>
                  <div className="mt-2 px-3 py-1 bg-success/10 rounded-full">
                    <span className="text-xs font-medium text-success">{person.joinedAccelerate}</span>
                  </div>
                </div>

                {/* Body */}
                <div className="px-6 pt-6 pb-6 flex-1 flex flex-col gap-5 border-t border-border/40 mt-6">
                  {/* New Signals */}
                  <div>
                    <h5 className="text-sm font-bold text-foreground mb-3">New Signals, last 30 days</h5>
                    <div className="flex flex-wrap gap-2">
                      {person.newSignals.map((sig) => {
                        const Icon = signalIconMap[sig.icon];
                        const color = signalIconColors[sig.icon];
                        return (
                          <div
                            key={sig.label}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${color.bg} border border-border/40`}
                          >
                            <Icon className={`w-4 h-4 ${color.text}`} />
                            <span className="text-xs font-medium text-foreground">{sig.label}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <div className="pt-4 border-t border-border/40">
                    <h5 className="text-sm font-bold text-foreground mb-3">Recent activity</h5>
                    <div className="grid grid-cols-4 gap-2">
                      {person.recentActivity.map((act) => {
                        const Icon = activityIconMap[act.icon];
                        const color = activityIconColors[act.icon];
                        return (
                          <div key={act.label} className="flex flex-col items-center text-center">
                            <div className="flex items-center gap-1.5 mb-1">
                              <div className={`w-7 h-7 rounded-full ${color.bg} flex items-center justify-center`}>
                                <Icon className={`w-3.5 h-3.5 ${color.text}`} />
                              </div>
                              <span className="text-lg font-bold text-foreground">{act.value}</span>
                            </div>
                            <span className="text-[10px] text-muted-foreground leading-tight">{act.label}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Summary */}
                  <div className="pt-4 border-t border-border/40">
                    <h5 className="text-sm font-bold text-foreground mb-2">30 Day Summary</h5>
                    <p className="text-sm text-muted-foreground leading-relaxed">{person.summary}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Controls */}
      <button
        onClick={() => emblaApi?.scrollPrev()}
        disabled={!canPrev}
        className="absolute -left-4 top-1/3 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-lg border border-border flex items-center justify-center text-foreground hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed z-20"
        aria-label="Previous"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={() => emblaApi?.scrollNext()}
        disabled={!canNext}
        className="absolute -right-4 top-1/3 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-lg border border-border flex items-center justify-center text-foreground hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed z-20"
        aria-label="Next"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
};

export default PipelineMovementCarousel;
