import {
  users,
  volunteers,
  forumPosts,
  forumComments,
  contactMessages,
  projects,
  xpActivities,
  timeCommitments,
  divisionChampions,
  type User,
  type UpsertUser,
  type Volunteer,
  type InsertVolunteer,
  type ForumPost,
  type InsertForumPost,
  type ForumComment,
  type InsertForumComment,
  type ContactMessage,
  type InsertContactMessage,
  type Project,
  type InsertProject,
  type XPActivity,
  type InsertXPActivity,
  type TimeCommitment,
  type InsertTimeCommitment,
  type DivisionChampion,
  type InsertDivisionChampion,
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  // User operations (required for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;

  // Volunteer operations
  getVolunteers(): Promise<Volunteer[]>;
  getVolunteer(id: string): Promise<Volunteer | undefined>;
  createVolunteer(volunteer: InsertVolunteer): Promise<Volunteer>;
  updateVolunteer(id: string, volunteer: Partial<InsertVolunteer>): Promise<Volunteer | undefined>;
  deleteVolunteer(id: string): Promise<boolean>;

  // Forum operations
  getForumPosts(): Promise<ForumPost[]>;
  getForumPost(id: string): Promise<ForumPost | undefined>;
  createForumPost(post: InsertForumPost): Promise<ForumPost>;
  updateForumPost(id: string, post: Partial<InsertForumPost>): Promise<ForumPost | undefined>;
  deleteForumPost(id: string): Promise<boolean>;

  // Comment operations
  getForumComments(postId: string): Promise<ForumComment[]>;
  createForumComment(comment: InsertForumComment): Promise<ForumComment>;
  deleteForumComment(id: string): Promise<boolean>;

  // Contact operations
  getContactMessages(): Promise<ContactMessage[]>;
  createContactMessage(message: InsertContactMessage): Promise<ContactMessage>;
  deleteContactMessage(id: string): Promise<boolean>;

  // Project operations
  getProjects(): Promise<Project[]>;
  getProject(id: string): Promise<Project | undefined>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: string, project: Partial<InsertProject>): Promise<Project | undefined>;
  deleteProject(id: string): Promise<boolean>;

  // XP Activity operations
  getXPActivities(userId?: string): Promise<XPActivity[]>;
  createXPActivity(activity: InsertXPActivity): Promise<XPActivity>;

  // Time Commitment operations
  getTimeCommitments(userId?: string): Promise<TimeCommitment[]>;
  createTimeCommitment(commitment: InsertTimeCommitment): Promise<TimeCommitment>;

  // Division Champion operations
  getDivisionChampions(): Promise<DivisionChampion[]>;
  createDivisionChampion(champion: InsertDivisionChampion): Promise<DivisionChampion>;
}

export class DatabaseStorage implements IStorage {
  // User operations (required for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Volunteer operations
  async getVolunteers(): Promise<Volunteer[]> {
    return await db.select().from(volunteers);
  }

  async getVolunteer(id: string): Promise<Volunteer | undefined> {
    const [volunteer] = await db.select().from(volunteers).where(eq(volunteers.id, id));
    return volunteer;
  }

  async createVolunteer(volunteer: InsertVolunteer): Promise<Volunteer> {
    const [created] = await db.insert(volunteers).values(volunteer).returning();
    return created;
  }

  async updateVolunteer(id: string, volunteer: Partial<InsertVolunteer>): Promise<Volunteer | undefined> {
    const [updated] = await db
      .update(volunteers)
      .set({ ...volunteer, updatedAt: new Date() })
      .where(eq(volunteers.id, id))
      .returning();
    return updated;
  }

  async deleteVolunteer(id: string): Promise<boolean> {
    const result = await db.delete(volunteers).where(eq(volunteers.id, id));
    return result.rowCount > 0;
  }

  // Forum operations
  async getForumPosts(): Promise<ForumPost[]> {
    return await db.select().from(forumPosts).orderBy(forumPosts.createdAt);
  }

  async getForumPost(id: string): Promise<ForumPost | undefined> {
    const [post] = await db.select().from(forumPosts).where(eq(forumPosts.id, parseInt(id)));
    return post;
  }

