import { mutation } from "./_generated/server";

// One-time migration to convert todos to tasks
// Run this once via Convex dashboard or CLI
export const migrateToTasks = mutation({
  handler: async (ctx) => {
    // This will only work if the old todos table still exists
    // After running this migration, you can remove the todos table from schema
    
    let migrated = 0;
    let skipped = 0;
    
    try {
      // Try to query todos - this will fail if the table doesn't exist
      const todos = await ctx.db.query("todos" as any).collect();
      
      for (const todo of todos) {
        // Check if task with same title already exists
        const existingTasks = await ctx.db.query("tasks").collect();
        const exists = existingTasks.some(t => 
          t.title === todo.title && 
          Math.abs(t.createdAt - todo.createdAt) < 1000 // within 1 second
        );
        
        if (exists) {
          skipped++;
          continue;
        }
        
        // Convert reminder format if needed
        let reminder = undefined;
        if (todo.reminder) {
          // Old format was just a string, new format is an object
          if (typeof todo.reminder === 'string') {
            reminder = {
              at: todo.reminder,
              repeat: 'never',
              fired: false,
            };
          } else if (typeof todo.reminder === 'object') {
            reminder = todo.reminder;
          }
        }
        
        // Create new task
        await ctx.db.insert("tasks", {
          title: todo.title,
          description: todo.description,
          status: todo.status === 'done' ? 'done' : 'active',
          priority: todo.priority || 'medium',
          type: 'personal', // Default to personal
          projectId: undefined,
          assignee: undefined,
          category: undefined,
          dueDate: todo.dueDate,
          reminder: reminder,
          createdAt: todo.createdAt,
          completedAt: todo.completedAt,
        });
        
        migrated++;
      }
      
      return { 
        success: true, 
        migrated, 
        skipped,
        message: `Migrated ${migrated} todos to tasks (${skipped} skipped as duplicates)` 
      };
    } catch (e) {
      // Table doesn't exist or other error
      return { 
        success: false, 
        migrated: 0, 
        skipped: 0,
        message: `Migration not needed or failed: ${e}` 
      };
    }
  },
});
