import { useState } from "react";
import { NavLink } from "@/components/NavLink";
import {
  Sparkles,
  Bot,
  Heart,
  UserCheck,
  GraduationCap,
  Shapes,
  LayoutGrid,
  ChevronLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import sidebarBg from "@/assets/sidebar-bg.png";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navItems = [
  { title: "Future Leaders", icon: Sparkles, path: "/", active: true },
  { title: "AI Assistant", icon: Bot, path: "/ai-assistant" },
  { title: "DE&I", icon: Heart, path: "/dei" },
  { title: "Retention", icon: UserCheck, path: "/retention" },
  { title: "Skills", icon: GraduationCap, path: "/skills" },
  { title: "Patterns", icon: Shapes, path: "/patterns" },
  { title: "Team Grid", icon: LayoutGrid, path: "/team-grid" },
];

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          "fixed lg:static inset-y-0 left-0 z-50 flex flex-col sidebar-transition",
          collapsed ? "w-[4.5rem]" : "w-64",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
        style={{
          backgroundImage: `url(${sidebarBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4">
          <div className="flex items-center gap-3">
            {!collapsed && (
              <span className="font-bold text-xl text-white">
                Cisco
              </span>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex h-8 w-8 text-white/70 hover:text-white hover:bg-white/10"
          >
            <ChevronLeft
              className={cn(
                "h-4 w-4 transition-transform",
                collapsed && "rotate-180"
              )}
            />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/70 hover:bg-white/10 hover:text-white transition-colors",
                collapsed && "justify-center px-2"
              )}
              activeClassName="bg-white/20 text-white font-medium"
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {!collapsed && <span className="text-sm">{item.title}</span>}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
