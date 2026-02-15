"use client";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Activity, Bot, CheckSquare, FolderOpen, Lightbulb, Cog } from "lucide-react";

export default function Dashboard() {
  const tasks = useQuery(api.tasks.list, {});
  const projects = useQuery(api.projects.list, {});
  const ideas = useQuery(api.ideas.list, {});
  const dashData = useQuery(api.dashboard.getData, {});

  const openTasks = tasks?.filter(t => t.status !== 'done').length ?? 0;
  const activeProjects = projects?.filter(p => p.status === 'building' || p.status === 'live').length ?? 0;
  const ideasCount = ideas?.length ?? 0;
  const recentActivity = dashData?.activity ?? [];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-400 text-sm mt-1">
          {new Date().toLocaleString('en-US', { 
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
            hour: '2-digit', minute: '2-digit'
          })}
        </p>
      </div>

      {/* Agent Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-3 mb-3">
            <Bot className="text-blue-400" size={20} />
            <h3 className="font-semibold">Alfred</h3>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Model:</span>
              <span>claude-opus-4-6</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Role:</span>
              <span>COO / Orchestrator</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Status:</span>
              <span className="text-green-400">Active</span>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-3 mb-3">
            <Bot className="text-purple-400" size={20} />
            <h3 className="font-semibold">Sentinel</h3>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Model:</span>
              <span>claude-opus-4-6</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Role:</span>
              <span>Trading Intelligence</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Status:</span>
              <span className="text-yellow-400">Idle</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckSquare className="text-blue-400" size={16} />
            <span className="text-sm text-gray-400">Open Tasks</span>
          </div>
          <div className="text-2xl font-bold">{openTasks}</div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <FolderOpen className="text-green-400" size={16} />
            <span className="text-sm text-gray-400">Active Projects</span>
          </div>
          <div className="text-2xl font-bold">{activeProjects}</div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb className="text-yellow-400" size={16} />
            <span className="text-sm text-gray-400">Ideas</span>
          </div>
          <div className="text-2xl font-bold">{ideasCount}</div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Cog className="text-gray-400" size={16} />
            <span className="text-sm text-gray-400">Cron Jobs</span>
          </div>
          <div className="text-2xl font-bold">{dashData?.stats?.tools ?? 0}</div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <Activity className="text-orange-400" size={20} />
          <h3 className="text-lg font-semibold">Recent Activity</h3>
        </div>
        <div className="space-y-3">
          {recentActivity.length > 0 ? recentActivity.slice(0, 10).map((item: any, i: number) => (
            <div key={i} className="flex justify-between items-center py-2 border-b border-border last:border-0">
              <span className="text-sm">{item.text ?? item.action ?? "Activity"}</span>
              <span className="text-xs text-gray-400">
                {item.timestamp ? new Date(item.timestamp).toLocaleTimeString() : ""}
              </span>
            </div>
          )) : (
            <div className="text-gray-400 text-sm">No recent activity</div>
          )}
        </div>
      </div>

      {/* System Health */}
      <div className="bg-card border border-border rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-4">System Health</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-400">Convex DB:</span>
            <span className="text-green-400">Healthy</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">API Monitor:</span>
            <span className="text-green-400">Online</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Discord Bot:</span>
            <span className="text-green-400">Connected</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Cron Service:</span>
            <span className="text-green-400">Running</span>
          </div>
        </div>
      </div>
    </div>
  );
}
