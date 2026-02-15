import { mutation } from "./_generated/server";

export const seed = mutation({
  handler: async (ctx) => {
    // Clear existing projects
    const existing = await ctx.db.query("projects").collect();
    for (const p of existing) {
      await ctx.db.delete(p._id);
    }

    const now = Date.now();
    const projects = [
      {
        title: "Mission Control",
        description: "Command center dashboard — projects, agents, crons, skills",
        status: "live",
        tags: ["work", "ai", "tool"],
        discordChannelId: "1467015020490653945",
        githubUrl: "https://github.com/clawd/mission-control",
        vercelUrl: "https://mission-control-zeta-livid.vercel.app",
        agent: "alfred",
        features: ["Command Center widgets", "Cron management", "Skills inventory", "Org Chart", "Agent status"],
        techStack: ["HTML", "JavaScript", "Convex", "Vercel"],
      },
      {
        title: "Earnings Tracker",
        description: "P&L logging, iron fly tracking, Schwab API integration",
        status: "live",
        tags: ["finance", "trading", "tool"],
        discordChannelId: "1466793711470903444",
        githubUrl: "https://github.com/clawd/earnings-tracker",
        vercelUrl: "https://app-five-mu-29.vercel.app",
        convexUrl: "https://dashboard.convex.dev/t/cautious-antelope-194",
        agent: "sentinel",
        features: ["Trade journal", "P&L calendar heatmap", "Strategy dashboards", "Auto-detect trades", "Spread rankings"],
        techStack: ["Next.js", "React", "Convex", "Schwab API", "Python"],
        apis: ["Schwab", "OQuants"],
      },
      {
        title: "Marriott Scanner",
        description: "MMP corporate rate scanner with PDF reports",
        status: "live",
        tags: ["travel", "tool"],
        discordChannelId: "1466734895719251979",
        githubUrl: "https://github.com/clawd/marriott-scanner",
        agent: "alfred",
        features: ["CDP browser scraping", "PDF generator", "Discord commands", "8995 hotel registry"],
        techStack: ["Node.js", "Puppeteer", "Convex"],
        apis: ["Marriott", "Bright Data"],
      },
      {
        title: "Scout",
        description: "Search across all accounts (Gmail, Dropbox, Slack, Drive)",
        status: "paused",
        tags: ["work", "tool"],
        discordChannelId: "1466735580627992689",
        githubUrl: "https://github.com/clawd/scout",
        agent: "alfred",
      },
      {
        title: "Connect Keeper",
        description: "Chrome extension for saving profiles + contact management",
        status: "building",
        tags: ["work", "tool"],
        discordChannelId: "1470449035943870556",
        githubUrl: "https://github.com/clawd/connect-keeper-v2",
        agent: "alfred",
        features: ["Profile auto-grab", "Photo backup", "Message page extraction"],
        techStack: ["Chrome Extension", "React", "Neon", "Cloudinary"],
      },
      {
        title: "GrowWatch",
        description: "AI grow ops command center — IP cameras + local vision AI",
        status: "building",
        tags: ["cannabis", "tech"],
        discordChannelId: "1471334389265858612",
        agent: "alfred",
        features: ["Camera monitoring", "Vision AI analysis"],
        techStack: ["Python", "IP cameras"],
      },
      {
        title: "Social Arb Lab",
        description: "TikTok trend scanning, social arbitrage signals",
        status: "building",
        tags: ["finance", "trading", "research"],
        discordChannelId: "1469912105648914631",
        agent: "sentinel",
        features: ["TikTok scraper", "X demand scanner", "Google Trends", "Signal dedup"],
        techStack: ["Node.js", "Python", "Bright Data"],
        apis: ["X API", "Bright Data", "Google Trends"],
      },
      {
        title: "Jordi Vissor",
        description: "Live camera vision project",
        status: "research",
        tags: ["tech", "side-quest"],
        discordChannelId: "1470865320481656975",
        agent: "alfred",
      },
      {
        title: "DailyLingo",
        description: "Phrase-based Chinese learning app",
        status: "paused",
        tags: ["side-quest", "learning"],
        githubUrl: "https://github.com/clawd/dailylingo",
        agent: "alfred",
      },
      {
        title: "Nickel Mining",
        description: "Indonesia nickel mine investment research",
        status: "research",
        tags: ["finance", "investing"],
        discordChannelId: "1469699614776234085",
        agent: "alfred",
      },
      {
        title: "AI Trading Firm",
        description: "Renaissance 2.0 — AI-powered trading with agent teams",
        status: "research",
        tags: ["finance", "trading", "ai"],
        discordChannelId: "1469627584068325501",
        agent: "sentinel",
      },
      {
        title: "Culture Cultivation",
        description: "Cannabis cultivation operations and compliance",
        status: "research",
        tags: ["cannabis"],
        discordChannelId: "1470335703752904716",
        agent: "alfred",
      },
      {
        title: "Ponderosa Court",
        description: "Real estate project",
        status: "research",
        tags: ["family", "real-estate"],
        discordChannelId: "1471227686964691089",
        agent: "alfred",
      },
      {
        title: "Flight Hunter",
        description: "Flight deal scanner",
        status: "paused",
        tags: ["travel", "tool"],
        agent: "alfred",
      },
      {
        title: "Trade Tracker v2",
        description: "Legacy trading portfolio tracker (replaced by Earnings Tracker)",
        status: "archived",
        tags: ["finance", "trading", "tool"],
        githubUrl: "https://github.com/clawd/trade-tracker-v2",
        agent: "sentinel",
      },
      {
        title: "Cannabis Wholesale Portal",
        description: "Cannabis B2B wholesale marketplace",
        status: "archived",
        tags: ["cannabis", "tool"],
        githubUrl: "https://github.com/clawd/cannabis-wholesale-portal",
        agent: "alfred",
      },
      {
        title: "Virtual AI Studio",
        description: "AI video/content studio",
        status: "archived",
        tags: ["ai", "side-quest"],
        githubUrl: "https://github.com/clawd/virtual-ai-studio",
        agent: "alfred",
      },
      {
        title: "Kirby Distro",
        description: "Cannabis distribution management",
        status: "archived",
        tags: ["cannabis"],
        githubUrl: "https://github.com/clawd/kirby-distro",
        agent: "alfred",
      },
      {
        title: "Obsidian Plugins",
        description: "Obsidian plugin suite (replaced by Mission Control)",
        status: "archived",
        tags: ["work", "tool"],
        discordChannelId: "1471813905436246038",
        agent: "alfred",
      },
    ];

    for (const p of projects) {
      await ctx.db.insert("projects", {
        ...p,
        createdAt: now,
        updatedAt: now,
      });
    }

    return { seeded: projects.length };
  },
});
