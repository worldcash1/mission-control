import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {
    tag: v.optional(v.string()),
    status: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let projects = await ctx.db.query("projects").order("desc").collect();
    if (args.tag) {
      projects = projects.filter(p => p.tags && p.tags.includes(args.tag));
    }
    if (args.status) {
      projects = projects.filter(p => p.status === args.status);
    }
    return projects;
  },
});

export const get = query({
  args: { id: v.id("projects") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const add = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    status: v.optional(v.string()),
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
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.insert("projects", {
      ...args,
      status: args.status || "research",
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("projects"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    status: v.optional(v.string()),
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
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    await ctx.db.patch(id, {
      ...updates,
      updatedAt: Date.now(),
    });
  },
});

export const remove = mutation({
  args: { id: v.id("projects") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
