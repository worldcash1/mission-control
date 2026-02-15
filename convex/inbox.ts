import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// List inbox items (untriaged by default)
export const list = query({
  args: {
    includeTriaged: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const items = await ctx.db.query("inbox").order("desc").collect();
    if (args.includeTriaged) return items;
    return items.filter(i => !i.triaged);
  },
});

// Add to inbox
export const add = mutation({
  args: {
    text: v.string(),
    source: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("inbox", {
      text: args.text,
      source: args.source || "web",
      triaged: false,
      createdAt: Date.now(),
    });
  },
});

// Triage an inbox item → task, idea, note, or dismiss
export const triage = mutation({
  args: {
    id: v.id("inbox"),
    to: v.string(), // "task" | "idea" | "note" | "dismissed"
    triagedId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      triaged: true,
      triagedTo: args.to,
      triagedId: args.triagedId,
      triagedAt: Date.now(),
    });
  },
});

// Delete an inbox item
export const remove = mutation({
  args: { id: v.id("inbox") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

// Count untriaged
export const count = query({
  handler: async (ctx) => {
    const items = await ctx.db.query("inbox").collect();
    return items.filter(i => !i.triaged).length;
  },
});
