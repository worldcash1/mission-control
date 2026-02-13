import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { api } from "./_generated/api";

const http = httpRouter();

// Apple Reminders → Mission Control sync endpoint
// POST /api/todos with JSON body: { title, description?, priority?, dueDate? }
http.route({
  path: "/api/todos",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    try {
      const body = await request.json();
      
      if (!body.title) {
        return new Response(
          JSON.stringify({ error: "title is required" }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }

      const id = await ctx.runMutation(api.todos.add, {
        title: body.title,
        description: body.description,
        priority: body.priority,
        dueDate: body.dueDate,
        reminder: body.reminder,
      });

      return new Response(
        JSON.stringify({ success: true, id }),
        { status: 201, headers: { "Content-Type": "application/json" } }
      );
    } catch (error) {
      return new Response(
        JSON.stringify({ error: "Failed to create todo" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
  }),
});

// Health check
http.route({
  path: "/api/health",
  method: "GET",
  handler: httpAction(async () => {
    return new Response(
      JSON.stringify({ status: "ok", service: "mission-control" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  }),
});

export default http;
