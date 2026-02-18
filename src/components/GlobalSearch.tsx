"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useRouter } from "next/navigation";
import {
  Search,
  X,
  CheckSquare,
  FolderOpen,
  Lightbulb,
  Brain,
  Inbox,
  Command,
} from "lucide-react";

const typeConfig: Record<string, { icon: any; color: string; label: string }> = {
  task: { icon: CheckSquare, color: "text-blue-400", label: "Task" },
  project: { icon: FolderOpen, color: "text-green-400", label: "Project" },
  idea: { icon: Lightbulb, color: "text-yellow-400", label: "Idea" },
  note: { icon: Brain, color: "text-purple-400", label: "Note" },
  inbox: { icon: Inbox, color: "text-orange-400", label: "Inbox" },
};

function timeAgo(ts: number) {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "now";
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d`;
  return new Date(ts).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const results = useQuery(
    api.search.global,
    query.trim().length >= 2 ? { query: query.trim() } : "skip"
  );

  // Cmd+K to open
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (e.key === "Escape") {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  // Reset selection when results change
  useEffect(() => {
    setSelectedIndex(0);
  }, [results]);

  const navigate = useCallback(
    (href: string) => {
      setOpen(false);
      router.push(href);
    },
    [router]
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const len = results?.length ?? 0;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((i) => (i + 1) % Math.max(len, 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((i) => (i - 1 + Math.max(len, 1)) % Math.max(len, 1));
    } else if (e.key === "Enter" && results && results[selectedIndex]) {
      e.preventDefault();
      navigate(results[selectedIndex].href);
    }
  };

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm"
        onClick={() => setOpen(false)}
      />

      {/* Modal */}
      <div className="fixed top-[15%] left-1/2 -translate-x-1/2 w-full max-w-xl z-50">
        <div className="bg-card border border-border rounded-lg shadow-2xl overflow-hidden">
          {/* Search Input */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
            <Search size={16} className="text-gray-400 shrink-0" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search everything..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-transparent text-white text-sm placeholder-gray-500 focus:outline-none"
            />
            <kbd className="hidden sm:flex items-center gap-0.5 text-[10px] text-gray-500 bg-gray-800 px-1.5 py-0.5 rounded border border-gray-700">
              ESC
            </kbd>
          </div>

          {/* Results */}
          <div className="max-h-80 overflow-y-auto">
            {query.trim().length < 2 ? (
              <div className="px-4 py-8 text-center text-sm text-gray-500">
                <Command size={20} className="mx-auto mb-2 text-gray-600" />
                Type to search tasks, projects, ideas, notes...
              </div>
            ) : results === undefined ? (
              <div className="px-4 py-6 text-center text-sm text-gray-500">
                Searching...
              </div>
            ) : results.length === 0 ? (
              <div className="px-4 py-6 text-center text-sm text-gray-500">
                No results for &ldquo;{query}&rdquo;
              </div>
            ) : (
              results.map((item, i) => {
                const config = typeConfig[item.type] ?? typeConfig.inbox;
                const Icon = config.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => navigate(item.href)}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                      i === selectedIndex
                        ? "bg-white/[0.06]"
                        : "hover:bg-white/[0.03]"
                    }`}
                  >
                    <Icon size={14} className={`${config.color} shrink-0`} />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm truncate">{item.title}</div>
                      {item.description && (
                        <div className="text-xs text-gray-500 truncate">
                          {item.description}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-800 text-gray-400">
                        {config.label}
                      </span>
                      <span className="text-[10px] text-gray-600">
                        {timeAgo(item.timestamp)}
                      </span>
                    </div>
                  </button>
                );
              })
            )}
          </div>

          {/* Footer hint */}
          {results && results.length > 0 && (
            <div className="px-4 py-2 border-t border-border flex items-center gap-4 text-[10px] text-gray-600">
              <span>↑↓ navigate</span>
              <span>↵ open</span>
              <span>esc close</span>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// Trigger button for sidebar/header
export function SearchTrigger() {
  const [, setOpen] = useState(false);

  const handleClick = () => {
    // Dispatch Cmd+K
    window.dispatchEvent(
      new KeyboardEvent("keydown", { key: "k", metaKey: true })
    );
  };

  return (
    <button
      onClick={handleClick}
      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-400 hover:text-white bg-white/[0.03] hover:bg-white/[0.06] border border-border rounded-md transition-colors"
    >
      <Search size={14} />
      <span className="flex-1 text-left">Search...</span>
      <kbd className="text-[10px] text-gray-600 bg-gray-800 px-1.5 py-0.5 rounded border border-gray-700">
        ⌘K
      </kbd>
    </button>
  );
}
