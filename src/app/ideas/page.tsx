"use client";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useState } from "react";
import { Plus, Lightbulb, Tag, Clock, Inbox } from "lucide-react";

const categoryColors = {
  finance: "bg-green-900/30 text-green-300",
  health: "bg-red-900/30 text-red-300",
  work: "bg-blue-900/30 text-blue-300",
  travel: "bg-purple-900/30 text-purple-300",
  family: "bg-yellow-900/30 text-yellow-300",
  tech: "bg-cyan-900/30 text-cyan-300",
  default: "bg-gray-700 text-gray-300",
};

export default function Ideas() {
  const ideas = useQuery(api.ideas.list);
  const inbox = useQuery(api.inbox.list, {});
  const createIdea = useMutation(api.ideas.add);
  
  const [newIdeaTitle, setNewIdeaTitle] = useState("");
  const [newIdeaDescription, setNewIdeaDescription] = useState("");
  const [newIdeaCategory, setNewIdeaCategory] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("");

  const untriagedInbox = inbox?.filter(item => !item.triaged) ?? [];
  
  const filteredIdeas = ideas?.filter(idea => {
    if (filterCategory && idea.category !== filterCategory) return false;
    return true;
  }) ?? [];

  const handleCreateIdea = async () => {
    if (!newIdeaTitle.trim()) return;
    
    await createIdea({
      title: newIdeaTitle,
      description: newIdeaDescription || undefined,
      category: newIdeaCategory || undefined,
    });
    
    setNewIdeaTitle("");
    setNewIdeaDescription("");
    setNewIdeaCategory("");
  };

  const getCategoryColor = (category?: string) => {
    if (!category) return categoryColors.default;
    return categoryColors[category as keyof typeof categoryColors] || categoryColors.default;
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Ideas</h1>
        <p className="text-gray-400 mt-1">
          {ideas?.length} ideas • {untriagedInbox.length} untriaged items
        </p>
      </div>

      {/* Inbox Section */}
      {untriagedInbox.length > 0 && (
        <div className="mb-8 bg-card border border-border rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <Inbox className="text-orange-400" size={20} />
            <h2 className="text-xl font-semibold">Inbox</h2>
            <span className="text-sm text-gray-400">({untriagedInbox.length} items)</span>
          </div>
          <div className="space-y-3">
            {untriagedInbox.slice(0, 5).map((item) => (
              <div
                key={item._id}
                className="p-3 bg-background border border-border rounded-md"
              >
                <div className="flex justify-between items-start">
                  <p className="text-sm flex-1">{item.text}</p>
                  <div className="ml-4 text-xs text-gray-500">
                    {item.source && (
                      <span className="px-2 py-1 bg-gray-700 rounded mr-2">
                        {item.source}
                      </span>
                    )}
                    {new Date(item.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
            {untriagedInbox.length > 5 && (
              <div className="text-center">
                <span className="text-sm text-gray-400">
                  ... and {untriagedInbox.length - 5} more items
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Quick Add */}
      <div className="mb-6 bg-card border border-border rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <Plus className="text-green-400" size={20} />
          <h2 className="text-xl font-semibold">Add New Idea</h2>
        </div>
        
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Idea title..."
            value={newIdeaTitle}
            onChange={(e) => setNewIdeaTitle(e.target.value)}
            className="w-full px-3 py-2 bg-background border border-border rounded-md text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
          />
          
          <textarea
            placeholder="Description (optional)..."
            value={newIdeaDescription}
            onChange={(e) => setNewIdeaDescription(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 bg-background border border-border rounded-md text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
          />
          
          <div className="flex gap-4">
            <select
              value={newIdeaCategory}
              onChange={(e) => setNewIdeaCategory(e.target.value)}
              className="px-3 py-2 bg-background border border-border rounded-md text-white"
            >
              <option value="">Select Category</option>
              <option value="finance">Finance</option>
              <option value="health">Health</option>
              <option value="work">Work</option>
              <option value="travel">Travel</option>
              <option value="family">Family</option>
              <option value="tech">Tech</option>
            </select>
            
            <button
              onClick={handleCreateIdea}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-md flex items-center gap-2"
            >
              <Plus size={16} />
              Add Idea
            </button>
          </div>
        </div>
      </div>

      {/* Filter */}
      <div className="mb-6 flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Tag size={16} />
          <span className="text-sm">Filter by category:</span>
        </div>
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
          <option value="tech">Tech</option>
        </select>
      </div>

      {/* Ideas List */}
      <div className="space-y-4">
        {filteredIdeas.map((idea) => (
          <div
            key={idea._id}
            className="bg-card border border-border rounded-lg p-6 hover:border-gray-500 transition-colors"
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-start gap-3">
                <Lightbulb className="text-yellow-400 mt-1 flex-shrink-0" size={18} />
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{idea.title}</h3>
                  {idea.description && (
                    <p className="text-gray-400 mt-2">{idea.description}</p>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {idea.category && (
                  <span className={`px-2 py-1 text-xs rounded ${getCategoryColor(idea.category)}`}>
                    {idea.category}
                  </span>
                )}
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Clock size={12} />
                  {new Date(idea.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {filteredIdeas.length === 0 && (
          <div className="text-center py-12">
            <Lightbulb className="mx-auto text-gray-600 mb-4" size={48} />
            <p className="text-gray-400">
              {filterCategory ? `No ideas in the ${filterCategory} category` : "No ideas yet"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}