// Re-export server actions from auth-actions for convenience.
// Do NOT add "use server" here — this file is imported by both server and client modules.
export { authenticate, logout, getSession, requireAuth } from "./auth-actions"

export const SESSION_COOKIE = "auth_session"
