import { query } from "./_generated/server";
import { v } from "convex/values";

export const global = query({
  args: {
    query: v.string(),
  },
  handler: async (ctx, args) => {
    const q = args.query.toLowerCase().trim();
    if (!q) return [];

    const results: Array<{
      type: string;
      title: string;
      description?: string;
      id: string;
      href: string;
      timestamp: number;
    }> = [];

    // Search tasks
    const tasks = await ctx.db.query("tasks").collect();
    for (const t of tasks) {
      if (
        t.title.toLowerCase().includes(q) ||
        t.description?.toLowerCase().includes(q)
      ) {
        results.push({
          type: "task",
          title: t.title,
          description: t.description,
          id: t._id,
          href: "/tasks",
          timestamp: t.createdAt,
        });
      }
    }

    // Search projects
    const projects = await ctx.db.query("projects").collect();
    for (const p of projects) {
      if (
        p.title.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q) ||
        p.tags?.some((tag: string) => tag.toLowerCase().includes(q))
      ) {
        results.push({
          type: "project",
          title: p.title,
          description: p.description,
          id: p._id,
          href: "/projects",
          timestamp: p.createdAt,
        });
      }
    }

    // Search ideas
    const ideas = await ctx.db.query("ideas").collect();
    for (const i of ideas) {
      if (
        i.title.toLowerCase().includes(q) ||
        i.description?.toLowerCase().includes(q)
      ) {
        results.push({
          type: "idea",
          title: i.title,
          description: i.description,
          id: i._id,
          href: "/ideas",
          timestamp: i.createdAt,
        });
      }
    }

    // Search notes (if table exists)
    try {
      const notes = await ctx.db.query("notes").collect();
      for (const n of notes) {
        if (n.text.toLowerCase().includes(q)) {
          results.push({
            type: "note",
            title: n.text.length > 80 ? n.text.slice(0, 80) + "..." : n.text,
            description: n.category,
            id: n._id,
            href: "/brain",
            timestamp: n.createdAt,
          });
        }
      }
    } catch {
      // notes table may not exist yet
    }

    // Search inbox
    const inbox = await ctx.db.query("inbox").collect();
    for (const item of inbox) {
      if (item.text.toLowerCase().includes(q)) {
        results.push({
          type: "inbox",
          title: item.text.length > 80 ? item.text.slice(0, 80) + "..." : item.text,
          id: item._id,
          href: "/",
          timestamp: item.createdAt,
        });
      }
    }

    // Sort by timestamp desc, limit to 20
    results.sort((a, b) => b.timestamp - a.timestamp);
    return results.slice(0, 20);
  },
});
