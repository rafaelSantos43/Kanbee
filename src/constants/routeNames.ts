/**
 * Centralized route names for the application
 * Usage: routeNames.auth.login, routeNames.board.list, etc.
 */

export const routeNames = {
  // Root
  root: "/",

  // Auth routes
  auth: {
    login: "/(auth)",
    register: "/(auth)/register",
  },

  // Main routes
  main: {
    root: "/(main)",
  },

  // Board routes
  board: {
    list: "/(main)/(board)/",
    detail: (id: string) => `/(main)/(board)/${id}`,
  },

  // Card Details routes
  cardDetails: {
    root: "/(main)/(cardDetails)/",
  },
} as const;

// Type for route keys (useful for type-safe navigation)
export type RouteNames = typeof routeNames;
