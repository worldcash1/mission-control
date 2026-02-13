import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api.js";
import { readFileSync } from "fs";

const envContent = readFileSync(".env.local", "utf8");
const CONVEX_URL = envContent.match(/VITE_CONVEX_URL=(.*)/)[1];

const client = new ConvexHttpClient(CONVEX_URL);

const projects = [
  {
    title: "Mission Control",
    description: "Central hub for managing projects, tools, todos, and AI agents",
    status: "live",
    tags: ["work", "ai", "tool"],
    discordChannelId: "1467015020490653945",
    githubUrl: "mission-control",
    vercelUrl: "mission-control-zeta-livid.vercel.app",
    convexUrl: "cautious-antelope-194",
    brainFolder: "projects/mission-control",
    agent: "alfred",
    progress: 90,
    techStack: ["Convex", "HTML/CSS/JS", "Vercel"],
    features: ["Project management", "Cron tracking", "Skills registry", "Org chart"],
  },
  {
    title: "Earnings Tracker",
    description: "Track earnings announcements and trading opportunities",
    status: "live",
    tags: ["finance", "trading", "tool"],
    discordChannelId: "1466793711470903444",
    githubUrl: "earnings-tracker",
    vercelUrl: "app-five-mu-29.vercel.app",
    convexUrl: "cautious-antelope-194",
    agent: "sentinel",
    progress: 85,
    techStack: ["Convex", "React", "Vercel"],
    apis: ["Schwab", "Earnings API"],
  },
  {
    title: "Marriott Scanner",
    description: "Automated hotel price and point value monitoring",
    status: "live",
    tags: ["travel", "tool"],
    discordChannelId: "1466734895719251979",
    githubUrl: "marriott-scanner",
    agent: "alfred",
    progress: 80,
    techStack: ["Node.js", "Bright Data"],
    features: ["Price alerts", "Point calculations", "Discord notifications"],
  },
  {
    title: "Scout",
    description: "Job listing aggregator and tracking system",
    status: "paused",
    tags: ["work", "tool"],
    discordChannelId: "1466735580627992689",
    githubUrl: "scout",
    agent: "alfred",
    progress: 60,
  },
  {
    title: "Connect Keeper",
    description: "CRM and network relationship manager",
    status: "building",
    tags: ["work", "tool"],
    discordChannelId: "1470449035943870556",
    githubUrl: "connect-keeper-v2",
    agent: "alfred",
    progress: 40,
    brainFolder: "projects/connect-keeper",
    features: ["Contact management", "Activity tracking", "Relationship insights"],
  },
  {
    title: "GrowWatch",
    description: "Cannabis cultivation monitoring and analytics",
    status: "building",
    tags: ["cannabis", "tech"],
    discordChannelId: "1471334389265858612",
    agent: "alfred",
    progress: 30,
    brainFolder: "projects/growwatch",
    features: ["Environmental monitoring", "Growth tracking", "Harvest predictions"],
  },
  {
    title: "Social Arb Lab",
    description: "Research platform for social media sentiment arbitrage",
    status: "building",
    tags: ["finance", "trading", "research"],
    discordChannelId: "1469912105648914631",
    agent: "sentinel",
    progress: 35,
    brainFolder: "projects/social-arb",
    apis: ["Twitter/X", "Reddit", "Discord"],
  },
  {
    title: "Jordi Vissor",
    description: "Technical research and development project",
    status: "research",
    tags: ["tech", "side-quest"],
    discordChannelId: "1470865320481656975",
    agent: "alfred",
    progress: 10,
  },
  {
    title: "DailyLingo",
    description: "Daily language learning practice app",
    status: "paused",
    tags: ["side-quest", "learning"],
    githubUrl: "dailylingo",
    agent: "alfred",
    progress: 50,
  },
  {
    title: "Nickel Mining",
    description: "Research into nickel mining investment opportunities",
    status: "research",
    tags: ["finance", "investing"],
    discordChannelId: "1469699614776234085",
    agent: "alfred",
    progress: 20,
    brainFolder: "research/nickel-mining",
  },
  {
    title: "AI Trading Firm",
    description: "Automated trading system powered by AI agents",
    status: "research",
    tags: ["finance", "trading", "ai"],
    discordChannelId: "1469627584068325501",
    agent: "sentinel",
    progress: 15,
    brainFolder: "projects/ai-trading",
  },
  {
    title: "Culture Cultivation",
    description: "Cannabis culture and education platform",
    status: "research",
    tags: ["cannabis"],
    discordChannelId: "1470335703752904716",
    agent: "alfred",
    progress: 10,
  },
  {
    title: "Ponderosa Court",
    description: "Family property development project",
    status: "research",
    tags: ["family", "real-estate"],
    discordChannelId: "1471227686964691089",
    agent: "alfred",
    progress: 5,
    brainFolder: "family/ponderosa-court",
  },
  {
    title: "Flight Hunter",
    description: "Flight deal finder and alert system",
    status: "paused",
    tags: ["travel", "tool"],
    agent: "alfred",
    progress: 45,
  },
  {
    title: "Trade Tracker v2",
    description: "Advanced trading journal and analytics",
    status: "archived",
    tags: ["finance", "trading", "tool"],
    githubUrl: "trade-tracker-v2",
    agent: "sentinel",
    progress: 70,
  },
  {
    title: "Cannabis Wholesale Portal",
    description: "B2B platform for cannabis wholesale operations",
    status: "archived",
    tags: ["cannabis", "tool"],
    githubUrl: "cannabis-wholesale-portal",
    agent: "alfred",
    progress: 60,
  },
  {
    title: "Virtual AI Studio",
    description: "AI-powered virtual studio environment",
    status: "archived",
    tags: ["ai", "side-quest"],
    githubUrl: "virtual-ai-studio",
    agent: "alfred",
    progress: 40,
  },
  {
    title: "Kirby Distro",
    description: "Cannabis distribution management system",
    status: "archived",
    tags: ["cannabis"],
    githubUrl: "kirby-distro",
    agent: "alfred",
    progress: 55,
  },
  {
    title: "Obsidian Plugins",
    description: "Custom Obsidian plugins for workflow automation (replaced by Mission Control)",
    status: "archived",
    tags: ["work", "tool"],
    discordChannelId: "1471813905436246038",
    agent: "alfred",
    progress: 75,
  },
];

async function seed() {
  console.log("Seeding projects...");
  
  // Clear existing projects
  const existing = await client.query(api.projects.list, {});
  console.log(`Clearing ${existing.length} existing projects...`);
  
  for (const project of existing) {
    await client.mutation(api.projects.remove, { id: project._id });
  }
  
  // Insert new projects
  for (const project of projects) {
    await client.mutation(api.projects.add, project);
    console.log(`✓ Added: ${project.title}`);
  }
  
  console.log(`\n✅ Successfully seeded ${projects.length} projects!`);
}

seed().catch(console.error);
