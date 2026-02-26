import { useState } from "react";
import { motion } from "framer-motion";
import { GitCompareArrows, ArrowRight, Dna, Sparkles, Search, BarChart3, Layers } from "lucide-react";
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
                Organisation Leadership
                <br />
                <span className="bg-gradient-to-r from-amber-600 via-orange-500 to-purple-600 bg-clip-text text-transparent">Genome</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                The behavioral patterns that distinguish your future leaders. Based on analysis of your{" "}
                <span className="inline-flex items-center gap-1.5 font-semibold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200/60">
                  Accelerate Group
                </span>
                {" "}— the 30 employees most likely to reach VP+.
              </p>

              {/* What is the Leadership Genome — redesigned */}
              <motion.button
                onClick={() => setShowGenomeModal(true)}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="mt-10 mx-auto group cursor-pointer"
              >
                <div className="relative rounded-2xl border border-border/50 bg-gradient-to-br from-muted/30 via-white to-muted/20 px-7 py-5 flex items-center gap-5 hover:shadow-md hover:border-border transition-all duration-300 overflow-hidden">
                  {/* Subtle decorative gradient */}
                  <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-40 pointer-events-none" style={{ background: "radial-gradient(circle, rgba(245,158,11,0.15), transparent 70%)" }} />
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-100 to-orange-100 border border-amber-200/40 flex items-center justify-center flex-shrink-0">
                    <Dna className="w-5 h-5 text-amber-600" />
                  </div>
                  <div className="text-left flex-1">
                    <p className="text-sm font-semibold text-foreground">What is the Leadership Genome?</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Learn how we identify the signals of Future Leaders in your organisation</p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-muted/50 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                    <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                  </div>
                </div>
              </motion.button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex justify-center">
          <div className="w-full max-w-[1020px] py-8 px-8">
            {/* Signal Strength Key — redesigned bigger */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.1 }}
              className="rounded-xl border border-border/30 bg-muted/15 px-6 py-4 mb-8 flex items-center gap-5"
            >
              <span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/60 flex-shrink-0">Signal Strength Key</span>
              <div className="w-px h-8 bg-border/40" />
              <div className="flex items-center gap-3">
                <StrengthRing value={95} color="#f59e0b" size={40} strokeWidth={3.5} />
                <p className="text-sm text-muted-foreground leading-snug">
                  = this signal appears in <span className="font-semibold text-foreground">95%</span> of your{" "}
                  <span className="font-medium text-amber-700">Accelerate</span> group
                </p>
              </div>
            </motion.div>

            <SignalExplorer showCleadMapping={showCleadMapping} />

            {/* Cisco Leadership Mapping — moved to end */}
            <div className="mt-12 mb-4 flex justify-center">
              <div className="rounded-xl border border-border/40 bg-muted/10 px-6 py-4 flex items-center gap-4">
                <div className="w-9 h-9 rounded-lg bg-primary/5 flex items-center justify-center flex-shrink-0">
                  <GitCompareArrows className="w-4.5 h-4.5 text-primary/60" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-foreground">Cisco Leadership Mapping</p>
                  <p className="text-xs text-muted-foreground">Map genome signals to C-LEAD framework behaviours</p>
                </div>
                <button
                  onClick={() => setShowCleadMapping(prev => !prev)}
                  className="ml-2 flex-shrink-0"
                >
                  <div className={cn(
                    "w-10 h-[22px] rounded-full relative transition-colors duration-200",
                    showCleadMapping ? "bg-primary" : "bg-border"
                  )}>
                    <div className={cn(
                      "absolute top-[3px] w-[16px] h-[16px] rounded-full bg-white shadow-sm transition-transform duration-200",
                      showCleadMapping ? "translate-x-[20px]" : "translate-x-[3px]"
                    )} />
                  </div>
                </button>
              </div>
            </div>
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

      {/* What is the Leadership Genome modal — redesigned */}
      <Dialog open={showGenomeModal} onOpenChange={setShowGenomeModal}>
        <DialogContent className="sm:max-w-2xl p-0 overflow-hidden rounded-2xl">
          {/* Modal hero header */}
          <div className="relative px-8 pt-8 pb-6 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-50/80 via-orange-50/40 to-purple-50/30 pointer-events-none" />
            <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(245,158,11,0.12), transparent 70%)" }} />
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-100 to-orange-100 border border-amber-200/40 flex items-center justify-center mb-4">
                <Dna className="w-6 h-6 text-amber-600" />
              </div>
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-foreground">What is the Leadership Genome?</DialogTitle>
              </DialogHeader>
              <p className="text-sm text-muted-foreground leading-relaxed mt-3 max-w-lg">
                Just as a biological genome is the unique DNA blueprint that defines a living organism, your{" "}
                <span className="font-semibold text-foreground">Leadership Genome</span> is the unique behavioral blueprint of leaders who advance to VP+ in your company. No two organizations share the same genome — yours is built from patterns specific to <em>your</em> leadership culture.
              </p>
            </div>
          </div>

          {/* How it works */}
          <div className="px-8 pb-8">
            <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/60 mb-5">How It Works</p>
            <div className="grid grid-cols-2 gap-4">
              {[
                { step: 1, icon: Sparkles, title: "We study your Accelerate group", desc: "These are the employees our model predicts are most likely to become future VPs and senior leaders.", color: "#f59e0b" },
                { step: 2, icon: Search, title: "We extract behavioral signals", desc: "We analyze hundreds of data points to find recurring patterns — things like executive access, strategic positioning, and cross-functional influence.", color: "#f97316" },
                { step: 3, icon: BarChart3, title: "We measure signal strength", desc: "Each signal gets a percentage score showing how often it appears in your Accelerate group. 95% means almost every predicted future leader shows this behavior.", color: "#a855f7" },
                { step: 4, icon: Layers, title: "Signals cluster into themes", desc: 'Related signals group together (like "Executive Access & Recognition") with an overall score, giving you a high-level view of what drives leadership at your company.', color: "#6366f1" },
              ].map(item => {
                const Icon = item.icon;
                return (
                  <div key={item.step} className="rounded-xl border border-border/40 bg-muted/10 p-4 flex flex-col gap-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: `${item.color}12` }}
                      >
                        <Icon className="w-4 h-4" style={{ color: item.color }} />
                      </div>
                      <span className="text-[10px] font-bold text-muted-foreground/40">0{item.step}</span>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-foreground mb-1">{item.title}</h4>
                      <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LeadershipDNAPage;
