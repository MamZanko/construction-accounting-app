import type React from "react"
import { memo } from "react"
import { cn } from "@/lib/utils"
import { Card } from "@/components/ui/card"

type StatCardProps = {
  label: string
  value: string
  icon: React.ElementType
  hint?: string
  tone?: "default" | "positive" | "negative" | "warning"
}

const toneMap = {
  default: "bg-primary/10 text-primary",
  positive: "bg-chart-2/15 text-chart-2",
  negative: "bg-destructive/10 text-destructive",
  warning: "bg-chart-4/20 text-chart-4",
}

export const StatCard = memo(function StatCard({ label, value, icon: Icon, hint, tone = "default" }: StatCardProps) {
  return (
    <Card className="flex items-start justify-between gap-3 p-4">
      <div className="min-w-0">
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
        <p className="mt-1.5 truncate text-xl font-bold text-foreground">{value}</p>
        {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
      </div>
      <div className={cn("flex size-10 shrink-0 items-center justify-center rounded-lg", toneMap[tone])}>
        <Icon className="size-5" />
      </div>
    </Card>
  )
})

export const PageHeader = memo(function PageHeader({
  title,
  description,
  action,
}: {
  title: string
  description?: string
  action?: React.ReactNode
}) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h2 className="text-xl font-bold text-foreground">{title}</h2>
        {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      </div>
      {action}
    </div>
  )
})
