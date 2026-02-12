import { useState } from "react";
import { Sparkles, Send, Signal, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface SignalAISidebarProps {
  categoryName: string;
  categoryColor: string;
  aiSummary: string;
  recognitionSummary?: string;
  suggestedPrompts: string[];
  bgColor?: string;
}

const SignalAISidebar = ({
  categoryName,
  categoryColor,
  aiSummary,
  recognitionSummary,
  suggestedPrompts,
  bgColor,
}: SignalAISidebarProps) => {
  const [selectedPrompt, setSelectedPrompt] = useState<string | null>(null);
  const [chatInput, setChatInput] = useState("");

  const responseSummary = recognitionSummary || aiSummary;

  return (
    <div className="h-full flex flex-col border-l border-border" style={{ backgroundColor: bgColor || '#F7F9FC' }}>
      {/* Header */}
      <div className="px-6 py-5 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div
            className="p-2 rounded-xl"
            style={{ backgroundColor: `${categoryColor}15` }}
          >
            <Sparkles className="h-5 w-5" style={{ color: categoryColor }} />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">AI Assistant</h3>
            <p className="text-xs text-muted-foreground">
              Ask about {categoryName.toLowerCase()}
            </p>
          </div>
        </div>
      </div>

      {/* Chat area — grows to fill */}
      <div className="flex-1 overflow-y-auto px-6 py-5 min-h-0">
        {selectedPrompt ? (
          <div className="space-y-4">
            <div className="flex justify-end">
              <div
                className="rounded-2xl rounded-tr-sm px-4 py-2 max-w-[85%] text-white"
                style={{ backgroundColor: categoryColor }}
              >
                <p className="text-sm">{selectedPrompt}</p>
              </div>
            </div>
            <div className="flex justify-start">
              <div className="bg-card border border-border rounded-2xl rounded-tl-sm px-4 py-3 max-w-[85%]">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles
                    className="h-3.5 w-3.5"
                    style={{ color: categoryColor }}
                  />
                  <span
                    className="text-xs font-medium"
                    style={{ color: categoryColor }}
                  >
                    AI Analysis
                  </span>
                </div>
                <p className="text-sm text-foreground leading-relaxed">
                  {responseSummary}
                </p>
              </div>
            </div>
          </div>
        ) : (
          /* Contextual empty state */
          <div className="h-full flex flex-col items-center justify-center px-4">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
              style={{ backgroundColor: `${categoryColor}10` }}
            >
              <Signal className="h-6 w-6" style={{ color: categoryColor, opacity: 0.5 }} />
            </div>
            <p className="text-sm font-medium text-foreground mb-1">
              Explore {categoryName}
            </p>
            <p className="text-xs text-muted-foreground text-center leading-relaxed max-w-[220px]">
              Ask questions about signal patterns, leader readiness, or development actions for this category.
            </p>
          </div>
        )}
      </div>

      {/* Suggested prompts — redesigned */}
      <div className="px-5 py-4 border-t border-border flex-shrink-0">
        <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          Suggested
        </p>
        <div className="space-y-1.5">
          {suggestedPrompts.map((prompt, index) => (
            <button
              key={index}
              onClick={() => setSelectedPrompt(prompt)}
              className={cn(
                "w-full text-left px-3.5 py-2.5 rounded-xl text-[13px] leading-snug transition-all group flex items-center justify-between gap-2",
                selectedPrompt === prompt
                  ? "border"
                  : "text-muted-foreground hover:text-foreground bg-white hover:bg-white/80 border border-border/50"
              )}
              style={
                selectedPrompt === prompt
                  ? {
                      backgroundColor: `${categoryColor}10`,
                      color: categoryColor,
                      borderColor: `${categoryColor}30`,
                    }
                  : {}
              }
            >
              <span className="flex-1">{prompt}</span>
              <ArrowRight 
                className="h-3.5 w-3.5 flex-shrink-0 opacity-0 group-hover:opacity-60 transition-opacity" 
                style={selectedPrompt === prompt ? { color: categoryColor } : {}}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Input — always visible at bottom */}
      <div className="px-5 py-4 border-t border-border flex-shrink-0">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            placeholder="Ask a question..."
            className="flex-1 px-4 py-2.5 rounded-xl bg-card border border-border text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2"
            style={
              {
                "--tw-ring-color": `${categoryColor}30`,
              } as React.CSSProperties
            }
          />
          <button
            className="p-2.5 rounded-xl text-white transition-colors"
            style={{ backgroundColor: categoryColor }}
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignalAISidebar;
