import { mutation } from "./_generated/server";

// Seed initial data
export const seedData = mutation({
  handler: async (ctx) => {
    // Clear existing data
    const existingTodos = await ctx.db.query("todos").collect();
    for (const todo of existingTodos) {
      await ctx.db.delete(todo._id);
    }
    
    const existingProjects = await ctx.db.query("projects").collect();
    for (const project of existingProjects) {
      await ctx.db.delete(project._id);
    }
    
    const existingIdeas = await ctx.db.query("ideas").collect();
    for (const idea of existingIdeas) {
      await ctx.db.delete(idea._id);
    }

    // Seed todos from Discord #to-do-list
    const todos = [
      {
        title: "Book Dubai tickets",
        description: "Daily reminder at 9am",
        status: "active",
        reminder: "daily 9am",
        createdAt: Date.now() - 86400000,
      },
      {
        title: "Book Jessica's hotel room",
        description: "April 6, 5 nights for Disneyland trip. Weekly reminder until April 6.",
        status: "active",
        dueDate: "2026-04-06",
        reminder: "weekly saturday 12pm",
        createdAt: Date.now() - 86400000,
      },
      {
        title: "Look into Hyatt vouchers",
        description: "$100 each - good for suite upgrades or $100 flat hotel nights",
        status: "active",
        createdAt: Date.now() - 86400000,
      },
      {
        title: "Set up remote control to Apple iMac",
        description: "Find the best solution for remote access",
        status: "active",
        createdAt: Date.now() - 3600000,
      },
      {
        title: "Buy IREN options",
        description: "Feb 6 catalyst - Amazon deal announcement, potential +20%. Reminder set for Feb 4.",
        status: "active",
        dueDate: "2026-02-06",
        reminder: "2026-02-04 9am",
        priority: "high",
        createdAt: Date.now() - 3600000,
      },
    ];

    for (const todo of todos) {
      await ctx.db.insert("todos", todo);
    }

    // Seed projects
    const projects = [
      {
        title: "Mission Control Dashboard",
        description: "Central command for all Alfred activity, skills, APIs, crons, and automation",
        status: "active",
        progress: 95,
        liveUrl: "https://mission-control-zeta-livid.vercel.app",
        repoUrl: "https://github.com/worldcash1/mission-control",
        createdAt: Date.now() - 172800000,
        updatedAt: Date.now(),
      },
      {
        title: "Marriott MMP Scanner",
        description: "Scan Marriott hotels for MMP discount rates. 80+ hotels across 9 cities.",
        status: "active",
        progress: 90,
        liveUrl: "https://marriott-scanner.vercel.app",
        repoUrl: "https://github.com/worldcash1/marriott-scanner",
        createdAt: Date.now() - 172800000,
        updatedAt: Date.now() - 86400000,
      },
      {
        title: "Strategy Tracker App",
        description: "Trading dashboard with P&L by strategy: Earnings, BX-Trender, Premium/Wheels",
        status: "queue",
        progress: 30,
        repoUrl: "https://github.com/worldcash1/trade-tracker-v2",
        createdAt: Date.now() - 345600000,
        updatedAt: Date.now() - 172800000,
      },
      {
        title: "MandarinFlow / DailyLingo",
        description: "Chinese learning app with phrase-based spaced repetition",
        status: "queue",
        progress: 50,
        createdAt: Date.now() - 345600000,
        updatedAt: Date.now() - 345600000,
      },
    ];

    for (const project of projects) {
      await ctx.db.insert("projects", project);
    }

    // Seed ideas
    const ideas = [
      {
        title: "AgentSpace",
        description: "MySpace for AI agents - social profiles, capabilities, connections. Domains: agenthive.dev available.",
        category: "project",
        createdAt: Date.now() - 86400000,
      },
      {
        title: "Live Discord Sync",
        description: "Auto-sync Mission Control from #to-do-list channel + memory files",
        category: "feature",
        createdAt: Date.now() - 3600000,
      },
    ];

    for (const idea of ideas) {
      await ctx.db.insert("ideas", idea);
    }

    // Log activity
    await ctx.db.insert("activity", {
      text: "Mission Control connected to Convex",
      timestamp: Date.now(),
    });

    return { success: true, todos: todos.length, projects: projects.length, ideas: ideas.length };
  },
});
