"use client"

import { memo } from "react"
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, XAxis, YAxis } from "recharts"
import { Card } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, type ChartConfig } from "@/components/ui/chart"
import { monthlySalesVsExpenses, topCustomers, materialBreakdown } from "@/lib/data"

const PIE_COLORS = [
  "var(--color-chart-1)",
  "var(--color-chart-2)",
  "var(--color-chart-3)",
  "var(--color-chart-4)",
  "var(--color-chart-5)",
] as const

function shortM(n: number) {
  return (n / 1000000).toFixed(0) + "م"
}

const salesExpensesConfig = {
  sales: { label: "فرۆش", color: "var(--chart-1)" },
  expenses: { label: "خەرجی", color: "var(--chart-4)" },
} satisfies ChartConfig

const topCustomersConfig = {
  revenue: { label: "داهات", color: "var(--chart-2)" },
} satisfies ChartConfig

const materialConfig = {
  value: { label: "ڕێژە" },
} satisfies ChartConfig

function tooltipContent(formatter: (v: number) => string) {
  return (
    <ChartTooltip
      content={({ active, payload, label }) => {
        if (!active || !payload?.length) return null
        return (
          <div
            className="rounded-lg border border-border bg-popover px-3 py-2 text-xs shadow-md"
            dir="rtl"
          >
            {label != null && <p className="mb-1 font-medium text-popover-foreground">{label}</p>}
            {payload.map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-muted-foreground">
                <span
                  className="size-2.5 rounded-full"
                  style={{ background: item.color ?? (item.payload as { fill?: string })?.fill }}
                />
                <span>{item.name ?? ""}</span>
                <span className="font-medium text-popover-foreground">
                  {formatter(item.value as number)}
                </span>
              </div>
            ))}
          </div>
        )
      }}
    />
  )
}

const SalesExpensesChartComponent = () => {
  return (
    <Card className="p-4">
      <h3 className="mb-4 text-sm font-bold text-foreground">فرۆش بەرامبەر خەرجی (مانگانە)</h3>
      <div className="h-[260px] w-full">
      <ChartContainer config={salesExpensesConfig} className="h-full w-full">
        <BarChart data={monthlySalesVsExpenses}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            tickFormatter={shortM}
            tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }}
            tickLine={false}
            axisLine={false}
            width={36}
          />
          {tooltipContent((v) => (v / 1000000).toFixed(1) + " ملیۆن د.ع")}
          <Bar dataKey="sales" name="فرۆش" fill="var(--color-sales)" radius={[4, 4, 0, 0]} />
          <Bar dataKey="expenses" name="خەرجی" fill="var(--color-expenses)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ChartContainer>
      </div>
    </Card>
  )
}

export const SalesExpensesChart = memo(SalesExpensesChartComponent)

const TopCustomersChartComponent = () => {
  return (
    <Card className="p-4">
      <h3 className="mb-4 text-sm font-bold text-foreground">٥ کڕیاری سەرەکی بەپێی داهات</h3>
      <div className="h-[260px] w-full">
      <ChartContainer config={topCustomersConfig} className="h-full w-full">
        <BarChart data={topCustomers} layout="vertical" margin={{ right: 8, left: 8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" horizontal={false} />
          <XAxis
            type="number"
            tickFormatter={shortM}
            tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            type="category"
            dataKey="name"
            width={110}
            tick={{ fontSize: 11, fill: "var(--color-foreground)" }}
            tickLine={false}
            axisLine={false}
          />
          {tooltipContent((v) => (v / 1000000).toFixed(1) + " ملیۆن د.ع")}
          <Bar dataKey="revenue" name="داهات" fill="var(--color-revenue)" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ChartContainer>
      </div>
    </Card>
  )
}

export const TopCustomersChart = memo(TopCustomersChartComponent)

const MaterialPieChartComponent = () => {
  return (
    <Card className="p-4">
      <h3 className="mb-4 text-sm font-bold text-foreground">دابەشبوونی فرۆش بەپێی کەرەستە</h3>
      <div className="h-[260px] w-full">
      <ChartContainer config={materialConfig} className="h-full w-full">
        <PieChart>
          <Pie
            data={materialBreakdown}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={90}
            innerRadius={45}
            paddingAngle={2}
          >
            {materialBreakdown.map((_, i) => (
              <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
            ))}
          </Pie>
          {tooltipContent((v) => v + "%")}
        </PieChart>
      </ChartContainer>
      </div>
      <div className="mt-2 flex flex-wrap justify-center gap-x-4 gap-y-1">
        {materialBreakdown.map((m, i) => (
          <div key={m.name} className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="size-2.5 rounded-full" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
            {m.name}
          </div>
        ))}
      </div>
    </Card>
  )
}

export const MaterialPieChart = memo(MaterialPieChartComponent)
