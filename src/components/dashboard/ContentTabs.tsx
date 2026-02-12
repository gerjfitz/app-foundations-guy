import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

interface Tab {
  id: string;
  label: string;
  badge?: number;
  versions?: { id: string; label: string }[];
}

const tabs: Tab[] = [
  { id: "future-leaders", label: "Leaders" },
  {
    id: "project-oxygen",
    label: "Cisco Leadership",
    versions: [
      { id: "v1", label: "Cisco Leadership" },
      { id: "v2", label: "Cisco Leadership V2" },
    ],
  },
  { id: "genome", label: "Genome" },
  { id: "talent-magnet", label: "Talent Magnets" },
  { id: "leakage", label: "Walk-Aways" },
  { id: "coverage", label: "Coverage" },
];

interface ContentTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  oxygenVersion?: string;
  onOxygenVersionChange?: (version: string) => void;
}

const ContentTabs = ({ activeTab, onTabChange, oxygenVersion = "v1", onOxygenVersionChange }: ContentTabsProps) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="flex justify-center border-b border-border bg-card">
      <nav className="flex gap-8">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const hasVersions = tab.versions && tab.versions.length > 1;

          return (
            <div key={tab.id} className="relative" ref={tab.id === "project-oxygen" ? dropdownRef : undefined}>
              <button
                onClick={() => {
                  onTabChange(tab.id);
                  if (hasVersions && isActive) {
                    setDropdownOpen((v) => !v);
                  } else {
                    setDropdownOpen(false);
                  }
                }}
                className={cn(
                  "py-4 text-sm font-bold tracking-wide transition-colors relative flex items-center gap-1.5",
                  isActive
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {hasVersions
                  ? tab.versions!.find((v) => v.id === oxygenVersion)?.label || tab.label
                  : tab.label}
                {false && hasVersions && (
                  <ChevronDown className={cn("w-3.5 h-3.5 transition-transform", dropdownOpen && isActive && "rotate-180")} />
                )}
                {tab.badge && (
                  <span className="inline-flex items-center justify-center h-5 min-w-[20px] px-1.5 text-xs font-bold text-white bg-accent-magenta rounded-full">
                    {tab.badge}
                  </span>
                )}
                {isActive && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent-magenta" />
                )}
              </button>

              {hasVersions && isActive && dropdownOpen && (
                <div className="absolute top-full left-0 mt-1 bg-card border border-border rounded-lg shadow-lg z-50 min-w-[200px] py-1">
                  {tab.versions!.map((version) => (
                    <button
                      key={version.id}
                      onClick={() => {
                        onOxygenVersionChange?.(version.id);
                        setDropdownOpen(false);
                      }}
                      className={cn(
                        "w-full text-left px-4 py-2.5 text-sm transition-colors",
                        oxygenVersion === version.id
                          ? "bg-primary/5 text-foreground font-semibold"
                          : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                      )}
                    >
                      {version.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </div>
  );
};

export default ContentTabs;
