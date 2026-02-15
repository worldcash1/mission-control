"use client";
import { TrendingUp, Calendar, DollarSign, BarChart3, AlertCircle } from "lucide-react";

export default function Trading() {
  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Trading Dashboard</h1>
        <p className="text-gray-400 mt-1">
          Options trading command center ($6M+ portfolio)
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center gap-3 mb-3">
            <DollarSign className="text-green-400" size={24} />
            <h3 className="font-semibold">Portfolio Value</h3>
          </div>
          <div className="text-3xl font-bold text-green-400">$6.2M</div>
          <div className="text-sm text-gray-400 mt-1">+2.3% today</div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center gap-3 mb-3">
            <TrendingUp className="text-blue-400" size={24} />
            <h3 className="font-semibold">Open Positions</h3>
          </div>
          <div className="text-3xl font-bold">23</div>
          <div className="text-sm text-gray-400 mt-1">12 calls, 11 puts</div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center gap-3 mb-3">
            <BarChart3 className="text-purple-400" size={24} />
            <h3 className="font-semibold">Today&apos;s P&L</h3>
          </div>
          <div className="text-3xl font-bold text-green-400">+$47K</div>
          <div className="text-sm text-gray-400 mt-1">+0.76%</div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center gap-3 mb-3">
            <AlertCircle className="text-yellow-400" size={24} />
            <h3 className="font-semibold">Risk Level</h3>
          </div>
          <div className="text-3xl font-bold text-yellow-400">Medium</div>
          <div className="text-sm text-gray-400 mt-1">Delta: -0.23</div>
        </div>
      </div>

      {/* Earnings Calendar Widget */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <Calendar className="text-orange-400" size={20} />
            <h3 className="text-xl font-semibold">Upcoming Earnings</h3>
          </div>
          <div className="space-y-3">
            {[
              { symbol: "AAPL", date: "Feb 16", time: "After close", position: "5 calls" },
              { symbol: "GOOGL", date: "Feb 17", time: "After close", position: "3 puts" },
              { symbol: "MSFT", date: "Feb 18", time: "After close", position: "7 calls" },
              { symbol: "TSLA", date: "Feb 19", time: "After close", position: "2 straddles" },
            ].map((earning, i) => (
              <div key={i} className="flex justify-between items-center p-3 bg-background border border-border rounded">
                <div>
                  <div className="font-semibold">{earning.symbol}</div>
                  <div className="text-sm text-gray-400">{earning.date} • {earning.time}</div>
                </div>
                <div className="text-sm text-blue-400">{earning.position}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Open Positions Summary */}
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="text-blue-400" size={20} />
            <h3 className="text-xl font-semibold">Top Positions</h3>
          </div>
          <div className="space-y-3">
            {[
              { symbol: "SPY", type: "CALL", strike: "485", exp: "Feb 23", pnl: "+$12.3K", color: "text-green-400" },
              { symbol: "QQQ", type: "PUT", strike: "420", exp: "Feb 16", pnl: "-$3.2K", color: "text-red-400" },
              { symbol: "NVDA", type: "CALL", strike: "800", exp: "Mar 15", pnl: "+$8.7K", color: "text-green-400" },
              { symbol: "AMZN", type: "STRADDLE", strike: "155", exp: "Feb 23", pnl: "+$2.1K", color: "text-green-400" },
            ].map((position, i) => (
              <div key={i} className="flex justify-between items-center p-3 bg-background border border-border rounded">
                <div>
                  <div className="font-semibold">{position.symbol} {position.strike} {position.type}</div>
                  <div className="text-sm text-gray-400">Exp: {position.exp}</div>
                </div>
                <div className={`font-semibold ${position.color}`}>{position.pnl}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* P&L Tracker */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <BarChart3 className="text-purple-400" size={20} />
          <h3 className="text-xl font-semibold">Weekly P&L</h3>
        </div>
        <div className="grid grid-cols-7 gap-2">
          {[
            { day: "Mon", pnl: "+$12K", positive: true },
            { day: "Tue", pnl: "-$8K", positive: false },
            { day: "Wed", pnl: "+$23K", positive: true },
            { day: "Thu", pnl: "+$15K", positive: true },
            { day: "Fri", pnl: "+$47K", positive: true },
            { day: "Sat", pnl: "—", positive: null },
            { day: "Sun", pnl: "—", positive: null },
          ].map((day, i) => (
            <div key={i} className="text-center p-3 bg-background border border-border rounded">
              <div className="text-sm text-gray-400 mb-2">{day.day}</div>
              <div className={`font-semibold ${
                day.positive === true ? "text-green-400" : 
                day.positive === false ? "text-red-400" : 
                "text-gray-500"
              }`}>
                {day.pnl}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Coming Soon Notice */}
      <div className="mt-8 text-center p-8 bg-yellow-900/20 border border-yellow-800 rounded-lg">
        <AlertCircle className="mx-auto text-yellow-400 mb-4" size={48} />
        <h3 className="text-lg font-semibold mb-2">Advanced Trading Features Coming Soon</h3>
        <p className="text-gray-400">
          Real-time options data, automated alerts, position management, and more trading tools are in development.
        </p>
      </div>
    </div>
  );
}