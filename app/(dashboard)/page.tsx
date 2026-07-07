import dynamic from "next/dynamic"
import { TrendingUp, Truck, Mountain, Receipt, Wallet, AlertTriangle, ArrowUpRight } from "lucide-react"
import { StatCard } from "@/components/ui-helpers"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatIQD, formatDate } from "@/lib/format"
import { sales, saleTotal, customers, maintenances } from "@/lib/data"

const ChartFallback = () => <Card className="h-[324px] animate-pulse bg-muted/40" />

const SalesExpensesChart = dynamic(
  () => import("@/components/dashboard-charts").then((m) => m.SalesExpensesChart),
  { loading: ChartFallback },
)
const TopCustomersChart = dynamic(
  () => import("@/components/dashboard-charts").then((m) => m.TopCustomersChart),
  { loading: ChartFallback },
)
const MaterialPieChart = dynamic(
  () => import("@/components/dashboard-charts").then((m) => m.MaterialPieChart),
  { loading: ChartFallback },
)

export default function DashboardPage() {
  const todaySales = sales
    .filter((s) => s.date === "2026-06-08")
    .reduce((a, s) => a + saleTotal(s), 0)
  const totalDebt = customers.reduce((a, c) => a + c.balance, 0)
  const recent = sales.slice(0, 6)
  const dueMaint = maintenances.filter((m) => m.nextDue && new Date(m.nextDue) <= new Date("2026-06-20"))

  return (
    <>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard label="فرۆشی ئەمڕۆ" value={formatIQD(todaySales)} icon={TrendingUp} tone="positive" />
        <StatCard label="گەیاندنی ئەمڕۆ" value="٣ گەشت" icon={Truck} hint="٢ بەردەست، ١ لە گەشتدا" />
        <StatCard label="بارەکانی دەرهێنانی ئەمڕۆ" value="٢٤ بار" icon={Mountain} tone="warning" />
        <StatCard label="خەرجی ئەمڕۆ" value={formatIQD(450000)} icon={Receipt} tone="negative" />
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard label="کۆی داهات" value={formatIQD(264000000)} icon={TrendingUp} tone="positive" />
        <StatCard label="کۆی خەرجی" value={formatIQD(109000000)} icon={Receipt} tone="negative" />
        <StatCard label="قازانجی پاک" value={formatIQD(155000000)} icon={Wallet} tone="positive" hint="داهات ـ خەرجی" />
        <StatCard label="کۆی قەرزی کڕیاران" value={formatIQD(totalDebt)} icon={AlertTriangle} tone="warning" />
      </div>

      {dueMaint.length > 0 && (
        <Card className="mt-4 border-chart-4/40 bg-chart-4/10 p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 size-5 shrink-0 text-chart-4" />
            <div>
              <p className="text-sm font-bold text-foreground">ئاگادارکردنەوەی چاککردنەوە</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {dueMaint.map((m) => `${m.truck} (${m.type} ـ تا ${formatDate(m.nextDue)})`).join(" ، ")}
              </p>
            </div>
          </div>
        </Card>
      )}

      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        <SalesExpensesChart />
        <TopCustomersChart />
      </div>

      <div className="mt-3 grid gap-3 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card className="p-4">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-bold text-foreground">دوایین مامەڵەکان</h3>
              <a href="/sales" className="flex items-center gap-1 text-xs font-medium text-primary hover:underline">
                هەمووی <ArrowUpRight className="size-3.5" />
              </a>
            </div>
            <div className="flex flex-col divide-y divide-border">
              {recent.map((s) => (
                <div key={s.id} className="flex items-center justify-between gap-3 py-2.5">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">{s.customer}</p>
                    <p className="text-xs text-muted-foreground">
                      {s.invoiceNo} ـ {formatDate(s.date)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={s.paymentType === "نەقد" ? "secondary" : "outline"}>{s.paymentType}</Badge>
                    <span className="text-sm font-bold text-foreground">{formatIQD(saleTotal(s))}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
        <MaterialPieChart />
      </div>
    </>
  )
}
