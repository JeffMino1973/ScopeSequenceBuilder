import { CurriculumUnit } from "@shared/schema";

interface ScopeTableProps {
  terms: CurriculumUnit[][];
  onUnitClick: (unitName: string) => void;
}

export function ScopeTable({ terms, onUnitClick }: ScopeTableProps) {
  const TOTAL_WEEKS = 10;

  const normalizeTermToWeekSlots = (termUnits: CurriculumUnit[]): (CurriculumUnit | null)[] => {
    const weekSlots: (CurriculumUnit | null)[] = Array(TOTAL_WEEKS).fill(null);
    let currentWeek = 0;

    termUnits.forEach((unit) => {
      const endWeek = Math.min(currentWeek + unit.weeks, TOTAL_WEEKS);
      for (let week = currentWeek; week < endWeek; week++) {
        weekSlots[week] = unit;
      }
      currentWeek = endWeek;
    });

    return weekSlots;
  };

  const renderTermRow = (termUnits: CurriculumUnit[], termIndex: number) => {
    const weekSlots = normalizeTermToWeekSlots(termUnits);
    const cells: JSX.Element[] = [];
    let skipUntil = 0;

    weekSlots.forEach((unit, weekIndex) => {
      if (weekIndex < skipUntil) return;

      let colspan = 1;
      if (unit) {
        while (
          weekIndex + colspan < TOTAL_WEEKS &&
          weekSlots[weekIndex + colspan]?.name === unit.name
        ) {
          colspan++;
        }
      }

      skipUntil = weekIndex + colspan;

      cells.push(
        <td
          key={weekIndex}
          colSpan={colspan}
          className="border-r border-gray-200 last:border-r-0"
        >
          {unit ? (
            <button
              onClick={() => onUnitClick(unit.name)}
              className="w-full p-3 min-h-[80px] hover:bg-nsw-light-blue transition-all duration-200 cursor-pointer text-left flex flex-col justify-center"
              data-testid={`button-unit-${unit.name.replace(/\s+/g, '-').toLowerCase()}`}
            >
              <div className="font-semibold text-sm text-gray-900">{unit.name}</div>
              <div className="text-xs text-gray-500 mt-1">{unit.weeks} weeks</div>
            </button>
          ) : (
            <div className="min-h-[80px] bg-gray-50" />
          )}
        </td>
      );
    });

    return cells;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden max-w-6xl mx-auto" data-testid="scope-table-container">
      <div className="p-4 text-sm font-semibold text-gray-600">
        *Click on the unit name to view details and resources
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-nsw-navy text-white">
              <th className="w-16 p-3 border-r border-white"></th>
              {Array.from({ length: 8 }, (_, i) => (
                <th key={i} className="p-3 text-center text-sm font-medium border-r border-white">
                  Week {i + 1}
                </th>
              ))}
              <th className="p-3 text-center text-sm font-medium" colSpan={2}>
                Weeks 9 & 10
              </th>
            </tr>
          </thead>
          <tbody>
            {terms.map((term, termIndex) => (
              <tr key={termIndex} className="border-b border-gray-200">
                <td className="bg-nsw-navy text-white font-semibold text-center p-2">
                  <div className="rotated-text whitespace-nowrap">Term {termIndex + 1}</div>
                </td>
                {renderTermRow(term, termIndex)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
