# TOOLS.md - Local Notes & Setup Details

> Environment-specific configuration and preferences.

---

## Account Creation Preferences
- **Ask for username** before creating any account
- **Password:** I can generate, but will confirm
- **Primary email:** alfred-x@agentmail.to ✅
- **Backup email:** alfred.work.1@proton.me

## Primary Email (AgentMail)
- **Email:** alfred-x@agentmail.to
- **Display:** Alfred AI
- **API Key:** ~/clawd/secrets/agentmail.env
- **Created:** Jan 28, 2026

## Apple ID
- **Email:** alfred-x@agentmail.to
- **Name:** alfred assist
- **2FA:** Enabled (Nam's phone)
- **Password:** ~/clawd/secrets/apple.env
- **Created:** Jan 28, 2026

## Backup Email (Proton)
- **Email:** alfred.work.1@proton.me
- **Password:** ~/clawd/secrets/proton.env
- **Created:** Jan 28, 2026

## Oura Ring
- **Token location:** ~/.secrets/oura.env AND ~/clawd/secrets/oura.env
- **API endpoint:** cloud.ouraring.com
- **Data types:** Sleep, activity, readiness, HR, stress, SpO2
- **Nam's baseline (2026-01-26):**
  - Readiness: 69 🟡
  - Sleep: 46 🔴 (poor - timing and regularity issues)
  - HRV Balance: 100 ✅
  - Resting HR: 100 ✅

## GitHub Repos

**Auto-backup (hourly):**
- **worldcash1/clawd-workspace** - Main workspace (~/clawd/)

**Manual push (when we make changes):**
- **worldcash1/mission-control** - Dashboard app (~/projects/mission-control/) ← NEW
- **worldcash1/trade-tracker-v2** - Strategy tracker app (Schwab API, Vercel)
- **worldcash1/mandarinflow** - Chinese learning app (Convex, ElevenLabs)
- **worldcash1/whale-trader-alpaca** - AI trading bot
- **worldcash1/ai-hedge-fund** - AI hedge fund project

**Archive:**
- alfred-assist-ai/alfred-brain - Old public-safe version
- worldcash1/alfred-brain - Old full backup
- worldcash1/dailylingo - Same as mandarinflow

## Workspace Structure
```
~/clawd/
├── brain/              # Obsidian vault
│   ├── accounts.md     # All credentials (PRIVATE)
│   ├── HOME.md         # Dashboard
│   └── daily-logs/     # Each day's work
├── secrets/            # API tokens
│   └── oura.env
├── memory/             # Daily logs (YYYY-MM-DD.md)
├── knowledge/          # Trading notes, transcripts
├── SOUL.md             # Who I am
├── USER.md             # About Nam
├── TOOLS.md            # This file
├── PROJECTS.md         # Active work status
├── MEMORY.md           # Long-term curated memory
└── .git/               # Version controlled
```

## Obsidian Setup
- **Vault location:** ~/clawd/brain/
- **Font snippets created:** 7 options
  - font-sf-pro (Apple system)
  - font-avenir (elegant geometric)
  - font-helvetica (classic neutral)
  - font-georgia (serif warm)
  - font-new-york (Apple serif refined)
  - font-system-rounded (friendly)
  - font-monaco (monospace)
- **Settings:** Appearance → CSS Snippets

## Cron Jobs (Active)
| Job | Schedule | Purpose |
|-----|----------|---------|
| Morning Brief | 9am HKT (5pm PT)* | Daily briefing |
| THT Pre-Market | 6:30am M-F | Trading analysis |
| THT Mid-Day | 12pm M-F | Trading analysis |
| THT Evening Recap | 6pm M-F | Trading analysis |
| Patreon Summary | 5pm M-F | MarketMaestro + DannyTrades |
| Playtech Morning | 6am M-F | LON:PTEC check |
| Playtech Afternoon | 2pm M-F | LON:PTEC close |
| Flight Tracker | 9am daily | SGN→LAX prices |
| Daily Summary | 11pm daily | Day recap to memory/ |
| Transcript Archive | 11pm daily | Save chat history |
| Alpha Research Weekly | 6pm Sundays | Research report |
| Netflix Weekly | 9am Mondays | Entertainment |
| Schwab Token Refresh | Every 25 min | Keep OAuth alive |
| Workspace Backup | Every hour | Git commit + push |
| Local Backup Sync | Every 30 min | rsync to Documents |

*Morning Brief at 9am HKT while Nam in Hong Kong (until Feb 5)

## QMD - Quick Markdown Search
- **Installed:** ✅ Jan 28, 2026
- **Purpose:** Local vector search for all markdown files (96% token savings)
- **Collections indexed:**
  - `brain` - 33 files (Obsidian vault)
  - `memory` - 3 files (daily logs)
  - `knowledge` - 76 files (trading notes, transcripts)
- **Usage:**
  ```bash
  qmd search "topic"     # Fast BM25 keyword search
  qmd vsearch "topic"    # Semantic vector search
  qmd query "topic"      # Hybrid + reranking (best quality)
  qmd embed              # Update embeddings after adding files
  qmd collection list    # Show all collections
  ```
- **Index location:** ~/.cache/qmd/index.sqlite

## Twitter/X API
- **Account:** @Nam_Le
- **Token location:** ~/clawd/secrets/twitter.env
- **Permissions:** Read Only (can't post, can search/monitor)
- **Capabilities:** Search tweets, check mentions, lookup users

## Skills Installed
- **Oura Ring** - Health data integration
- **Built-in available:**
  - github (gh CLI)
  - notion
  - slack
  - weather
  - apple-notes (memo CLI)
  - gog (Google Workspace)
  - browser automation
  - web search/fetch

## ClawdHub Skills of Interest
- Caldav Calendar (14K+ downloads) - iCloud/Google calendar sync
- News Aggregator - HN, GitHub Trending, finance
- Competitive Intelligence - B2B SaaS research
- Research Idea - Business analysis
- ComfyUI - Image generation

## Phone Service Options (For Future)
- **Ultra Mobile PayGo** - $3/mo, real SIM, T-Mobile (RECOMMENDED)
- **Plivo** - ~$0.80/mo + usage, developer-friendly
- **Telnyx** - ~$1/mo + $0.004/SMS, no minimum

## Strategy Tracker Specs (Recovered 2026-01-29)
**Architecture:**
- Main Dashboard (portfolio overview)
- Strategy Pages (each with own metrics):
  - Earnings: EV/trade, Premium Capture %, Win Rate by Structure
  - BX-Trender: 8 metrics (Position, Value, P&L, Win Rate, Max DD, Hold Time)
  - Premium/Wheels: Theta Efficiency, Assignment Rate
  - Ethan's Trades: TBD (need specs from Nam)
  - VRP: TBD (need definition from Nam)
- Risk Metrics: Sharpe, Sortino, Profit Factor, Expectancy
- UI: Magic Patterns components available
- Repo: trade-tracker-v2 (Vercel deployed)

## Portability Notes
**Portable (inside ~/clawd/):**
- brain/accounts.md ✅
- secrets/ ✅
- memory/ ✅
- All .md files ✅

**Not portable (need to set up on new system):**
- ~/.secrets/ (move to ~/clawd/secrets/)
- ~/.zshrc additions
- Installed packages
- Clawdbot config

**To migrate:** Just copy ~/clawd/ folder. It's git-tracked.
