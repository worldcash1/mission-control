/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as dashboard from "../dashboard.js";
import type * as http from "../http.js";
import type * as ideas from "../ideas.js";
import type * as migrateTodos from "../migrateTodos.js";
import type * as projects from "../projects.js";
import type * as seed from "../seed.js";
import type * as seedProjects from "../seedProjects.js";
import type * as seedTools from "../seedTools.js";
import type * as tasks from "../tasks.js";
import type * as todos from "../todos.js";
import type * as tools from "../tools.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  dashboard: typeof dashboard;
  http: typeof http;
  ideas: typeof ideas;
  migrateTodos: typeof migrateTodos;
  projects: typeof projects;
  seed: typeof seed;
  seedProjects: typeof seedProjects;
  seedTools: typeof seedTools;
  tasks: typeof tasks;
  todos: typeof todos;
  tools: typeof tools;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
