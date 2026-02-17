"use client";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useState, useRef } from "react";
import { Plus, Filter, User, Flag, Tag, Send, Sparkles } from "lucide-react";
import { Id } from "../../../convex/_generated/dataModel";

const statusColumns = [
  { id: "backlog", title: "Backlog", color: "border-gray-500" },
  { id: "active", title: "Active", color: "border-blue-500" },
  { id: "in-progress", title: "In Progress", color: "border-yellow-500" },
  { id: "done", title: "Done", color: "border-green-500" },
];

const priorityColors = {
  low: "text-gray-400",
  medium: "text-yellow-400", 
  high: "text-red-400",
};

const assigneeColors = {
  nam: "text-blue-400",
  alfred: "text-green-400",
  sentinel: "text-purple-400",
};

export default function Tasks() {
  const tasks = useQuery(api.tasks.list, {});
  const updateTask = useMutation(api.tasks.update);
  const createTask = useMutation(api.tasks.add);
  
  const [chatInput, setChatInput] = useState("");
  const [parsedPreview, setParsedPreview] = useState<any>(null);
  const [filterAssignee, setFilterAssignee] = useState<string>("");
  const [filterPriority, setFilterPriority] = useState<string>("");
  const [filterCategory, setFilterCategory] = useState<string>("");
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Smart parser: extracts structured data from natural language
  function parseTaskInput(text: string) {
    let title = text.trim();
    let priority = "medium";
    let assignee = "";
    let category = "";
    let dueDate = "";
    let status = "backlog";

    // Extract @assignee
    const assigneeMatch = title.match(/@(nam|alfred|sentinel)/i);
    if (assigneeMatch) {
      assignee = assigneeMatch[1].toLowerCase();
      title = title.replace(assigneeMatch[0], "").trim();
    }

    // Extract priority: !high, !low, !urgent, p1/p2/p3
    if (/\b(!urgent|!high|p1)\b/i.test(title)) {
      priority = "high";
      title = title.replace(/\b(!urgent|!high|p1)\b/i, "").trim();
    } else if (/\b(!low|p3)\b/i.test(title)) {
      priority = "low";
      title = title.replace(/\b(!low|p3)\b/i, "").trim();
    } else if (/\b(!medium|p2)\b/i.test(title)) {
      priority = "medium";
      title = title.replace(/\b(!medium|p2)\b/i, "").trim();
    }

    // Extract #category
    const catMatch = title.match(/#(trading|health|finance|work|travel|family|infra|ai)/i);
    if (catMatch) {
      category = catMatch[1].toLowerCase();
      title = title.replace(catMatch[0], "").trim();
    }

    // Extract due dates: "by friday", "by tomorrow", "due 2/20", "by eod"
    const dueMatch = title.match(/\b(?:by|due|before)\s+(today|tomorrow|eod|eow|monday|tuesday|wednesday|thursday|friday|saturday|sunday|\d{1,2}\/\d{1,2}(?:\/\d{2,4})?)\b/i);
    if (dueMatch) {
      const raw = dueMatch[1].toLowerCase();
      const now = new Date();
      if (raw === "today" || raw === "eod") {
        dueDate = now.toISOString().split("T")[0];
      } else if (raw === "tomorrow") {
        now.setDate(now.getDate() + 1);
        dueDate = now.toISOString().split("T")[0];
      } else if (raw === "eow") {
        const daysUntilFri = (5 - now.getDay() + 7) % 7 || 7;
        now.setDate(now.getDate() + daysUntilFri);
        dueDate = now.toISOString().split("T")[0];
      } else if (/monday|tuesday|wednesday|thursday|friday|saturday|sunday/.test(raw)) {
        const days = ["sunday","monday","tuesday","wednesday","thursday","friday","saturday"];
        const target = days.indexOf(raw);
        const diff = (target - now.getDay() + 7) % 7 || 7;
        now.setDate(now.getDate() + diff);
        dueDate = now.toISOString().split("T")[0];
      } else {
        dueDate = raw;
      }
      title = title.replace(dueMatch[0], "").trim();
    }

    // Clean up extra spaces
    title = title.replace(/\s+/g, " ").trim();

    return { title, priority, assignee, category, dueDate, status };
  }

  const filteredTasks = tasks?.filter(task => {
    if (filterAssignee && task.assignee !== filterAssignee) return false;
    if (filterPriority && task.priority !== filterPriority) return false;
    if (filterCategory && task.category !== filterCategory) return false;
    return true;
  }) ?? [];

  const handleChatSubmit = async () => {
    if (!chatInput.trim()) return;
    const parsed = parseTaskInput(chatInput);
    if (!parsed.title) return;
    
    await createTask({
      title: parsed.title,
      status: parsed.status,
      priority: parsed.priority,
      ...(parsed.assignee && { assignee: parsed.assignee }),
      ...(parsed.category && { category: parsed.category }),
      ...(parsed.dueDate && { dueDate: parsed.dueDate }),
      type: "personal",
    });
    
    setChatInput("");
    setParsedPreview(null);
  };

  const handleInputChange = (val: string) => {
    setChatInput(val);
    if (val.trim()) {
      setParsedPreview(parseTaskInput(val));
    } else {
      setParsedPreview(null);
    }
  };

  const handleStatusChange = async (taskId: Id<"tasks">, newStatus: string) => {
    await updateTask({
      id: taskId,
      status: newStatus,
      ...(newStatus === "done" && { completedAt: Date.now() }),
    });
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-4">Tasks</h1>
        
        {/* Chat-style Quick Add */}
        <div className="bg-card border border-border rounded-lg mb-4">
          <div className="flex items-end gap-2 p-3">
            <textarea
              ref={inputRef}
              placeholder="Type a task... e.g. &quot;fix schwab auth by friday @alfred !high #trading&quot;"
              value={chatInput}
              onChange={(e) => handleInputChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleChatSubmit();
                }
              }}
              rows={1}
              className="flex-1 px-3 py-2 bg-background border border-border rounded-md text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 resize-none text-sm"
            />
            <button
              onClick={handleChatSubmit}
              disabled={!chatInput.trim()}
              className="p-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:text-gray-500 rounded-md transition-colors"
            >
              <Send size={16} />
            </button>
          </div>
          
          {/* Live parse preview */}
          {parsedPreview && parsedPreview.title && (
            <div className="px-3 pb-3 flex items-center gap-3 text-xs text-gray-400 border-t border-border pt-2 mx-3">
              <Sparkles size={12} className="text-blue-400 shrink-0" />
              <span className="text-white font-medium truncate">{parsedPreview.title}</span>
              {parsedPreview.priority !== "medium" && (
                <span className={`px-1.5 py-0.5 rounded ${parsedPreview.priority === "high" ? "bg-red-900/50 text-red-400" : "bg-gray-700 text-gray-400"}`}>
                  {parsedPreview.priority}
                </span>
              )}
              {parsedPreview.assignee && (
                <span className="px-1.5 py-0.5 rounded bg-blue-900/50 text-blue-400">
                  @{parsedPreview.assignee}
                </span>
              )}
              {parsedPreview.category && (
                <span className="px-1.5 py-0.5 rounded bg-purple-900/50 text-purple-400">
                  #{parsedPreview.category}
                </span>
              )}
              {parsedPreview.dueDate && (
                <span className="px-1.5 py-0.5 rounded bg-yellow-900/50 text-yellow-400">
                  due {parsedPreview.dueDate}
                </span>
              )}
            </div>
          )}
        </div>
        
        <div className="text-xs text-gray-500 mb-4 -mt-2">
          Shortcuts: <code className="bg-gray-800 px-1 rounded">@nam</code> <code className="bg-gray-800 px-1 rounded">!high</code> <code className="bg-gray-800 px-1 rounded">#trading</code> <code className="bg-gray-800 px-1 rounded">by friday</code>
        </div>

        {/* Filters */}
        <div className="flex gap-4 items-center">
          <div className="flex items-center gap-2">
            <Filter size={16} />
            <span className="text-sm">Filters:</span>
          </div>
          
          <select
            value={filterAssignee}
            onChange={(e) => setFilterAssignee(e.target.value)}
            className="px-3 py-1 bg-card border border-border rounded text-sm"
          >
            <option value="">All Assignees</option>
            <option value="nam">Nam</option>
            <option value="alfred">Alfred</option>
            <option value="sentinel">Sentinel</option>
          </select>

          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="px-3 py-1 bg-card border border-border rounded text-sm"
          >
            <option value="">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-1 bg-card border border-border rounded text-sm"
          >
            <option value="">All Categories</option>
            <option value="finance">Finance</option>
            <option value="health">Health</option>
            <option value="work">Work</option>
            <option value="travel">Travel</option>
            <option value="family">Family</option>
          </select>
        </div>
      </div>

      {/* Compact Task List */}
      <div className="space-y-6">
        {statusColumns.filter(col => col.id !== "done").map((column) => {
          const columnTasks = filteredTasks.filter(task => task.status === column.id);
          if (columnTasks.length === 0) return null;
          
          return (
            <div key={column.id}>
              <div className="flex items-center gap-2 mb-2 px-1">
                <div className={`w-2 h-2 rounded-full ${column.color.replace('border-', 'bg-')}`} />
                <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                  {column.title}
                </h3>
                <span className="text-xs text-gray-500">{columnTasks.length}</span>
              </div>
              
              <div className="bg-card border border-border rounded-lg divide-y divide-border">
                {columnTasks.map((task) => (
                  <div
                    key={task._id}
                    className="flex items-center gap-3 px-3 py-2 hover:bg-white/[0.02] group transition-colors"
                  >
                    {/* Priority dot */}
                    <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                      task.priority === 'high' ? 'bg-red-400' : 
                      task.priority === 'low' ? 'bg-gray-500' : 'bg-yellow-400/60'
                    }`} />
                    
                    {/* Checkbox */}
                    <button
                      onClick={() => handleStatusChange(task._id, "done")}
                      className="w-4 h-4 rounded border border-gray-600 hover:border-green-400 shrink-0 flex items-center justify-center transition-colors"
                    >
                      <span className="hidden group-hover:block text-green-400 text-[10px]">✓</span>
                    </button>
                    
                    {/* Title + description inline */}
                    <div className="flex-1 min-w-0 flex items-baseline gap-2">
                      <span className="text-sm font-medium truncate">{task.title}</span>
                      {task.description && (
                        <span className="text-xs text-gray-500 truncate hidden md:inline">{task.description}</span>
                      )}
                    </div>
                    
                    {/* Tags row - compact pills */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      {task.category && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-700/50 text-gray-400">
                          {task.category}
                        </span>
                      )}
                      {task.assignee && (
                        <span className={`text-[10px] px-1.5 py-0.5 rounded bg-gray-700/50 ${
                          assigneeColors[task.assignee as keyof typeof assigneeColors] ?? 'text-gray-400'
                        }`}>
                          {task.assignee}
                        </span>
                      )}
                      {task.dueDate && (
                        <span className="text-[10px] text-gray-500">{task.dueDate}</span>
                      )}
                    </div>

                    {/* Status quick-move */}
                    <select
                      value={task.status}
                      onChange={(e) => handleStatusChange(task._id, e.target.value)}
                      className="text-[10px] bg-transparent border border-transparent hover:border-gray-600 rounded px-1 py-0.5 text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    >
                      {statusColumns.map(col => (
                        <option key={col.id} value={col.id}>{col.title}</option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
        
        {/* Completed section - collapsed */}
        {filteredTasks.filter(t => t.status === "done").length > 0 && (
          <details className="group">
            <summary className="flex items-center gap-2 px-1 mb-2 cursor-pointer text-xs font-semibold uppercase tracking-wider text-gray-500 hover:text-gray-400">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              Done
              <span>{filteredTasks.filter(t => t.status === "done").length}</span>
            </summary>
            <div className="bg-card border border-border rounded-lg divide-y divide-border opacity-60">
              {filteredTasks.filter(t => t.status === "done").map((task) => (
                <div key={task._id} className="flex items-center gap-3 px-3 py-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 shrink-0" />
                  <span className="text-sm text-gray-500 line-through truncate">{task.title}</span>
                  <span className="text-[10px] text-gray-600 ml-auto">
                    {task.completedAt ? new Date(task.completedAt).toLocaleDateString() : ''}
                  </span>
                </div>
              ))}
            </div>
          </details>
        )}
      </div>
    </div>
  );
}