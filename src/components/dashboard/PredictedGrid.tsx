import { useState } from "react";
import { Target, ChevronLeft, ChevronRight, Sparkles, Brain, Radar, TrendingUp, Check, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";

interface PredictedPerson {
  id: string;
  name: string;
  role: string;
  currentRole: string;
  image: string;
  signalYear: number;
  promotedYear: number;
  aiSummary: string;
}

const predictedPeople: PredictedPerson[] = [
  {
    id: "1",
    name: "Dr. Sarah Mitchell",
    role: "Senior Researcher",
    currentRole: "VP of R&D",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=500&fit=crop&crop=face",
    signalYear: 2001,
    promotedYear: 2006,
    aiSummary: "Sarah's early leadership signals emerged through her cross-functional collaboration patterns and mentorship of junior researchers. The model detected a 3x increase in peer recognition and strategic project ownership before her official promotion.",
  },
  {
    id: "2",
    name: "James Chen",
    role: "Engineering Lead",
    currentRole: "SVP of Manufacturing",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop&crop=face",
    signalYear: 2003,
    promotedYear: 2009,
    aiSummary: "James showed early signs of executive potential through his ability to influence across departments without formal authority. His recognition network expanded 4x in the 18 months before promotion, signaling growing organizational impact.",
  },
  {
    id: "3",
    name: "Maria Rodriguez",
    role: "Product Manager",
    currentRole: "Chief Product Officer",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=500&fit=crop&crop=face",
    signalYear: 2005,
    promotedYear: 2011,
    aiSummary: "Maria's trajectory was marked by consistent innovation leadership and stakeholder alignment. The model identified her unique ability to translate customer insights into strategic initiatives, a key VP+ competency.",
  },
  {
    id: "4",
    name: "David Kim",
    role: "Sales Director",
    currentRole: "EVP of Global Sales",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=500&fit=crop&crop=face",
    signalYear: 2008,
    promotedYear: 2014,
    aiSummary: "David's leadership DNA showed strong strategic thinking combined with team development capabilities. His peer recognition patterns indicated influence well beyond his direct reports, predicting executive readiness.",
  },
  {
    id: "5",
    name: "Emily Thompson",
    role: "Clinical Director",
    currentRole: "VP of Clinical Operations",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=500&fit=crop&crop=face",
    signalYear: 2010,
    promotedYear: 2016,
    aiSummary: "Emily demonstrated exceptional crisis leadership and cross-team collaboration early in her career. The model detected her growing influence network and decision-making authority as key promotion indicators.",
  },
];

interface PredictedGridProps {
  onViewPredicted: () => void;
}

const PredictedGrid = ({ onViewPredicted }: PredictedGridProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [lightboxPerson, setLightboxPerson] = useState<PredictedPerson | null>(null);
  
  const currentPerson = predictedPeople[currentIndex];
  const yearsAdvance = currentPerson.promotedYear - currentPerson.signalYear;

  // Data for prediction cards (Option 4) - using same data structure as other layouts
  const predictionCards = [
    {
      id: 1,
      signalYear: 2001,
      promotedYear: 2006,
      name: "Dr. Sarah Mitchell",
      role: "Senior Researcher",
      currentRole: "VP of R&D",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face",
      aiSummary: "Early leadership signals emerged through cross-functional collaboration and mentorship patterns. Model detected 3x increase in peer recognition before promotion.",
    },
    {
      id: 2,
      signalYear: 2003,
      promotedYear: 2009,
      name: "James Chen",
      role: "Engineering Lead",
      currentRole: "SVP of Manufacturing",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
      aiSummary: "Showed executive potential through cross-departmental influence without formal authority. Recognition network expanded 4x in 18 months before promotion.",
    },
    {
      id: 3,
      signalYear: 2005,
      promotedYear: 2011,
      name: "Maria Rodriguez",
      role: "Product Manager",
      currentRole: "Chief Product Officer",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop&crop=face",
      aiSummary: "Trajectory marked by innovation leadership and stakeholder alignment. Model identified unique ability to translate customer insights into strategic initiatives.",
    },
    {
      id: 4,
      signalYear: 2008,
      promotedYear: 2014,
      name: "David Kim",
      role: "Sales Director",
      currentRole: "EVP of Global Sales",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face",
      aiSummary: "Leadership DNA showed strong strategic thinking with team development capabilities. Peer recognition indicated influence well beyond direct reports.",
    },
    {
      id: 5,
      signalYear: 2010,
      promotedYear: 2016,
      name: "Emily Thompson",
      role: "Clinical Director",
      currentRole: "VP of Clinical Operations",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop&crop=face",
      aiSummary: "Demonstrated exceptional crisis leadership and cross-team collaboration early in career. Growing influence network and decision-making authority were key indicators.",
    },
  ];
  const [cardIndex, setCardIndex] = useState(1);

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev === 0 ? predictedPeople.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev === predictedPeople.length - 1 ? 0 : prev + 1));
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 100 : -100,
      opacity: 0,
    }),
  };

  // Layout 1: Horizontal (Original)
  const renderHorizontalLayout = () => (
    <div className="bg-card rounded-2xl shadow-sm overflow-hidden">
      <div className="flex flex-col lg:flex-row">
        <div className="flex-1 p-8 lg:p-10 overflow-hidden">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentPerson.id}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <div className="flex items-center gap-6 mb-10">
                <img 
                  src={currentPerson.image}
                  alt={currentPerson.name}
                  className="w-32 h-32 rounded-2xl object-cover shadow-md"
                />
                <div>
                  <h3 className="text-2xl font-bold text-foreground">{currentPerson.name}</h3>
                  <p className="text-muted-foreground mt-1">{currentPerson.role}</p>
                  <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-success/10 text-success text-sm font-medium">
                    <Sparkles className="w-4 h-4" />
                    Now {currentPerson.currentRole}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center mx-auto shadow-md">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-3xl font-bold text-primary mt-3">{currentPerson.signalYear}</p>
                  <p className="text-sm text-muted-foreground">Predicted</p>
                </div>

                <div className="flex-1 flex items-center">
                  <div className="flex-1 border-t-2 border-dashed border-muted-foreground/30" />

                  {/* Large circular years early indicator */}
                  <div className="relative z-10 px-[15px] rounded-full bg-card">
                    <div className="relative w-20 h-20 flex items-center justify-center">
                      {/* Outer transparent ring */}
                      <div
                        className="absolute inset-0 rounded-full"
                        style={{ backgroundColor: 'rgba(199, 118, 207, 0.06)' }}
                      />
                      {/* Main circle */}
                      <div
                        className="relative w-16 h-16 rounded-full flex flex-col items-center justify-center"
                        style={{ backgroundColor: 'rgba(199, 118, 207, 0.12)' }}
                      >
                        <span className="text-xl font-bold text-foreground">{yearsAdvance}</span>
                        <span className="text-[10px] text-muted-foreground leading-none">Yrs</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 border-t-2 border-dashed border-muted-foreground/30" />
                </div>

                <div className="text-center">
                  <div className="w-14 h-14 rounded-full bg-success flex items-center justify-center mx-auto shadow-md">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-3xl font-bold text-success mt-3">{currentPerson.promotedYear}</p>
                  <p className="text-sm text-muted-foreground">Promoted</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="w-full lg:w-80 p-8 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-border">
          <div className="rounded-xl p-5" style={{ backgroundColor: '#FEFBFF' }}>
            <div className="flex items-center gap-2 mb-4">
              <Brain className="w-5 h-5 text-primary" />
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">AI Prediction Insight</p>
            </div>
            <AnimatePresence mode="wait">
              <motion.p
                key={currentPerson.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="text-sm text-foreground/80 leading-relaxed"
              >
                {currentPerson.aiSummary}
              </motion.p>
            </AnimatePresence>
          </div>

          <div className="mt-8 pt-6">
            <div className="flex items-center justify-between">
              <button
                onClick={handlePrev}
                className="w-10 h-10 rounded-full bg-white dark:bg-card border border-border flex items-center justify-center hover:bg-muted transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-foreground" />
              </button>
              
              <div className="flex gap-2">
                {predictedPeople.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setDirection(index > currentIndex ? 1 : -1);
                      setCurrentIndex(index);
                    }}
                    className={`h-2 rounded-full transition-all ${
                      index === currentIndex 
                        ? 'bg-primary w-6' 
                        : 'bg-muted-foreground/30 w-2 hover:bg-muted-foreground/50'
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={handleNext}
                className="w-10 h-10 rounded-full bg-white dark:bg-card border border-border flex items-center justify-center hover:bg-muted transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-foreground" />
              </button>
            </div>
            <p className="text-center text-sm text-muted-foreground mt-3">
              {currentIndex + 1} of {predictedPeople.length} leaders
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  // Layout 1: Split Layout - Avatar/Info Left, Timeline/Insight Right
  const renderMinimalLayout = () => (
    <div className="flex gap-8">
      {/* Left: Avatar, Name, Role - Outside the panel */}
      <div className="flex-shrink-0 w-80 flex flex-col items-center">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentPerson.id}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="flex flex-col items-center text-center"
          >
            {/* Siri-style glow background */}
            <div className="relative mb-5">
              <div 
                className="absolute inset-[-12px] rounded-full animate-pulse"
                style={{
                  background: "radial-gradient(circle, rgba(199, 118, 207, 0.4) 0%, rgba(139, 92, 246, 0.3) 50%, transparent 70%)",
                  filter: "blur(16px)",
                }}
              />
              <img 
                src={currentPerson.image}
                alt={currentPerson.name}
                className="relative w-40 h-40 rounded-full object-cover shadow-lg border-4 border-white"
              />
            </div>
            <h3 className="text-xl font-bold text-foreground">{currentPerson.name}</h3>
            <p className="text-muted-foreground text-sm">{currentPerson.role}</p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Right: Timeline, AI Insight, and Navigation */}
      <div className="flex-1 flex flex-col">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={`content-${currentPerson.id}`}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="bg-card rounded-2xl p-10"
          >
            {/* Timeline with large centered circle and icons on top */}
            <div className="flex items-center gap-4 mb-8">
              <div className="text-center">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
                  <Radar className="w-5 h-5 text-primary" />
                </div>
                <p className="text-3xl font-bold text-primary">{currentPerson.signalYear}</p>
                <p className="text-xs text-muted-foreground mt-1">Predicted</p>
              </div>
              
              <div className="flex-1 flex items-center">
                <div className="flex-1 border-t-2 border-dashed border-muted-foreground/30" />

                {/* Large circular years early indicator */}
                <div className="relative z-10 px-[15px] rounded-full bg-card">
                  <div className="relative w-20 h-20 flex items-center justify-center">
                    {/* Outer transparent ring */}
                    <div
                      className="absolute inset-0 rounded-full"
                      style={{ backgroundColor: 'rgba(199, 118, 207, 0.06)' }}
                    />
                    {/* Main circle */}
                    <div
                      className="relative w-16 h-16 rounded-full flex flex-col items-center justify-center"
                      style={{ backgroundColor: 'rgba(199, 118, 207, 0.12)' }}
                    >
                      <span className="text-xl font-bold text-foreground">{yearsAdvance}</span>
                      <span className="text-[10px] text-muted-foreground leading-none">Yrs</span>
                    </div>
                  </div>
                </div>

                <div className="flex-1 border-t-2 border-dashed border-muted-foreground/30" />
              </div>
              
              <div className="text-center">
                <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-2">
                  <TrendingUp className="w-5 h-5 text-success" />
                </div>
                <p className="text-3xl font-bold text-success">{currentPerson.promotedYear}</p>
                <p className="text-xs text-muted-foreground mt-1">Promoted</p>
              </div>
            </div>

            {/* AI Insight in subtle panel */}
            <div className="rounded-xl p-5" style={{ backgroundColor: 'rgba(199, 118, 207, 0.15)' }}>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">AI Insight</p>
              <p className="text-sm text-foreground/80 leading-relaxed">
                {currentPerson.aiSummary}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation - Centered under right panel */}
        <div className="flex items-center justify-center gap-4 mt-8">
          <button
            onClick={handlePrev}
            className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-foreground" />
          </button>
          
          <div className="flex gap-2">
            {predictedPeople.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setDirection(index > currentIndex ? 1 : -1);
                  setCurrentIndex(index);
                }}
                className={`h-2 rounded-full transition-all ${
                  index === currentIndex 
                    ? 'bg-primary w-6' 
                    : 'bg-muted-foreground/30 w-2 hover:bg-muted-foreground/50'
                }`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-foreground" />
          </button>
        </div>
      </div>
    </div>
  );

  // Layout 2: Dark Version
  const renderDarkLayout = () => (
    <div className="bg-slate-900 rounded-2xl shadow-sm overflow-hidden">
      <div className="flex flex-col lg:flex-row">
        <div className="flex-1 p-8 lg:p-10 overflow-hidden">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentPerson.id}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              {/* Centered Avatar and Info */}
              <div className="flex flex-col items-center text-center mb-10">
                <img 
                  src={currentPerson.image}
                  alt={currentPerson.name}
                  className="w-40 h-40 rounded-2xl object-cover shadow-md mb-4"
                />
                <h3 className="text-2xl font-bold text-white">{currentPerson.name}</h3>
                <p className="text-slate-400 mt-1">{currentPerson.role}</p>
                <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-success/20 text-success text-sm font-medium">
                  <Sparkles className="w-4 h-4" />
                  Now {currentPerson.currentRole}
                </div>
              </div>

              {/* Timeline without years early circle */}
              <div className="flex items-center justify-center gap-6">
                <div className="text-center">
                  <div className="w-14 h-14 rounded-full bg-purple-400/20 flex items-center justify-center mx-auto shadow-md">
                    <Target className="w-6 h-6 text-purple-400" />
                  </div>
                  <p className="text-3xl font-bold text-purple-400 mt-3">{currentPerson.signalYear}</p>
                  <p className="text-sm text-slate-400">First Signal</p>
                </div>

                <div className="w-32 border-t-2 border-dashed border-slate-600" />

                <div className="text-center">
                  <div className="w-14 h-14 rounded-full bg-success/20 flex items-center justify-center mx-auto shadow-md">
                    <Sparkles className="w-6 h-6 text-success" />
                  </div>
                  <p className="text-3xl font-bold text-success mt-3">{currentPerson.promotedYear}</p>
                  <p className="text-sm text-slate-400">Promoted</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="w-full lg:w-80 p-8 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-slate-700">
          <div className="rounded-xl p-5" style={{ backgroundColor: 'rgba(199, 118, 207, 0.15)' }}>
            <div className="flex items-center gap-2 mb-4">
              <Brain className="w-5 h-5 text-purple-400" />
              <p className="text-xs font-semibold text-purple-300 uppercase tracking-wider">AI Prediction Insight</p>
            </div>
            <AnimatePresence mode="wait">
              <motion.p
                key={currentPerson.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="text-sm text-slate-200 leading-relaxed"
              >
                {currentPerson.aiSummary}
              </motion.p>
            </AnimatePresence>
          </div>

          <div className="mt-8 pt-6">
            <div className="flex items-center justify-between">
              <button
                onClick={handlePrev}
                className="w-10 h-10 rounded-full bg-slate-800 border border-slate-600 flex items-center justify-center hover:bg-slate-700 transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-white" />
              </button>
              
              <div className="flex gap-2">
                {predictedPeople.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setDirection(index > currentIndex ? 1 : -1);
                      setCurrentIndex(index);
                    }}
                    className={`h-2 rounded-full transition-all ${
                      index === currentIndex 
                        ? 'bg-primary w-6' 
                        : 'bg-slate-600 w-2 hover:bg-slate-500'
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={handleNext}
                className="w-10 h-10 rounded-full bg-slate-800 border border-slate-600 flex items-center justify-center hover:bg-slate-700 transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-white" />
              </button>
            </div>
            <p className="text-center text-sm text-slate-400 mt-3">
              {currentIndex + 1} of {predictedPeople.length} leaders
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  // Layout 4: Clean Card Grid with Lightbox
  const renderStatsLayout = () => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {predictedPeople.map((person) => {
          const years = person.promotedYear - person.signalYear;
          return (
            <button
              key={person.id}
              onClick={() => setLightboxPerson(person)}
              className="bg-card rounded-2xl overflow-hidden transition-all text-left hover:shadow-lg hover:ring-2 hover:ring-primary/50 border border-border group"
            >
              {/* Image */}
              <div className="aspect-square overflow-hidden">
                <img 
                  src={person.image}
                  alt={person.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              
              {/* Content below image */}
              <div className="p-4">
                <h3 className="font-semibold text-foreground text-sm truncate">{person.name}</h3>
                <p className="text-xs text-muted-foreground truncate mt-0.5">{person.role}</p>
                
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    <span className="text-xs font-semibold text-primary">{person.signalYear}</span>
                  </div>
                  <div 
                    className="w-20 h-20 rounded-full flex flex-col items-center justify-center"
                    style={{ backgroundColor: 'rgba(199, 118, 207, 0.12)' }}
                  >
                    <span className="text-xl font-bold text-foreground">{years}</span>
                    <span className="text-[10px] text-muted-foreground leading-none">Yrs</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-success" />
                    <span className="text-xs font-semibold text-success">{person.promotedYear}</span>
                  </div>
                </div>
                
                <p className="text-xs text-success mt-2 truncate text-center">{person.currentRole}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Lightbox Dialog */}
      <Dialog open={!!lightboxPerson} onOpenChange={() => setLightboxPerson(null)}>
        <DialogContent className="max-w-2xl p-0 overflow-hidden">
          <DialogTitle className="sr-only">
            {lightboxPerson?.name} - Leadership Journey
          </DialogTitle>
          {lightboxPerson && (
            <div className="flex flex-col md:flex-row">
              {/* Image */}
              <div className="w-full md:w-1/3 aspect-square md:aspect-auto">
                <img 
                  src={lightboxPerson.image}
                  alt={lightboxPerson.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Content */}
              <div className="flex-1 p-6">
                <div className="mb-4">
                  <h3 className="text-2xl font-bold text-foreground">{lightboxPerson.name}</h3>
                  <p className="text-muted-foreground">{lightboxPerson.role}</p>
                  <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-success/10 text-success text-sm font-medium">
                    <Sparkles className="w-4 h-4" />
                    Now {lightboxPerson.currentRole}
                  </div>
                </div>

                {/* Timeline */}
                <div className="flex items-center gap-4 mb-6 p-4 bg-muted/50 rounded-xl">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary">{lightboxPerson.signalYear}</p>
                    <p className="text-xs text-muted-foreground">Signal</p>
                  </div>
                  <div className="flex-1 flex items-center justify-center">
                    <span className="px-3 py-1 rounded-full bg-primary text-white text-sm font-bold">
                      {lightboxPerson.promotedYear - lightboxPerson.signalYear} Years Early
                    </span>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-success">{lightboxPerson.promotedYear}</p>
                    <p className="text-xs text-muted-foreground">Promoted</p>
                  </div>
                </div>

                {/* AI Overview */}
                <div className="bg-primary/5 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Brain className="w-4 h-4 text-primary" />
                    <span className="text-xs font-semibold text-primary uppercase tracking-wider">AI Prediction Insight</span>
                  </div>
                  <p className="text-sm text-foreground/80 leading-relaxed">
                    {lightboxPerson.aiSummary}
                  </p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );

  // Layout 4: Prediction Quote Cards
  const getVisibleCards = () => {
    const cards = [];
    for (let i = -1; i <= 1; i++) {
      const idx = (cardIndex + i + predictionCards.length) % predictionCards.length;
      cards.push({ ...predictionCards[idx], position: i });
    }
    return cards;
  };

  const [yearlyIndex, setYearlyIndex] = useState(0);
  const maxYearlyIndex = predictionCards.length - 3;

  const renderYearlyLayout = () => {
    return (
      <div className="relative">
        {/* Fade overlays on edges */}
        <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
        
        {/* Cards Container */}
        <div className="overflow-hidden px-4">
          <motion.div 
            className="flex gap-5"
            animate={{ x: -yearlyIndex * 300 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {predictionCards.map((card, idx) => {
              const yearsEarly = card.promotedYear - card.signalYear;
              
              return (
                <motion.div
                  key={card.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex-shrink-0 w-[280px] bg-card rounded-2xl border border-border overflow-hidden cursor-pointer group hover:border-primary/30 transition-all"
                  style={{ boxShadow: '0 4px 20px -4px rgba(199, 118, 207, 0.15), 0 2px 8px -2px rgba(0, 0, 0, 0.06)' }}
                >
                  {/* Content section */}
                  <div className="p-5 pt-6 text-center">
                    {/* Profile image - circular with Siri glow */}
                    <div className="flex justify-center mb-4">
                      <div className="relative">
                        {/* Siri-style glow background */}
                        <div 
                          className="absolute inset-[-8px] rounded-full animate-pulse"
                          style={{
                            background: "radial-gradient(circle, rgba(199, 118, 207, 0.4) 0%, rgba(139, 92, 246, 0.3) 50%, transparent 70%)",
                            filter: "blur(10px)",
                          }}
                        />
                        <img 
                          src={card.image}
                          alt={card.name}
                          className="relative w-28 h-28 rounded-full object-cover border-4 border-white shadow-lg group-hover:scale-105 transition-transform"
                        />
                      </div>
                    </div>

                    <div className="flex justify-center mb-8">
                      <span className="px-3 py-1 rounded-full text-xs font-semibold" style={{ backgroundColor: 'rgba(199, 118, 207, 0.12)', color: 'rgba(199, 118, 207, 1)' }}>
                        {yearsEarly} Yrs Early
                      </span>
                    </div>

                    {/* Name and role */}
                    <h4 className="text-lg font-bold text-foreground mb-1">
                      {card.name}
                    </h4>
                    <p className="text-sm text-muted-foreground mb-6">
                      {card.role}
                    </p>

                    {/* Timeline */}
                    <div className="flex items-center gap-3 mb-4 p-3 bg-muted/50 rounded-xl">
                      <div className="text-center flex-1">
                        <p className="text-lg font-bold text-primary">{card.signalYear}</p>
                        <p className="text-xs text-muted-foreground">Signal</p>
                      </div>
                      <div className="w-8 h-0.5 bg-gradient-to-r from-primary to-success" />
                      <div className="text-center flex-1">
                        <p className="text-lg font-bold text-success">{card.promotedYear}</p>
                        <p className="text-xs text-muted-foreground">Promoted</p>
                      </div>
                    </div>

                    {/* Current role badge */}
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-success/10 text-success text-xs font-medium border border-success/20">
                      <Sparkles className="w-3.5 h-3.5" />
                      Now {card.currentRole}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-center gap-4 mt-8">
          <button
            onClick={() => setYearlyIndex((prev) => Math.max(0, prev - 1))}
            disabled={yearlyIndex === 0}
            className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-5 h-5 text-foreground" />
          </button>
          
          <div className="flex gap-2">
            {Array.from({ length: maxYearlyIndex + 1 }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setYearlyIndex(idx)}
                className={`h-2 rounded-full transition-all ${
                  idx === yearlyIndex 
                    ? 'bg-primary w-6' 
                    : 'bg-muted-foreground/30 w-2 hover:bg-muted-foreground/50'
                }`}
              />
            ))}
          </div>

          <button
            onClick={() => setYearlyIndex((prev) => Math.min(maxYearlyIndex, prev + 1))}
            disabled={yearlyIndex >= maxYearlyIndex}
            className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-5 h-5 text-foreground" />
          </button>
        </div>
      </div>
    );
  };

  // Layout 5: Horizontal Scrollable Cards with Carousel Navigation
  const scrollCardColors = [
    { bg: 'rgba(199, 118, 207, 0.25)', accent: 'hsl(var(--primary))' },
    { bg: 'rgba(34, 197, 94, 0.2)', accent: 'hsl(var(--success))' },
    { bg: 'rgba(59, 130, 246, 0.2)', accent: 'rgb(59, 130, 246)' },
    { bg: 'rgba(249, 115, 22, 0.2)', accent: 'rgb(249, 115, 22)' },
    { bg: 'rgba(168, 85, 247, 0.2)', accent: 'rgb(168, 85, 247)' },
  ];

  const [scrollIndex, setScrollIndex] = useState(0);
  const maxScrollIndex = predictionCards.length - 3;

  const renderScrollLayout = () => (
    <div className="relative -mr-[calc((100vw-1100px)/2+1rem)] pr-4">
      {/* Cards Container - extends to right edge */}
      <div className="overflow-hidden">
        <motion.div 
          className="flex gap-5"
          animate={{ x: -scrollIndex * 340 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          {predictionCards.map((card, idx) => {
            const yearsEarly = card.promotedYear - card.signalYear;
            
            return (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="flex-shrink-0 w-80 h-[480px] rounded-3xl overflow-hidden cursor-pointer group flex flex-col bg-card border border-border"
                style={{ boxShadow: '0 4px 20px -4px rgba(199, 118, 207, 0.15), 0 2px 8px -2px rgba(0, 0, 0, 0.08)' }}
              >
                {/* Top section with name and description (fixed height so avatars align) */}
                <div className="p-8 pb-0 h-[130px]">
                  {/* Title */}
                  <h3 className="text-2xl font-bold text-foreground leading-tight mb-2 overflow-hidden text-ellipsis whitespace-nowrap">
                    {card.name}
                  </h3>

                  {/* Description (fixed block height; overflow hidden to keep rows consistent) */}
                  <p className="text-sm text-muted-foreground leading-relaxed overflow-hidden">
                    From {card.role} to {card.currentRole}. Predicted {yearsEarly} years in advance.
                  </p>
                </div>

                {/* Image section - fixed height + slightly lowered to avoid hugging the top */}
                <div className="h-[220px] flex items-center justify-center pt-4">
                  <div className="relative">
                    {/* Subtle gradient glow behind profile */}
                    <div 
                      className="absolute -inset-3 rounded-full blur-xl"
                      style={{
                        background: 'radial-gradient(ellipse at 50% 50%, rgba(199, 118, 207, 0.35) 0%, transparent 70%)',
                      }}
                    />
                    <img 
                      src={card.image}
                      alt={card.name}
                      className="relative z-10 w-36 h-36 rounded-full object-cover border-4 border-white shadow-lg group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </div>

                {/* Bottom section - Years early pill and Timeline */}
                <div className="p-8 pt-0 flex flex-col items-center gap-4">
                  {/* Years early pill */}
                  <span className="px-4 py-1.5 rounded-full text-sm font-semibold" style={{ backgroundColor: 'rgba(199, 118, 207, 0.12)', color: 'rgba(199, 118, 207, 1)' }}>
                    {yearsEarly} Yrs Early
                  </span>
                  
                  {/* Timeline */}
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold text-primary">{card.signalYear}</span>
                    <div className="w-16 border-t-2 border-dashed border-muted-foreground/40" />
                    <span className="text-lg font-bold text-success">{card.promotedYear}</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* Navigation Arrows - Left aligned */}
      <div className="flex items-center gap-4 mt-8">
        <button
          onClick={() => setScrollIndex((prev) => Math.max(0, prev - 1))}
          disabled={scrollIndex === 0}
          className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-5 h-5 text-foreground" />
        </button>
        <button
          onClick={() => setScrollIndex((prev) => Math.min(maxScrollIndex, prev + 1))}
          disabled={scrollIndex >= maxScrollIndex}
          className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronRight className="w-5 h-5 text-foreground" />
        </button>
      </div>
    </div>
  );

  // Layout 6: Expandable Accordion Cards
  const [expandedCard, setExpandedCard] = useState<number | null>(0); // Default first card open

  const renderBentoLayout = () => (
    <div className="flex gap-3 h-[420px]">
      {predictionCards.map((card, idx) => {
        const isExpanded = expandedCard === idx;
        const yearsEarly = card.promotedYear - card.signalYear;
        
        return (
          <motion.div
            key={card.id}
            layout
            onClick={() => setExpandedCard(idx)}
            className={`relative rounded-3xl overflow-hidden cursor-pointer ${
              isExpanded ? 'flex-[3] bg-card' : 'flex-[0.6]'
            }`}
            initial={false}
            animate={{ flex: isExpanded ? 3 : 0.6 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {/* Collapsed: Show image with overlay */}
            {!isExpanded && (
              <>
                <img 
                  src={card.image}
                  alt={card.name}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
                <div className="absolute inset-0 flex flex-col items-center justify-end pb-6">
                  <div 
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap"
                    style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
                  >
                    <span className="text-white font-semibold text-lg tracking-wide">
                      {card.name.split(' ').slice(-1)[0]}
                    </span>
                  </div>
                  <div className="px-3 py-1.5 bg-success/90 backdrop-blur-sm rounded-full">
                    <span className="text-xs font-medium text-white">{yearsEarly}yr</span>
                  </div>
                </div>
              </>
            )}

            {/* Expanded: White background with content left, image right */}
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.15 }}
                className="absolute inset-0 flex flex-col p-8"
              >
                {/* Top: Pill */}
                <div className="flex items-center gap-3 mb-6">
                  <span className="px-3 py-1.5 bg-primary text-white rounded-full text-xs font-medium">
                    {yearsEarly} Years Early
                  </span>
                </div>

                {/* Middle: Content left, Image right - vertically aligned */}
                <div className="flex items-center gap-6 flex-1">
                  {/* Left: Name, Title, Description */}
                  <div className="flex-1">
                    <h3 className="text-3xl font-bold text-foreground mb-1">{card.name}</h3>
                    <p className="text-muted-foreground text-base mb-4">{card.role}</p>
                    <p className="text-muted-foreground text-sm leading-relaxed max-w-sm line-clamp-3">
                      {card.aiSummary}
                    </p>
                  </div>

                  {/* Right: Image */}
                  <div className="w-40 h-40 flex-shrink-0">
                    <img 
                      src={card.image}
                      alt={card.name}
                      className="w-full h-full object-cover rounded-2xl"
                    />
                  </div>
                </div>

                {/* Bottom: Timeline - Full width */}
                <div className="flex items-center gap-4 mt-6">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-foreground">{card.signalYear}</p>
                    <p className="text-xs text-muted-foreground">Predicted</p>
                  </div>
                  <div className="flex-1">
                    <div className="w-full border-t-2 border-dashed border-muted-foreground/40" />
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-success">{card.promotedYear}</p>
                    <p className="text-xs text-muted-foreground">Promoted</p>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        );
      })}
    </div>
  );

  // Layout 7: Featured Person with Design Elements
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const featuredPerson = predictionCards[featuredIndex];
  const featuredYearsEarly = featuredPerson.promotedYear - featuredPerson.signalYear;

  const renderFeaturedLayout = () => (
    <div className="flex gap-12 items-start">
      {/* Left Side - Person Feature */}
      <div className="relative flex-shrink-0">
        {/* Decorative elements */}
        <div className="absolute -top-4 -left-4 w-24 h-24 rounded-2xl border-2 border-primary/20" />
        <div className="absolute bottom-16 -left-2 w-2 h-2 rounded-full bg-success" />
        
        {/* Stats floating card */}
        <motion.div 
          className="absolute bottom-8 -left-6 px-6 py-5 bg-success rounded-xl shadow-lg z-10 text-center"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          key={`years-${featuredIndex}`}
        >
          <p className="text-4xl font-bold text-white">{featuredYearsEarly}</p>
          <p className="text-sm text-white/80">Years Early</p>
        </motion.div>

        {/* Main person image */}
        <div className="relative ml-8">
          <motion.div
            key={featuredIndex}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="relative"
          >
            <img 
              src={featuredPerson.image}
              alt={featuredPerson.name}
              className="w-72 h-80 object-cover rounded-3xl shadow-xl"
            />
          </motion.div>
        </div>
      </div>

      {/* Right Side - Info, AI Insight & Navigation */}
      <div className="flex-1 flex flex-col">
        {/* Name & Timeline Panel */}
        <motion.div
          key={`info-${featuredIndex}`}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-card rounded-2xl p-8 shadow-sm border border-border"
        >
          <h3 className="text-4xl font-bold text-foreground text-center">{featuredPerson.name}</h3>
          <p className="text-lg text-muted-foreground mt-1 mb-6 text-center">{featuredPerson.role}</p>

          {/* Timeline */}
          <div className="flex items-center justify-center gap-6">
            <div className="bg-muted/50 rounded-xl px-5 py-3 text-center">
              <p className="text-3xl font-bold text-foreground">{featuredPerson.signalYear}</p>
              <p className="text-sm text-muted-foreground">Predicted</p>
            </div>
            <div className="flex-1 min-w-64 h-1 border-t-2 border-dashed border-foreground/30" />
            <div className="bg-muted/50 rounded-xl px-5 py-3 text-center">
              <p className="text-3xl font-bold text-success">{featuredPerson.promotedYear}</p>
              <p className="text-sm text-muted-foreground">Promoted</p>
            </div>
          </div>
        </motion.div>

        {/* AI Insight Panel */}
        <motion.div 
          className="p-8 rounded-2xl mt-4"
          style={{ backgroundColor: 'rgba(199, 118, 207, 0.15)' }}
          key={`insight-${featuredIndex}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <div className="flex items-center justify-center gap-2 mb-3">
            <Brain className="w-5 h-5 text-primary" />
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">AI Insight</span>
          </div>
          <p className="text-sm text-foreground leading-relaxed text-center">
            Leadership signal detected {featuredYearsEarly} years before promotion. Pattern recognition identified cross-functional influence and strategic project ownership as key indicators.
          </p>
        </motion.div>

        {/* Navigation - Centered under right panels */}
        <div className="flex items-center justify-center gap-4 mt-8">
          <button
            onClick={() => setFeaturedIndex((prev) => (prev === 0 ? predictionCards.length - 1 : prev - 1))}
            className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-foreground" />
          </button>
          
          <div className="flex gap-2">
            {predictionCards.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setFeaturedIndex(idx)}
                className={`h-2 rounded-full transition-all ${
                  idx === featuredIndex 
                    ? 'bg-primary w-6' 
                    : 'bg-muted-foreground/30 w-2 hover:bg-muted-foreground/50'
                }`}
              />
            ))}
          </div>

          <button
            onClick={() => setFeaturedIndex((prev) => (prev === predictionCards.length - 1 ? 0 : prev + 1))}
            className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-foreground" />
          </button>
        </div>
      </div>
    </div>
  );


  // Layout 7: Magazine - Editorial asymmetric layout
  const [magazineIndex, setMagazineIndex] = useState(0);
  const magazinePerson = predictedPeople[magazineIndex];
  const magazineYearsEarly = magazinePerson.promotedYear - magazinePerson.signalYear;

  const renderMagazineLayout = () => (
    <div className="relative">
      {/* Large background number */}
      <div className="absolute -top-8 -right-4 text-[200px] font-black text-primary/5 leading-none select-none pointer-events-none z-0">
        {magazineYearsEarly}
      </div>
      
      <div className="relative z-10 grid grid-cols-12 gap-6 items-center ml-16">
        {/* Left column - Large typography */}
        <div className="col-span-5">
          <motion.div
            key={`mag-text-${magazineIndex}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-success/10 text-success text-sm font-semibold mb-4">
              <TrendingUp className="w-4 h-4" />
              {magazineYearsEarly} Years Before Promotion
            </div>
            
            <h3 className="text-5xl font-black text-foreground leading-tight mb-2">
              {magazinePerson.name.split(' ')[0]}
              <br />
              <span className="text-primary">{magazinePerson.name.split(' ').slice(1).join(' ')}</span>
            </h3>
            
            <p className="text-xl text-muted-foreground mb-6">{magazinePerson.role}</p>
            
            {/* Vertical timeline */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex flex-col items-center">
                <div className="w-3 h-3 rounded-full bg-primary" />
                <div className="w-0.5 h-12 bg-gradient-to-b from-primary to-success" />
                <div className="w-3 h-3 rounded-full bg-success" />
              </div>
              <div className="flex flex-col justify-between h-[60px]">
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-foreground">{magazinePerson.signalYear}</span>
                  <span className="text-sm text-muted-foreground">Signal Detected</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-success">{magazinePerson.promotedYear}</span>
                  <span className="text-sm text-muted-foreground">Promoted to VP</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
        
        {/* Center - Image with overlay */}
        <div className="col-span-3 relative">
          <motion.div
            key={`mag-img-${magazineIndex}`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent rounded-3xl transform rotate-3" />
            <img 
              src={magazinePerson.image}
              alt={magazinePerson.name}
              className="w-full aspect-[3/4] object-cover rounded-3xl shadow-2xl relative z-10"
            />
            {/* Floating badge */}
            <div className="absolute -bottom-4 -right-4 z-20 bg-card rounded-2xl shadow-xl p-4 border border-border">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-success flex items-center justify-center">
                  <Check className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Now</p>
                  <p className="text-sm font-semibold text-foreground">{magazinePerson.currentRole}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
        
        {/* Right column - AI Insight card */}
        <div className="col-span-3">
          <motion.div
            key={`mag-insight-${magazineIndex}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="rounded-2xl p-6"
            style={{ backgroundColor: 'rgba(199, 118, 207, 0.15)' }}
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                <Brain className="w-4 h-4 text-primary" />
              </div>
              <span className="text-xs font-semibold text-primary uppercase tracking-wider">AI Insight</span>
            </div>
            <p className="text-sm text-foreground leading-relaxed">
              {magazinePerson.aiSummary.slice(0, 150)}...
            </p>
            <button className="mt-4 flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80 transition-colors">
              Read full analysis
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        </div>
      </div>
      
      {/* Navigation */}
      <div className="flex items-center justify-center gap-4 mt-10">
        <button 
          onClick={() => setMagazineIndex(prev => prev === 0 ? predictedPeople.length - 1 : prev - 1)}
          className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-foreground" />
        </button>
        
        <div className="flex gap-2">
          {predictedPeople.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setMagazineIndex(idx)}
              className={`h-2 rounded-full transition-all ${
                idx === magazineIndex ? 'w-8 bg-primary' : 'w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50'
              }`}
            />
          ))}
        </div>
        
        <button 
          onClick={() => setMagazineIndex(prev => prev === predictedPeople.length - 1 ? 0 : prev + 1)}
          className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors"
        >
          <ChevronRight className="w-5 h-5 text-foreground" />
        </button>
      </div>
    </div>
  );


  return (
    <section className="py-12 pb-16">
      <div className="max-w-[1100px] mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div 
              className="h-12 w-12 rounded-full flex items-center justify-center"
              style={{ backgroundColor: 'rgba(199, 118, 207, 0.12)' }}
            >
              <Target className="h-6 w-6" style={{ color: 'rgba(199, 118, 207, 1)' }} />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-foreground">Proven Predictions</h2>
              <p className="text-muted-foreground">
                Model accuracy validated against <span className="text-foreground">historical promotions</span>
              </p>
            </div>
          </div>
          
          <button 
            onClick={onViewPredicted}
            className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
          >
            View All →
          </button>
        </div>

        {/* Render scroll layout (default) */}
        {renderScrollLayout()}
        
      </div>
    </section>
  );
};

export default PredictedGrid;
