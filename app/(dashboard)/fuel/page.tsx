"use client"

import { useState } from "react"
import { Plus, Fuel, Droplet, Calendar, X } from "lucide-react"
import { PageHeader, StatCard } from "@/components/ui-helpers"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
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
import { formatIQD, formatNum, formatDate } from "@/lib/format"
import { useStore } from "@/lib/store"

export default function FuelPage() {
  const { fuelLogs, addFuelLog } = useStore()
  const totalCost = fuelLogs.reduce((a, f) => a + f.cost, 0)
  const totalLiters = fuelLogs.reduce((a, f) => a + f.liters, 0)

  const today = new Date().toISOString().slice(0, 10)
  const [open, setOpen] = useState(false)
  const [liters, setLiters] = useState("")
  const [cost, setCost] = useState("")
  const [notes, setNotes] = useState("")
  const [date, setDate] = useState(today)
  const [error, setError] = useState("")

  function openAdd() {
    setLiters("")
    setCost("")
    setNotes("")
    setDate(today)
    setError("")
    setOpen(true)
  }

  function handleSave() {
    const l = Number(liters)
    const c = Number(cost)
    if (!l || l <= 0) { setError("ژمارەی لیتر پێویستە"); return }
    if (!c || c <= 0) { setError("تێچووی گشتی پێویستە"); return }
    addFuelLog({ date, liters: l, cost: c, notes: notes.trim() })
    setOpen(false)
  }

  return (
    <>
      <PageHeader
        title="بەڕێوەبردنی سووتەمەنی"
        description="تۆماری یەکگرتووی سووتەمەنی بۆ هەموو بارهەڵگر و ئامێرەکان"
        action={
          <Button onClick={openAdd}>
            <Plus className="size-4" />
            تۆماری سووتەمەنی
          </Button>
        }
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        <StatCard label="کۆی تێچوو" value={formatIQD(totalCost)} icon={Fuel} tone="negative" />
        <StatCard label="کۆی لیتر" value={`${formatNum(totalLiters)} لیتر`} icon={Droplet} />
        <StatCard label="ژمارەی تۆمار" value={`${fuelLogs.length} تۆمار`} icon={Calendar} />
      </div>

      <Card className="mt-4 overflow-hidden p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">بەروار</TableHead>
                <TableHead className="text-right">بڕ (لیتر)</TableHead>
                <TableHead className="text-right">تێچووی گشتی</TableHead>
                <TableHead className="text-right">نرخی لیتر</TableHead>
                <TableHead className="text-right">تێبینی</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fuelLogs.map((f) => (
                <TableRow key={f.id}>
                  <TableCell className="text-muted-foreground">{formatDate(f.date)}</TableCell>
                  <TableCell>{formatNum(f.liters)} لیتر</TableCell>
                  <TableCell className="font-bold">{formatIQD(f.cost)}</TableCell>
                  <TableCell className="text-muted-foreground">{formatIQD(f.cost / f.liters)}</TableCell>
                  <TableCell className="text-muted-foreground">{f.notes || "ـ"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md" dir="rtl">
          <DialogHeader>
            <DialogTitle>تۆماری سووتەمەنی نوێ</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>بڕ (لیتر) *</Label>
                <Input type="number" min="0" value={liters} onChange={(e) => setLiters(e.target.value)} dir="ltr" className="text-right" placeholder="٠" />
              </div>
              <div className="space-y-1.5">
                <Label>تێچووی گشتی (د.ع) *</Label>
                <Input type="number" min="0" value={cost} onChange={(e) => setCost(e.target.value)} dir="ltr" className="text-right" placeholder="٠" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>بەروار</Label>
              <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} dir="ltr" />
            </div>
            {liters && cost && Number(liters) > 0 && Number(cost) > 0 && (
              <div className="rounded-lg bg-muted p-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">نرخی هەر لیترێک</span>
                  <span className="font-bold">{formatIQD(Number(cost) / Number(liters))}</span>
                </div>
              </div>
            )}
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
