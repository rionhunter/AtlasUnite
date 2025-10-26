import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { 
  insertVolunteerSchema, 
  insertForumPostSchema, 
  insertForumCommentSchema, 
  insertContactMessageSchema,
  insertProjectSchema,
  insertXPActivitySchema,
  insertTimeCommitmentSchema,
  insertDivisionChampionSchema
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Public contact route (not protected)
  app.post("/api/contact", async (req, res) => {
    try {
      const validatedData = insertContactMessageSchema.parse(req.body);
      const message = await storage.createContactMessage(validatedData);
      res.status(201).json(message);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.get("/api/contact", async (req, res) => {
    try {
      const messages = await storage.getContactMessages();
      res.json(messages);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Protected volunteer routes
  app.get("/api/volunteers", isAuthenticated, async (req, res) => {
    try {
      const volunteers = await storage.getVolunteers();
      res.json(volunteers);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/volunteers", isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any)?.claims?.sub;
      const validatedData = insertVolunteerSchema.parse({ ...req.body, userId });
      const volunteer = await storage.createVolunteer(validatedData);
      res.status(201).json(volunteer);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.get("/api/volunteers/:id", isAuthenticated, async (req, res) => {
    try {
      const volunteer = await storage.getVolunteer(req.params.id);
      if (!volunteer) {
        return res.status(404).json({ error: "Volunteer not found" });
      }
      res.json(volunteer);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Protected forum routes
  app.get("/api/forum/posts", isAuthenticated, async (req, res) => {
    try {
      const posts = await storage.getForumPosts();
      res.json(posts);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/forum/posts", isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any)?.claims?.sub;
      const validatedData = insertForumPostSchema.parse({ ...req.body, userId });
      const post = await storage.createForumPost(validatedData);
      res.status(201).json(post);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.get("/api/forum/posts/:id", isAuthenticated, async (req, res) => {
    try {
      const post = await storage.getForumPost(req.params.id);
      if (!post) {
        return res.status(404).json({ error: "Post not found" });
      }
      res.json(post);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/forum/posts/:id/comments", isAuthenticated, async (req, res) => {
    try {
      const comments = await storage.getForumComments(req.params.id);
      res.json(comments);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/forum/posts/:id/comments", isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any)?.claims?.sub;
      const validatedData = insertForumCommentSchema.parse({ 
        ...req.body, 
        postId: parseInt(req.params.id),
        userId 
      });
      const comment = await storage.createForumComment(validatedData);
      res.status(201).json(comment);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Protected project routes
  app.get("/api/projects", isAuthenticated, async (req, res) => {
    try {
      const projects = await storage.getProjects();
      res.json(projects);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/projects", isAuthenticated, async (req, res) => {
    try {
      const validatedData = insertProjectSchema.parse(req.body);
      const project = await storage.createProject(validatedData);
      res.status(201).json(project);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.get("/api/projects/:id", isAuthenticated, async (req, res) => {
    try {
      const project = await storage.getProject(req.params.id);
      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }
      res.json(project);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Protected XP activity routes
  app.get("/api/xp-activities", isAuthenticated, async (req, res) => {
    try {
      const userId = req.query.userId as string;
      const activities = await storage.getXPActivities(userId);
      res.json(activities);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/xp-activities", isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any)?.claims?.sub;
      const validatedData = insertXPActivitySchema.parse({ ...req.body, userId });
      const activity = await storage.createXPActivity(validatedData);
      res.status(201).json(activity);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Protected time commitment routes
  app.get("/api/time-commitments", isAuthenticated, async (req, res) => {
    try {
      const userId = req.query.userId as string;
      const commitments = await storage.getTimeCommitments(userId);
      res.json(commitments);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/time-commitments", isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any)?.claims?.sub;
      const validatedData = insertTimeCommitmentSchema.parse({ ...req.body, userId });
      const commitment = await storage.createTimeCommitment(validatedData);
      res.status(201).json(commitment);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Protected division champion routes
  app.get("/api/champions", isAuthenticated, async (req, res) => {
    try {
      const champions = await storage.getDivisionChampions();
      res.json(champions);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/champions", isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any)?.claims?.sub;
      const validatedData = insertDivisionChampionSchema.parse({ ...req.body, userId });
      const champion = await storage.createDivisionChampion(validatedData);
      res.status(201).json(champion);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}