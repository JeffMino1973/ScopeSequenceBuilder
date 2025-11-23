import { useState } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SubjectData } from "@shared/schema";
import { subjects } from "@shared/schema";

interface SelectedUnit {
  id: string;
  unitName: string;
  subject: string;
  subjectName: string;
  term: number;
  description: string;
  outcomes: string[];
}

export default function Wizard() {
  const [selectedUnits, setSelectedUnits] = useState<Map<string, SelectedUnit>>(new Map());
  const [showSchedule, setShowSchedule] = useState(false);

  const { data: allSubjectsData, isLoading } = useQuery<Record<string, SubjectData>>({
    queryKey: ["/api/subjects/all"],
  });

  const toggleUnitSelection = (
    unitName: string,
    subject: string,
    subjectName: string,
    description?: string,
    outcomes?: string[]
  ) => {
    if (!unitName || !subject || !subjectName) return;
    
    const key = `${subject}-${unitName}`;
    const newSelection = new Map(selectedUnits);
    
    if (newSelection.has(key)) {
      newSelection.delete(key);
    } else {
      newSelection.set(key, {
        id: key,
        unitName,
        subject,
        subjectName,
        term: 1,
        description: description || "",
        outcomes: outcomes || [],
      });
    }
    
    setSelectedUnits(newSelection);
  };

  const updateUnitTerm = (unitId: string, term: number) => {
    const newSelection = new Map(selectedUnits);
    const unit = newSelection.get(unitId);
    if (unit) {
      unit.term = term;
      newSelection.set(unitId, unit);
      setSelectedUnits(newSelection);
    }
  };

  const buildSchedule = () => {
    if (selectedUnits.size === 0) {
      return;
    }
    setShowSchedule(true);
    setTimeout(() => {
      const schedule = document.getElementById("custom-schedule-container");
      schedule?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const groupedByTerm = () => {
    const grouped: Map<number, SelectedUnit[]> = new Map();
    selectedUnits.forEach((unit) => {
      const existing = grouped.get(unit.term) || [];
      existing.push(unit);
      grouped.set(unit.term, existing);
    });
    return grouped;
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="text-center px-4 sm:px-8 pt-8 pb-6">
        <Link href="/">
          <Button variant="ghost" className="mb-4" data-testid="button-back-home">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Hub
          </Button>
        </Link>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-nsw-navy mt-4 mb-4">
          Custom Scope and Sequence Wizard
        </h1>
      </div>

      <main className="container mx-auto p-4 md:p-6 lg:p-8 max-w-7xl">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            1. Select Your Units and Assign a Term
          </h2>
          <p className="text-gray-600 mb-8">
            Click a unit to select it. Once selected, use the dropdown menu to choose which Term (1-4) the unit should run in. Click again to unselect.
          </p>

          {isLoading || !allSubjectsData || Object.keys(allSubjectsData).length === 0 ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-nsw-blue mx-auto mb-4"></div>
              <p className="text-gray-600">Loading curriculum units...</p>
            </div>
          ) : (
            subjects.map((subject) => {
            const subjectData = allSubjectsData[subject.id];
            if (!subjectData || !subjectData.unitDetails || !subjectData.scopeAndSequence) return null;

            const allUnits: Array<{ name: string; description: string; outcomes: string[] }> = [];
            Object.values(subjectData.scopeAndSequence).forEach((stageData) => {
              stageData.terms.forEach((term) => {
                term.forEach((unit) => {
                  const unitDetails = subjectData.unitDetails[unit.name];
                  if (unitDetails && !allUnits.some(u => u.name === unit.name)) {
                    allUnits.push({
                      name: unit.name,
                      description: unitDetails.description,
                      outcomes: unitDetails.outcomes,
                    });
                  }
                });
              });
            });

            return (
              <div key={subject.id} className="mb-8">
                <h3 className="text-xl font-semibold text-nsw-navy mb-4 flex items-center gap-2">
                  <span className="text-2xl">{subject.emoji}</span>
                  {subject.name}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {allUnits.map((unit) => {
                    const key = `${subject.id}-${unit.name}`;
                    const isSelected = selectedUnits.has(key);
                    const selectedUnit = selectedUnits.get(key);

                    return (
                      <Card
                        key={key}
                        onClick={() => !isSelected && !isLoading && toggleUnitSelection(unit.name, subject.id, subject.name, unit.description, unit.outcomes)}
                        className={`p-4 transition-all duration-200 border ${
                          isLoading
                            ? "cursor-not-allowed opacity-50"
                            : isSelected
                            ? "bg-nsw-navy text-white border-nsw-navy cursor-pointer"
                            : "hover:bg-nsw-light-blue hover:border-nsw-blue cursor-pointer"
                        }`}
                        data-testid={`card-wizard-unit-${key.replace(/\s+/g, '-').toLowerCase()}`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div className="font-semibold">{unit.name}</div>
                          {isSelected && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleUnitSelection(unit.name, subject.id, subject.name, unit.description, unit.outcomes);
                              }}
                              className="text-white hover:text-gray-200"
                            >
                              ✕
                            </button>
                          )}
                        </div>
                        <div className={`text-xs mb-2 ${isSelected ? "text-white/80" : "text-gray-600"}`}>
                          {subject.name}
                        </div>
                        <div className={`text-sm mb-3 ${isSelected ? "text-white/90" : "text-gray-700"}`}>
                          {unit.description.substring(0, 100)}...
                        </div>
                        {isSelected && selectedUnit && (
                          <Select
                            value={selectedUnit.term.toString()}
                            onValueChange={(value) => updateUnitTerm(key, parseInt(value))}
                          >
                            <SelectTrigger 
                              className="w-full bg-white text-nsw-navy"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <SelectValue placeholder="Select Term" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1">Term 1</SelectItem>
                              <SelectItem value="2">Term 2</SelectItem>
                              <SelectItem value="3">Term 3</SelectItem>
                              <SelectItem value="4">Term 4</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      </Card>
                    );
                  })}
                </div>
              </div>
            );
          })
          )}

          <div className="flex justify-center mt-10">
            <Button
              onClick={buildSchedule}
              disabled={selectedUnits.size === 0}
              className="bg-nsw-blue hover:bg-nsw-navy text-white px-8 py-3 rounded-full font-bold shadow-lg"
              data-testid="button-build-schedule"
            >
              Build My Custom Scope and Sequence
            </Button>
          </div>
        </div>

        {showSchedule && (
          <div id="custom-schedule-container" className="bg-white rounded-xl shadow-lg mt-12 p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">2. Your Custom Scope and Sequence</h2>
              <Button
                onClick={handlePrint}
                variant="outline"
                className="hidden sm:flex"
                data-testid="button-print"
              >
                <Printer className="w-4 h-4 mr-2" />
                Print PDF
              </Button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-nsw-navy text-white">
                    <th className="border border-white p-3 text-left">Term</th>
                    <th className="border border-white p-3 text-left">Unit Name</th>
                    <th className="border border-white p-3 text-left">Subject</th>
                    <th className="border border-white p-3 text-left">Description</th>
                  </tr>
                </thead>
                <tbody>
                  {[1, 2, 3, 4].map((term) => {
                    const units = groupedByTerm().get(term) || [];
                    if (units.length === 0) return null;

                    return units.map((unit, index) => (
                      <tr key={unit.id} className="hover:bg-gray-50">
                        {index === 0 && (
                          <td
                            rowSpan={units.length}
                            className="border border-gray-300 p-3 font-semibold bg-gray-50 align-top"
                          >
                            Term {term}
                          </td>
                        )}
                        <td className="border border-gray-300 p-3 font-medium">{unit.unitName}</td>
                        <td className="border border-gray-300 p-3">{unit.subjectName}</td>
                        <td className="border border-gray-300 p-3 text-sm text-gray-700">{unit.description}</td>
                      </tr>
                    ));
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      <footer className="bg-nsw-navy text-white p-4 text-center text-sm mt-10">
        <p>&copy; 2025 NSW Special Education Programs. Portal v2.0</p>
      </footer>
    </div>
  );
}
