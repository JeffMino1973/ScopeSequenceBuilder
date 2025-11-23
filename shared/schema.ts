import { z } from "zod";

export interface CurriculumUnit {
  name: string;
  weeks: number;
}

export interface ScopeAndSequenceTerm {
  units: CurriculumUnit[];
}

export interface StageData {
  title: string;
  terms: CurriculumUnit[][];
}

export interface ScopeAndSequenceData {
  [stageId: string]: StageData;
}

export interface WeeklyActivity {
  week: number;
  focus: string;
  learningActivities: string[];
  assessment: string;
}

export interface UnitOfWork {
  overview: string;
  duration: string;
  rationale: string;
  learningObjectives: string[];
  weeklyPlan: WeeklyActivity[];
  assessmentStrategies: string[];
  differentiationStrategies: string[];
  resourcesNeeded: string[];
  safeguardsAndConsiderations: string[];
}

export interface UnitDetails {
  subtitle: string;
  outcomes: string[];
  description: string;
  lesson: string[];
  curriculum: string[];
  support: string[];
  unitOfWork?: UnitOfWork;
}

export interface UnitDetailsData {
  [unitName: string]: UnitDetails;
}

export interface SubjectData {
  id: string;
  name: string;
  emoji: string;
  scopeAndSequence: ScopeAndSequenceData;
  unitDetails: UnitDetailsData;
}

export interface CustomScopeSelection {
  id: string;
  unitName: string;
  subject: string;
  term: number;
}

export const customScopeSelectionSchema = z.object({
  id: z.string(),
  unitName: z.string(),
  subject: z.string(),
  term: z.number().min(1).max(4),
});

export type InsertCustomScopeSelection = z.infer<typeof customScopeSelectionSchema>;

export const subjects: Array<{ id: string; name: string; emoji: string }> = [
  { id: "capa", name: "CAPA", emoji: "🎨" },
  { id: "computing", name: "Computing Technology", emoji: "💻" },
  { id: "design-tech", name: "Design & Technology", emoji: "🛠️" },
  { id: "dance", name: "Dance", emoji: "💃" },
  { id: "drama", name: "Drama", emoji: "🎭" },
  { id: "english", name: "English", emoji: "📘" },
  { id: "hsie", name: "HSIE", emoji: "🌍" },
  { id: "lote", name: "LOTE", emoji: "💬" },
  { id: "maths", name: "Maths", emoji: "➗" },
  { id: "music", name: "Music", emoji: "🎼" },
  { id: "pdhpe", name: "PDHPE", emoji: "🏃" },
  { id: "science", name: "Science", emoji: "🔬" },
  { id: "tas", name: "TAS", emoji: "⚙️" },
  { id: "visual-arts", name: "Visual Arts", emoji: "🖌️" },
];
