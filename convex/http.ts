import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { api } from "./_generated/api";

const http = httpRouter();

// ─── TASKS API ───────────────────────────────────────────────
// POST /api/tasks — Create a task
// Body: { title, description?, priority?, type?, dueDate?, category?, assignee?, reminder? }
http.route({
  path: "/api/tasks",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    try {
      const body = await request.json();
      if (!body.title) {
        return new Response(
          JSON.stringify({ error: "title is required" }),
          { status: 400, headers: corsHeaders("application/json") }
        );
      }

      const id = await ctx.runMutation(api.tasks.add, {
        title: body.title,
        description: body.description,
        priority: body.priority || "medium",
        type: body.type || "personal",
        dueDate: body.dueDate,
        category: body.category,
        assignee: body.assignee,
        reminder: body.reminder,
      });

      // Log activity
      await ctx.runMutation(api.dashboard.logActivity, {
        text: `Task created: ${body.title}`,
      });

      return new Response(
        JSON.stringify({ success: true, id }),
        { status: 201, headers: corsHeaders("application/json") }
      );
    } catch (error) {
      return new Response(
        JSON.stringify({ error: "Failed to create task" }),
        { status: 500, headers: corsHeaders("application/json") }
      );
    }
  }),
});

// GET /api/tasks — List tasks
http.route({
  path: "/api/tasks",
  method: "GET",
  handler: httpAction(async (ctx, request) => {
    const url = new URL(request.url);
    const status = url.searchParams.get("status") || undefined;
    const tasks = await ctx.runQuery(api.tasks.list, { status });
    return new Response(
      JSON.stringify(tasks),
      { status: 200, headers: corsHeaders("application/json") }
    );
  }),
});

// POST /api/tasks/complete — Complete a task
http.route({
  path: "/api/tasks/complete",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    try {
      const body = await request.json();
      if (!body.id) {
        return new Response(
          JSON.stringify({ error: "id is required" }),
          { status: 400, headers: corsHeaders("application/json") }
        );
      }

      // Get task title for activity log
      const task = await ctx.runQuery(api.tasks.get, { id: body.id });
      
      await ctx.runMutation(api.tasks.complete, { id: body.id });
      
      await ctx.runMutation(api.dashboard.logActivity, {
        text: `Task completed: ${task?.title || "Unknown"}`,
      });

      return new Response(
        JSON.stringify({ success: true }),
        { status: 200, headers: corsHeaders("application/json") }
      );
    } catch (error) {
      return new Response(
        JSON.stringify({ error: "Failed to complete task" }),
        { status: 500, headers: corsHeaders("application/json") }
      );
    }
  }),
});

// ─── LEGACY: Todos endpoint (backwards compat) ──────────────
http.route({
  path: "/api/todos",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    try {
      const body = await request.json();
      if (!body.title) {
        return new Response(
          JSON.stringify({ error: "title is required" }),
          { status: 400, headers: corsHeaders("application/json") }
        );
      }

      const id = await ctx.runMutation(api.tasks.add, {
        title: body.title,
        description: body.description,
        priority: body.priority,
        dueDate: body.dueDate,
        reminder: body.reminder,
      });

      return new Response(
        JSON.stringify({ success: true, id }),
        { status: 201, headers: corsHeaders("application/json") }
      );
    } catch (error) {
      return new Response(
        JSON.stringify({ error: "Failed to create todo" }),
        { status: 500, headers: corsHeaders("application/json") }
      );
    }
  }),
});

// ─── HEALTH ──────────────────────────────────────────────────
http.route({
  path: "/api/health",
  method: "GET",
  handler: httpAction(async () => {
    return new Response(
      JSON.stringify({ status: "ok", service: "mission-control", version: "4.1.0" }),
      { status: 200, headers: corsHeaders("application/json") }
    );
  }),
});

// ─── CORS preflight ──────────────────────────────────────────
http.route({
  path: "/api/tasks",
  method: "OPTIONS",
  handler: httpAction(async () => {
    return new Response(null, { status: 204, headers: corsHeaders() });
  }),
});

http.route({
  path: "/api/tasks/complete",
  method: "OPTIONS",
  handler: httpAction(async () => {
    return new Response(null, { status: 204, headers: corsHeaders() });
  }),
});

function corsHeaders(contentType?: string): Record<string, string> {
  const headers: Record<string, string> = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
  if (contentType) headers["Content-Type"] = contentType;
  return headers;
}

export default http;
