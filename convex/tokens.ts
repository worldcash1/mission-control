import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Get all token usage with optional date range filter
export const getUsage = query({
  args: {
    startDate: v.optional(v.string()),
    endDate: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let usage = await ctx.db.query("tokenUsage").collect();
    
    if (args.startDate || args.endDate) {
      usage = usage.filter(u => {
        if (args.startDate && u.date < args.startDate) return false;
        if (args.endDate && u.date > args.endDate) return false;
        return true;
      });
    }
    
    return usage.sort((a, b) => b.date.localeCompare(a.date));
  },
});

// Get current budget configuration
export const getBudget = query({
  handler: async (ctx) => {
    const budgets = await ctx.db.query("tokenBudget").collect();
    if (budgets.length === 0) {
      // Return default if none exists
      return {
        monthlyBudget: 300,
        alerts: [
          { threshold: 50, notified: false },
          { threshold: 80, notified: false },
          { threshold: 90, notified: false },
        ],
        updatedAt: Date.now(),
      };
    }
    return budgets[0];
  },
});

// Set/update budget
export const setBudget = mutation({
  args: {
    monthlyBudget: v.number(),
    alerts: v.optional(v.array(v.object({
      threshold: v.number(),
      notified: v.optional(v.boolean()),
    }))),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.query("tokenBudget").collect();
    
    if (existing.length > 0) {
      await ctx.db.patch(existing[0]._id, {
        monthlyBudget: args.monthlyBudget,
        alerts: args.alerts,
        updatedAt: Date.now(),
      });
      return existing[0]._id;
    } else {
      return await ctx.db.insert("tokenBudget", {
        monthlyBudget: args.monthlyBudget,
        alerts: args.alerts || [
          { threshold: 50, notified: false },
          { threshold: 80, notified: false },
          { threshold: 90, notified: false },
        ],
        updatedAt: Date.now(),
      });
    }
  },
});

// Record token usage
export const recordUsage = mutation({
  args: {
    provider: v.string(),
    model: v.optional(v.string()),
    date: v.string(),
    inputTokens: v.optional(v.number()),
    outputTokens: v.optional(v.number()),
    cost: v.number(),
    agent: v.optional(v.string()),
    sessions: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("tokenUsage", {
      ...args,
      fetchedAt: Date.now(),
    });
  },
});

// Get aggregated stats
export const getStats = query({
  handler: async (ctx) => {
    const usage = await ctx.db.query("tokenUsage").collect();
    const budget = await ctx.db.query("tokenBudget").collect();
    
    const monthlyBudget = budget.length > 0 ? budget[0].monthlyBudget : 300;
    
    // Get current month data
    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    
    const monthUsage = usage.filter(u => u.date.startsWith(currentMonth));
    const todayUsage = usage.filter(u => u.date === today);
    
    // Total spend this month
    const totalMonthSpend = monthUsage.reduce((sum, u) => sum + u.cost, 0);
    const totalTodaySpend = todayUsage.reduce((sum, u) => sum + u.cost, 0);
    
    // By provider
    const byProvider = monthUsage.reduce((acc, u) => {
      acc[u.provider] = (acc[u.provider] || 0) + u.cost;
      return acc;
    }, {} as Record<string, number>);
    
    // By model
    const byModel = monthUsage.reduce((acc, u) => {
      if (u.model) {
        if (!acc[u.model]) {
          acc[u.model] = { cost: 0, inputTokens: 0, outputTokens: 0, provider: u.provider };
        }
        acc[u.model].cost += u.cost;
        acc[u.model].inputTokens += u.inputTokens || 0;
        acc[u.model].outputTokens += u.outputTokens || 0;
      }
      return acc;
    }, {} as Record<string, { cost: number; inputTokens: number; outputTokens: number; provider: string }>);
    
    // By agent
    const byAgent = monthUsage.reduce((acc, u) => {
      const agent = u.agent || "unknown";
      if (!acc[agent]) {
        acc[agent] = { cost: 0, sessions: 0 };
      }
      acc[agent].cost += u.cost;
      acc[agent].sessions += u.sessions || 0;
      return acc;
    }, {} as Record<string, { cost: number; sessions: number }>);
    
    // Daily trend (last 30 days)
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const dailyTrend: Record<string, number> = {};
    
    // Initialize all days with 0
    for (let i = 0; i < 30; i++) {
      const d = new Date(thirtyDaysAgo.getTime() + i * 24 * 60 * 60 * 1000);
      const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      dailyTrend[dateStr] = 0;
    }
    
    // Fill in actual usage
    usage.forEach(u => {
      if (dailyTrend.hasOwnProperty(u.date)) {
        dailyTrend[u.date] += u.cost;
      }
    });
    
    // Calculate projected monthly spend
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const currentDay = now.getDate();
    const avgDailySpend = totalMonthSpend / currentDay;
    const projectedMonthlySpend = avgDailySpend * daysInMonth;
    
    // Find top provider
    const topProvider = Object.entries(byProvider).sort((a, b) => b[1] - a[1])[0];
    
    return {
      totalMonthSpend,
      totalTodaySpend,
      projectedMonthlySpend,
      monthlyBudget,
      topProvider: topProvider ? { name: topProvider[0], spend: topProvider[1] } : null,
      byProvider,
      byModel,
      byAgent,
      dailyTrend,
    };
  },
});
