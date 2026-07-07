"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Topbar } from "@/components/topbar"

export function AppShell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false)

  useEffect(() => {
    const stored = window.localStorage.getItem("sidebar-collapsed")
    if (stored === "true") setCollapsed(true)
  }, [])

  const toggle = () =>
    setCollapsed((c) => {
      const next = !c
      window.localStorage.setItem("sidebar-collapsed", String(next))
      return next
    })

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar collapsed={collapsed} onToggle={toggle} />
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <Topbar />
        <main className="no-scrollbar flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}
