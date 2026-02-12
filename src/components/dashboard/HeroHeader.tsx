interface HeroHeaderProps {
  onViewPipeline: () => void;
}

const HeroHeader = ({ onViewPipeline }: HeroHeaderProps) => {
  return (
    <section className="pt-[94px] pb-12 px-8">
      <div className="max-w-[1100px] mx-auto text-center">
        <div className="flex justify-center mb-4">
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-accent-magenta/10 to-primary/10 border border-accent-magenta/20 text-sm text-muted-foreground">
            Powered by the Workhuman{" "}
            <span className="font-semibold italic tracking-wide text-foreground" style={{ fontFamily: 'Georgia, serif' }}>Ascend</span>
            {" "}model
          </span>
        </div>
        <h1 className="text-4xl lg:text-5xl font-extrabold text-foreground leading-tight mb-4">
          Future Leaders
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          AI-powered leadership intelligence that identifies and develops your next generation
          of executive talent.
        </p>
      </div>
    </section>
  );
};

export default HeroHeader;
