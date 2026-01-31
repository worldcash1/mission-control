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
  
  tools: defineTable({
    name: v.string(),
    type: v.string(), // "api", "web", "cli", "account", "skill"
    category: v.string(), // "AI", "Finance", "Communication", "Development", "Productivity", etc.
    description: v.string(),
    accessMethod: v.optional(v.string()), // "API Key", "OAuth", "Browser", "CLI", "Bot Token"
    capabilities: v.optional(v.array(v.string())), // What can be done with this tool
    status: v.string(), // "active", "inactive", "limited"
    icon: v.optional(v.string()),
    url: v.optional(v.string()), // Link to service
    notes: v.optional(v.string()), // Any special notes
    addedAt: v.number(),
  }),
});
