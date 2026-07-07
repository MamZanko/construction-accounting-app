"use client"

import { useState } from "react"
import { Plus, Wrench, AlertTriangle, CircleDollarSign, X } from "lucide-react"
import { PageHeader, StatCard } from "@/components/ui-helpers"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
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
import type { Maintenance } from "@/lib/data"
import { formatIQD, formatDate } from "@/lib/format"
import { useStore } from "@/lib/store"

const today = new Date().toISOString().slice(0, 10)
const near = new Date()
near.setDate(near.getDate() + 14)
const nearDate = near.toISOString().slice(0, 10)

export default function MaintenancePage() {
  const { maintenances, trucks, addMaintenance } = useStore()
  const totalCost = maintenances.reduce((a, m) => a + m.cost, 0)
  const due = maintenances.filter((m) => m.nextDue && m.nextDue <= nearDate)

  const [open, setOpen] = useState(false)
  const [truckName, setTruckName] = useState("")
  const [type, setType] = useState<Maintenance["type"]>("گۆڕینی زەیت")
  const [cost, setCost] = useState("")
  const [date, setDate] = useState(today)
  const [nextDue, setNextDue] = useState("")
  const [mechanic, setMechanic] = useState("")
  const [description, setDescription] = useState("")
  const [error, setError] = useState("")

  function openAdd() {
    setTruckName("")
    setType("گۆڕینی زەیت")
    setCost("")
    setDate(today)
    setNextDue("")
    setMechanic("")
    setDescription("")
    setError("")
    setOpen(true)
  }

  function handleSave() {
    if (!truckName) { setError("بارهەڵگر هەڵبژێرە"); return }
    const c = Number(cost)
    if (!c || c <= 0) { setError("تێچوو پێویستە و باش بێت"); return }
    addMaintenance({
      truck: truckName,
      type,
      cost: c,
      date,
      nextDue: nextDue.trim(),
      mechanic: mechanic.trim(),
      description: description.trim(),
    })
    setOpen(false)
  }

  return (
    <>
      <PageHeader
        title="چاککردنەوەی بارهەڵگر"
        description="تۆماری چاککردنەوە، تێچوو و بیرخستنەوەی چاککردنەوەی داهاتوو"
        action={
          <Button onClick={openAdd}>
            <Plus className="size-4" />
            تۆماری چاککردنەوە
          </Button>
        }
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        <StatCard label="کۆی تێچووی چاککردنەوە" value={formatIQD(totalCost)} icon={CircleDollarSign} tone="negative" />
        <StatCard label="ژمارەی تۆمار" value={`${maintenances.length} تۆمار`} icon={Wrench} />
        <StatCard label="چاککردنەوەی نزیک" value={`${due.length} بیرخستنەوە`} icon={AlertTriangle} tone="warning" />
      </div>

      {due.length > 0 && (
        <Card className="mt-4 border-chart-4/40 bg-chart-4/10 p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 size-5 shrink-0 text-chart-4" />
            <div>
              <p className="text-sm font-bold text-foreground">بیرخستنەوەی چاککردنەوەی نزیک</p>
              <ul className="mt-1 list-inside list-disc text-sm text-muted-foreground">
                {due.map((m) => (
                  <li key={m.id}>
                    {m.truck} ـ {m.type} ـ تاریخی داهاتوو: {formatDate(m.nextDue)}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Card>
      )}

      <Card className="mt-4 overflow-hidden p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">بارهەڵگر</TableHead>
                <TableHead className="text-right">جۆر</TableHead>
                <TableHead className="text-right">تێچوو</TableHead>
                <TableHead className="text-right">بەروار</TableHead>
                <TableHead className="text-right">داهاتوو</TableHead>
                <TableHead className="text-right">مەکانیک</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {maintenances.map((m) => (
                <TableRow key={m.id}>
                  <TableCell className="font-medium">{m.truck}</TableCell>
                  <TableCell><Badge variant="secondary">{m.type}</Badge></TableCell>
                  <TableCell className="font-bold">{formatIQD(m.cost)}</TableCell>
                  <TableCell className="text-muted-foreground">{formatDate(m.date)}</TableCell>
                  <TableCell className="text-muted-foreground">{m.nextDue ? formatDate(m.nextDue) : "ـ"}</TableCell>
                  <TableCell className="text-muted-foreground">{m.mechanic}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md" dir="rtl">
          <DialogHeader>
            <DialogTitle>تۆماری چاککردنەوەی نوێ</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>بارهەڵگر *</Label>
              <Select value={truckName} onValueChange={setTruckName}>
                <SelectTrigger><SelectValue placeholder="بارهەڵگر هەڵبژێرە..." /></SelectTrigger>
                <SelectContent>
                  {trucks.map((t) => (
                    <SelectItem key={t.id} value={t.name}>{t.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>جۆری چاککردنەوە</Label>
              <Select value={type} onValueChange={(v) => setType(v as Maintenance["type"])}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {(["گۆڕینی زەیت","گۆڕینی تایە","چاککردنەوەی بزوێنەر","خزمەتی فڕین","ئەوانیتر"] as const).map((t) => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>تێچوو (د.ع) *</Label>
                <Input type="number" min="0" value={cost} onChange={(e) => setCost(e.target.value)} dir="ltr" className="text-right" placeholder="٠" />
              </div>
              <div className="space-y-1.5">
                <Label>بەروار</Label>
                <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} dir="ltr" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>بەرواری داهاتوو</Label>
                <Input type="date" value={nextDue} onChange={(e) => setNextDue(e.target.value)} dir="ltr" />
              </div>
              <div className="space-y-1.5">
                <Label>مەکانیک</Label>
                <Input value={mechanic} onChange={(e) => setMechanic(e.target.value)} placeholder="ناوی مەکانیک..." />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>وردەکاری</Label>
              <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} />
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
