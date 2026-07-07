"use client"

import { useState, useTransition } from "react"
import { Mountain, Lock, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { authenticate } from "@/lib/auth-actions"
import { companyInfo } from "@/lib/data"

export default function LoginPage() {
  const [isPending, startTransition] = useTransition()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    startTransition(async () => {
      // authenticate() redirects server-side on success
      // If we get a response, it means auth failed
      const result = await authenticate(email, password)
      setError(result.error ?? "هەڵەیەک ڕوویدا")
    })
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-sidebar p-4">
      <Card className="w-full max-w-sm p-7">
        <div className="mb-7 flex flex-col items-center text-center">
          <div className="mb-3 flex size-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
            <Mountain className="size-7" />
          </div>
          <h1 className="text-xl font-bold text-foreground text-balance">{companyInfo.name}</h1>
          <p className="mt-1 text-sm text-muted-foreground">سیستەمی ژمێریاری و بەڕێوەبردن</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email">ئیمەیڵ</Label>
            <div className="relative">
              <Mail className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pr-9"
                required
                autoComplete="email"
                placeholder="ئیمەیڵەکەت بنووسە"
                dir="ltr"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="password">وشەی نهێنی</Label>
            <div className="relative">
              <Lock className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pr-9"
                required
                autoComplete="current-password"
                placeholder="••••••••"
                dir="ltr"
              />
            </div>
          </div>

          {error && (
            <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive" role="alert">
              {error}
            </p>
          )}

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? "چاوەڕوان بە..." : "چوونەژوورەوە"}
          </Button>
        </form>

        <p className="mt-5 text-center text-xs text-muted-foreground" dir="ltr">{companyInfo.phone}</p>
      </Card>
    </main>
  )
}
