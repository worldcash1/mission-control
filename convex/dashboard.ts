import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Get all dashboard data in one query
export const getData = query({
  handler: async (ctx) => {
    const tasks = await ctx.db.query("tasks").order("desc").collect();
    const projects = await ctx.db.query("projects").order("desc").collect();
    const ideas = await ctx.db.query("ideas").order("desc").collect();
    const activity = await ctx.db.query("activity").order("desc").take(20);
    const tools = await ctx.db.query("tools").order("asc").collect();

    const inboxItems = await ctx.db.query("inbox").order("desc").collect();
    const untriagedInbox = inboxItems.filter(i => !i.triaged);

    const activeTasks = tasks.filter((t) => t.status !== "done");
    const completedTasks = tasks.filter((t) => t.status === "done");
    const activeProjects = projects.filter((p) => p.status === "active" || p.status === "building");
    const queuedProjects = projects.filter((p) => p.status === "queue" || p.status === "planning");
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

    // Calculate due today and this week
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const weekEnd = new Date(now);
    weekEnd.setDate(weekEnd.getDate() + 7);
    const weekEndStr = weekEnd.toISOString().split('T')[0];
    
    const dueToday = activeTasks.filter(t => t.dueDate === today).length;
    const dueThisWeek = activeTasks.filter(t => t.dueDate && t.dueDate >= today && t.dueDate <= weekEndStr).length;

    return {
      inbox: {
        items: untriagedInbox,
        count: untriagedInbox.length,
      },
      tasks: {
        active: activeTasks,
        completed: completedTasks,
        total: tasks.length,
        dueToday,
        dueThisWeek,
      },
      // Legacy compatibility - map tasks to todos structure
      todos: {
        active: activeTasks,
        completed: completedTasks,
        total: tasks.length,
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
        activeTasks: activeTasks.length,
        completedTasks: completedTasks.length,
        dueToday,
        dueThisWeek,
        // Legacy
        activeTodos: activeTasks.length,
        completedTodos: completedTasks.length,
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
