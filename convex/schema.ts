import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  todos: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    status: v.string(),
    priority: v.optional(v.string()),
    dueDate: v.optional(v.string()),
    reminder: v.optional(v.string()),
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
