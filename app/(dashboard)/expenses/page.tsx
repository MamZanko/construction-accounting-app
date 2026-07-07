"use client"

import { useState } from "react"
import { PageHeader, StatCard } from "@/components/ui-helpers"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { expenseCategories } from "@/lib/data"
import { formatIQD, formatDate } from "@/lib/format"
import { Plus, Receipt, TrendingDown, Tag, X } from "lucide-react"
import { useStore } from "@/lib/store"

export default function ExpensesPage() {
  const { expenses, addExpense } = useStore()
  const total = expenses.reduce((s, e) => s + e.amount, 0)
  const todayDate = new Date().toISOString().slice(0, 10)
  const today = expenses.filter((e) => e.date === todayDate).reduce((s, e) => s + e.amount, 0)

  const [open, setOpen] = useState(false)
  const [description, setDescription] = useState("")
  const [amount, setAmount] = useState("")
  const [notes, setNotes] = useState("")
  const [date, setDate] = useState(todayDate)
  const [selectedCats, setSelectedCats] = useState<string[]>([])
  const [error, setError] = useState("")

  function openAdd() {
    setDescription("")
    setAmount("")
    setNotes("")
    setDate(todayDate)
    setSelectedCats([])
    setError("")
    setOpen(true)
  }

  function toggleCat(c: string) {
    setSelectedCats((prev) => prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c])
  }

  function handleSave() {
    if (!description.trim()) { setError("وردەکاری پێویستە"); return }
    const a = Number(amount)
    if (!a || a <= 0) { setError("بڕ پێویستە و باش بێت"); return }
    if (selectedCats.length === 0) { setError("لانیکەم یەک پۆل هەڵبژێرە"); return }
    addExpense({
      date,
      categories: selectedCats,
      amount: a,
      description: description.trim(),
      notes: notes.trim(),
    })
    setOpen(false)
  }

  return (
    <>
      <PageHeader
        title="خەرجی و مەسروفات"
        description="تۆمارکردنی هەموو خەرجییەکانی کۆمپانیا بە پۆلێنکراوی"
        action={
          <Button onClick={openAdd}>
            <Plus className="size-4" />
            خەرجی نوێ
          </Button>
        }
      />

      <div className="mb-5 grid grid-cols-2 gap-4 lg:grid-cols-3">
        <StatCard label="کۆی خەرجی" value={formatIQD(total)} icon={TrendingDown} tone="negative" />
        <StatCard label="خەرجی ئەمڕۆ" value={formatIQD(today)} icon={Receipt} tone="warning" />
        <StatCard label="ژمارەی پۆلەکان" value={String(expenseCategories.length)} icon={Tag} />
      </div>

      <div className="mb-5 flex flex-wrap gap-2">
        {expenseCategories.map((c) => (
          <Badge key={c} variant="secondary" className="font-normal">{c}</Badge>
        ))}
      </div>

      <Card className="overflow-hidden p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-right">بەروار</TableHead>
              <TableHead className="text-right">وردەکاری</TableHead>
              <TableHead className="text-right">پۆلەکان</TableHead>
              <TableHead className="text-right">بڕ</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {expenses.map((e) => (
              <TableRow key={e.id}>
                <TableCell className="whitespace-nowrap text-muted-foreground">{formatDate(e.date)}</TableCell>
                <TableCell className="font-medium">{e.description}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {e.categories.map((c) => (
                      <Badge key={c} variant="outline" className="font-normal">{c}</Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell className="font-semibold text-destructive">{formatIQD(e.amount)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md" dir="rtl">
          <DialogHeader>
            <DialogTitle>خەرجی نوێ تۆمارکردن</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>وردەکاری *</Label>
              <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="وردەکاری خەرجی..." />
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
              <Label>پۆلەکان *</Label>
              <div className="flex flex-wrap gap-2">
                {expenseCategories.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => toggleCat(c)}
                    className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                      selectedCats.includes(c)
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-transparent text-foreground hover:bg-muted"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>تێبینی</Label>
              <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}><X className="size-4" /> داخستن</Button>
            <Button onClick={handleSave}>تۆمارکردن</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
