import { useState } from "react";
import { Sparkles, X, Send, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

interface AIAssistantDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  context: string;
  suggestedPrompts: string[];
}

const AIAssistantDrawer = ({ isOpen, onClose, context, suggestedPrompts }: AIAssistantDrawerProps) => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = (prompt: string) => {
    if (!prompt.trim()) return;
    
    setMessages((prev) => [...prev, { role: "user", content: prompt }]);
    setInput("");
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `Based on the ${context} data, here's my analysis: This is a simulated response. In production, this would connect to an AI service to provide contextual insights about leadership predictions, patterns, and recommendations.`,
        },
      ]);
      setIsLoading(false);
    }, 1500);
  };

  const handlePromptClick = (prompt: string) => {
    handleSend(prompt);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-[400px] sm:w-[540px] p-0 flex flex-col">
        <SheetHeader className="p-6 pb-4 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-accent-magenta flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div>
                <SheetTitle className="text-lg font-bold">AI Assistant</SheetTitle>
                <p className="text-sm text-muted-foreground">Context: {context}</p>
              </div>
            </div>
          </div>
        </SheetHeader>

        {/* Messages area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.length === 0 ? (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Ask me anything about the data you are viewing. Here are some suggestions:
              </p>
              <div className="space-y-2">
                {suggestedPrompts.map((prompt, index) => (
                  <button
                    key={index}
                    onClick={() => handlePromptClick(prompt)}
                    className="w-full text-left p-3 rounded-lg border border-border hover:border-primary/50 hover:bg-primary/5 transition-colors group"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm text-foreground">{prompt}</span>
                      <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((message, index) => (
              <div
                key={index}
                className={cn(
                  "flex",
                  message.role === "user" ? "justify-end" : "justify-start"
                )}
              >
                <div
                  className={cn(
                    "max-w-[85%] rounded-2xl px-4 py-3",
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-foreground"
                  )}
                >
                  <p className="text-sm leading-relaxed">{message.content}</p>
                </div>
              </div>
            ))
          )}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-muted rounded-2xl px-4 py-3">
                <div className="flex gap-1">
                  <span className="h-2 w-2 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="h-2 w-2 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="h-2 w-2 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input area */}
        <div className="p-4 border-t border-border">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about this data..."
              className="flex-1"
              onKeyDown={(e) => e.key === "Enter" && handleSend(input)}
            />
            <Button
              onClick={() => handleSend(input)}
              disabled={!input.trim() || isLoading}
              size="icon"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

interface AIAssistantBadgeProps {
  context: string;
  suggestedPrompts: string[];
}

export const AIAssistantBadge = ({ context, suggestedPrompts }: AIAssistantBadgeProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-primary/10 to-accent-magenta/10 border border-primary/20 hover:border-primary/40 hover:from-primary/15 hover:to-accent-magenta/15 transition-all group"
      >
        <Sparkles className="h-4 w-4 text-primary group-hover:scale-110 transition-transform" />
        <span className="text-sm font-medium text-foreground">Ask AI</span>
      </button>

      <AIAssistantDrawer
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        context={context}
        suggestedPrompts={suggestedPrompts}
      />
    </>
  );
};

export default AIAssistantDrawer;
