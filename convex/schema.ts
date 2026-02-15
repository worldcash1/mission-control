import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  tasks: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    status: v.string(), // "backlog" | "active" | "in-progress" | "blocked" | "done"
    priority: v.string(), // "low" | "medium" | "high"
    type: v.string(), // "personal" | "project"
    projectId: v.optional(v.id("projects")),
    assignee: v.optional(v.string()), // "nam" | "alfred" | "sentinel"
    category: v.optional(v.string()), // "finance" | "health" | "travel" | "family" | "work"
    dueDate: v.optional(v.string()),
    reminder: v.optional(v.object({
      at: v.string(), // ISO datetime
      repeat: v.optional(v.string()), // "never" | "daily" | "weekly" | "monthly"
      fired: v.optional(v.boolean()),
    })),
    createdAt: v.number(),
    completedAt: v.optional(v.number()),
  }),
  
  projects: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    status: v.string(), // "research" | "planning" | "building" | "live" | "paused" | "archived"
    progress: v.optional(v.number()),
    liveUrl: v.optional(v.string()),
    repoUrl: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    discordChannelId: v.optional(v.string()),
    githubUrl: v.optional(v.string()),
    vercelUrl: v.optional(v.string()),
    convexUrl: v.optional(v.string()),
    brainFolder: v.optional(v.string()),
    features: v.optional(v.array(v.string())),
    apis: v.optional(v.array(v.string())),
    techStack: v.optional(v.array(v.string())),
    agent: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }),
  
  ideas: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    category: v.optional(v.string()),
    createdAt: v.number(),
  }),
  
  inbox: defineTable({
    text: v.string(),
    source: v.optional(v.string()), // "web" | "discord" | "slack" | "cli" | "voice"
    triaged: v.optional(v.boolean()),
    triagedTo: v.optional(v.string()), // "task" | "idea" | "note" | "dismissed"
    triagedId: v.optional(v.string()), // ID of created task/idea
    createdAt: v.number(),
    triagedAt: v.optional(v.number()),
  }),

  activity: defineTable({
    text: v.string(),
    timestamp: v.number(),
  }),
  
  tools: defineTable({
    name: v.string(),
    type: v.string(),
    category: v.string(),
    description: v.string(),
    accessMethod: v.optional(v.string()),
    capabilities: v.optional(v.array(v.string())),
    status: v.string(),
    icon: v.optional(v.string()),
    url: v.optional(v.string()),
    notes: v.optional(v.string()),
    addedAt: v.number(),
  }),
});
