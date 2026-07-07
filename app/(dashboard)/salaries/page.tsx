"use client"

import { PageHeader, StatCard } from "@/components/ui-helpers"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatIQD, formatNum, formatDate } from "@/lib/format"
import { Wallet, Calculator, Users, Printer } from "lucide-react"
import { useStore } from "@/lib/store"

export default function SalariesPage() {
  const { employees, extractions } = useStore()

  const rows = employees.map((e) => {
    if (e.salaryType === "بەپێی بار") {
      const loads = extractions.filter((x) => x.driver === e.name).reduce((s, x) => s + x.loads, 0)
      return { ...e, loads, due: loads * e.ratePerLoad }
    }
    return { ...e, loads: 0, due: e.monthlySalary }
  })

  const totalDue = rows.reduce((s, r) => s + r.due, 0)
  const driverCount = employees.filter((e) => e.role === "شۆفێر").length
  const printDate = new Date().toLocaleDateString("en-US")

  function handlePrintSalaryList() {
    const win = window.open("", "_blank", "width=800,height=600")
    if (!win) return
    const rowsHtml = rows.map((r) => `
      <tr>
        <td>${r.name}</td>
        <td>${r.role}</td>
        <td>${r.salaryType}</td>
        <td>${r.salaryType === "بەپێی بار" ? formatNum(r.loads) + " بار" : "ـ"}</td>
        <td>${r.salaryType === "بەپێی بار" ? formatNum(r.ratePerLoad) + " / بار" : "مانگانە"}</td>
        <td><b>${formatIQD(r.due)}</b></td>
      </tr>
    `).join("")
    win.document.write(`
      <html dir="rtl"><head><title>لیستی مووچە</title>
      <style>
        body{font-family:sans-serif;padding:24px;direction:rtl}
        h2{margin-bottom:4px}p{margin:2px 0 16px;color:#666}
        table{width:100%;border-collapse:collapse}
        th,td{border:1px solid #ccc;padding:8px;text-align:right;font-size:13px}
        th{background:#f5f5f5;font-weight:600}
        tfoot td{font-weight:bold;background:#f5f5f5}
      </style></head><body>
      <h2>لیستی مووچەی مانگانە</h2>
      <p>بەروار: ${printDate}</p>
      <table>
        <thead><tr><th>ناو</th><th>پێگە</th><th>جۆر</th><th>بارەکان</th><th>نرخ</th><th>بڕی مووچە</th></tr></thead>
        <tbody>${rowsHtml}</tbody>
        <tfoot><tr><td colspan="5">کۆی گشتی</td><td>${formatIQD(totalDue)}</td></tr></tfoot>
      </table>
      <script>window.print();window.close();</script>
      </body></html>
    `)
  }

  return (
    <>
      <PageHeader
        title="مووچە و حیسابی کار"
        description="حیسابکردنی مووچەی مانگانە و کرێی بار بۆ شۆفێرەکان"
        action={
          <Button variant="outline" onClick={handlePrintSalaryList}>
            <Printer className="size-4" />
            چاپی لیستی مووچە
          </Button>
        }
      />

      <div className="mb-5 grid grid-cols-2 gap-4 lg:grid-cols-3">
        <StatCard label="کۆی مووچەی ئەم مانگە" value={formatIQD(totalDue)} icon={Wallet} tone="negative" />
        <StatCard label="ژمارەی کارمەند" value={String(employees.length)} icon={Users} />
        <StatCard label="شۆفێری بەپێی بار" value={String(driverCount)} icon={Calculator} tone="warning" />
      </div>

      <Card className="overflow-hidden p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-right">ناو</TableHead>
              <TableHead className="text-right">پێگە</TableHead>
              <TableHead className="text-right">جۆری مووچە</TableHead>
              <TableHead className="text-right">بارەکان</TableHead>
              <TableHead className="text-right">نرخ</TableHead>
              <TableHead className="text-right">بڕی مووچە</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((r) => (
              <TableRow key={r.id}>
                <TableCell className="font-medium">{r.name}</TableCell>
                <TableCell>
                  <Badge variant="secondary" className="font-normal">{r.role}</Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">{r.salaryType}</TableCell>
                <TableCell>{r.salaryType === "بەپێی بار" ? formatNum(r.loads) : "ـ"}</TableCell>
                <TableCell className="text-muted-foreground">
                  {r.salaryType === "بەپێی بار" ? `${formatNum(r.ratePerLoad)} / بار` : "مانگانە"}
                </TableCell>
                <TableCell className="font-semibold text-foreground">{formatIQD(r.due)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </>
  )
}
