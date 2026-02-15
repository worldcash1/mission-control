"use client";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useState } from "react";
import { ExternalLink, Github, Globe, Database, MessageCircle, ChevronDown, ChevronRight } from "lucide-react";

const statusColors = {
  research: "bg-gray-500",
  planning: "bg-blue-500",
  building: "bg-yellow-500",
  live: "bg-green-500",
  paused: "bg-orange-500",
  archived: "bg-red-500",
};

const statusLabels = {
  research: "Research",
  planning: "Planning",
  building: "Building", 
  live: "Live",
  paused: "Paused",
  archived: "Archived",
};

export default function Projects() {
  const projects = useQuery(api.projects.list, {});
  const [expandedProjects, setExpandedProjects] = useState<Set<string>>(new Set());

  const toggleExpanded = (projectId: string) => {
    const newExpanded = new Set(expandedProjects);
    if (newExpanded.has(projectId)) {
      newExpanded.delete(projectId);
    } else {
      newExpanded.add(projectId);
    }
    setExpandedProjects(newExpanded);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Projects</h1>
        <p className="text-gray-400 mt-1">
          {projects?.length} projects total
        </p>
      </div>

      {/* Project Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects?.map((project) => {
          const isExpanded = expandedProjects.has(project._id);
          
          return (
            <div key={project._id} className="bg-card border border-border rounded-lg overflow-hidden">
              {/* Card Header */}
              <div className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-semibold text-lg">{project.title}</h3>
                  <div className="flex items-center gap-2">
                    <span 
                      className={`px-2 py-1 text-xs rounded-full text-white ${
                        statusColors[project.status as keyof typeof statusColors]
                      }`}
                    >
                      {statusLabels[project.status as keyof typeof statusLabels]}
                    </span>
                  </div>
                </div>

                {project.description && (
                  <p className="text-gray-400 text-sm mb-4">{project.description}</p>
                )}

                {/* Progress Bar */}
                {project.progress !== undefined && (
                  <div className="mb-4">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-400">Progress</span>
                      <span>{project.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {/* Tech Stack */}
                {project.techStack && project.techStack.length > 0 && (
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-1">
                      {project.techStack.slice(0, 3).map((tech) => (
                        <span
                          key={tech}
                          className="px-2 py-1 bg-gray-700 text-xs rounded"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.techStack.length > 3 && (
                        <span className="px-2 py-1 bg-gray-700 text-xs rounded">
                          +{project.techStack.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Quick Links */}
                <div className="flex gap-2 mb-4">
                  {project.repoUrl && (
                    <a
                      href={project.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-gray-700 hover:bg-gray-600 rounded-md transition-colors"
                      title="Repository"
                    >
                      <Github size={16} />
                    </a>
                  )}
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-gray-700 hover:bg-gray-600 rounded-md transition-colors"
                      title="Live URL"
                    >
                      <Globe size={16} />
                    </a>
                  )}
                  {project.vercelUrl && (
                    <a
                      href={project.vercelUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-gray-700 hover:bg-gray-600 rounded-md transition-colors"
                      title="Vercel"
                    >
                      <ExternalLink size={16} />
                    </a>
                  )}
                  {project.convexUrl && (
                    <a
                      href={project.convexUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-gray-700 hover:bg-gray-600 rounded-md transition-colors"
                      title="Convex"
                    >
                      <Database size={16} />
                    </a>
                  )}
                  {project.discordChannelId && (
                    <a
                      href={`https://discord.com/channels/1466625923578331291/${project.discordChannelId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-gray-700 hover:bg-gray-600 rounded-md transition-colors"
                      title="Discord Channel"
                    >
                      <MessageCircle size={16} />
                    </a>
                  )}
                </div>

                {/* Expand/Collapse Button */}
                <button
                  onClick={() => toggleExpanded(project._id)}
                  className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
                >
                  {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                  {isExpanded ? "Less details" : "More details"}
                </button>
              </div>

              {/* Expanded Details */}
              {isExpanded && (
                <div className="border-t border-border p-4 bg-background/50">
                  {project.features && project.features.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-sm font-medium mb-2">Features</h4>
                      <ul className="text-sm text-gray-400 space-y-1">
                        {project.features.map((feature, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-green-400 mt-0.5">•</span>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {project.apis && project.apis.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-sm font-medium mb-2">APIs</h4>
                      <div className="flex flex-wrap gap-1">
                        {project.apis.map((api) => (
                          <span key={api} className="px-2 py-1 bg-blue-900/30 text-blue-300 text-xs rounded">
                            {api}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {project.agent && (
                    <div className="mb-4">
                      <h4 className="text-sm font-medium mb-2">Agent</h4>
                      <span className="px-2 py-1 bg-purple-900/30 text-purple-300 text-xs rounded">
                        {project.agent}
                      </span>
                    </div>
                  )}

                  <div className="text-xs text-gray-500">
                    Created: {new Date(project.createdAt).toLocaleDateString()}
                    {project.updatedAt !== project.createdAt && (
                      <>
                        {" • "}
                        Updated: {new Date(project.updatedAt).toLocaleDateString()}
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}