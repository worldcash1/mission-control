"use client";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useState, useRef } from "react";
import { Brain as BrainIcon, Pin, Pencil, X, Search, Plus, Tag, Archive } from "lucide-react";
import { Id } from "../../../convex/_generated/dataModel";

const categories = [
  { id: "general", name: "General", color: "bg-white" },
  { id: "trading", name: "Trading", color: "bg-blue-400" },
  { id: "health", name: "Health", color: "bg-green-400" },
  { id: "ideas", name: "Ideas", color: "bg-yellow-400" },
  { id: "research", name: "Research", color: "bg-purple-400" },
  { id: "personal", name: "Personal", color: "bg-orange-400" },
  { id: "work", name: "Work", color: "bg-gray-400" },
];

function formatRelativeTime(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days === 1) return "yesterday";
  if (days < 7) return `${days}d ago`;
  
  const date = new Date(timestamp);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function autoDetectTags(text: string): string[] {
  const tags: string[] = [];
  if (text.includes("http://") || text.includes("https://")) tags.push("link");
  if (/\b(TODO|todo|To-do|to-do)\b/.test(text)) tags.push("todo");
  return tags;
}

export default function Brain() {
  const notes = useQuery(api.notes.list, {});
  const archivedNotes = useQuery(api.notes.listArchived, {});
  const addNote = useMutation(api.notes.add);
  const updateNote = useMutation(api.notes.update);
  const archiveNote = useMutation(api.notes.archive);
  const deleteNote = useMutation(api.notes.deleteNote);

  const [inputText, setInputText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showArchived, setShowArchived] = useState(false);
  const [editingId, setEditingId] = useState<Id<"notes"> | null>(null);
  const [editText, setEditText] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = async () => {
    if (!inputText.trim()) return;
    
    const tags = autoDetectTags(inputText);
    await addNote({
      text: inputText.trim(),
      category: selectedCategory || "general",
      tags: tags.length > 0 ? tags : undefined,
      source: "manual",
    });
    
    setInputText("");
    setSelectedCategory("");
    inputRef.current?.focus();
  };

  const handleEdit = (id: Id<"notes">, currentText: string) => {
    setEditingId(id);
    setEditText(currentText);
  };

  const handleSaveEdit = async (id: Id<"notes">) => {
    if (!editText.trim()) return;
    await updateNote({ id, text: editText.trim() });
    setEditingId(null);
    setEditText("");
  };

  const handlePin = async (id: Id<"notes">, currentPinned: boolean | undefined) => {
    await updateNote({ id, pinned: !currentPinned });
  };

  // Filter notes
  const filteredNotes = notes?.filter((note) => {
    if (filterCategory && note.category !== filterCategory) return false;
    if (searchQuery && !note.text.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  }) ?? [];

  // Category counts
  const categoryCounts = categories.map((cat) => ({
    ...cat,
    count: notes?.filter((n) => n.category === cat.id).length ?? 0,
  }));

  const totalCount = notes?.length ?? 0;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-6">
          <BrainIcon size={32} className="text-blue-400" />
          <h1 className="text-3xl font-bold">Brain</h1>
          <span className="text-sm text-gray-500">Everything in one place</span>
        </div>

        {/* Quick Capture Bar */}
        <div className="bg-card border border-border rounded-lg mb-4">
          <div className="flex gap-2 p-3">
            <textarea
              ref={inputRef}
              placeholder="Brain dump... thoughts, links, reminders, anything"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
              rows={1}
              className="flex-1 px-3 py-2 bg-background border border-border rounded-md text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 resize-none text-sm"
            />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 bg-background border border-border rounded-md text-sm text-gray-400 focus:outline-none focus:border-blue-500"
            >
              <option value="">Category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            <button
              onClick={handleSubmit}
              disabled={!inputText.trim()}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:text-gray-500 rounded-md transition-colors flex items-center gap-2"
            >
              <Plus size={16} />
              Add
            </button>
          </div>
          <div className="px-3 pb-2 text-xs text-gray-500">
            Shift+Enter for newline • Auto-tags: links, TODOs
          </div>
        </div>

        {/* Filter Row */}
        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setFilterCategory("")}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                filterCategory === ""
                  ? "bg-blue-600 text-white"
                  : "bg-card border border-border text-gray-400 hover:bg-white/[0.02]"
              }`}
            >
              All
              <span className="ml-1.5 opacity-60">{totalCount}</span>
            </button>
            {categoryCounts.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setFilterCategory(cat.id)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors flex items-center gap-1.5 ${
                  filterCategory === cat.id
                    ? "bg-blue-600 text-white"
                    : "bg-card border border-border text-gray-400 hover:bg-white/[0.02]"
                }`}
              >
                <div className={`w-2 h-2 rounded-full ${cat.color}`} />
                {cat.name}
                <span className="opacity-60">{cat.count}</span>
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1 bg-card border border-border rounded-md text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 w-48"
            />
          </div>
        </div>
      </div>

      {/* Stream View */}
      <div className="space-y-1">
        {filteredNotes.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <BrainIcon size={48} className="mx-auto mb-3 opacity-20" />
            <p>No notes yet. Start dumping your thoughts above!</p>
          </div>
        ) : (
          filteredNotes.map((note) => {
            const category = categories.find((c) => c.id === note.category);
            const isEditing = editingId === note._id;

            return (
              <div
                key={note._id}
                className="bg-card border border-border rounded-md px-3 py-2 hover:bg-white/[0.02] transition-colors group"
              >
                <div className="flex items-start gap-3">
                  {/* Category dot */}
                  <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${category?.color ?? "bg-gray-400"}`} />

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    {isEditing ? (
                      <div className="space-y-2">
                        <textarea
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          className="w-full px-2 py-1 bg-background border border-border rounded text-sm text-white focus:outline-none focus:border-blue-500 resize-none"
                          rows={3}
                          autoFocus
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleSaveEdit(note._id)}
                            className="px-2 py-1 bg-blue-600 hover:bg-blue-700 rounded text-xs"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded text-xs"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        {/* Text with clickable links */}
                        <p className="text-sm whitespace-pre-wrap break-words">
                          {note.text.split(/(\bhttps?:\/\/\S+)/g).map((part, i) =>
                            /^https?:\/\//.test(part) ? (
                              <a
                                key={i}
                                href={part}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-400 hover:underline"
                              >
                                {part}
                              </a>
                            ) : (
                              <span key={i}>{part}</span>
                            )
                          )}
                        </p>

                        {/* Tags */}
                        {note.tags && note.tags.length > 0 && (
                          <div className="flex items-center gap-1.5 mt-1">
                            {note.tags.map((tag) => (
                              <span
                                key={tag}
                                className="text-[10px] px-1.5 py-0.5 rounded bg-gray-700/50 text-gray-400"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </>
                    )}
                  </div>

                  {/* Timestamp */}
                  <div className="text-xs text-gray-500 shrink-0 mt-0.5">
                    {formatRelativeTime(note.createdAt)}
                  </div>

                  {/* Actions (show on hover) */}
                  {!isEditing && (
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => handlePin(note._id, note.pinned)}
                        className={`p-1 rounded hover:bg-white/[0.05] transition-colors ${
                          note.pinned ? "text-yellow-400" : "text-gray-500"
                        }`}
                        title={note.pinned ? "Unpin" : "Pin"}
                      >
                        <Pin size={14} />
                      </button>
                      <button
                        onClick={() => handleEdit(note._id, note.text)}
                        className="p-1 rounded hover:bg-white/[0.05] text-gray-500 transition-colors"
                        title="Edit"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => archiveNote({ id: note._id })}
                        className="p-1 rounded hover:bg-white/[0.05] text-gray-500 transition-colors"
                        title="Archive"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  )}

                  {/* Pin indicator */}
                  {note.pinned && !isEditing && (
                    <Pin size={12} className="text-yellow-400/50 shrink-0 mt-1" />
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Archived Toggle */}
      {archivedNotes && archivedNotes.length > 0 && (
        <div className="mt-6 pt-6 border-t border-border">
          <button
            onClick={() => setShowArchived(!showArchived)}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-400 transition-colors"
          >
            <Archive size={14} />
            {showArchived ? "Hide" : "Show"} archived ({archivedNotes.length})
          </button>

          {showArchived && (
            <div className="mt-4 space-y-1 opacity-60">
              {archivedNotes.map((note) => {
                const category = categories.find((c) => c.id === note.category);
                return (
                  <div
                    key={note._id}
                    className="bg-card border border-border rounded-md px-3 py-2 hover:bg-white/[0.02] transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${category?.color ?? "bg-gray-400"}`} />
                      <p className="text-sm flex-1 line-through text-gray-500">{note.text}</p>
                      <div className="text-xs text-gray-600">{formatRelativeTime(note.createdAt)}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
