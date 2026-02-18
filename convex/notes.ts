import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// List all non-archived notes, sorted by createdAt desc (pinned first)
export const list = query({
  args: {},
  handler: async (ctx) => {
    const notes = await ctx.db
      .query("notes")
      .filter((q) => q.neq(q.field("archived"), true))
      .collect();
    
    // Sort: pinned first, then by createdAt desc
    return notes.sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return b.createdAt - a.createdAt;
    });
  },
});

// Add a new note
export const add = mutation({
  args: {
    text: v.string(),
    category: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    source: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("notes", {
      text: args.text,
      category: args.category,
      tags: args.tags,
      source: args.source || "manual",
      createdAt: Date.now(),
    });
  },
});

// Update a note
export const update = mutation({
  args: {
    id: v.id("notes"),
    text: v.optional(v.string()),
    category: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    pinned: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    await ctx.db.patch(id, {
      ...updates,
      updatedAt: Date.now(),
    });
  },
});

// Archive a note (soft delete)
export const archive = mutation({
  args: { id: v.id("notes") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      archived: true,
      updatedAt: Date.now(),
    });
  },
});

// Delete a note (hard delete)
export const deleteNote = mutation({
  args: { id: v.id("notes") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

// Search notes by text content
export const search = query({
  args: { query: v.string() },
  handler: async (ctx, args) => {
    const allNotes = await ctx.db
      .query("notes")
      .filter((q) => q.neq(q.field("archived"), true))
      .collect();
    
    const query = args.query.toLowerCase();
    const filtered = allNotes.filter((note) =>
      note.text.toLowerCase().includes(query)
    );
    
    return filtered.sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return b.createdAt - a.createdAt;
    });
  },
});

// List archived notes
export const listArchived = query({
  args: {},
  handler: async (ctx) => {
    const notes = await ctx.db
      .query("notes")
      .filter((q) => q.eq(q.field("archived"), true))
      .collect();
    
    return notes.sort((a, b) => b.createdAt - a.createdAt);
  },
});
