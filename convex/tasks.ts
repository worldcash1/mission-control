import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Get all tasks with optional filters
export const list = query({
  args: {
    status: v.optional(v.string()),
    type: v.optional(v.string()),
    projectId: v.optional(v.id("projects")),
    assignee: v.optional(v.string()),
    category: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let tasks = await ctx.db.query("tasks").order("desc").collect();
    
    if (args.status) {
      tasks = tasks.filter(t => t.status === args.status);
    }
    if (args.type) {
      tasks = tasks.filter(t => t.type === args.type);
    }
    if (args.projectId) {
      tasks = tasks.filter(t => t.projectId === args.projectId);
    }
    if (args.assignee) {
      tasks = tasks.filter(t => t.assignee === args.assignee);
    }
    if (args.category) {
      tasks = tasks.filter(t => t.category === args.category);
    }
    
    return tasks;
  },
});

// Get active (non-done) tasks
export const listActive = query({
  handler: async (ctx) => {
    const tasks = await ctx.db.query("tasks").order("desc").collect();
    return tasks.filter(t => t.status !== "done");
  },
});

// Get tasks by project
export const listByProject = query({
  args: { projectId: v.id("projects") },
  handler: async (ctx, args) => {
    const tasks = await ctx.db.query("tasks").order("desc").collect();
    return tasks.filter(t => t.projectId === args.projectId);
  },
});

// Get tasks with upcoming unfired reminders
export const listUpcomingReminders = query({
  handler: async (ctx) => {
    const tasks = await ctx.db.query("tasks").order("desc").collect();
    return tasks
      .filter(t => t.reminder && !t.reminder.fired && t.status !== "done")
      .sort((a, b) => {
        const aTime = a.reminder?.at ? new Date(a.reminder.at).getTime() : Infinity;
        const bTime = b.reminder?.at ? new Date(b.reminder.at).getTime() : Infinity;
        return aTime - bTime;
      });
  },
});

// Get a single task by ID
export const get = query({
  args: { id: v.id("tasks") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Add a new task
export const add = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    status: v.optional(v.string()),
    priority: v.optional(v.string()),
    type: v.optional(v.string()),
    projectId: v.optional(v.id("projects")),
    assignee: v.optional(v.string()),
    category: v.optional(v.string()),
    dueDate: v.optional(v.string()),
    reminder: v.optional(v.object({
      at: v.string(),
      repeat: v.optional(v.string()),
      fired: v.optional(v.boolean()),
    })),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("tasks", {
      title: args.title,
      description: args.description,
      status: args.status || "active",
      priority: args.priority || "medium",
      type: args.type || "personal",
      projectId: args.projectId,
      assignee: args.assignee,
      category: args.category,
      dueDate: args.dueDate,
      reminder: args.reminder,
      createdAt: Date.now(),
    });
  },
});

// Update a task
export const update = mutation({
  args: {
    id: v.id("tasks"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    status: v.optional(v.string()),
    priority: v.optional(v.string()),
    type: v.optional(v.string()),
    projectId: v.optional(v.id("projects")),
    assignee: v.optional(v.string()),
    category: v.optional(v.string()),
    dueDate: v.optional(v.string()),
    reminder: v.optional(v.object({
      at: v.string(),
      repeat: v.optional(v.string()),
      fired: v.optional(v.boolean()),
    })),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    // Remove undefined values
    const cleanUpdates: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(updates)) {
      if (value !== undefined) {
        cleanUpdates[key] = value;
      }
    }
    await ctx.db.patch(id, cleanUpdates);
  },
});

// Mark task as done
export const complete = mutation({
  args: { id: v.id("tasks") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      status: "done",
      completedAt: Date.now(),
    });
  },
});

// Reopen a completed task
export const reopen = mutation({
  args: { id: v.id("tasks") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      status: "active",
      completedAt: undefined,
    });
  },
});

// Delete a task
export const remove = mutation({
  args: { id: v.id("tasks") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

// Mark reminder as fired
export const markReminderFired = mutation({
  args: { id: v.id("tasks") },
  handler: async (ctx, args) => {
    const task = await ctx.db.get(args.id);
    if (task && task.reminder) {
      await ctx.db.patch(args.id, {
        reminder: {
          ...task.reminder,
          fired: true,
        },
      });
    }
  },
});
