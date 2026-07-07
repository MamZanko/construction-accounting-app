"use client"

import { useState, memo, useTransition } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, Mountain, Search, Bell, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"
import { navItems, navGroups } from "@/lib/nav"
import { Button } from "@/components/ui/button"
import { logout } from "@/lib/auth-actions"

function TopbarComponent() {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const pathname = usePathname()
  const current = navItems.find((i) => i.href === pathname || (i.href !== "/" && pathname.startsWith(i.href)))

  const handleNotificationClick = () => {
    alert("بێ ئاگادارکردنەوەی نوێ")
  }

  const handleLogout = () => {
    startTransition(async () => {
      await logout()
    })
  }

  return (
    <>
      <header className="sticky top-0 z-30 flex items-center justify-between gap-4 border-b border-border bg-card/80 px-4 py-3 backdrop-blur md:px-6">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setOpen(true)}
            aria-label="کردنەوەی مێنیو"
          >
            <Menu className="size-5" />
          </Button>
          <div>
            <h1 className="text-lg font-bold text-foreground">{current?.label ?? "داشبۆرد"}</h1>
            <p className="hidden text-xs text-muted-foreground sm:block">
              {new Date().toLocaleDateString("en-GB")} ـ کۆمپانیای مەعمەل قەندیل
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative hidden md:block">
            <Search className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              placeholder="گەڕان..."
              className="h-9 w-56 rounded-lg border border-input bg-background pr-9 pl-3 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            aria-label="ئاگادارکردنەوەکان"
            onClick={handleNotificationClick}
          >
            <Bell className="size-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleLogout}
            disabled={isPending}
            aria-label="چوونەدەرەوە"
            title="چوونەدەرەوە"
          >
            <LogOut className="size-5" />
          </Button>
        </div>
      </header>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-foreground/40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-0 flex h-full w-72 flex-col bg-sidebar text-sidebar-foreground">
            <div className="flex items-center justify-between border-b border-sidebar-border px-4 py-4">
              <div className="flex items-center gap-2">
                <div className="flex size-9 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Mountain className="size-5" />
                </div>
                <span className="font-bold">مەعمەل قەندیل</span>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setOpen(false)} aria-label="داخستن">
                <X className="size-5" />
              </Button>
            </div>
            <nav className="no-scrollbar flex-1 overflow-y-auto px-3 py-4">
              {navGroups.map((group) => (
                <div key={group} className="mb-4">
                  <p className="px-3 pb-1 text-[11px] font-semibold uppercase tracking-wide text-sidebar-foreground/40">
                    {group}
                  </p>
                  {navItems
                    .filter((i) => i.group === group)
                    .map((item) => {
                      const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          prefetch
                          onClick={() => setOpen(false)}
                          className={cn(
                            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium",
                            active
                              ? "bg-sidebar-primary text-sidebar-primary-foreground"
                              : "text-sidebar-foreground/80 hover:bg-sidebar-accent",
                          )}
                        >
                          <item.icon className="size-[18px]" />
                          {item.label}
                        </Link>
                      )
                    })}
                </div>
              ))}
            </nav>
          </div>
        </div>
      )}
    </>
  )
}

export const Topbar = memo(TopbarComponent)
