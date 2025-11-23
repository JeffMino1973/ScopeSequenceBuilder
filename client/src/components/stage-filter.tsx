import { Button } from "@/components/ui/button";

interface StageFilterProps {
  stages: Array<{ id: string; label: string }>;
  activeStage: string;
  onStageChange: (stageId: string) => void;
}

export function StageFilter({ stages, activeStage, onStageChange }: StageFilterProps) {
  return (
    <div className="flex flex-wrap justify-center gap-2 sm:gap-4 px-4 sm:px-8 py-4">
      {stages.map((stage) => {
        const isActive = activeStage === stage.id;
        return (
          <Button
            key={stage.id}
            onClick={() => onStageChange(stage.id)}
            variant={isActive ? "default" : "outline"}
            size="lg"
            className="rounded-full font-medium"
            data-testid={`button-stage-${stage.id}`}
          >
            {stage.label}
          </Button>
        );
      })}
    </div>
  );
}
