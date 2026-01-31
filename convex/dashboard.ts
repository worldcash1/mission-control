import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Get all dashboard data in one query
export const getData = query({
  handler: async (ctx) => {
    const todos = await ctx.db.query("todos").order("desc").collect();
    const projects = await ctx.db.query("projects").order("desc").collect();
    const ideas = await ctx.db.query("ideas").order("desc").collect();
    const activity = await ctx.db.query("activity").order("desc").take(20);

    const activeTodos = todos.filter((t) => t.status === "active");
    const completedTodos = todos.filter((t) => t.status === "done");
    const activeProjects = projects.filter((p) => p.status === "active");
    const queuedProjects = projects.filter((p) => p.status === "queue");

    return {
      todos: {
        active: activeTodos,
        completed: completedTodos,
        total: todos.length,
      },
      projects: {
        active: activeProjects,
        queued: queuedProjects,
        all: projects,
        total: projects.length,
      },
      ideas: {
        all: ideas,
        total: ideas.length,
      },
      activity,
      stats: {
        activeTodos: activeTodos.length,
        completedTodos: completedTodos.length,
        activeProjects: activeProjects.length,
        queuedProjects: queuedProjects.length,
        ideas: ideas.length,
      },
    };
  },
});

// Log activity
export const logActivity = mutation({
  args: { text: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db.insert("activity", {
      text: args.text,
      timestamp: Date.now(),
    });
  },
});
