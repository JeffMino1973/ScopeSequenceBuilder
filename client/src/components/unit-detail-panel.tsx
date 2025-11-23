import { useState } from "react";
import { UnitDetails } from "@shared/schema";
import { ChevronRight, X, Plus, Trash2, BookOpen, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface UnitDetailPanelProps {
  unit: UnitDetails;
  unitName: string;
  onClose: () => void;
}

interface UserResource {
  id: string;
  title: string;
  url: string;
}

export function UnitDetailPanel({ unit, unitName, onClose }: UnitDetailPanelProps) {
  const [outcomesOpen, setOutcomesOpen] = useState(true);
  const [unitOfWorkOpen, setUnitOfWorkOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const [userResources, setUserResources] = useState<UserResource[]>([]);
  const [newResourceTitle, setNewResourceTitle] = useState("");
  const [newResourceUrl, setNewResourceUrl] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);

  if (unitName === "default") {
    return null;
  }

  const handleAddResource = () => {
    if (newResourceTitle.trim()) {
      const newResource: UserResource = {
        id: Date.now().toString(),
        title: newResourceTitle.trim(),
        url: newResourceUrl.trim(),
      };
      setUserResources([...userResources, newResource]);
      setNewResourceTitle("");
      setNewResourceUrl("");
      setShowAddForm(false);
    }
  };

  const handleDeleteResource = (id: string) => {
    setUserResources(userResources.filter((resource) => resource.id !== id));
  };

  const handlePrint = () => {
    // Expand all sections before printing
    setOutcomesOpen(true);
    setUnitOfWorkOpen(true);
    setResourcesOpen(true);
    
    // Mark that we're printing a unit (not the scope table)
    document.body.setAttribute('data-print-mode', 'unit');
    
    // Wait for state to update, then print
    setTimeout(() => {
      window.print();
      // Clean up after printing
      setTimeout(() => {
        document.body.removeAttribute('data-print-mode');
      }, 100);
    }, 100);
  };

  return (
    <div 
      className="bg-white rounded-xl shadow-lg mt-8 p-8 max-w-6xl mx-auto transition-all duration-300 ease-in-out print:shadow-none print:mt-0"
      data-testid="panel-unit-details"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-nsw-blue mb-2">{unitName}</h2>
          <p className="text-lg text-nsw-blue mb-2">{unit.subtitle}</p>
        </div>
        <div className="flex gap-2 ml-4 print:hidden">
          <Button
            variant="outline"
            size="icon"
            onClick={handlePrint}
            data-testid="button-print-unit"
            title="Print Unit of Work"
          >
            <Printer className="w-5 h-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            data-testid="button-close-panel"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <div className="border-t border-b border-gray-200 py-4">
        <div
          className="flex justify-between items-center cursor-pointer print:cursor-default"
          onClick={() => setOutcomesOpen(!outcomesOpen)}
          data-testid="button-toggle-outcomes"
        >
          <h3 className="text-lg font-semibold text-nsw-blue">
            Unit Details and Outcomes
          </h3>
          <ChevronRight
            className={`w-6 h-6 text-gray-500 transition-transform duration-300 print:hidden ${
              outcomesOpen ? "rotate-90" : ""
            }`}
          />
        </div>
        {outcomesOpen && (
          <div className="mt-4" data-testid="content-outcomes">
            <p className="text-sm text-gray-700 mb-4">{unit.description}</p>
            {unit.outcomes.length > 0 && (
              <div className="mb-4">
                <p className="font-medium text-sm text-gray-900 mb-2">Outcomes:</p>
                <div className="flex flex-wrap gap-2">
                  {unit.outcomes.map((outcome, index) => (
                    <span
                      key={index}
                      className="inline-block px-3 py-1 bg-nsw-red/10 text-nsw-red text-xs font-medium rounded-full"
                    >
                      {outcome}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {unit.unitOfWork && (
        <div className="border-b border-gray-200 py-4 mt-4 print:page-break-before">
          <div
            className="flex justify-between items-center cursor-pointer print:cursor-default"
            onClick={() => setUnitOfWorkOpen(!unitOfWorkOpen)}
            data-testid="button-toggle-unit-of-work"
          >
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-nsw-blue" />
              <h3 className="text-lg font-semibold text-nsw-blue">Unit of Work</h3>
            </div>
            <ChevronRight
              className={`w-6 h-6 text-gray-500 transition-transform duration-300 print:hidden ${
                unitOfWorkOpen ? "rotate-90" : ""
              }`}
            />
          </div>
          {unitOfWorkOpen && (
            <div className="mt-4 space-y-6" data-testid="content-unit-of-work">
              <div>
                <h4 className="font-semibold text-sm text-gray-900 mb-2">Overview</h4>
                <p className="text-sm text-gray-700">{unit.unitOfWork.overview}</p>
              </div>

              <div>
                <h4 className="font-semibold text-sm text-gray-900 mb-2">Duration</h4>
                <p className="text-sm text-gray-700">{unit.unitOfWork.duration}</p>
              </div>

              <div>
                <h4 className="font-semibold text-sm text-gray-900 mb-2">Rationale</h4>
                <p className="text-sm text-gray-700">{unit.unitOfWork.rationale}</p>
              </div>

              <div>
                <h4 className="font-semibold text-sm text-gray-900 mb-2">Learning Objectives</h4>
                <ul className="list-disc list-inside space-y-1">
                  {unit.unitOfWork.learningObjectives.map((objective, index) => (
                    <li key={index} className="text-sm text-gray-700">{objective}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-sm text-gray-900 mb-3">Weekly Plan</h4>
                <div className="space-y-4">
                  {unit.unitOfWork.weeklyPlan.map((week) => (
                    <div key={week.week} className="bg-gray-50 p-4 rounded-lg">
                      <h5 className="font-semibold text-sm text-nsw-blue mb-2">
                        Week {week.week}: {week.focus}
                      </h5>
                      <div className="space-y-2">
                        <div>
                          <p className="text-xs font-medium text-gray-600 mb-1">Learning Activities:</p>
                          <ul className="list-disc list-inside space-y-1 ml-2">
                            {week.learningActivities.map((activity, idx) => (
                              <li key={idx} className="text-xs text-gray-700">{activity}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-gray-600">Assessment:</p>
                          <p className="text-xs text-gray-700">{week.assessment}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-sm text-gray-900 mb-2">Assessment Strategies</h4>
                <ul className="list-disc list-inside space-y-1">
                  {unit.unitOfWork.assessmentStrategies.map((strategy, index) => (
                    <li key={index} className="text-sm text-gray-700">{strategy}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-sm text-gray-900 mb-2">Differentiation Strategies</h4>
                <ul className="list-disc list-inside space-y-1">
                  {unit.unitOfWork.differentiationStrategies.map((strategy, index) => (
                    <li key={index} className="text-sm text-gray-700">{strategy}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-sm text-gray-900 mb-2">Resources Needed</h4>
                <ul className="list-disc list-inside space-y-1">
                  {unit.unitOfWork.resourcesNeeded.map((resource, index) => (
                    <li key={index} className="text-sm text-gray-700">{resource}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-sm text-gray-900 mb-2">Safeguards and Considerations</h4>
                <ul className="list-disc list-inside space-y-1">
                  {unit.unitOfWork.safeguardsAndConsiderations.map((item, index) => (
                    <li key={index} className="text-sm text-gray-700">{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="border-b border-gray-200 py-4 mt-4 print:page-break-before">
        <div
          className="flex justify-between items-center cursor-pointer print:cursor-default"
          onClick={() => setResourcesOpen(!resourcesOpen)}
          data-testid="button-toggle-resources"
        >
          <h3 className="text-lg font-semibold text-nsw-blue">Resources</h3>
          <ChevronRight
            className={`w-6 h-6 text-gray-500 transition-transform duration-300 print:hidden ${
              resourcesOpen ? "rotate-90" : ""
            }`}
          />
        </div>
        {resourcesOpen && (
          <div className="mt-4 space-y-4" data-testid="content-resources">
            {userResources.length > 0 && (
              <div className="space-y-2">
                {userResources.map((resource) => (
                  <div
                    key={resource.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    data-testid={`resource-item-${resource.id}`}
                  >
                    <div className="flex-1">
                      <p className="font-medium text-sm text-gray-900">
                        {resource.title}
                      </p>
                      {resource.url && (
                        <a
                          href={resource.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-nsw-blue hover:underline"
                        >
                          {resource.url}
                        </a>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteResource(resource.id)}
                      className="ml-2"
                      data-testid={`button-delete-resource-${resource.id}`}
                    >
                      <Trash2 className="w-4 h-4 text-gray-500" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {showAddForm ? (
              <div className="space-y-3 p-4 bg-gray-50 rounded-lg print:hidden" data-testid="form-add-resource">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Resource Title *
                  </label>
                  <Input
                    type="text"
                    placeholder="e.g., Worksheet on fractions"
                    value={newResourceTitle}
                    onChange={(e) => setNewResourceTitle(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleAddResource();
                      }
                    }}
                    data-testid="input-resource-title"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    URL (optional)
                  </label>
                  <Input
                    type="text"
                    placeholder="https://example.com/resource"
                    value={newResourceUrl}
                    onChange={(e) => setNewResourceUrl(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleAddResource();
                      }
                    }}
                    data-testid="input-resource-url"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={handleAddResource}
                    disabled={!newResourceTitle.trim()}
                    data-testid="button-save-resource"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Save Resource
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowAddForm(false);
                      setNewResourceTitle("");
                      setNewResourceUrl("");
                    }}
                    data-testid="button-cancel-add-resource"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <Button
                onClick={() => setShowAddForm(true)}
                variant="outline"
                className="w-full print:hidden"
                data-testid="button-add-resource"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add a Resource
              </Button>
            )}

            {userResources.length === 0 && !showAddForm && (
              <p className="text-sm text-gray-500 italic text-center py-4">
                No resources added yet. Click "Add a Resource" to get started.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
