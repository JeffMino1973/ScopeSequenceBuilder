import { type SubjectData, subjects as subjectsList } from "@shared/schema";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export interface IStorage {
  getSubject(subjectId: string): Promise<SubjectData | undefined>;
  getAllSubjects(): Promise<Record<string, SubjectData>>;
}

export class MemStorage implements IStorage {
  private curriculumData: Record<string, any>;

  constructor() {
    // Try multiple locations for curriculum-data.json to support both dev and production
    const possiblePaths = [
      path.join(__dirname, "curriculum-data.json"),           // Production (dist/)
      path.join(__dirname, "..", "server", "curriculum-data.json"), // Development fallback
      path.join(process.cwd(), "server", "curriculum-data.json"),  // Additional fallback
    ];

    let dataPath: string | null = null;
    for (const testPath of possiblePaths) {
      if (fs.existsSync(testPath)) {
        dataPath = testPath;
        break;
      }
    }

    if (!dataPath) {
      throw new Error(
        `curriculum-data.json not found. Tried paths:\n${possiblePaths.join('\n')}`
      );
    }

    const rawData = fs.readFileSync(dataPath, "utf-8");
    this.curriculumData = JSON.parse(rawData);
  }

  async getSubject(subjectId: string): Promise<SubjectData | undefined> {
    const data = this.curriculumData[subjectId];
    if (!data) return undefined;

    const subject = subjectsList.find((s) => s.id === subjectId);
    if (!subject) return undefined;

    return {
      id: subjectId,
      name: subject.name,
      emoji: subject.emoji,
      scopeAndSequence: data.scopeAndSequence,
      unitDetails: data.unitDetails,
    };
  }

  async getAllSubjects(): Promise<Record<string, SubjectData>> {
    const allSubjects: Record<string, SubjectData> = {};

    for (const subject of subjectsList) {
      const data = this.curriculumData[subject.id];
      if (data) {
        allSubjects[subject.id] = {
          id: subject.id,
          name: subject.name,
          emoji: subject.emoji,
          scopeAndSequence: data.scopeAndSequence,
          unitDetails: data.unitDetails,
        };
      }
    }

    return allSubjects;
  }
}

export const storage = new MemStorage();
