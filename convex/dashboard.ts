import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Get all dashboard data in one query
export const getData = query({
  handler: async (ctx) => {
    const todos = await ctx.db.query("todos").order("desc").collect();
    const projects = await ctx.db.query("projects").order("desc").collect();
    const ideas = await ctx.db.query("ideas").order("desc").collect();
    const activity = await ctx.db.query("activity").order("desc").take(20);
    const tools = await ctx.db.query("tools").order("asc").collect();

    const activeTodos = todos.filter((t) => t.status === "active");
    const completedTodos = todos.filter((t) => t.status === "done");
    const activeProjects = projects.filter((p) => p.status === "active");
    const queuedProjects = projects.filter((p) => p.status === "queue");
    const activeTools = tools.filter((t) => t.status === "active");
    
    // Group tools by category
    const toolsByCategory: Record<string, typeof tools> = {};
    tools.forEach(t => {
      if (!toolsByCategory[t.category]) toolsByCategory[t.category] = [];
      toolsByCategory[t.category].push(t);
    });
    
    // Group tools by type
    const toolsByType: Record<string, typeof tools> = {};
    tools.forEach(t => {
      if (!toolsByType[t.type]) toolsByType[t.type] = [];
      toolsByType[t.type].push(t);
    });

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
      tools: {
        all: tools,
        active: activeTools,
        byCategory: toolsByCategory,
        byType: toolsByType,
        total: tools.length,
      },
      activity,
      stats: {
        activeTodos: activeTodos.length,
        completedTodos: completedTodos.length,
        activeProjects: activeProjects.length,
        queuedProjects: queuedProjects.length,
        ideas: ideas.length,
        tools: activeTools.length,
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
