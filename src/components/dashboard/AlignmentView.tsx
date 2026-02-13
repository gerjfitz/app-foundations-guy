import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Activity, GitCompareArrows, Dna, LayoutGrid, Network, GitFork, Layers } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import ConnectionMapLayout from "./alignment/ConnectionMapLayout";
import MatrixGridLayout from "./alignment/MatrixGridLayout";
import SankeyFlowLayout from "./alignment/SankeyFlowLayout";
import StackedCardsLayout from "./alignment/StackedCardsLayout";
import { genomeDimensions, genomeCategoryColors } from "./alignment/alignmentData";

/* ───────────── Genome Dimension Card ───────────── */

const GenomeDimensionCard = ({
  dim,
  index,
}: {
  dim: (typeof genomeDimensions)[0];
  index: number;
}) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.06 }}
      className="rounded-2xl border border-border/50 bg-card hover:border-border/80 hover:shadow-md transition-all overflow-hidden cursor-pointer"
      onClick={() => setExpanded(!expanded)}
    >
      <div
        className="p-6"
        style={{
          background: `linear-gradient(135deg, ${dim.color}08 0%, transparent 100%)`,
        }}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 flex-1">
            <Activity
              className="h-4 w-4 mt-1 flex-shrink-0"
              style={{ color: dim.color }}
            />
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-sm text-foreground mb-2">
                {dim.dimension}
              </h4>
              <div className="flex flex-wrap gap-2 mb-3">
                {dim.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[11px] font-medium px-3 py-1 rounded-full border"
                    style={{
                      color: dim.color,
                      borderColor: `${dim.color}25`,
                      backgroundColor: `${dim.color}08`,
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {dim.captures}
              </p>
            </div>
          </div>
          <motion.div
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="flex-shrink-0 mt-1"
          >
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 pt-2 border-t border-border/30 space-y-4">
              <div className="rounded-xl px-4 py-3 bg-muted/30 border border-border/30">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                  What C-LEAD can't see
                </p>
                <p className="text-xs text-foreground/70 leading-relaxed">
                  {dim.gap}
                </p>
              </div>
              <div
                className="rounded-xl px-4 py-3 border"
                style={{
                  backgroundColor: `${dim.color}06`,
                  borderColor: `${dim.color}15`,
                }}
              >
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                  Real-world example
                </p>
                <p className="text-xs text-foreground/70 leading-relaxed italic">
                  {dim.example}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

/* ───────────── Main View ───────────── */

const AlignmentView = () => {
  return (
    <div className="space-y-16">
      {/* Section 1: C-LEAD ↔ Genome Alignment */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-9 h-9 rounded-lg bg-indigo-50 flex items-center justify-center">
            <GitCompareArrows className="w-5 h-5 text-indigo-500" />
          </div>
          <h2 className="text-2xl font-bold text-foreground">C-LEAD × Genome Alignment</h2>
        </div>
        <p className="text-[11px] uppercase tracking-widest text-muted-foreground mb-6 ml-12">
          Explore the alignment between C-LEAD principles and Genome categories
        </p>

        <Tabs defaultValue="connection" className="w-full">
          <TabsList className="mb-6 bg-muted/50">
            <TabsTrigger value="connection" className="gap-1.5 text-xs">
              <Network className="w-3.5 h-3.5" />
              Connection Map
            </TabsTrigger>
            <TabsTrigger value="matrix" className="gap-1.5 text-xs">
              <LayoutGrid className="w-3.5 h-3.5" />
              Matrix
            </TabsTrigger>
            <TabsTrigger value="sankey" className="gap-1.5 text-xs">
              <GitFork className="w-3.5 h-3.5" />
              Flow
            </TabsTrigger>
            <TabsTrigger value="cards" className="gap-1.5 text-xs">
              <Layers className="w-3.5 h-3.5" />
              Cards
            </TabsTrigger>
          </TabsList>

          <TabsContent value="connection">
            <ConnectionMapLayout />
          </TabsContent>
          <TabsContent value="matrix">
            <MatrixGridLayout />
          </TabsContent>
          <TabsContent value="sankey">
            <SankeyFlowLayout />
          </TabsContent>
          <TabsContent value="cards">
            <StackedCardsLayout />
          </TabsContent>
        </Tabs>
      </div>

      {/* Section 2: Genome-Only Dimensions */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-9 h-9 rounded-lg bg-purple-50 flex items-center justify-center">
            <Dna className="w-5 h-5 text-purple-500" />
          </div>
          <h2 className="text-2xl font-bold text-foreground">Genome-Only Dimensions</h2>
        </div>
        <p className="text-[11px] uppercase tracking-widest text-muted-foreground mb-6 ml-12 max-w-2xl">
          C-LEAD defines what great leadership looks like today — the Genome adds a temporal dimension, surfacing patterns that point-in-time assessments can't detect
        </p>

        <div className="grid grid-cols-1 gap-4">
          {genomeDimensions.map((dim, i) => (
            <GenomeDimensionCard key={dim.dimension} dim={dim} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AlignmentView;
