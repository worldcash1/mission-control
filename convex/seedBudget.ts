import { mutation } from "./_generated/server";

// One-time seed to create initial budget
export const seed = mutation({
  handler: async (ctx) => {
    const existing = await ctx.db.query("tokenBudget").collect();
    
    if (existing.length === 0) {
      await ctx.db.insert("tokenBudget", {
        monthlyBudget: 300,
        alerts: [
          { threshold: 50, notified: false },
          { threshold: 80, notified: false },
          { threshold: 90, notified: false },
        ],
        updatedAt: Date.now(),
      });
      return { success: true, message: "Budget seeded with $300" };
    }
    
    return { success: false, message: "Budget already exists" };
  },
});
