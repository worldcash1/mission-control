# TODO.md - Master Recovery Checklist

> Created 2026-01-29 after Telegram export review. Getting everything back to shape.

---

## 🔴 HIGH PRIORITY

### 1. Strategy Tracker App
- [ ] Locate `trade-tracker-v2` repo and check status
- [ ] Find Magic Patterns UI components
- [ ] Implement 4 strategy pages:
  - [ ] Earnings (EV, Win Rate by Structure, Premium Capture)
  - [ ] BX-Trender (8 metrics: Position, Value, P&L, Win Rate, etc.)
  - [ ] Premium/Wheels (Theta, Assignment Rate)
  - [ ] Ethan's Trades (need specs from Nam)
- [ ] Add risk-adjusted metrics (Sharpe, Sortino, Profit Factor)
- [ ] Connect to Schwab API for live data

### 2. Schwab API - Full Access
- [ ] Re-authorize with trading/accounts scope (currently only market data)
- [ ] Enable portfolio viewing
- [ ] Auto-sync positions to tracker

### 3. Clarify Missing Specs
- [ ] **VRP Strategy** - Ask Nam what this is
- [ ] **Ethan** - Who is this trader? What platform?

---

## 🟡 MEDIUM PRIORITY

### 4. Morning Brief (DONE ✅)
- [x] Created cron job for 9am HKT (5pm PT)
- [ ] Test first run tomorrow
- [ ] Adjust after feedback

### 5. Alpha Research System
- [ ] Implement Thesis Vault template
- [ ] Set up Trend Scanner (Google Trends, Reddit)
- [ ] Create idea capture workflow
- [ ] Sunday 6pm cron for weekly review

### 6. MandarinFlow / DailyLingo
- [ ] Check repo status: `worldcash1/mandarinflow`
- [ ] Check Convex setup
- [ ] Deploy to Vercel if not done

### 7. Calendar Sync
- [ ] Install CalDAV skill from ClawdHub
- [ ] Connect iCloud calendar
- [ ] Add events to morning brief

### 8. Brain Organization
- [ ] Review and update MEMORY.md with recovered insights
- [ ] Verify all knowledge/trading docs are current
- [ ] Cross-link related documents

---

## 🟢 LOW PRIORITY

### 9. Phone Number
- [ ] Try Ultra Mobile PayGo ($3/mo)
- [ ] Or Plivo (~$0.80/mo)
- [ ] For 2FA and SMS verification

### 10. Twitter Write Access
- [ ] Regenerate token with Read+Write scope
- [ ] Currently read-only ($200/mo)

### 11. Tailscale
- [ ] Fix VPN conflict with ExpressVPN
- [ ] Or just switch between them as needed

### 12. Security Audit
- [ ] Set proper gateway auth token
- [ ] Review exposed endpoints

---

## ✅ COMPLETED TODAY

- [x] Telegram export analyzed (3,642 messages)
- [x] Strategy Tracker specs recovered
- [x] Morning Brief cron created (9am HKT)
- [x] RECOVERED-SPECS.md created
- [x] This TODO created

---

## 📦 REPOS TO CHECK

| Repo | Purpose | Status |
|------|---------|--------|
| `trade-tracker-v2` | Strategy tracker app | ❓ Check |
| `worldcash1/mandarinflow` | Chinese learning app | ❓ Check |
| `worldcash1/dailylingo` | Same as above? | ❓ Check |
| `alfred-assist-ai/alfred-brain` | Public workspace backup | ✅ Active |
| `worldcash1/alfred-brain` | Private full backup | ✅ Active |

---

## 🧠 KNOWLEDGE GAPS

Things mentioned in chat but not fully documented:

1. **VRP Strategy** - Nam mentioned but never explained
2. **Ethan's Trades** - A trader Nam follows, biotech + mixed
3. **Magic Patterns Dashboard** - UI kit exists somewhere
4. **Pomp's 8-Step Portfolio Optimizer** - Mentioned as future idea

---

*Last updated: 2026-01-29 03:40 PST*
