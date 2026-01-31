import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Get all tools
export const list = query({
  handler: async (ctx) => {
    return await ctx.db.query("tools").order("asc").collect();
  },
});

// Get tools by type
export const listByType = query({
  args: { type: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("tools")
      .filter((q) => q.eq(q.field("type"), args.type))
      .collect();
  },
});

// Get tools by category
export const listByCategory = query({
  args: { category: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("tools")
      .filter((q) => q.eq(q.field("category"), args.category))
      .collect();
  },
});

// Get active tools only
export const listActive = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("tools")
      .filter((q) => q.eq(q.field("status"), "active"))
      .collect();
  },
});

// Add a new tool
export const add = mutation({
  args: {
    name: v.string(),
    type: v.string(),
    category: v.string(),
    description: v.string(),
    accessMethod: v.optional(v.string()),
    capabilities: v.optional(v.array(v.string())),
    status: v.optional(v.string()),
    icon: v.optional(v.string()),
    url: v.optional(v.string()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("tools", {
      name: args.name,
      type: args.type,
      category: args.category,
      description: args.description,
      accessMethod: args.accessMethod,
      capabilities: args.capabilities,
      status: args.status || "active",
      icon: args.icon,
      url: args.url,
      notes: args.notes,
      addedAt: Date.now(),
    });
  },
});

// Update a tool
export const update = mutation({
  args: {
    id: v.id("tools"),
    name: v.optional(v.string()),
    type: v.optional(v.string()),
    category: v.optional(v.string()),
    description: v.optional(v.string()),
    accessMethod: v.optional(v.string()),
    capabilities: v.optional(v.array(v.string())),
    status: v.optional(v.string()),
    icon: v.optional(v.string()),
    url: v.optional(v.string()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    // Filter out undefined values
    const filteredUpdates = Object.fromEntries(
      Object.entries(updates).filter(([_, v]) => v !== undefined)
    );
    await ctx.db.patch(id, filteredUpdates);
  },
});

// Remove a tool
export const remove = mutation({
  args: { id: v.id("tools") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

// Get tool stats
export const stats = query({
  handler: async (ctx) => {
    const tools = await ctx.db.query("tools").collect();
    const byType: Record<string, number> = {};
    const byCategory: Record<string, number> = {};
    let active = 0;
    
    tools.forEach(t => {
      byType[t.type] = (byType[t.type] || 0) + 1;
      byCategory[t.category] = (byCategory[t.category] || 0) + 1;
      if (t.status === "active") active++;
    });
    
    return {
      total: tools.length,
      active,
      byType,
      byCategory,
    };
  },
});
