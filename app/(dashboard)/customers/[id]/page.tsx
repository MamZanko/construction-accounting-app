"use client"

import { use, useState } from "react"
import Link from "next/link"
import { ArrowRight, Phone, MapPin, Building2, Printer, Wallet, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { saleTotal } from "@/lib/data"
import { formatIQD, formatDate } from "@/lib/format"
import { useStore } from "@/lib/store"

export default function CustomerProfile({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { customers, sales, payments, addPayment, companyInfo } = useStore()

  const customer = customers.find((c) => c.id === Number(id))

  const [open, setOpen] = useState(false)
  const [amount, setAmount] = useState("")
  const [notes, setNotes] = useState("")
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))
  const [error, setError] = useState("")

  if (!customer) {
    return (
      <div className="py-20 text-center text-muted-foreground">
        <p>کڕیار نەدۆزرایەوە</p>
        <Link href="/customers" className="mt-4 inline-flex items-center gap-1 text-sm text-primary hover:underline">
          <ArrowRight className="size-4" /> گەڕانەوە
        </Link>
      </div>
    )
  }

  const custSales = sales.filter((s) => s.customer === customer.name)
  const custPayments = payments.filter((p) => p.customer === customer.name)

  function openPayment() {
    setAmount("")
    setNotes("")
    setDate(new Date().toISOString().slice(0, 10))
    setError("")
    setOpen(true)
  }

  function handleSavePayment() {
    const a = Number(amount)
    if (!a || a <= 0) { setError("بڕی پارەدان پێویستە"); return }
    if (!customer) return
    addPayment({ date, customer: customer.name, amount: a, notes: notes.trim() })
    setOpen(false)
  }

  function handlePrintLedger() {
    if (!customer) return
    const win = window.open("", "_blank", "width=700,height=600")
    if (!win) return
    const rows = [
      ...custSales.map((s) => ({ date: s.date, type: "فرۆش", debit: saleTotal(s) - s.paid, credit: 0, ref: s.invoiceNo })),
      ...custPayments.map((p) => ({ date: p.date, type: "پارەدان", debit: 0, credit: p.amount, ref: "وەسڵ" })),
    ].sort((a, b) => a.date.localeCompare(b.date))
    let running = 0
    const html = rows.map((r) => {
      running += r.debit - r.credit
      return `<tr><td>${formatDate(r.date)}</td><td>${r.type}</td><td>${r.ref}</td><td>${r.debit > 0 ? formatIQD(r.debit) : "ـ"}</td><td>${r.credit > 0 ? formatIQD(r.credit) : "ـ"}</td><td>${formatIQD(running)}</td></tr>`
    }).join("")
    win.document.write(`<html dir="rtl"><head><title>کەشف حساب ـ ${customer.name}</title>
      <style>body{font-family:sans-serif;padding:24px;direction:rtl}h2{margin-bottom:4px}p{color:#666;margin-bottom:16px}
      table{width:100%;border-collapse:collapse}th,td{border:1px solid #ccc;padding:8px;text-align:right;font-size:13px}
      th{background:#f5f5f5}</style></head><body>
      <h2>کەشف حساب ـ ${customer.name}</h2><p>${companyInfo.name}</p>
      <table><thead><tr><th>بەروار</th><th>جۆر</th><th>ژمارە</th><th>قەرز</th><th>پارەدان</th><th>باڵانس</th></tr></thead>
      <tbody>${html}</tbody></table>
      <script>window.print();window.close();</script></body></html>`)
  }

  // Build ledger
  type Row = { date: string; type: string; debit: number; credit: number; ref: string }
  const rows: Row[] = [
    ...custSales.map((s) => ({ date: s.date, type: "فرۆش", debit: saleTotal(s) - s.paid, credit: 0, ref: s.invoiceNo })),
    ...custPayments.map((p) => ({ date: p.date, type: "پارەدان", debit: 0, credit: p.amount, ref: "وەسڵ" })),
  ].sort((a, b) => a.date.localeCompare(b.date))
  let running = 0
  const ledger = rows.map((r) => {
    running += r.debit - r.credit
    return { ...r, balance: running }
  })

  return (
    <>
      <Link href="/customers" className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowRight className="size-4" />
        گەڕانەوە بۆ کڕیاران
      </Link>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="p-5 lg:col-span-1">
          <div className="flex items-center gap-3">
            <div className="flex size-14 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
              {customer.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">{customer.name}</h2>
              <Badge variant={customer.type === "کۆمپانیا" ? "default" : "secondary"}>{customer.type}</Badge>
            </div>
          </div>

          <div className="mt-5 flex flex-col gap-3 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Phone className="size-4" /> <span dir="ltr">{customer.phone}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="size-4" /> {customer.address}
            </div>
            {customer.company && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Building2 className="size-4" /> {customer.company}
              </div>
            )}
          </div>

          <div className="mt-5 rounded-lg bg-muted p-4">
            <p className="text-xs text-muted-foreground">باڵانسی ئێستا</p>
            <p className={`mt-1 text-2xl font-bold ${customer.balance > 0 ? "text-destructive" : "text-chart-2"}`}>
              {formatIQD(customer.balance)}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">{customer.balance > 0 ? "قەرزدارە" : "بێ قەرز"}</p>
          </div>

          <div className="mt-4 flex gap-2">
            <Button className="flex-1" onClick={openPayment}>
              <Wallet className="size-4" />
              تۆمارکردنی پارەدان
            </Button>
            <Button variant="outline" onClick={handlePrintLedger}>
              <Printer className="size-4" />
            </Button>
          </div>
          {customer.notes && <p className="mt-4 text-sm text-muted-foreground">تێبینی: {customer.notes}</p>}
        </Card>

        <Card className="overflow-hidden p-0 lg:col-span-2">
          <div className="border-b border-border px-4 py-3">
            <h3 className="text-sm font-bold text-foreground">کەشف حساب (مامەڵە و باڵانس)</h3>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">بەروار</TableHead>
                  <TableHead className="text-right">جۆر</TableHead>
                  <TableHead className="text-right">ژمارە</TableHead>
                  <TableHead className="text-right">قەرز</TableHead>
                  <TableHead className="text-right">پارەدان</TableHead>
                  <TableHead className="text-right">باڵانس</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ledger.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="py-8 text-center text-muted-foreground">
                      هیچ مامەڵەیەک نییە
                    </TableCell>
                  </TableRow>
                ) : (
                  ledger.map((r, i) => (
                    <TableRow key={i}>
                      <TableCell className="text-muted-foreground">{formatDate(r.date)}</TableCell>
                      <TableCell>
                        <Badge variant={r.type === "فرۆش" ? "outline" : "secondary"}>{r.type}</Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{r.ref}</TableCell>
                      <TableCell>{r.debit > 0 ? formatIQD(r.debit) : "ـ"}</TableCell>
                      <TableCell className="text-chart-2">{r.credit > 0 ? formatIQD(r.credit) : "ـ"}</TableCell>
                      <TableCell className="font-bold">{formatIQD(r.balance)}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md" dir="rtl">
          <DialogHeader>
            <DialogTitle>تۆمارکردنی پارەدان ـ {customer.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>بڕ (د.ع) *</Label>
                <Input
                  type="number" min="0"
                  value={amount} onChange={(e) => setAmount(e.target.value)}
                  dir="ltr" className="text-right" placeholder="٠"
                />
              </div>
              <div className="space-y-1.5">
                <Label>بەروار</Label>
                <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} dir="ltr" />
              </div>
            </div>
            {customer.balance > 0 && (
              <div className="rounded-lg bg-muted p-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">قەرزی ماوە</span>
                  <span className="font-bold text-destructive">{formatIQD(customer.balance)}</span>
                </div>
                {amount && Number(amount) > 0 && (
                  <div className="flex justify-between border-t border-border pt-1 mt-1">
                    <span className="text-muted-foreground">پاش پارەدان</span>
                    <span className="font-bold">{formatIQD(Math.max(0, customer.balance - Number(amount)))}</span>
                  </div>
                )}
              </div>
            )}
            <div className="space-y-1.5">
              <Label>تێبینی</Label>
              <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              <X className="size-4" /> داخستن
            </Button>
            <Button onClick={handleSavePayment}>تۆمارکردن</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
