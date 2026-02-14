# PROJECTS.md - Active Work & Status

> One glance = current status. Updated 2026-02-11.

---

## 🔥 ACTIVE

### Earnings Tracker
- **Status:** ✅ LIVE
- **URL:** https://earnings-tracker-theta.vercel.app
- **Repo:** `~/projects/earnings-tracker/`
- **Stack:** Next.js + Convex + Schwab API + OQuants
- **Features:** Pre-trade capture, post-trade P&L, auto-close, spread rankings
- **Crons:** Pre-trade pipeline (3:15pm ET), Auto-close (10:30/12:30/2:30pm ET), Spread rankings (10am ET)

### Marriott MMP Scanner
- **Status:** ✅ LIVE v3.0
- **URL:** https://marriott-scanner.vercel.app
- **Repo:** `~/projects/marriott-scanner/`
- **Stack:** Next.js + Convex + Playwright + Vercel
- **Features:** Hotel selection, 12-month range, real-time progress, calendar view
- **Key discovery:** Tokyo MMP rates $39-75/night at quality hotels

### Sentinel - Trading Intelligence
- **Status:** ✅ LIVE
- **Purpose:** Maximize $200/mo X API investment
- **Crons:** Market scan (5x/day), EOD recap (4pm), weekly sentiment (Sun 6pm)
- **Architecture:** X API → Grok hybrid pipeline
- **Output:** #alerts (real-time), #briefings (scheduled)

### Mission Control Dashboard
- **Status:** ✅ LIVE
- **URL:** https://mission-control-nams-projects-9474d015.vercel.app
- **Features:** Daily logs viewer, skills inventory, APIs status
- **Repo:** `~/projects/mission-control/`

### Social Arb
- **Status:** ✅ LIVE
- **Location:** `~/projects/social-arb/`
- **Purpose:** TikTok/Amazon trend → stock correlation
- **Crons:** Google Trends (6:15am ET), X Scanner (6:30am ET), Bright Data (Mon/Wed/Fri)
- **Output:** #social-arb-lab, #tiktok-trend-arbitrage

### Coiled Earnings Scanner
- **Status:** ✅ LIVE v1.0
- **Location:** `~/clawd/skills/coiled-scanner/`
- **Purpose:** Find squeeze setups: high SI + upcoming earnings
- **Data:** Convex DB at `dazzling-dogfish-586.convex.cloud`
- **Crons:** Weekly scan (Sun 6pm), Outcome tracker (daily 7am)

### API Monitor
- **Status:** ✅ LIVE
- **Location:** `~/clawd/skills/api-monitor/`
- **Purpose:** Health check all APIs, auto-recovery, Discord alerts
- **Dashboard:** #📡-api-monitor (pinned message)
- **Crons:** Health check every 4 hours

---

## 🟡 IN PROGRESS

### Strategy Tracker App
- **Status:** READY TO BUILD
- **Repo:** `~/projects/trade-tracker-v2`
- **Tech:** Next.js 14, Prisma, Schwab OAuth, shadcn/ui
- **Blocked:** Need Schwab trading scope for positions

### Schwab API Integration
- **Working:** ✅ Market data, quotes, options chains, token refresh (every 25 min)
- **Blocked:** ❌ Portfolio/accounts scope (need re-auth)

---

## 📁 BACKLOG

| Project | Priority | Notes |
|---------|----------|-------|
| Trade Journal Auto-Logger | High | Needs Schwab scope |
| Sleep → Trading Correlator | Medium | Needs trade data |
| Calendar Sync (CalDAV) | Low | Connect iCloud/Google |

---

## ✅ COMPLETED (Recent)

### 2026-02-11
- [x] Context optimization (40KB → 16KB workspace files)
- [x] Disabled unused bundled skills (apple-notes, skill-creator, video-frames)
- [x] Fixed broken crons (model refs)
- [x] Consolidated morning briefings, downgraded model tiers

### 2026-02-08
- [x] Earnings Tracker pipeline complete
- [x] OQuants + Schwab pre/post-trade CLIs
- [x] 14 CLIs in ~/bin/

### 2026-02-05
- [x] Coiled Earnings Scanner v1.0

---

## 📦 GITHUB REPOS

| Repo | Description | Status |
|------|-------------|--------|
| `worldcash1/earnings-tracker` | Earnings trade tracker | ✅ Active |
| `worldcash1/marriott-scanner` | MMP rate scanner | ✅ Active |
| `worldcash1/mission-control` | Dashboard app | ✅ Active |
| `worldcash1/social-arb` | TikTok trend arbitrage | ✅ Active |
| `worldcash1/clawd-workspace` | Main workspace backup | ✅ Hourly backup |

---

## 🗂️ ~/projects/ Folder Status

| Folder | Status | Notes |
|--------|--------|-------|
| earnings-tracker | ✅ Active | Main earnings app |
| marriott-scanner | ✅ Active | v3.0 live |
| mission-control | ✅ Active | Dashboard |
| social-arb | ✅ Active | Trend arbitrage |
| scout-v2 | ✅ Active | Latest Scout version |
| trade-tracker-v2 | 🟡 Paused | Needs Schwab scope |
| botbrowser | 🔴 Stale | Old browser automation |
| connect-keeper-* | 🔴 Stale | Old iterations |
| earnings-intel | 🔴 Stale | Merged into earnings-tracker |
| marriott-mmp | 🔴 Stale | Replaced by marriott-scanner |
| scout | 🔴 Stale | Replaced by scout-v2 |
| stealth-browser | 🔴 Stale | Experimental |

---

*Last updated: 2026-02-11 8:15 PM PT*
