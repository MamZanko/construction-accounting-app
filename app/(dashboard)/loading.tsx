import { Card } from "@/components/ui/card"

export default function Loading() {
  return (
    <div className="animate-pulse">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="h-6 w-48 rounded-md bg-muted" />
          <div className="mt-2 h-4 w-64 rounded-md bg-muted/70" />
        </div>
        <div className="h-9 w-28 rounded-md bg-muted" />
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="flex items-start justify-between gap-3 p-4">
            <div className="min-w-0 flex-1">
              <div className="h-3 w-20 rounded bg-muted" />
              <div className="mt-2 h-6 w-24 rounded bg-muted" />
            </div>
            <div className="size-10 shrink-0 rounded-lg bg-muted" />
          </Card>
        ))}
      </div>

      <Card className="mt-4 p-4">
        <div className="h-4 w-40 rounded bg-muted" />
        <div className="mt-4 flex flex-col gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between gap-3">
              <div className="h-4 w-1/3 rounded bg-muted" />
              <div className="h-4 w-20 rounded bg-muted/70" />
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
