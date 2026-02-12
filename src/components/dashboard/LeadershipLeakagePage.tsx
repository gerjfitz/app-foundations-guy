import { TrendingDown, Building2, Clock, Users, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

const departmentData = [
  { name: "Engineering", shortName: "ENGINEERING", exits: 14 },
  { name: "Sales", shortName: "SALES", exits: 9 },
  { name: "Product", shortName: "PRODUCT", exits: 6 },
  { name: "Marketing", shortName: "MARKETING", exits: 4 },
  { name: "Operations", shortName: "OPERATIONS", exits: 3 },
];

const leavers = [
  {
    id: "1",
    name: "James Anderson",
    role: "STAFF SOFTWARE ENGINEER",
    department: "Engineering",
    tenure: "3.5 Years",
    exitDate: "LEFT OCT 2023",
    signal: "Accelerate",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face",
  },
  {
    id: "2",
    name: "Nina Patel",
    role: "ENTERPRISE SALES LEAD",
    department: "Sales",
    tenure: "2.8 Years",
    exitDate: "LEFT NOV 2023",
    signal: "Nurture",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face",
  },
  {
    id: "3",
    name: "Robert Fox",
    role: "PRODUCT DIRECTOR",
    department: "Product",
    tenure: "4.2 Years",
    exitDate: "LEFT SEP 2023",
    signal: "Accelerate",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face",
  },
  {
    id: "4",
    name: "Emily Davis",
    role: "SENIOR MARKETING MANAGER",
    department: "Marketing",
    tenure: "5.0 Years",
    exitDate: "LEFT DEC 2023",
    signal: "Monitor",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face",
  },
  {
    id: "5",
    name: "Sarah Jenkins",
    role: "DIRECTOR OF PRODUCT",
    department: "Product",
    tenure: "4.5 Years",
    exitDate: "LEFT JAN 2024",
    signal: "Accelerate",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=face",
  },
  {
    id: "6",
    name: "Mike Chen",
    role: "LEAD ARCHITECT",
    department: "Engineering",
    tenure: "6.1 Years",
    exitDate: "LEFT FEB 2024",
    signal: "Nurture",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
  },
  {
    id: "7",
    name: "Amanda Cole",
    role: "REGIONAL OPS MANAGER",
    department: "Operations",
    tenure: "3.8 Years",
    exitDate: "LEFT FEB 2024",
    signal: "Monitor",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&crop=face",
  },
  {
    id: "8",
    name: "David Wright",
    role: "MARKETING STRATEGIST",
    department: "Marketing",
    tenure: "2.5 Years",
    exitDate: "LEFT MAR 2024",
    signal: "Nurture",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop&crop=face",
  },
];

const signalColors: Record<string, string> = {
  Accelerate: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  Nurture: "bg-amber-50 text-amber-700 border border-amber-200",
  Monitor: "bg-slate-100 text-slate-600 border border-slate-200",
};

const LeadershipLeakagePage = () => {
  const totalExits = departmentData.reduce((sum, d) => sum + d.exits, 0);
  const maxExits = Math.max(...departmentData.map(d => d.exits));

  return (
    <div className="min-h-full bg-page-background">
      <div className="py-12 max-w-[1100px] mx-auto">
        {/* Hero Section - Matching Coverage page */}
        <div className="text-center py-12 mb-4">
          <p className="text-sm font-semibold tracking-widest text-muted-foreground uppercase mb-4">
            Retention Risk
          </p>
          <h1 className="text-4xl lg:text-5xl font-extrabold text-foreground mb-4">
            Leadership Leakage
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Analysis of high-potential talent loss and risk factors.
          </p>
        </div>

        {/* Summary Stats - Matching Coverage page style */}
        <div className="mb-10 bg-card border border-border rounded-2xl p-8">
          <div className="grid grid-cols-3 gap-8">
            <div className="text-center border-r border-border">
              <div className="flex justify-center mb-4">
                <div className="p-2.5 rounded-lg" style={{ background: 'rgba(190, 43, 190, 0.1)' }}>
                  <TrendingDown className="h-6 w-6" style={{ color: '#BE2BBE' }} />
                </div>
              </div>
              <div className="flex items-center justify-center mb-1">
                <span className="text-5xl font-bold" style={{ color: '#BE2BBE' }}>
                  {totalExits}
                </span>
              </div>
              <p className="text-sm font-medium text-foreground mb-1">Future Leaders Lost</p>
              <p className="text-xs text-muted-foreground">Total exits in last 12 months</p>
            </div>

            <div className="text-center border-r border-border">
              <div className="flex justify-center mb-4">
                <div className="p-2.5 rounded-lg bg-warning/10">
                  <Building2 className="h-6 w-6 text-warning" />
                </div>
              </div>
              <div className="flex items-center justify-center mb-1">
                <span className="text-5xl font-bold text-foreground">
                  Engineering
                </span>
              </div>
              <p className="text-sm font-medium text-foreground mb-1">Highest Loss Department</p>
              <p className="text-xs text-muted-foreground">14 leaders lost this year</p>
            </div>

            <button className="text-left w-full hover:bg-muted/30 rounded-xl p-2 -m-2 transition-colors cursor-pointer group">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-fuchsia-50 flex-shrink-0 group-hover:bg-fuchsia-100 transition-colors">
                  <Sparkles className="h-6 w-6 text-fuchsia-500" />
                </div>
                <div className="text-left">
                  <h4 className="font-semibold text-foreground mb-1 group-hover:text-fuchsia-600 transition-colors">Ask AI</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Get personalized insights about retention risks, vulnerable departments, and development recommendations.
                  </p>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Chart Section - Vertical Bar Chart with gradient bars */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          <Card className="bg-card border-border mb-8 overflow-hidden">
            <CardContent className="p-8">
              <div className="flex items-start justify-between mb-10">
                <div>
                  <h3 className="text-xl font-semibold text-foreground">Talent Exits by Department</h3>
                  <p className="text-sm text-muted-foreground">High-potential exits over the last 12 months</p>
                </div>
              </div>

              <div className="flex items-end justify-between gap-4 h-96 pt-8">
                {departmentData.map((dept, index) => {
                  const heightPercent = (dept.exits / maxExits) * 100;
                  const opacity = 1 - (index * 0.15);
                  return (
                    <div 
                      key={dept.name} 
                      className="flex-1 flex flex-col items-center gap-6 group bg-muted/30 rounded-2xl p-6 pt-10"
                    >
                      {/* Number with background circle - fixed positioning */}
                      <div className="relative flex items-center justify-center" style={{ width: '60px', height: '60px' }}>
                        <div 
                          className="absolute rounded-full"
                          style={{ 
                            background: `rgba(190, 43, 190, 0.1)`,
                            width: '60px',
                            height: '60px',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                          }}
                        />
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                          className="text-2xl font-bold relative z-10"
                          style={{ color: '#BE2BBE' }}
                        >
                          {dept.exits}
                        </motion.div>
                      </div>
                      <div className="w-full flex items-end justify-center" style={{ height: '200px' }}>
                        <motion.div 
                          initial={{ height: 0 }}
                          animate={{ height: `${heightPercent}%` }}
                          transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
                          className="w-full max-w-20 rounded-t-2xl transition-all duration-300 group-hover:scale-105"
                          style={{ 
                            background: `linear-gradient(to top, rgba(190, 43, 190, ${opacity}) 0%, rgba(190, 43, 190, ${opacity * 0.5}) 100%)`,
                          }}
                        />
                      </div>
                      <span className="text-xs font-semibold text-muted-foreground tracking-wider uppercase">
                        {dept.shortName}
                      </span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Leavers List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-sm font-bold tracking-widest text-muted-foreground uppercase mb-5">
            Talent Lost
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {leavers.map((person) => (
              <Card key={person.id} className="bg-card border-border hover:shadow-lg transition-shadow">
                <CardContent className="p-5">
                  {/* Header with image and exit date */}
                  <div className="flex items-center justify-between mb-4">
                    <img
                      src={person.image}
                      alt={person.name}
                      className="h-14 w-14 rounded-full object-cover"
                    />
                    <span className="text-xs font-medium text-destructive">
                      {person.exitDate}
                    </span>
                  </div>

                  {/* Name and role */}
                  <h3 className="font-semibold text-foreground text-lg">{person.name}</h3>
                  <p className="text-xs text-muted-foreground tracking-wide mb-4">{person.role}</p>

                  {/* Details with icons */}
                  <div className="space-y-3 pt-4 border-t border-border">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Building2 className="h-4 w-4" />
                        <span>Department</span>
                      </div>
                      <span className="font-medium text-foreground">{person.department}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>Tenure</span>
                      </div>
                      <span className="font-medium text-foreground">{person.tenure}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Users className="h-4 w-4" />
                        <span>Signal</span>
                      </div>
                      <Badge className={signalColors[person.signal]}>
                        {person.signal.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LeadershipLeakagePage;