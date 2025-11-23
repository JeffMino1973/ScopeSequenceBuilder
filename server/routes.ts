import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  app.get("/api/subjects/all", async (req, res) => {
    try {
      const allSubjects = await storage.getAllSubjects();
      res.json(allSubjects);
    } catch (error) {
      console.error("Error fetching all subjects:", error);
      res.status(500).json({ error: "Failed to fetch subjects data" });
    }
  });

  app.get("/api/subjects/:subjectId", async (req, res) => {
    try {
      const { subjectId } = req.params;
      const subject = await storage.getSubject(subjectId);
      
      if (!subject) {
        return res.status(404).json({ error: "Subject not found" });
      }
      
      res.json(subject);
    } catch (error) {
      console.error("Error fetching subject:", error);
      res.status(500).json({ error: "Failed to fetch subject data" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