  async createForumPost(post: InsertForumPost): Promise<ForumPost> {
    const [created] = await db.insert(forumPosts).values(post).returning();
    return created;
  }

  async updateForumPost(id: string, post: Partial<InsertForumPost>): Promise<ForumPost | undefined> {
    const [updated] = await db
      .update(forumPosts)
      .set({ ...post, updatedAt: new Date() })
      .where(eq(forumPosts.id, parseInt(id)))
      .returning();
    return updated;
  }

  async deleteForumPost(id: string): Promise<boolean> {
    const result = await db.delete(forumPosts).where(eq(forumPosts.id, parseInt(id)));
    return result.rowCount > 0;
  }

  // Comment operations
  async getForumComments(postId: string): Promise<ForumComment[]> {
    return await db.select().from(forumComments).where(eq(forumComments.postId, parseInt(postId)));
  }

  async createForumComment(comment: InsertForumComment): Promise<ForumComment> {
    const [created] = await db.insert(forumComments).values(comment).returning();
    return created;
  }

  async deleteForumComment(id: string): Promise<boolean> {
    const result = await db.delete(forumComments).where(eq(forumComments.id, parseInt(id)));
    return result.rowCount > 0;
  }

  // Contact operations
  async getContactMessages(): Promise<ContactMessage[]> {
    return await db.select().from(contactMessages).orderBy(contactMessages.createdAt);
  }

  async createContactMessage(message: InsertContactMessage): Promise<ContactMessage> {
    const [created] = await db.insert(contactMessages).values(message).returning();
    return created;
  }

  async deleteContactMessage(id: string): Promise<boolean> {
    const result = await db.delete(contactMessages).where(eq(contactMessages.id, parseInt(id)));
    return result.rowCount > 0;
  }

  // Project operations
  async getProjects(): Promise<Project[]> {
    return await db.select().from(projects).orderBy(projects.createdAt);
  }

  async getProject(id: string): Promise<Project | undefined> {
    const [project] = await db.select().from(projects).where(eq(projects.id, parseInt(id)));
    return project;
  }

  async createProject(project: InsertProject): Promise<Project> {
    const [created] = await db.insert(projects).values(project).returning();
    return created;
  }

  async updateProject(id: string, project: Partial<InsertProject>): Promise<Project | undefined> {
    const [updated] = await db
      .update(projects)
      .set({ ...project, updatedAt: new Date() })
      .where(eq(projects.id, parseInt(id)))
      .returning();
    return updated;
  }

  async deleteProject(id: string): Promise<boolean> {
    const result = await db.delete(projects).where(eq(projects.id, parseInt(id)));
    return result.rowCount > 0;
  }

  // XP Activity operations
  async getXPActivities(userId?: string): Promise<XPActivity[]> {
    if (userId) {
      return await db.select().from(xpActivities).where(eq(xpActivities.userId, userId));
    }
    return await db.select().from(xpActivities);
  }

  async createXPActivity(activity: InsertXPActivity): Promise<XPActivity> {
    const [created] = await db.insert(xpActivities).values(activity).returning();
    return created;
  }

  // Time Commitment operations
  async getTimeCommitments(userId?: string): Promise<TimeCommitment[]> {
    if (userId) {
      return await db.select().from(timeCommitments).where(eq(timeCommitments.userId, userId));
    }
    return await db.select().from(timeCommitments);
  }

  async createTimeCommitment(commitment: InsertTimeCommitment): Promise<TimeCommitment> {
    const [created] = await db.insert(timeCommitments).values(commitment).returning();
    return created;
  }

  // Division Champion operations
  async getDivisionChampions(): Promise<DivisionChampion[]> {
    return await db.select().from(divisionChampions).where(eq(divisionChampions.isActive, true));
  }

  async createDivisionChampion(champion: InsertDivisionChampion): Promise<DivisionChampion> {
    const [created] = await db.insert(divisionChampions).values(champion).returning();
    return created;
  }
}

export const storage = new DatabaseStorage();