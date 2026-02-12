import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import SignalExplorer from "./SignalExplorer";
import SignalAISidebar from "./SignalAISidebar";
import GenomeStrand from "./GenomeStrand";

const LeadershipDNAPage = () => {
  return (
    <div className="h-full flex flex-col overflow-hidden bg-page-background">
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="pt-10 pb-6 px-8 bg-card border-b border-border flex-shrink-0"
      >
        <div className="max-w-[1100px] mx-auto text-center">
          <GenomeStrand />
          <h1 className="text-4xl lg:text-5xl font-extrabold text-foreground mb-3">
            Leadership Genome
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Leadership Genome is the unique set of signals observed from your senior leaders over time & used to identify Future Leaders
          </p>
        </div>
      </motion.section>

      {/* Main content: Explorer + AI Sidebar */}
      <div className="flex-1 min-h-0 flex overflow-hidden">
        {/* Explorer area */}
        <div className="flex-1 min-w-0 overflow-y-auto py-8 px-6">
          <div className="max-w-[900px] mx-auto">
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

        {/* AI Sidebar */}
        <div className="w-[320px] flex-shrink-0">
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
    </div>
  );
};

export default LeadershipDNAPage;
