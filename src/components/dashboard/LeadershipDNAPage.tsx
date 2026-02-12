import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import SignalExplorer from "./SignalExplorer";
import SignalAISidebar from "./SignalAISidebar";
import GenomeStrand from "./GenomeStrand";

const LeadershipDNAPage = () => {
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
                Leadership Genome
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Leadership Genome is the unique set of signals observed from your senior leaders over time & used to identify Future Leaders
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex justify-center">
          <div className="w-full max-w-[1020px] py-8 px-8">
            {/* AI Insight banner */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.15 }}
              className="relative rounded-2xl border border-border/30 p-5 mb-8 overflow-hidden"
              style={{
                background: "linear-gradient(135deg, rgba(249, 115, 22, 0.06), rgba(168, 85, 247, 0.04) 50%, rgba(168, 85, 247, 0.06))",
              }}
            >
              <div className="absolute top-0 right-0 w-40 h-40 rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(168, 85, 247, 0.1), transparent 70%)" }} />
              <div className="flex items-start gap-4 relative z-10">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Sparkles className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-sm font-bold text-foreground">AI Insight</h3>
                    <span className="text-[10px] font-medium uppercase tracking-wider text-primary/70 bg-primary/10 rounded-full px-2 py-0.5">iQ Analysis</span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    These leadership signals are derived from the recognition patterns happening across your organisation. Workhuman iQ analyses peer-to-peer recognition data to surface emerging leadership behaviors that traditional assessments miss.
                  </p>
                </div>
              </div>
            </motion.div>

            <p className="text-[11px] uppercase tracking-widest text-muted-foreground mb-6">
              Predictive strength shows how often each signal appears in leaders who advanced to VP+
            </p>

            <SignalExplorer />
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
    </div>
  );
};

export default LeadershipDNAPage;
