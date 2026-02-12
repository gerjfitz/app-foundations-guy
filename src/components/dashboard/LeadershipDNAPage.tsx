import { motion } from "framer-motion";
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
            <div className="mb-8">
              <h2 className="text-base font-semibold text-foreground mb-1">Signal Predictive Strength</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Predictive strength shows how often each signal appears in leaders who advanced to VP+ (Accelerate group)
              </p>
            </div>

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
