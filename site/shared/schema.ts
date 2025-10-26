import { sql } from 'drizzle-orm';
import {
  index,
  jsonb,
  pgTable,
  serial,
  varchar,
  text,
  timestamp,
  boolean,
  integer,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table for authentication
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User table for authentication (required for Replit Auth)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

export const volunteers = pgTable("volunteers", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id),
  firstName: varchar("first_name", { length: 255 }).notNull(),
  lastName: varchar("last_name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  phone: varchar("phone", { length: 20 }),
  suburb: varchar("suburb", { length: 255 }),
  interests: jsonb("interests").$type<string[]>(),
  availability: jsonb("availability").$type<string[]>(),
  experience: text("experience"),
  motivation: text("motivation"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  
  // Gamification fields
  xpPoints: integer("xp_points").default(0),
  divisionLevel: integer("division_level").default(1),
  timePledgedHours: integer("time_pledged_hours").default(0),
  timeCompletedHours: integer("time_completed_hours").default(0),
  reliabilityScore: integer("reliability_score").default(100), // Percentage
});

export const forumPosts = pgTable("forum_posts", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content").notNull(),
  category: varchar("category", { length: 100 }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const forumComments = pgTable("forum_comments", {
  id: serial("id").primaryKey(),
  postId: integer("post_id").references(() => forumPosts.id).notNull(),
  userId: varchar("user_id").references(() => users.id),
  content: text("content").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const contactMessages = pgTable("contact_messages", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  subject: varchar("subject", { length: 255 }),
  message: text("message").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

// Gamification tables
export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  division: varchar("division", { length: 100 }).notNull(),
  location: varchar("location", { length: 255 }),
  coordinator: varchar("coordinator", { length: 255 }),
  status: varchar("status", { length: 50 }).default("planning"),
  volunteersNeeded: integer("volunteers_needed").default(1),
  volunteersRegistered: integer("volunteers_registered").default(0),
  xpReward: integer("xp_reward").default(10),
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const xpActivities = pgTable("xp_activities", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id),
  activityType: varchar("activity_type", { length: 100 }).notNull(),
  xpEarned: integer("xp_earned").notNull(),
  description: text("description"),
  projectId: integer("project_id").references(() => projects.id),
  createdAt: timestamp("created_at").defaultNow(),
});

export const timeCommitments = pgTable("time_commitments", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id),
  projectId: integer("project_id").references(() => projects.id).notNull(),
  hoursPledged: integer("hours_pledged").notNull(),
  hoursCompleted: integer("hours_completed").default(0),
  isVerified: boolean("is_verified").default(false),
  completionVerifiedBy: varchar("completion_verified_by", { length: 255 }),
  contractSignedAt: timestamp("contract_signed_at").defaultNow(),
  completedAt: timestamp("completed_at"),
});

export const divisionChampions = pgTable("division_champions", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id),
  division: varchar("division", { length: 100 }).notNull(),
  isActive: boolean("is_active").default(true),
  appointedAt: timestamp("appointed_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  volunteers: many(volunteers),
  forumPosts: many(forumPosts),
  forumComments: many(forumComments),
  xpActivities: many(xpActivities),
  timeCommitments: many(timeCommitments),
  divisionChampions: many(divisionChampions),
}));

export const volunteersRelations = relations(volunteers, ({ one }) => ({
  user: one(users, {
    fields: [volunteers.userId],
    references: [users.id],
  }),
}));

export const forumPostsRelations = relations(forumPosts, ({ one, many }) => ({
  user: one(users, {
    fields: [forumPosts.userId],
    references: [users.id],
  }),
  comments: many(forumComments),
}));

export const forumCommentsRelations = relations(forumComments, ({ one }) => ({
  post: one(forumPosts, {
    fields: [forumComments.postId],
    references: [forumPosts.id],
  }),
  user: one(users, {
    fields: [forumComments.userId],
    references: [users.id],
  }),
}));

export const projectsRelations = relations(projects, ({ many }) => ({
  xpActivities: many(xpActivities),
  timeCommitments: many(timeCommitments),
}));

export const xpActivitiesRelations = relations(xpActivities, ({ one }) => ({
  user: one(users, {
    fields: [xpActivities.userId],
    references: [users.id],
  }),
  project: one(projects, {
    fields: [xpActivities.projectId],
    references: [projects.id],
  }),
}));

export const timeCommitmentsRelations = relations(timeCommitments, ({ one }) => ({
  user: one(users, {
    fields: [timeCommitments.userId],
    references: [users.id],
  }),
  project: one(projects, {
    fields: [timeCommitments.projectId],
    references: [projects.id],
  }),
}));

export const divisionChampionsRelations = relations(divisionChampions, ({ one }) => ({
  user: one(users, {
    fields: [divisionChampions.userId],
    references: [users.id],
  }),
}));

// Zod schemas for validation
export const insertVolunteerSchema = createInsertSchema(volunteers).omit({
  id: true,
  createdAt: true,
  xpPoints: true,
  divisionLevel: true,
  timePledgedHours: true,
  timeCompletedHours: true,
  reliabilityScore: true,
});

export const insertForumPostSchema = createInsertSchema(forumPosts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertForumCommentSchema = createInsertSchema(forumComments).omit({
  id: true,
  createdAt: true,
});

export const insertContactMessageSchema = createInsertSchema(contactMessages).omit({
  id: true,
  createdAt: true,
});

export const insertProjectSchema = createInsertSchema(projects).omit({
  id: true,
  createdAt: true,
});

export const insertXPActivitySchema = createInsertSchema(xpActivities).omit({
  id: true,
  createdAt: true,
});

export const insertTimeCommitmentSchema = createInsertSchema(timeCommitments).omit({
  id: true,
  contractSignedAt: true,
  completedAt: true,
});

export const insertDivisionChampionSchema = createInsertSchema(divisionChampions).omit({
  id: true,
  appointedAt: true,
});

// Types
export type InsertVolunteer = z.infer<typeof insertVolunteerSchema>;
export type Volunteer = typeof volunteers.$inferSelect;

export type InsertForumPost = z.infer<typeof insertForumPostSchema>;
export type ForumPost = typeof forumPosts.$inferSelect;

export type InsertForumComment = z.infer<typeof insertForumCommentSchema>;
export type ForumComment = typeof forumComments.$inferSelect;

export type InsertContactMessage = z.infer<typeof insertContactMessageSchema>;
export type ContactMessage = typeof contactMessages.$inferSelect;

export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Project = typeof projects.$inferSelect;

export type InsertXPActivity = z.infer<typeof insertXPActivitySchema>;
export type XPActivity = typeof xpActivities.$inferSelect;

export type InsertTimeCommitment = z.infer<typeof insertTimeCommitmentSchema>;
export type TimeCommitment = typeof timeCommitments.$inferSelect;

export type InsertDivisionChampion = z.infer<typeof insertDivisionChampionSchema>;
export type DivisionChampion = typeof divisionChampions.$inferSelect;