import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Get all projects
export const list = query({
  handler: async (ctx) => {
    return await ctx.db.query("projects").order("desc").collect();
  },
});

// Add a new project
export const add = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    status: v.optional(v.string()),
    progress: v.optional(v.number()),
    liveUrl: v.optional(v.string()),
    repoUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.insert("projects", {
      title: args.title,
      description: args.description,
      status: args.status || "queue",
      progress: args.progress || 0,
      liveUrl: args.liveUrl,
      repoUrl: args.repoUrl,
      createdAt: now,
      updatedAt: now,
    });
  },
});

// Update project
export const update = mutation({
  args: {
    id: v.id("projects"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    status: v.optional(v.string()),
    progress: v.optional(v.number()),
    liveUrl: v.optional(v.string()),
    repoUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    await ctx.db.patch(id, {
      ...updates,
      updatedAt: Date.now(),
    });
  },
});
