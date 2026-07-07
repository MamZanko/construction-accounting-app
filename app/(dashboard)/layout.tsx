import type React from "react"
import { AppShell } from "@/components/app-shell"
import { StoreProvider } from "@/lib/store"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <StoreProvider>
      <AppShell>{children}</AppShell>
    </StoreProvider>
  )
}
