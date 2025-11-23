import { useState, useEffect } from "react";
import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Printer } from "lucide-react";
import { StageFilter } from "@/components/stage-filter";
import { ScopeTable } from "@/components/scope-table";
import { UnitDetailPanel } from "@/components/unit-detail-panel";
import { SubjectData, UnitDetails } from "@shared/schema";
import { Button } from "@/components/ui/button";

export default function SubjectViewer() {
  const { subjectId } = useParams<{ subjectId: string }>();
  const [activeStage, setActiveStage] = useState<string>("");
  const [selectedUnit, setSelectedUnit] = useState<string>("default");

  const { data: subjectData, isLoading } = useQuery<SubjectData>({
    queryKey: ["/api/subjects", subjectId],
  });

  useEffect(() => {
    if (subjectData && !activeStage) {
      const firstStage = Object.keys(subjectData.scopeAndSequence)[0];
      setActiveStage(firstStage);
    }
  }, [subjectData, activeStage]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-nsw-blue mx-auto mb-4"></div>
          <p className="text-gray-600">Loading curriculum data...</p>
        </div>
      </div>
    );
  }

  if (!subjectData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Subject not found</p>
          <Link href="/">
            <Button className="mt-4">Return Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  const stages = Object.keys(subjectData.scopeAndSequence).map((stageId) => ({
    id: stageId,
    label: subjectData.scopeAndSequence[stageId].title.includes("Stage")
      ? `Years ${stageId === "4" ? "7-8" : stageId === "5" ? "9-10" : "11-12"}`
      : `Year ${stageId}`,
  }));

  const currentStageData = subjectData.scopeAndSequence[activeStage];
  const currentUnit = subjectData.unitDetails[selectedUnit] || subjectData.unitDetails["default"];

  const handlePrintScopeTable = () => {
    // Mark that we're printing the scope table (not a unit)
    document.body.setAttribute('data-print-mode', 'scope');
    
    window.print();
    
    // Clean up after printing
    setTimeout(() => {
      document.body.removeAttribute('data-print-mode');
    }, 100);
  };

  return (
    <div className="min-h-screen bg-gray-50 print:bg-white">
      <div className="text-center px-4 sm:px-8 pt-8 pb-6 print:pt-4 print:pb-2">
        <Link href="/">
          <Button 
            variant="ghost" 
            className="mb-4 print:hidden"
            data-testid="button-back-home"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Hub
          </Button>
        </Link>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-nsw-navy mt-4 mb-4 print:text-2xl print:mt-0">
          {subjectData.name} Life Skills Scope and Sequence
        </h1>
        <p className="text-lg text-gray-600 mb-2 print:text-sm hidden print:block">
          {stages.find(s => s.id === activeStage)?.label}
        </p>
      </div>

      <div className="print:hidden">
        <StageFilter
          stages={stages}
          activeStage={activeStage}
          onStageChange={(stageId) => {
            setActiveStage(stageId);
            setSelectedUnit("default");
          }}
        />
      </div>

      <div className="flex justify-center mb-4 print:hidden">
        <Button
          variant="outline"
          onClick={handlePrintScopeTable}
          data-testid="button-print-scope"
        >
          <Printer className="w-4 h-4 mr-2" />
          Print Scope and Sequence
        </Button>
      </div>

      <main className="container mx-auto p-4 md:p-6 lg:p-8 print:p-4">
        {currentStageData && (
          <ScopeTable
            terms={currentStageData.terms}
            onUnitClick={(unitName) => {
              setSelectedUnit(unitName);
              setTimeout(() => {
                const panel = document.querySelector('[data-testid="panel-unit-details"]');
                panel?.scrollIntoView({ behavior: "smooth", block: "start" });
              }, 100);
            }}
          />
        )}

        {selectedUnit !== "default" && (
          <UnitDetailPanel 
            unit={currentUnit} 
            unitName={selectedUnit}
            onClose={() => setSelectedUnit("default")}
          />
        )}
      </main>

      <footer className="bg-nsw-navy text-white p-4 text-center text-sm mt-10 print:hidden">
        <p>&copy; 2025 NSW Special Education Programs. Portal v2.0</p>
      </footer>
    </div>
  );
}
