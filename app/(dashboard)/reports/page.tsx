"use client"

import { PageHeader, StatCard } from "@/components/ui-helpers"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { monthlySalesVsExpenses, topCustomers, materialBreakdown } from "@/lib/data"
import { formatIQD } from "@/lib/format"
import { FileBarChart, TrendingUp, TrendingDown, Scale, Printer } from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"

const tooltipStyle = {
  background: "var(--popover)",
  border: "1px solid var(--border)",
  borderRadius: "8px",
  fontSize: "12px",
}

export default function ReportsPage() {
  const totalSales = monthlySalesVsExpenses.reduce((s, m) => s + m.sales, 0)
  const totalExpenses = monthlySalesVsExpenses.reduce((s, m) => s + m.expenses, 0)
  const profit = totalSales - totalExpenses

  const handlePrintReport = () => {
    window.print()
  }

  return (
    <>
      <PageHeader
        title="ڕاپۆرت و شیکاری"
        description="ڕاپۆرتی قازانج و زیان، فرۆشتن بەپێی مانگ و کڕیار"
        action={
          <Button variant="outline" onClick={handlePrintReport}>
            <Printer className="size-4" />
            چاپ / PDF
          </Button>
        }
      />

      <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="کۆی داهات (٦ مانگ)" value={formatIQD(totalSales)} icon={TrendingUp} tone="positive" />
        <StatCard label="کۆی خەرجی (٦ مانگ)" value={formatIQD(totalExpenses)} icon={TrendingDown} tone="negative" />
        <StatCard label="قازانجی پاک" value={formatIQD(profit)} icon={Scale} tone="warning" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="p-4">
          <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-foreground">
            <FileBarChart className="size-4 text-primary" />
            داهات بەرامبەر خەرجی
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlySalesVsExpenses}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} reversed />
                <YAxis
                  tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                  tickFormatter={(v) => `${v / 1000000}م`}
                  orientation="right"
                />
                <Tooltip contentStyle={tooltipStyle} formatter={(v) => formatIQD(v as number)} />
                <Legend wrapperStyle={{ fontSize: "12px" }} />
                <Bar dataKey="sales" name="داهات" fill="var(--chart-2)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expenses" name="خەرجی" fill="var(--chart-5)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-4">
          <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-foreground">
            <TrendingUp className="size-4 text-primary" />
            باشترین کڕیارەکان
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topCustomers} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
                <XAxis
                  type="number"
                  tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                  tickFormatter={(v) => `${v / 1000000}م`}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                  width={120}
                  orientation="right"
                />
                <Tooltip contentStyle={tooltipStyle} formatter={(v) => formatIQD(v as number)} />
                <Bar dataKey="revenue" name="داهات" fill="var(--chart-1)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-4 lg:col-span-2">
          <h3 className="mb-4 text-sm font-semibold text-foreground">فرۆشتن بەپێی جۆری کەرەستە (%)</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={materialBreakdown}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} reversed />
                <YAxis tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} orientation="right" />
                <Tooltip contentStyle={tooltipStyle} formatter={(v) => `${v}%`} />
                <Bar dataKey="value" name="ڕێژە" fill="var(--chart-3)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </>
  )
}
