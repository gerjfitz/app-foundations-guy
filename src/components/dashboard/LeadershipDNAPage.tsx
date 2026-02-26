import { useState } from "react";
import { motion } from "framer-motion";
import { GitCompareArrows, ChevronRight, Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";
import SignalExplorer from "./SignalExplorer";
import SignalAISidebar from "./SignalAISidebar";
import GenomeStrand from "./GenomeStrand";
import StrengthRing from "./StrengthRing";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const LeadershipDNAPage = () => {
  const [showCleadMapping, setShowCleadMapping] = useState(false);
  const [showGenomeModal, setShowGenomeModal] = useState(false);

  return (
    <div className="h-full bg-white flex overflow-hidden">
      {/* Left: main scrollable */}
      <div className="flex-1 overflow-y-auto">
        {/* Hero */}
        <div className="bg-white border-b border-border relative overflow-hidden">
          <div className="relative z-10 flex justify-center">
            <div className="w-full max-w-[1020px] px-8 pt-12 pb-10 text-center">
              <GenomeStrand />
              <h1 className="text-4xl font-bold text-foreground mt-3 mb-4">
                Organisation Leadership Genome
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                The behavioral patterns that distinguish your future leaders. Based on analysis of your{" "}
                <span className="inline-flex items-center gap-1.5 font-semibold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200/60">
                  Accelerate Group
                </span>
                {" "}— the 30 employees most likely to reach VP+.
              </p>

              {/* What is the Leadership Genome panel */}
              <motion.button
                onClick={() => setShowGenomeModal(true)}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="mt-6 mx-auto flex items-center gap-3 px-5 py-3.5 rounded-xl border border-amber-200/60 bg-amber-50/50 hover:bg-amber-50 transition-colors group cursor-pointer"
              >
                <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
                  <Lightbulb className="w-4 h-4 text-amber-600" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-foreground">What is the Leadership Genome?</p>
                  <p className="text-xs text-muted-foreground">Learn how we identify the signals of Future Leaders in your organisation</p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
              </motion.button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex justify-center">
          <div className="w-full max-w-[1020px] py-8 px-8">
            {/* Toggle for C-LEAD mapping */}
            <div className="flex items-center justify-between mb-6">
              {/* Signal Strength Key */}
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">Signal Strength Key:</span>
                <div className="flex items-center gap-2">
                  <StrengthRing value={95} color="#f59e0b" size={28} strokeWidth={2.5} />
                  <span className="text-xs text-muted-foreground">= this signal appears in <span className="font-semibold text-foreground">95%</span> of your Accelerate group</span>
                </div>
              </div>

              <button
                onClick={() => setShowCleadMapping(prev => !prev)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-all",
                  showCleadMapping 
                    ? "bg-primary/10 border-primary/30 text-primary" 
                    : "bg-muted/30 border-border/50 text-muted-foreground hover:text-foreground hover:border-border"
                )}
              >
                <GitCompareArrows className="w-4 h-4" />
                Cisco Leadership Mapping
                <div className={cn(
                  "w-8 h-[18px] rounded-full relative transition-colors duration-200",
                  showCleadMapping ? "bg-primary" : "bg-border"
                )}>
                  <div className={cn(
                    "absolute top-[2px] w-[14px] h-[14px] rounded-full bg-white shadow-sm transition-transform duration-200",
                    showCleadMapping ? "translate-x-[16px]" : "translate-x-[2px]"
                  )} />
                </div>
              </button>
            </div>

            <SignalExplorer showCleadMapping={showCleadMapping} />
          </div>
        </div>
      </div>

      {/* Right: AI sidebar */}
      <div className="w-[410px] flex-shrink-0">
        <SignalAISidebar
          categoryName="Leadership Genome"
          categoryColor="#6366f1"
          aiSummary="Strong executive access patterns indicate leaders who are building visibility with C-suite stakeholders. Multi-source VP recognition shows cross-functional impact. Explore individual signal categories to understand predictive patterns."
          suggestedPrompts={[
            "Which signals are most predictive of VP+ advancement?",
            "Who shows the strongest executive access patterns?",
            "What anti-patterns should we watch for?",
            "Compare signal strength across categories",
          ]}
        />
      </div>

      {/* What is the Leadership Genome modal */}
      <Dialog open={showGenomeModal} onOpenChange={setShowGenomeModal}>
        <DialogContent className="sm:max-w-xl p-0 overflow-hidden">
          <div className="px-7 pt-7 pb-2">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-foreground">What is the Leadership Genome?</DialogTitle>
            </DialogHeader>
          </div>

          {/* Why Genome section */}
          <div className="mx-7 mb-5 rounded-xl border border-amber-200/60 bg-amber-50/40 p-5">
            <p className="text-[11px] font-bold uppercase tracking-wider text-amber-700 mb-2.5">Why "Genome"?</p>
            <p className="text-sm text-foreground leading-relaxed">
              Just as a biological genome is the unique DNA blueprint that defines a living organism, your{" "}
              <span className="font-bold">Leadership Genome</span> is the unique behavioral blueprint of leaders who advance to VP+ in your company. No two organizations share the same genome — yours is built from patterns specific to <em>your</em> leadership culture.
            </p>
          </div>

          {/* How it works section */}
          <div className="mx-7 mb-7 rounded-xl border border-border/40 bg-muted/20 p-5">
            <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-4">How It Works</p>
            <div className="space-y-5">
              {[
                { step: 1, title: "We study your Accelerate group", desc: "These are the employees our model predicts are most likely to become future VPs and senior leaders." },
                { step: 2, title: "We extract behavioral signals", desc: "We analyze hundreds of data points to find recurring patterns — things like executive access, strategic positioning, and cross-functional influence." },
                { step: 3, title: "We measure signal strength", desc: "Each signal gets a percentage score showing how often it appears in your Accelerate group. 95% means almost every predicted future leader shows this behavior." },
                { step: 4, title: "Signals cluster into themes", desc: 'Related signals group together (like "Executive Access & Recognition") with an overall score, giving you a high-level view of what drives leadership at your company.' },
              ].map(item => (
                <div key={item.step} className="flex gap-4">
                  <div className="w-7 h-7 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-amber-700">{item.step}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-foreground mb-0.5">{item.title}</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LeadershipDNAPage;
