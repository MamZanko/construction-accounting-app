"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"

const VALID_EMAIL = "zanko@qandil.com"
const VALID_PASSWORD = "Qandil@2026"

const SESSION_COOKIE = "auth_session"
const SESSION_DURATION_SEC = 60 * 60 * 24 * 7 // 7 days

export async function authenticate(email: string, password: string) {
  if (email === VALID_EMAIL && password === VALID_PASSWORD) {
    const cookieStore = await cookies()
    const secret = process.env.SESSION_SECRET ?? "qandil-secret-2026"
    const raw = `${email}:${Date.now()}:${secret}`
    const token = Buffer.from(raw).toString("base64url")

    const isDev = process.env.NODE_ENV === "development"
    
    cookieStore.set(SESSION_COOKIE, token, {
      httpOnly: true,
      secure: true,
      sameSite: isDev ? "none" : "lax",
      maxAge: SESSION_DURATION_SEC,
      path: "/",
    })

    // Redirect from server action to ensure cookie is committed before navigation
    redirect("/")
  }

  return { success: false as const, error: "ئیمەیڵ یان وشەی نهێنی هەڵەیە" }
}

export async function logout() {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE)
  redirect("/login")
}

export async function getSession() {
  const cookieStore = await cookies()
  return cookieStore.get(SESSION_COOKIE)?.value ?? null
}

export async function requireAuth() {
  const session = await getSession()
  if (!session) redirect("/login")
  return session
}
