"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { memo } from "react"
import { Mountain, PanelRightClose, PanelRightOpen, Phone } from "lucide-react"
import { cn } from "@/lib/utils"
import { navItems, navGroups } from "@/lib/nav"

function SidebarComponent({
  collapsed = false,
  onToggle,
}: {
  collapsed?: boolean
  onToggle?: () => void
}) {
  const pathname = usePathname()

  return (
    <aside
      className={cn(
        "no-scrollbar hidden h-screen shrink-0 flex-col overflow-y-auto bg-sidebar text-sidebar-foreground transition-[width] duration-200 lg:flex",
        collapsed ? "w-[72px]" : "w-64",
      )}
    >
      <div className={cn("flex items-center gap-3 px-3 py-5", collapsed && "justify-center px-0")}>
        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
          <Mountain className="size-5" />
        </div>
        {!collapsed && (
          <div className="leading-tight">
            <p className="text-sm font-bold">مەعمەل قەندیل</p>
            <p className="text-xs text-sidebar-foreground/60">سیستەمی ژمێریاری</p>
          </div>
        )}
      </div>

      <div className={cn("px-3 pb-2", collapsed && "px-2")}>
        <button
          type="button"
          onClick={onToggle}
          aria-label={collapsed ? "کردنەوەی لیستە" : "داخستنی لیستە"}
          className={cn(
            "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-sidebar-foreground/80 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
            collapsed && "justify-center px-0",
          )}
        >
          {collapsed ? (
            <PanelRightOpen className="size-[18px] shrink-0" />
          ) : (
            <>
              <PanelRightClose className="size-[18px] shrink-0" />
              <span>داخستنی لیستە</span>
            </>
          )}
        </button>
      </div>

      <nav className={cn("flex-1 px-3 py-2", collapsed && "px-2")}>
        {navGroups.map((group) => (
          <div key={group} className="mb-5">
            {!collapsed && (
              <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wide text-sidebar-foreground/40">
                {group}
              </p>
            )}
            <div className="flex flex-col gap-1">
              {navItems
                .filter((item) => item.group === group)
                .map((item) => {
                  const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      prefetch
                      title={collapsed ? item.label : undefined}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                        collapsed && "justify-center px-0",
                        active
                          ? "bg-sidebar-primary text-sidebar-primary-foreground"
                          : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                      )}
                    >
                      <item.icon className="size-[18px] shrink-0" />
                      {!collapsed && <span>{item.label}</span>}
                    </Link>
                  )
                })}
            </div>
          </div>
        ))}
      </nav>

      <div className={cn("px-3 py-4 text-xs text-sidebar-foreground/50", collapsed && "hidden")}>
        <p>ژمێریار: دیاری محمد</p>
        <div className="mt-3">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-sidebar-foreground/40">گەشەپێدەر</p>
          <p className="mt-1 font-medium text-sidebar-foreground/90">زانکۆ محمد</p>
          <a
            href="tel:07728607640"
            className="mt-1 flex items-center gap-1.5 transition-colors hover:text-sidebar-foreground"
            dir="ltr"
          >
            <Phone className="size-3.5 shrink-0" />
            <span>0772 860 76 40</span>
          </a>
        </div>
        <p className="mt-3">وەشانی ١.٠ ـ ٢٠٢٦</p>
      </div>
    </aside>
  )
}

export const Sidebar = memo(SidebarComponent)
