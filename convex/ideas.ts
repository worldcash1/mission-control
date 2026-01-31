import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Get all ideas
export const list = query({
  handler: async (ctx) => {
    return await ctx.db.query("ideas").order("desc").collect();
  },
});

// Add a new idea
export const add = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    category: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("ideas", {
      title: args.title,
      description: args.description,
      category: args.category,
      createdAt: Date.now(),
    });
  },
});

// Delete an idea
export const remove = mutation({
  args: { id: v.id("ideas") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
