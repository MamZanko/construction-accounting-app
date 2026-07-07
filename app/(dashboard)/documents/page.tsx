"use client"

import { PageHeader } from "@/components/ui-helpers"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { saleTotal } from "@/lib/data"
import { formatIQD, formatDate } from "@/lib/format"
import { FileText, Printer, Download, FileBarChart, Receipt, Users } from "lucide-react"
import { useStore } from "@/lib/store"

const templates = [
  { title: "پسوڵەی فرۆشتن", desc: "پسوڵەی تاکە فرۆشتن بۆ کڕیار", icon: Receipt },
  { title: "ڕاپۆرتی قەرز", desc: "لیستی قەرزی هەموو کڕیارەکان", icon: Users },
  { title: "ڕاپۆرتی مانگانە", desc: "کورتەی داهات و خەرجی مانگانە", icon: FileBarChart },
  { title: "لیستی مووچە", desc: "مووچەی کارمەند و شۆفێرەکان", icon: FileText },
]

export default function DocumentsPage() {
  const { sales, customers, employees, extractions, companyInfo, expenses } = useStore()

  function printDebtReport() {
    const debtors = customers.filter((c) => c.balance > 0)
    const win = window.open("", "_blank", "width=700,height=500")
    if (!win) return
    const rows = debtors.map((c) => `<tr><td>${c.name}</td><td dir="ltr">${c.phone}</td><td>${formatIQD(c.balance)}</td></tr>`).join("")
    const total = debtors.reduce((s, c) => s + c.balance, 0)
    win.document.write(`<html dir="rtl"><head><title>ڕاپۆرتی قەرز</title>
      <style>body{font-family:sans-serif;padding:24px;direction:rtl}h2{margin-bottom:4px}p{color:#666;margin-bottom:16px}
      table{width:100%;border-collapse:collapse}th,td{border:1px solid #ccc;padding:8px;text-align:right;font-size:13px}
      th{background:#f5f5f5}tfoot td{font-weight:bold;background:#f5f5f5}</style></head><body>
      <h2>ڕاپۆرتی قەرزی کڕیاران</h2><p>${companyInfo.name}</p>
      <table><thead><tr><th>کڕیار</th><th>مۆبایل</th><th>قەرز</th></tr></thead>
      <tbody>${rows}</tbody>
      <tfoot><tr><td colspan="2">کۆی گشتی</td><td>${formatIQD(total)}</td></tr></tfoot></table>
      <script>window.print();window.close();</script></body></html>`)
  }

  function printMonthlySummary() {
    const totalSales = sales.reduce((s, x) => s + saleTotal(x), 0)
    const totalExp = expenses.reduce((s, x) => s + x.amount, 0)
    const win = window.open("", "_blank", "width=700,height=400")
    if (!win) return
    win.document.write(`<html dir="rtl"><head><title>ڕاپۆرتی مانگانە</title>
      <style>body{font-family:sans-serif;padding:24px;direction:rtl}h2{margin-bottom:4px}p{color:#666}
      .row{display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #eee;font-size:14px}
      .total{font-weight:bold;font-size:16px}</style></head><body>
      <h2>ڕاپۆرتی کورتەی دارایی</h2><p>${companyInfo.name}</p>
      <div class="row"><span>کۆی فرۆش</span><span>${formatIQD(totalSales)}</span></div>
      <div class="row"><span>کۆی خەرجی</span><span>${formatIQD(totalExp)}</span></div>
      <div class="row total"><span>قازانجی پاک</span><span>${formatIQD(totalSales - totalExp)}</span></div>
      <script>window.print();window.close();</script></body></html>`)
  }

  function printSalaryList() {
    const rows = employees.map((e) => {
      if (e.salaryType === "بەپێی بار") {
        const loads = extractions.filter((x) => x.driver === e.name).reduce((s, x) => s + x.loads, 0)
        const pay = loads * e.ratePerLoad
        return `<tr><td>${e.name}</td><td>${e.role}</td><td>بەپێی بار</td><td>${loads} بار</td><td>${formatIQD(pay)}</td></tr>`
      }
      return `<tr><td>${e.name}</td><td>${e.role}</td><td>مانگانە</td><td>ـ</td><td>${formatIQD(e.monthlySalary)}</td></tr>`
    }).join("")
    const total = employees.reduce((s, e) => {
      if (e.salaryType === "بەپێی بار") {
        const loads = extractions.filter((x) => x.driver === e.name).reduce((a, x) => a + x.loads, 0)
        return s + loads * e.ratePerLoad
      }
      return s + e.monthlySalary
    }, 0)
    const win = window.open("", "_blank", "width=700,height=500")
    if (!win) return
    win.document.write(`<html dir="rtl"><head><title>لیستی مووچە</title>
      <style>body{font-family:sans-serif;padding:24px;direction:rtl}h2{margin-bottom:4px}p{color:#666;margin-bottom:16px}
      table{width:100%;border-collapse:collapse}th,td{border:1px solid #ccc;padding:8px;text-align:right;font-size:13px}
      th{background:#f5f5f5}tfoot td{font-weight:bold;background:#f5f5f5}</style></head><body>
      <h2>لیستی مووچەی مانگانە</h2><p>${companyInfo.name}</p>
      <table><thead><tr><th>ناو</th><th>پێگە</th><th>جۆر</th><th>بارەکان</th><th>مووچە</th></tr></thead>
      <tbody>${rows}</tbody>
      <tfoot><tr><td colspan="4">کۆی گشتی</td><td>${formatIQD(total)}</td></tr></tfoot></table>
      <script>window.print();window.close();</script></body></html>`)
  }

  function handleTemplate(title: string) {
    if (title === "ڕاپۆرتی قەرز") return printDebtReport()
    if (title === "ڕاپۆرتی مانگانە") return printMonthlySummary()
    if (title === "لیستی مووچە") return printSalaryList()
    // For single invoice template, print the latest sale
    if (sales.length > 0) printInvoice(sales[0].id)
  }

  function handleDownload(title: string) {
    // Same as print but user can save from the print dialog
    handleTemplate(title)
  }

  function printInvoice(saleId: number) {
    const s = sales.find((x) => x.id === saleId)
    if (!s) return
    const total = saleTotal(s)
    const remaining = total - s.paid
    const linesHtml = s.lines.map((l) => `
      <tr><td>${l.material}</td><td>${l.meters} مەتر</td><td>${formatIQD(l.pricePerMeter)}</td><td>${formatIQD(l.meters * l.pricePerMeter)}</td></tr>
    `).join("")
    const win = window.open("", "_blank", "width=700,height=600")
    if (!win) return
    win.document.write(`<html dir="rtl"><head><title>پسوڵە ${s.invoiceNo}</title>
      <style>body{font-family:sans-serif;padding:24px;direction:rtl}
      .header{display:flex;justify-content:space-between;margin-bottom:20px}
      h2{margin:0}p{margin:2px 0;color:#555;font-size:13px}
      table{width:100%;border-collapse:collapse;margin:16px 0}
      th,td{border:1px solid #ccc;padding:8px;text-align:right;font-size:13px}
      th{background:#f5f5f5}.totals{text-align:left;font-size:13px}
      .totals tr td:first-child{color:#666}.totals tr td:last-child{font-weight:bold}</style></head><body>
      <div class="header">
        <div><h2>${companyInfo.name}</h2><p>${companyInfo.address}</p><p>${companyInfo.phone}</p></div>
        <div style="text-align:left"><h3 style="margin:0">پسوڵە ${s.invoiceNo}</h3>
        <p>بەروار: ${formatDate(s.date)}</p><p>کڕیار: ${s.customer}</p></div>
      </div>
      <table><thead><tr><th>کەرەستە</th><th>مەتر</th><th>نرخ/مەتر</th><th>کۆ</th></tr></thead>
      <tbody>${linesHtml}</tbody></table>
      <table class="totals" style="width:280px;float:left">
        <tr><td>کۆی گشتی</td><td>${formatIQD(total)}</td></tr>
        <tr><td>دراوە</td><td>${formatIQD(s.paid)}</td></tr>
        <tr><td>ماوە</td><td>${formatIQD(remaining)}</td></tr>
      </table>
      <script>window.print();window.close();</script></body></html>`)
  }

  return (
    <>
      <PageHeader
        title="بەڵگەنامە و چاپکردن"
        description="دروستکردن و چاپکردنی پسوڵە و ڕاپۆرتەکان بە سەرپەڕەی کۆمپانیا"
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {templates.map((t) => (
          <Card key={t.title} className="flex flex-col gap-3 p-4">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <t.icon className="size-5" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">{t.title}</h3>
              <p className="mt-0.5 text-xs text-muted-foreground">{t.desc}</p>
            </div>
            <div className="mt-auto flex gap-2">
              <Button
                size="sm"
                variant="outline"
                className="flex-1 bg-transparent"
                onClick={() => handleTemplate(t.title)}
              >
                <Printer className="size-4" />
                چاپ
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleDownload(t.title)}
              >
                <Download className="size-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-5">
        <div className="mb-4 flex items-center justify-between border-b border-border pb-4">
          <div>
            <h3 className="text-base font-bold text-foreground">{companyInfo.name}</h3>
            <p className="text-xs text-muted-foreground">{companyInfo.address}</p>
            <p className="text-xs text-muted-foreground">{companyInfo.phone}</p>
          </div>
          <Badge variant="secondary">نموونەی پسوڵە</Badge>
        </div>

        <div className="space-y-3">
          <p className="text-sm font-semibold text-foreground">دوایین پسوڵەکان</p>
          {sales.slice(0, 4).map((s) => (
            <div
              key={s.id}
              className="flex items-center justify-between rounded-lg border border-border px-4 py-2.5"
            >
              <div className="flex items-center gap-3">
                <FileText className="size-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium text-foreground">{s.customer}</p>
                  <p className="text-xs text-muted-foreground">
                    {s.invoiceNo} ـ {formatDate(s.date)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-semibold text-foreground">{formatIQD(saleTotal(s))}</span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => printInvoice(s.id)}
                >
                  <Printer className="size-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </>
  )
}
