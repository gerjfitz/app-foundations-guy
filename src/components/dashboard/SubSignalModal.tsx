import { motion, AnimatePresence } from "framer-motion";
import { X, Signal, TrendingUp, Users, Sparkles } from "lucide-react";

interface Leader {
  name: string;
  role: string;
  image: string;
  insight: string;
}

interface SubSignalModalProps {
  isOpen: boolean;
  onClose: () => void;
  signalName: string;
  signalDescription: string;
  strength: "strong" | "medium" | "emerging";
  summary?: string;
  leaders: Leader[];
  categoryColor: string;
  categoryName: string;
}

const strengthLabels = {
  strong: { label: "Strong Signal", bg: "bg-success/10", text: "text-success", dot: "bg-success" },
  medium: { label: "Medium Signal", bg: "bg-warning/10", text: "text-warning", dot: "bg-warning" },
  emerging: { label: "Emerging Signal", bg: "bg-muted", text: "text-muted-foreground", dot: "bg-muted-foreground" },
};

const SubSignalModal = ({
  isOpen,
  onClose,
  signalName,
  signalDescription,
  strength,
  summary,
  leaders,
  categoryColor,
  categoryName,
}: SubSignalModalProps) => {
  const strengthInfo = strengthLabels[strength];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/40 z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.target === e.currentTarget && onClose()}
          >
            <div className="bg-card rounded-2xl border border-border shadow-2xl w-full max-w-[640px] max-h-[85vh] overflow-hidden flex flex-col">
              {/* Header */}
              <div className="px-8 pt-8 pb-6 border-b border-border flex-shrink-0">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${categoryColor}15` }}
                    >
                      <Signal className="w-6 h-6" style={{ color: categoryColor }} />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-1">{categoryName}</p>
                      <h2 className="text-xl font-bold text-foreground">{signalName}</h2>
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 rounded-xl hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6">
                {/* Signal strength + description */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold ${strengthInfo.bg} ${strengthInfo.text}`}>
                      <div className={`w-2 h-2 rounded-full ${strengthInfo.dot}`} />
                      {strengthInfo.label}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{signalDescription}</p>
                </div>

                {/* AI Insight */}
                {summary && (
                  <div
                    className="rounded-xl p-5 border"
                    style={{ backgroundColor: `${categoryColor}06`, borderColor: `${categoryColor}20` }}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <Sparkles className="h-4 w-4" style={{ color: categoryColor }} />
                      <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: categoryColor }}>
                        AI Insight
                      </span>
                    </div>
                    <p className="text-sm text-foreground leading-relaxed">{summary}</p>
                  </div>
                )}

                {/* People showing this signal */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <h3 className="text-sm font-bold text-foreground">
                      Leaders showing this signal
                      {leaders.length > 0 && (
                        <span className="font-normal text-muted-foreground ml-1">({leaders.length})</span>
                      )}
                    </h3>
                  </div>

                  {leaders.length > 0 ? (
                    <div className="space-y-3">
                      {leaders.map((leader, index) => (
                        <motion.div
                          key={leader.name}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.2, delay: index * 0.05 }}
                          className="flex items-start gap-4 p-4 rounded-xl bg-muted/40 hover:bg-muted/60 transition-colors"
                        >
                          <img
                            src={leader.image}
                            alt={leader.name}
                            className="w-11 h-11 rounded-full object-cover border-2 border-border flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-semibold text-foreground">{leader.name}</h4>
                            <p className="text-xs text-muted-foreground mb-2">{leader.role}</p>
                            <div className="flex items-start gap-2">
                              <TrendingUp className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{ color: categoryColor }} />
                              <p className="text-xs text-foreground/70 leading-relaxed">{leader.insight}</p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 rounded-xl bg-muted/30">
                      <Signal className="h-8 w-8 text-muted-foreground/30 mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">
                        No leaders currently flagged for this signal.
                      </p>
                      <p className="text-xs text-muted-foreground/70 mt-1">
                        This signal is still emerging in the organization.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="px-8 py-5 border-t border-border flex-shrink-0">
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl text-sm font-medium bg-muted hover:bg-muted/80 text-foreground transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SubSignalModal;
