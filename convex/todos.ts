import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Get all todos
export const list = query({
  handler: async (ctx) => {
    return await ctx.db.query("todos").order("desc").collect();
  },
});

// Get active todos only
export const listActive = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("todos")
      .filter((q) => q.eq(q.field("status"), "active"))
      .order("desc")
      .collect();
  },
});

// Add a new todo
export const add = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    priority: v.optional(v.string()),
    dueDate: v.optional(v.string()),
    reminder: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("todos", {
      title: args.title,
      description: args.description,
      status: "active",
      priority: args.priority,
      dueDate: args.dueDate,
      reminder: args.reminder,
      createdAt: Date.now(),
    });
  },
});

// Complete a todo
export const complete = mutation({
  args: { id: v.id("todos") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      status: "done",
      completedAt: Date.now(),
    });
  },
});

// Delete a todo
export const remove = mutation({
  args: { id: v.id("todos") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

// Reopen a completed todo
export const reopen = mutation({
  args: { id: v.id("todos") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      status: "active",
      completedAt: undefined,
    });
  },
});
