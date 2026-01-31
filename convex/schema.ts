import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  todos: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    status: v.string(), // "active", "done"
    priority: v.optional(v.string()), // "high", "medium", "low"
    dueDate: v.optional(v.string()),
    reminder: v.optional(v.string()),
    createdAt: v.number(),
    completedAt: v.optional(v.number()),
  }),
  
  projects: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    status: v.string(), // "active", "queue", "done", "archived"
    progress: v.optional(v.number()),
    liveUrl: v.optional(v.string()),
    repoUrl: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }),
  
  ideas: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    category: v.optional(v.string()),
    createdAt: v.number(),
  }),
  
  activity: defineTable({
    text: v.string(),
    timestamp: v.number(),
  }),
});
