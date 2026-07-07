"use client"

import { useState } from "react"
import { Plus, HandCoins, Wallet, AlertTriangle, Printer, X } from "lucide-react"
import { PageHeader, StatCard } from "@/components/ui-helpers"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatIQD, formatDate } from "@/lib/format"
import { useStore } from "@/lib/store"

export default function PaymentsPage() {
  const { payments, customers, addPayment } = useStore()
  const totalPaid = payments.reduce((a, p) => a + p.amount, 0)
  const totalDebt = customers.reduce((a, c) => a + c.balance, 0)
  const debtors = customers.filter((c) => c.balance > 0)

  const [open, setOpen] = useState(false)
  const [customer, setCustomer] = useState("")
  const [amount, setAmount] = useState("")
  const [notes, setNotes] = useState("")
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))
  const [error, setError] = useState("")

  function openAdd() {
    setCustomer("")
    setAmount("")
    setNotes("")
    setDate(new Date().toISOString().slice(0, 10))
    setError("")
    setOpen(true)
  }

  function handlePrintReceipt(id: number) {
    const p = payments.find((x) => x.id === id)
    if (!p) return
    const win = window.open("", "_blank", "width=600,height=400")
    if (!win) return
    win.document.write(`
      <html dir="rtl"><head><title>وەسڵ</title>
      <style>body{font-family:sans-serif;padding:20px;direction:rtl}h2{margin-bottom:8px}p{margin:4px 0}hr{margin:12px 0}</style>
      </head><body>
      <h2>وەسڵی پارەدان</h2><hr/>
      <p><b>کڕیار:</b> ${p.customer}</p>
      <p><b>بەروار:</b> ${formatDate(p.date)}</p>
      <p><b>بڕ:</b> ${formatIQD(p.amount)}</p>
      ${p.notes ? `<p><b>تێبینی:</b> ${p.notes}</p>` : ""}
      <hr/><p style="font-size:11px;color:#888">مەعمەل قەندیل</p>
      <script>window.print();window.close();</script>
      </body></html>
    `)
  }

  function handleSave() {
    if (!customer) { setError("کڕیار هەڵبژێرە"); return }
    const a = Number(amount)
    if (!a || a <= 0) { setError("بڕی پارەدان پێویستە و باش بێت"); return }
    addPayment({ date, customer, amount: a, notes: notes.trim() })
    setOpen(false)
  }

  return (
    <>
      <PageHeader
        title="پارەدان و قەرز"
        description="تۆمارکردنی پارەدانی کڕیاران و بەدواداچوونی قەرزەکان"
        action={
          <Button onClick={openAdd}>
            <Plus className="size-4" />
            تۆمارکردنی پارەدان
          </Button>
        }
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        <StatCard label="کۆی پارەدان" value={formatIQD(totalPaid)} icon={HandCoins} tone="positive" />
        <StatCard label="کۆی قەرزی ماوە" value={formatIQD(totalDebt)} icon={Wallet} tone="negative" />
        <StatCard label="کڕیاری قەرزدار" value={`${debtors.length} کڕیار`} icon={AlertTriangle} tone="warning" />
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        <Card className="overflow-hidden p-0">
          <div className="border-b border-border px-4 py-3">
            <h3 className="text-sm font-bold text-foreground">دوایین پارەدانەکان</h3>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">بەروار</TableHead>
                  <TableHead className="text-right">کڕیار</TableHead>
                  <TableHead className="text-right">بڕ</TableHead>
                  <TableHead className="text-right"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="text-muted-foreground">{formatDate(p.date)}</TableCell>
                    <TableCell className="font-medium">{p.customer}</TableCell>
                    <TableCell className="font-bold text-chart-2">{formatIQD(p.amount)}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label="چاپکردنی وەسڵ"
                        onClick={() => handlePrintReceipt(p.id)}
                      >
                        <Printer className="size-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>

        <Card className="overflow-hidden p-0">
          <div className="border-b border-border px-4 py-3">
            <h3 className="text-sm font-bold text-foreground">ڕاپۆرتی قەرزی نەدراو</h3>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">کڕیار</TableHead>
                  <TableHead className="text-right">مۆبایل</TableHead>
                  <TableHead className="text-right">قەرز</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {debtors.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell className="font-medium">{c.name}</TableCell>
                    <TableCell dir="ltr" className="text-right text-muted-foreground">{c.phone}</TableCell>
                    <TableCell className="font-bold text-destructive">{formatIQD(c.balance)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md" dir="rtl">
          <DialogHeader>
            <DialogTitle>تۆمارکردنی پارەدانی نوێ</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>کڕیار *</Label>
              <Select value={customer} onValueChange={setCustomer}>
                <SelectTrigger><SelectValue placeholder="کڕیار هەڵبژێرە..." /></SelectTrigger>
                <SelectContent>
                  {customers.map((c) => (
                    <SelectItem key={c.id} value={c.name}>
                      {c.name}{c.balance > 0 ? ` (قەرز: ${formatIQD(c.balance)})` : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>بڕ (د.ع) *</Label>
                <Input type="number" min="0" value={amount} onChange={(e) => setAmount(e.target.value)} dir="ltr" className="text-right" placeholder="٠" />
              </div>
              <div className="space-y-1.5">
                <Label>بەروار</Label>
                <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} dir="ltr" />
              </div>
            </div>
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
            <Button onClick={handleSave}>تۆمارکردن</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
