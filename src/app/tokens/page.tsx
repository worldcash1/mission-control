"use client";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Coins, TrendingUp, Cpu, Bot, DollarSign, Calendar } from "lucide-react";

// Known models to display even if $0
const KNOWN_MODELS = [
  "claude-opus-4-6",
  "claude-sonnet-4-5",
  "claude-sonnet-4-0",
  "claude-3-5-haiku",
  "gpt-4o",
  "gpt-5.2",
  "gpt-5.3-codex",
  "o3",
  "o4-mini",
  "grok-3",
  "grok-3-mini",
  "gemini-2.5-pro",
  "gemini-2.5-flash",
];

const PROVIDERS = ["openrouter", "anthropic", "openai", "xai", "google"];

export default function TokensPage() {
  const stats = useQuery(api.tokens.getStats);

  if (!stats) {
    return (
      <div className="p-6">
        <div className="text-gray-400">Loading token usage...</div>
      </div>
    );
  }

  const budgetPercent = (stats.totalMonthSpend / stats.monthlyBudget) * 100;
  const budgetColor =
    budgetPercent >= 80
      ? "bg-red-500"
      : budgetPercent >= 50
      ? "bg-yellow-500"
      : "bg-green-500";

  // Prepare model data
  const modelData = KNOWN_MODELS.map((model) => {
    const data = stats.byModel[model];
    if (data) {
      return {
        model,
        provider: data.provider,
        cost: data.cost,
        totalTokens: data.inputTokens + data.outputTokens,
      };
    }
    return { model, provider: "—", cost: 0, totalTokens: 0 };
  }).sort((a, b) => b.cost - a.cost);

  // Add any other models not in known list
  Object.entries(stats.byModel).forEach(([model, data]) => {
    if (!KNOWN_MODELS.includes(model)) {
      modelData.push({
        model,
        provider: data.provider,
        cost: data.cost,
        totalTokens: data.inputTokens + data.outputTokens,
      });
    }
  });

  // Provider data
  const providerData = PROVIDERS.map((provider) => ({
    provider,
    spend: stats.byProvider[provider] || 0,
    percent: stats.totalMonthSpend > 0
      ? ((stats.byProvider[provider] || 0) / stats.totalMonthSpend) * 100
      : 0,
  })).sort((a, b) => b.spend - a.spend);

  // Daily trend data
  const dailyTrendEntries = Object.entries(stats.dailyTrend).sort((a, b) =>
    a[0].localeCompare(b[0])
  );
  const maxDailySpend = Math.max(...dailyTrendEntries.map((e) => e[1]), 1);

  // Agent data
  const agentData = Object.entries(stats.byAgent).map(([agent, data]) => ({
    agent,
    spend: data.cost,
    sessions: data.sessions,
  })).sort((a, b) => b.spend - a.spend);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Token Usage</h1>
        <p className="text-gray-400 mt-1">
          AI model usage and budget tracking
        </p>
      </div>

      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="text-green-400" size={18} />
            <h3 className="text-sm font-semibold">Monthly Spend</h3>
          </div>
          <div className="text-2xl font-bold text-green-400">
            ${stats.totalMonthSpend.toFixed(2)}
          </div>
          <div className="text-xs text-gray-400 mt-1">
            / ${stats.monthlyBudget.toFixed(0)} budget
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="text-blue-400" size={18} />
            <h3 className="text-sm font-semibold">Today&apos;s Spend</h3>
          </div>
          <div className="text-2xl font-bold text-blue-400">
            ${stats.totalTodaySpend.toFixed(2)}
          </div>
          <div className="text-xs text-gray-400 mt-1">
            {((stats.totalTodaySpend / stats.totalMonthSpend) * 100).toFixed(1)}% of month
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="text-purple-400" size={18} />
            <h3 className="text-sm font-semibold">Projected Monthly</h3>
          </div>
          <div className="text-2xl font-bold text-purple-400">
            ${stats.projectedMonthlySpend.toFixed(2)}
          </div>
          <div className="text-xs text-gray-400 mt-1">
            {((stats.projectedMonthlySpend / stats.monthlyBudget) * 100).toFixed(0)}% of budget
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Cpu className="text-orange-400" size={18} />
            <h3 className="text-sm font-semibold">Top Provider</h3>
          </div>
          <div className="text-2xl font-bold text-orange-400 capitalize">
            {stats.topProvider?.name || "—"}
          </div>
          <div className="text-xs text-gray-400 mt-1">
            ${stats.topProvider?.spend.toFixed(2) || "0.00"}
          </div>
        </div>
      </div>

      {/* Budget Progress Bar */}
      <div className="bg-card border border-border rounded-lg p-4 mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-semibold">Budget Progress</span>
          <span className="text-sm text-gray-400">
            {budgetPercent.toFixed(1)}%
          </span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
          <div
            className={`h-full ${budgetColor} transition-all`}
            style={{ width: `${Math.min(budgetPercent, 100)}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>$0</span>
          <span>${stats.monthlyBudget}</span>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Provider Breakdown */}
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <Cpu className="text-blue-400" size={18} />
            <h3 className="text-lg font-semibold">Provider Breakdown</h3>
          </div>
          <div className="space-y-2">
            {providerData.map((p) => (
              <div
                key={p.provider}
                className="flex items-center gap-3 p-1.5 rounded hover:bg-background/50"
              >
                <div className="w-24 text-sm capitalize text-gray-300">
                  {p.provider}
                </div>
                <div className="flex-1">
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className="h-full bg-blue-500 rounded-full"
                      style={{ width: `${p.percent}%` }}
                    />
                  </div>
                </div>
                <div className="w-16 text-sm font-semibold text-right">
                  ${p.spend.toFixed(2)}
                </div>
                <div className="w-12 text-xs text-gray-400 text-right">
                  {p.percent.toFixed(0)}%
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Model Breakdown */}
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <Coins className="text-purple-400" size={18} />
            <h3 className="text-lg font-semibold">Model Breakdown</h3>
          </div>
          <div className="overflow-y-auto max-h-64">
            <table className="w-full text-sm">
              <thead className="text-xs text-gray-400 border-b border-border">
                <tr>
                  <th className="text-left py-1.5 font-semibold">Model</th>
                  <th className="text-left py-1.5 font-semibold">Provider</th>
                  <th className="text-right py-1.5 font-semibold">Spend</th>
                  <th className="text-right py-1.5 font-semibold">Tokens</th>
                </tr>
              </thead>
              <tbody>
                {modelData.map((m, i) => (
                  <tr
                    key={i}
                    className="border-b border-border/30 hover:bg-background/50"
                  >
                    <td className="py-1.5 text-gray-300">{m.model}</td>
                    <td className="py-1.5 text-gray-400 capitalize text-xs">
                      {m.provider}
                    </td>
                    <td className="py-1.5 text-right font-semibold">
                      {m.cost > 0 ? `$${m.cost.toFixed(2)}` : "—"}
                    </td>
                    <td className="py-1.5 text-right text-gray-400 text-xs">
                      {m.totalTokens > 0
                        ? (m.totalTokens / 1000000).toFixed(2) + "M"
                        : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Daily Spend Trend */}
      <div className="bg-card border border-border rounded-lg p-4 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="text-green-400" size={18} />
          <h3 className="text-lg font-semibold">Daily Spend Trend (30 days)</h3>
        </div>
        <div className="flex items-end gap-0.5 h-32">
          {dailyTrendEntries.map(([date, spend]) => {
            const height = (spend / maxDailySpend) * 100;
            const isToday =
              date ===
              new Date().toISOString().split("T")[0];
            return (
              <div
                key={date}
                className="flex-1 flex flex-col items-center group relative"
              >
                <div
                  className={`w-full ${
                    isToday ? "bg-green-500" : "bg-blue-500"
                  } rounded-t transition-all hover:opacity-80`}
                  style={{ height: `${height}%`, minHeight: spend > 0 ? "2px" : "0" }}
                  title={`${date}: $${spend.toFixed(2)}`}
                />
                <div className="absolute -bottom-6 text-[8px] text-gray-500 opacity-0 group-hover:opacity-100 whitespace-nowrap">
                  ${spend.toFixed(1)}
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-8">
          <span>{dailyTrendEntries[0][0]}</span>
          <span>Today</span>
        </div>
      </div>

      {/* Agent Breakdown */}
      <div className="bg-card border border-border rounded-lg p-4">
        <div className="flex items-center gap-2 mb-3">
          <Bot className="text-yellow-400" size={18} />
          <h3 className="text-lg font-semibold">Agent Breakdown</h3>
        </div>
        <table className="w-full text-sm">
          <thead className="text-xs text-gray-400 border-b border-border">
            <tr>
              <th className="text-left py-2 font-semibold">Agent</th>
              <th className="text-right py-2 font-semibold">Spend</th>
              <th className="text-right py-2 font-semibold">Sessions</th>
            </tr>
          </thead>
          <tbody>
            {agentData.length > 0 ? (
              agentData.map((a, i) => (
                <tr
                  key={i}
                  className="border-b border-border/30 hover:bg-background/50"
                >
                  <td className="py-1.5 text-gray-300 capitalize">{a.agent}</td>
                  <td className="py-1.5 text-right font-semibold">
                    ${a.spend.toFixed(2)}
                  </td>
                  <td className="py-1.5 text-right text-gray-400">
                    {a.sessions}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="py-4 text-center text-gray-500">
                  No agent data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Info Notice */}
      <div className="mt-6 p-4 bg-blue-900/20 border border-blue-800 rounded-lg">
        <div className="flex items-start gap-3">
          <Coins className="text-blue-400 mt-0.5" size={18} />
          <div>
            <h4 className="font-semibold text-blue-400 mb-1">
              Token Usage Tracking
            </h4>
            <p className="text-sm text-gray-400">
              Data synced from provider APIs. Run{" "}
              <code className="bg-background px-1 py-0.5 rounded text-xs">
                mc-token-sync
              </code>{" "}
              to update. Current budget: ${stats.monthlyBudget}/month.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
