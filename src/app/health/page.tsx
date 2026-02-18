"use client";
import { useEffect, useState } from "react";
import { Heart, Moon, Activity, TrendingUp, Clock, Battery, AlertTriangle } from "lucide-react";

interface DailySleep {
  day: string;
  score: number;
  contributors?: {
    total_sleep?: number;
  };
}

interface Sleep {
  bedtime_start: string;
  bedtime_end: string;
  total_sleep_duration: number;
  deep_sleep_duration: number;
  rem_sleep_duration: number;
  light_sleep_duration: number;
  efficiency: number;
  day: string;
}

interface DailyReadiness {
  day: string;
  score: number;
  contributors?: {
    hrv_balance?: number;
  };
}

interface OuraData {
  dailySleep: DailySleep[];
  sleep: Sleep[];
  dailyReadiness: DailyReadiness[];
}

const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.round((seconds % 3600) / 60);
  return `${hours}h ${minutes}m`;
};

const formatTime = (utcTime: string): string => {
  if (!utcTime) return "—";
  try {
    const date = new Date(utcTime);
    return date.toLocaleTimeString('en-US', {
      timeZone: 'America/Los_Angeles',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  } catch {
    return "—";
  }
};

const getDayName = (dateStr: string): string => {
  try {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  } catch {
    return "—";
  }
};

const getScoreColor = (score: number | undefined): string => {
  if (!score) return "text-gray-400";
  if (score >= 85) return "text-green-400";
  if (score >= 70) return "text-yellow-400";
  return "text-red-400";
};

const getScoreBgColor = (score: number | undefined): string => {
  if (!score) return "bg-gray-900/20 border-gray-800";
  if (score >= 85) return "bg-green-900/20 border-green-800";
  if (score >= 70) return "bg-yellow-900/20 border-yellow-800";
  return "bg-red-900/20 border-red-800";
};

export default function Health() {
  const [data, setData] = useState<OuraData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const today = new Date();
        const sevenDaysAgo = new Date(today);
        sevenDaysAgo.setDate(today.getDate() - 7);

        const formatDate = (date: Date) => date.toISOString().split('T')[0];
        const start = formatDate(sevenDaysAgo);
        const end = formatDate(today);

        const [dailySleepRes, sleepRes, dailyReadinessRes] = await Promise.all([
          fetch(`/api/oura?type=daily_sleep&start=${start}&end=${end}`),
          fetch(`/api/oura?type=sleep&start=${start}&end=${end}`),
          fetch(`/api/oura?type=daily_readiness&start=${start}&end=${end}`),
        ]);

        const dailySleep = await dailySleepRes.json();
        const sleep = await sleepRes.json();
        const dailyReadiness = await dailyReadinessRes.json();

        setData({
          dailySleep: dailySleep.data || [],
          sleep: sleep.data || [],
          dailyReadiness: dailyReadiness.data || [],
        });
      } catch (err) {
        console.error('Failed to fetch Oura data:', err);
        setError('Failed to load health data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Health Dashboard</h1>
          <p className="text-gray-400 mt-1">Loading Oura Ring data...</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-card border border-border rounded-lg p-6 h-32 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Health Dashboard</h1>
          <p className="text-gray-400 mt-1">Error loading data</p>
        </div>
        <div className="bg-red-900/20 border border-red-800 rounded-lg p-6">
          <p className="text-red-400">{error || 'No data available'}</p>
        </div>
      </div>
    );
  }

  const todaySleep = data.dailySleep[data.dailySleep.length - 1];
  const todayReadiness = data.dailyReadiness[data.dailyReadiness.length - 1];
  const latestSleep = data.sleep[data.sleep.length - 1];

  const hrvBalance = todayReadiness?.contributors?.hrv_balance;
  const sleepScore = todaySleep?.score;
  const readinessScore = todayReadiness?.score;
  const totalSleep = latestSleep?.total_sleep_duration;

  // Calculate insights
  const insights: Array<{ type: 'success' | 'warning' | 'info'; title: string; text: string }> = [];
  
  if (sleepScore && sleepScore < 70) {
    insights.push({
      type: 'warning',
      title: 'Low Sleep Score',
      text: `Your sleep score is ${sleepScore}, below optimal range. Consider going to bed earlier tonight.`,
    });
  }

  if (latestSleep?.bedtime_start) {
    const bedtimeHour = new Date(latestSleep.bedtime_start).getUTCHours();
    if (bedtimeHour >= 3 && bedtimeHour < 12) {
      insights.push({
        type: 'warning',
        title: 'Late Bedtime Pattern',
        text: 'Your bedtime is consistently after 3 AM. This may impact recovery quality.',
      });
    }
  }

  const avgReadiness = data.dailyReadiness.length > 0
    ? data.dailyReadiness.reduce((sum, r) => sum + (r.score || 0), 0) / data.dailyReadiness.length
    : 0;
  
  if (readinessScore && avgReadiness > 0 && readinessScore > avgReadiness + 5) {
    insights.push({
      type: 'success',
      title: 'Readiness Trending Up',
      text: `Today's readiness (${readinessScore}) is ${Math.round(readinessScore - avgReadiness)} points above your 7-day average.`,
    });
  }

  const avgSleep = data.dailySleep.length > 0
    ? data.dailySleep.reduce((sum, s) => sum + (s.score || 0), 0) / data.dailySleep.length
    : 0;

  if (sleepScore && avgSleep > 0) {
    const diff = sleepScore - avgSleep;
    if (Math.abs(diff) > 5) {
      insights.push({
        type: 'info',
        title: 'Sleep vs 7-Day Average',
        text: `Today's sleep score is ${diff > 0 ? Math.round(diff) + ' points above' : Math.abs(Math.round(diff)) + ' points below'} your weekly average (${Math.round(avgSleep)}).`,
      });
    }
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Health Dashboard</h1>
        <p className="text-gray-400 mt-1">
          Sleep, HRV, and wellness tracking with Oura Ring
        </p>
      </div>

      {/* Top Row - 4 Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center gap-3 mb-3">
            <Moon className="text-blue-400" size={24} />
            <h3 className="font-semibold">Sleep Score</h3>
          </div>
          <div className={`text-3xl font-bold ${getScoreColor(sleepScore)}`}>
            {sleepScore || '—'}
          </div>
          <div className="text-sm text-gray-400 mt-1">
            {totalSleep ? formatDuration(totalSleep) : 'No data'}
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center gap-3 mb-3">
            <Activity className="text-green-400" size={24} />
            <h3 className="font-semibold">Readiness</h3>
          </div>
          <div className={`text-3xl font-bold ${getScoreColor(readinessScore)}`}>
            {readinessScore || '—'}
          </div>
          <div className="text-sm text-gray-400 mt-1">
            {readinessScore && readinessScore >= 85 ? 'Excellent' : 
             readinessScore && readinessScore >= 70 ? 'Good' : 
             readinessScore ? 'Rest needed' : 'No data'}
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center gap-3 mb-3">
            <Heart className="text-red-400" size={24} />
            <h3 className="font-semibold">HRV Balance</h3>
          </div>
          <div className="text-3xl font-bold text-red-400">
            {hrvBalance !== undefined ? hrvBalance : '—'}
          </div>
          <div className="text-sm text-gray-400 mt-1">
            {hrvBalance !== undefined && hrvBalance > 0 ? 'Balanced' : 
             hrvBalance !== undefined && hrvBalance < 0 ? 'Below avg' : 'No data'}
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center gap-3 mb-3">
            <Battery className="text-orange-400" size={24} />
            <h3 className="font-semibold">Total Sleep</h3>
          </div>
          <div className="text-3xl font-bold text-orange-400">
            {totalSleep ? Math.floor(totalSleep / 3600) : '—'}h
          </div>
          <div className="text-sm text-gray-400 mt-1">
            {totalSleep ? formatDuration(totalSleep) : 'No data'}
          </div>
        </div>
      </div>

      {/* Sleep Breakdown & 7-Day Readiness */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Sleep Breakdown */}
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <Moon className="text-blue-400" size={20} />
            <h3 className="text-xl font-semibold">Sleep Breakdown</h3>
          </div>
          {latestSleep ? (
            <>
              <div className="space-y-4 mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Bedtime</span>
                  <span className="font-semibold">{formatTime(latestSleep.bedtime_start)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Wake time</span>
                  <span className="font-semibold">{formatTime(latestSleep.bedtime_end)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Deep sleep</span>
                  <span className="font-semibold text-blue-400">
                    {formatDuration(latestSleep.deep_sleep_duration)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">REM sleep</span>
                  <span className="font-semibold text-purple-400">
                    {formatDuration(latestSleep.rem_sleep_duration)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Light sleep</span>
                  <span className="font-semibold text-green-400">
                    {formatDuration(latestSleep.light_sleep_duration)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Efficiency</span>
                  <span className="font-semibold">{latestSleep.efficiency}%</span>
                </div>
              </div>
              {/* Sleep Stage Bars */}
              <div className="space-y-2">
                <div className="text-xs text-gray-400 mb-1">Sleep Stages</div>
                <div className="flex h-6 rounded overflow-hidden">
                  <div 
                    className="bg-blue-500" 
                    style={{ width: `${(latestSleep.deep_sleep_duration / latestSleep.total_sleep_duration) * 100}%` }}
                    title="Deep"
                  />
                  <div 
                    className="bg-purple-500" 
                    style={{ width: `${(latestSleep.rem_sleep_duration / latestSleep.total_sleep_duration) * 100}%` }}
                    title="REM"
                  />
                  <div 
                    className="bg-green-500" 
                    style={{ width: `${(latestSleep.light_sleep_duration / latestSleep.total_sleep_duration) * 100}%` }}
                    title="Light"
                  />
                </div>
                <div className="flex gap-4 text-xs">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-blue-500 rounded" />
                    <span className="text-gray-400">Deep</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-purple-500 rounded" />
                    <span className="text-gray-400">REM</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-green-500 rounded" />
                    <span className="text-gray-400">Light</span>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <p className="text-gray-400">No sleep data available</p>
          )}
        </div>

        {/* 7-Day Readiness Trend */}
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="text-green-400" size={20} />
            <h3 className="text-xl font-semibold">7-Day Readiness Trend</h3>
          </div>
          {data.dailyReadiness.length > 0 ? (
            <div className="space-y-2">
              {data.dailyReadiness.slice().reverse().map((r, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-gray-400 text-sm w-16">{getDayName(r.day)}</span>
                  <div className="flex-1 bg-background border border-border rounded h-8 overflow-hidden">
                    <div 
                      className={`h-full ${
                        r.score >= 85 ? 'bg-green-500' :
                        r.score >= 70 ? 'bg-yellow-500' :
                        'bg-red-500'
                      }`}
                      style={{ width: `${r.score}%` }}
                    />
                  </div>
                  <span className={`font-semibold text-sm w-8 ${getScoreColor(r.score)}`}>
                    {r.score}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400">No readiness data available</p>
          )}
        </div>
      </div>

      {/* 7-Day Sleep Score Trend */}
      <div className="bg-card border border-border rounded-lg p-6 mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Moon className="text-blue-400" size={20} />
          <h3 className="text-xl font-semibold">7-Day Sleep Score Trend</h3>
        </div>
        {data.dailySleep.length > 0 ? (
          <div className="space-y-2">
            {data.dailySleep.slice().reverse().map((s, i) => {
              const sleepEntry = data.sleep.find(sl => sl.day === s.day);
              return (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-gray-400 text-sm w-16">{getDayName(s.day)}</span>
                  <div className="flex-1 bg-background border border-border rounded h-8 overflow-hidden">
                    <div 
                      className={`h-full ${
                        s.score >= 85 ? 'bg-blue-500' :
                        s.score >= 70 ? 'bg-yellow-500' :
                        'bg-red-500'
                      }`}
                      style={{ width: `${s.score}%` }}
                    />
                  </div>
                  <span className={`font-semibold text-sm w-8 ${getScoreColor(s.score)}`}>
                    {s.score}
                  </span>
                  <span className="text-gray-400 text-sm w-16">
                    {sleepEntry ? formatDuration(sleepEntry.total_sleep_duration) : '—'}
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-gray-400">No sleep data available</p>
        )}
      </div>

      {/* Weekly Sleep Pattern Grid */}
      <div className="bg-card border border-border rounded-lg p-6 mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Clock className="text-purple-400" size={20} />
          <h3 className="text-xl font-semibold">Weekly Sleep Pattern</h3>
        </div>
        {data.dailySleep.length > 0 ? (
          <div className="grid grid-cols-7 gap-2">
            {data.dailySleep.map((s, i) => {
              const sleepEntry = data.sleep.find(sl => sl.day === s.day);
              return (
                <div 
                  key={i} 
                  className={`text-center p-3 rounded border ${getScoreBgColor(s.score)}`}
                >
                  <div className="text-sm text-gray-400 mb-2">{getDayName(s.day)}</div>
                  <div className={`font-semibold mb-1 ${getScoreColor(s.score)}`}>
                    {s.score}
                  </div>
                  <div className="text-sm text-gray-300 mb-1">
                    {sleepEntry ? formatDuration(sleepEntry.total_sleep_duration) : '—'}
                  </div>
                  <div className="text-xs text-gray-500">
                    {sleepEntry ? formatTime(sleepEntry.bedtime_start) : '—'}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-gray-400">No sleep pattern data available</p>
        )}
      </div>

      {/* Health Insights */}
      {insights.length > 0 && (
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <Activity className="text-yellow-400" size={20} />
            <h3 className="text-xl font-semibold">Health Insights</h3>
          </div>
          <div className="space-y-4">
            {insights.map((insight, i) => (
              <div 
                key={i} 
                className={`p-4 rounded-lg border ${
                  insight.type === 'success' ? 'bg-green-900/20 border-green-800' :
                  insight.type === 'warning' ? 'bg-yellow-900/20 border-yellow-800' :
                  'bg-blue-900/20 border-blue-800'
                }`}
              >
                <div className="flex items-start gap-3">
                  {insight.type === 'success' ? <TrendingUp className="text-green-400 mt-1" size={16} /> :
                   insight.type === 'warning' ? <AlertTriangle className="text-yellow-400 mt-1" size={16} /> :
                   <Activity className="text-blue-400 mt-1" size={16} />}
                  <div>
                    <h4 className={`font-semibold ${
                      insight.type === 'success' ? 'text-green-400' :
                      insight.type === 'warning' ? 'text-yellow-400' :
                      'text-blue-400'
                    }`}>
                      {insight.title}
                    </h4>
                    <p className="text-sm text-gray-400 mt-1">{insight.text}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
