"use client";
import { Heart, Moon, Activity, TrendingUp, Clock, Battery, Thermometer } from "lucide-react";

export default function Health() {
  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Health Dashboard</h1>
        <p className="text-gray-400 mt-1">
          Sleep, HRV, and wellness tracking with Oura Ring
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center gap-3 mb-3">
            <Moon className="text-blue-400" size={24} />
            <h3 className="font-semibold">Sleep Score</h3>
          </div>
          <div className="text-3xl font-bold text-blue-400">87</div>
          <div className="text-sm text-gray-400 mt-1">Last night: 7h 23m</div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center gap-3 mb-3">
            <Heart className="text-red-400" size={24} />
            <h3 className="font-semibold">HRV</h3>
          </div>
          <div className="text-3xl font-bold text-red-400">42ms</div>
          <div className="text-sm text-gray-400 mt-1">+8% vs avg</div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center gap-3 mb-3">
            <Activity className="text-green-400" size={24} />
            <h3 className="font-semibold">Readiness</h3>
          </div>
          <div className="text-3xl font-bold text-green-400">82</div>
          <div className="text-sm text-gray-400 mt-1">Good to go</div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center gap-3 mb-3">
            <Battery className="text-orange-400" size={24} />
            <h3 className="font-semibold">Energy</h3>
          </div>
          <div className="text-3xl font-bold text-orange-400">78%</div>
          <div className="text-sm text-gray-400 mt-1">Above average</div>
        </div>
      </div>

      {/* Sleep Widget */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <Moon className="text-blue-400" size={20} />
            <h3 className="text-xl font-semibold">Sleep Breakdown</h3>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Bedtime</span>
              <span className="font-semibold">2:47 AM</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Wake time</span>
              <span className="font-semibold">10:10 AM</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Deep sleep</span>
              <span className="font-semibold text-blue-400">1h 52m</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">REM sleep</span>
              <span className="font-semibold text-purple-400">2h 15m</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Light sleep</span>
              <span className="font-semibold text-green-400">3h 16m</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Efficiency</span>
              <span className="font-semibold">94%</span>
            </div>
          </div>
        </div>

        {/* HRV Trend */}
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="text-red-400" size={20} />
            <h3 className="text-xl font-semibold">HRV Trend (7 days)</h3>
          </div>
          <div className="space-y-3">
            {[
              { day: "Today", value: "42ms", trend: "+8%", color: "text-green-400" },
              { day: "Yesterday", value: "39ms", trend: "+2%", color: "text-green-400" },
              { day: "Feb 13", value: "38ms", trend: "-5%", color: "text-red-400" },
              { day: "Feb 12", value: "40ms", trend: "+1%", color: "text-green-400" },
              { day: "Feb 11", value: "39ms", trend: "-3%", color: "text-red-400" },
              { day: "Feb 10", value: "41ms", trend: "+6%", color: "text-green-400" },
              { day: "Feb 9", value: "38ms", trend: "-1%", color: "text-red-400" },
            ].map((day, i) => (
              <div key={i} className="flex justify-between items-center p-3 bg-background border border-border rounded">
                <span className="text-gray-400">{day.day}</span>
                <div className="flex items-center gap-3">
                  <span className="font-semibold">{day.value}</span>
                  <span className={`text-sm ${day.color}`}>{day.trend}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Weekly Summary */}
      <div className="bg-card border border-border rounded-lg p-6 mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Clock className="text-purple-400" size={20} />
          <h3 className="text-xl font-semibold">Weekly Sleep Pattern</h3>
        </div>
        <div className="grid grid-cols-7 gap-2">
          {[
            { day: "Mon", hours: "6.8h", score: 73, bedtime: "3:15 AM" },
            { day: "Tue", hours: "7.2h", score: 81, bedtime: "2:45 AM" },
            { day: "Wed", hours: "6.5h", score: 68, bedtime: "3:30 AM" },
            { day: "Thu", hours: "7.8h", score: 89, bedtime: "2:20 AM" },
            { day: "Fri", hours: "7.0h", score: 76, bedtime: "3:00 AM" },
            { day: "Sat", hours: "8.1h", score: 92, bedtime: "2:10 AM" },
            { day: "Sun", hours: "7.4h", score: 87, bedtime: "2:47 AM" },
          ].map((day, i) => (
            <div key={i} className="text-center p-3 bg-background border border-border rounded">
              <div className="text-sm text-gray-400 mb-2">{day.day}</div>
              <div className="font-semibold text-blue-400 mb-1">{day.hours}</div>
              <div className={`text-sm font-semibold mb-1 ${
                day.score >= 85 ? "text-green-400" : 
                day.score >= 70 ? "text-yellow-400" : 
                "text-red-400"
              }`}>
                {day.score}
              </div>
              <div className="text-xs text-gray-500">{day.bedtime}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Health Insights */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <Thermometer className="text-yellow-400" size={20} />
          <h3 className="text-xl font-semibold">Health Insights</h3>
        </div>
        <div className="space-y-4">
          <div className="p-4 bg-green-900/20 border border-green-800 rounded-lg">
            <div className="flex items-start gap-3">
              <TrendingUp className="text-green-400 mt-1" size={16} />
              <div>
                <h4 className="font-semibold text-green-400">Sleep Quality Improving</h4>
                <p className="text-sm text-gray-400 mt-1">
                  Your average sleep score has increased by 12% over the past month. 
                  Consistent bedtime routine is paying off.
                </p>
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-yellow-900/20 border border-yellow-800 rounded-lg">
            <div className="flex items-start gap-3">
              <Clock className="text-yellow-400 mt-1" size={16} />
              <div>
                <h4 className="font-semibold text-yellow-400">Late Bedtime Pattern</h4>
                <p className="text-sm text-gray-400 mt-1">
                  You&apos;re averaging 2:50 AM bedtime. Consider gradually shifting earlier for 
                  optimal recovery during your night owl schedule.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Coming Soon Notice */}
      <div className="mt-8 text-center p-8 bg-blue-900/20 border border-blue-800 rounded-lg">
        <Activity className="mx-auto text-blue-400 mb-4" size={48} />
        <h3 className="text-lg font-semibold mb-2">Advanced Health Tracking Coming Soon</h3>
        <p className="text-gray-400">
          Direct Oura Ring integration, workout tracking, nutrition logging, and personalized health insights.
        </p>
      </div>
    </div>
  );
}