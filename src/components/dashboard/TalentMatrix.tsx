interface MatrixPerson {
  id: string;
  name: string;
  role: string;
  image: string;
  tenure: number;
  readinessScore: number;
}

interface TalentMatrixProps {
  people: MatrixPerson[];
}

const TalentMatrix = ({ people }: TalentMatrixProps) => {
  const getPosition = (tenure: number, score: number) => {
    // Add padding to keep avatars away from edges (15% padding on each side)
    const xPadding = 15;
    const yPadding = 12;
    const x = xPadding + (tenure / 10) * (100 - 2 * xPadding);
    const y = yPadding + ((100 - score) / 50) * (100 - 2 * yPadding);
    return { x, y };
  };

  return (
    <div className="bg-card rounded-2xl border border-border p-12">
      <div className="flex">
        {/* Y-axis label */}
        <div className="flex items-center justify-center w-12 mr-6">
          <span 
            className="text-xs font-semibold text-muted-foreground tracking-widest uppercase whitespace-nowrap"
            style={{ transform: "rotate(-90deg)", transformOrigin: "center" }}
          >
            Leadership Readiness Signal
          </span>
        </div>

        <div className="flex-1">
          {/* Y-axis numbers */}
          <div className="flex">
            <div className="w-10 flex flex-col justify-between text-right pr-3 text-sm text-muted-foreground" style={{ height: 600 }}>
              <span>100</span>
              <span>90</span>
              <span>80</span>
              <span>70</span>
              <span>60</span>
              <span>50</span>
            </div>

            {/* Main chart area */}
            <div className="flex-1 relative border-l-2 border-b-2 border-border" style={{ height: 600 }}>
              {/* Quadrant dividers */}
              <div className="absolute left-1/2 top-0 bottom-0 border-l-2 border-dashed border-primary/30" />
              <div className="absolute top-1/2 left-0 right-0 border-t-2 border-dashed border-primary/30" />

              {/* Quadrant labels - positioned in corners with z-index below people */}
              <div className="absolute top-3 left-3 z-0">
                <h3 className="text-lg font-bold text-success">Rising Stars</h3>
                <p className="text-[10px] text-success/70 uppercase tracking-wide mt-0.5">Rising Fast — Early Tenure</p>
              </div>

              <div className="absolute top-3 right-3 text-right z-0">
                <h3 className="text-lg font-bold text-destructive">Stagnating</h3>
                <p className="text-[10px] text-destructive/70 uppercase tracking-wide mt-0.5">High Value — High Tenure</p>
              </div>

              <div className="absolute bottom-3 left-3 z-0">
                <h3 className="text-lg font-bold text-primary">Developing</h3>
                <p className="text-[10px] text-primary/70 uppercase tracking-wide mt-0.5">Growing — Early Tenure</p>
              </div>

              <div className="absolute bottom-3 right-3 text-right z-0">
                <h3 className="text-lg font-bold text-muted-foreground">Stable Anchors</h3>
                <p className="text-[10px] text-muted-foreground/70 uppercase tracking-wide mt-0.5">Consistent — High Tenure</p>
              </div>

              {/* People dots */}
              {people.map((person) => {
                const pos = getPosition(person.tenure, person.readinessScore);
                const isTopHalf = person.readinessScore >= 75;
                const isRightHalf = person.tenure >= 5;
                
                let borderColor = "border-success";
                if (isTopHalf && isRightHalf) borderColor = "border-destructive";
                else if (!isTopHalf && isRightHalf) borderColor = "border-muted-foreground";
                else if (!isTopHalf && !isRightHalf) borderColor = "border-primary";

                return (
                  <div
                    key={person.id}
                    className="absolute flex flex-col items-center z-10"
                    style={{
                      left: `${pos.x}%`,
                      top: `${pos.y}%`,
                      transform: "translate(-50%, -50%)",
                    }}
                  >
                    <img
                      src={person.image}
                      alt={person.name}
                      className={`h-11 w-11 rounded-full object-cover border-3 ${borderColor} shadow-lg`}
                    />
                    <p className="text-xs font-medium text-foreground mt-1.5 whitespace-nowrap bg-card/80 px-1.5 py-0.5 rounded">
                      {person.name.split(" ")[0]}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* X-axis numbers */}
          <div className="flex ml-10 mt-3">
            <div className="flex-1 flex justify-between text-sm text-muted-foreground">
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                <span key={num}>{num}</span>
              ))}
            </div>
          </div>

          {/* X-axis label */}
          <div className="text-center mt-6">
            <span className="text-xs font-semibold text-muted-foreground tracking-widest uppercase">
              Tenure (Years)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TalentMatrix;
