export type Role = "admin" | "agent" | "user";
export const USER_ROLES = {
  admin: "admin",
  agent: "agent",
  user: "user",
} as const;
