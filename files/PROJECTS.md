# PROJECTS.md - Active Work & Status

> One glance = current status. Updated 2026-01-29 after Telegram export recovery.

---

## 🔥 ACTIVE

### Strategy Tracker App
- **Status:** READY TO BUILD
- **Specs:** ✅ Recovered from Telegram export
- **Repo:** `trade-tracker-v2` (check status)
- **UI:** Magic Patterns components available
- **Pages:**
  - Earnings (EV, Win Rate by Structure, Premium Capture)
  - BX-Trender (8 key metrics)
  - Premium/Wheels (Theta, Assignment Rate)
  - Ethan's Trades (need specs from Nam)
  - VRP (need definition from Nam)
- **Next:** Locate repo, assess current state, continue build

### Morning Brief
- **Status:** ✅ LIVE
- **Schedule:** 9am HKT (5pm PT) — adjusted for HK trip
- **Includes:** Oura, Weather, Markets, Calendar, Email, News
- **Next:** Test tomorrow, switch back to 9am PT on Feb 5

---

## 🟡 IN PROGRESS

### Schwab API Integration
- **Status:** PARTIAL
- **Working:** ✅ Market data, token refresh
- **Blocked:** ❌ Portfolio/accounts scope (need re-auth)
- **Next:** Re-authorize with trading scope

### Alpha Research System
- **Status:** DESIGNED
- **Specs:** Chris Camillo method, Thesis Vault, Trend Scanner
- **Next:** Implement idea capture workflow

### MandarinFlow / DailyLingo
- **Status:** STARTED
- **Repo:** `worldcash1/mandarinflow` + `worldcash1/dailylingo`
- **Stack:** Next.js, Convex, ElevenLabs
- **Next:** Check deployment status

---

## 🔴 BLOCKED

### Schwab Portfolio Access
- **Issue:** Only have market data scope
- **Fix:** Re-authorize OAuth with trading/accounts scope
- **Impact:** Can't see positions in Strategy Tracker

### Phone Number
- **Blocker:** Twilio suspended
- **Options:** Ultra Mobile PayGo ($3/mo), Plivo ($0.80/mo)
- **Need:** SMS for 2FA verifications

### Tailscale
- **Issue:** VPN conflict with ExpressVPN
- **Workaround:** Switch between them manually

---

## 📁 BACKLOG

| Project | Priority | Notes |
|---------|----------|-------|
| Calendar Sync (CalDAV) | Medium | Connect iCloud/Google |
| Twitter Write Access | Low | Currently read-only |
| Security Audit | Medium | Set proper auth token |
| Pomp's Portfolio Optimizer | Future | 8-step system |
| ComfyUI Image Gen | Future | Skill available |

---

## ✅ COMPLETED

### 2026-01-29
- [x] Telegram export analyzed (3,642 messages)
- [x] Strategy Tracker specs recovered
- [x] Morning Brief cron created
- [x] TODO.md created
- [x] PROJECTS.md updated

### 2026-01-28
- [x] Mac mini Screen Share fixed
- [x] ExpressVPN auto-start configured
- [x] Brave Search API added
- [x] Twitter/X API added (read-only)
- [x] Alpha Vantage API added
- [x] Proton email created
- [x] All credentials backed up
- [x] 14 cron jobs running
- [x] Triple backup system verified

### 2026-01-27
- [x] DailyLingo app started
- [x] Schwab OAuth setup
- [x] Workspace recovery from wipe

### 2026-01-26
- [x] Oura skill installed
- [x] GitHub repos created
- [x] Obsidian vault set up
- [x] Trading cron jobs created

---

## 📦 GITHUB REPOS

| Repo | Description | Status |
|------|-------------|--------|
| `trade-tracker-v2` | Strategy tracker | ❓ Check |
| `worldcash1/mandarinflow` | Chinese app | ❓ Check |
| `worldcash1/dailylingo` | Chinese app | ❓ Check |
| `alfred-assist-ai/alfred-brain` | Public backup | ✅ |
| `worldcash1/alfred-brain` | Private backup | ✅ |
| `whale-trader-alpaca` | AI trading bot | ✅ |
| `ai-hedge-fund` | AI hedge fund | ❓ Review |

---

## ❓ NEED INPUT FROM NAM

1. **VRP Strategy** - What is this? Volatility Risk Premium?
2. **Ethan** - Who is this trader? Platform? Trade style?
3. **Historical trades** - How far back to import?

---

*Last updated: 2026-01-29 03:40 PST*
