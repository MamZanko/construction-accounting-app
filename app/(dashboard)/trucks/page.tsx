"use client"

import { useState } from "react"
import { Plus, Truck, CheckCircle2, Wrench, XCircle, Navigation, X } from "lucide-react"
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
import type { Truck as TruckType } from "@/lib/data"
import { useStore } from "@/lib/store"

const statusStyle: Record<string, string> = {
  بەردەست: "bg-chart-2/15 text-chart-2",
  "لە گەشتدا": "bg-chart-3/15 text-chart-3",
  "لە چاککردنەوەدا": "bg-chart-4/20 text-chart-4",
  "لە کاردا نییە": "bg-destructive/10 text-destructive",
}

type TruckForm = {
  name: string
  plate: string
  model: string
  capacity: string
  ownership: TruckType["ownership"]
  status: TruckType["status"]
  notes: string
}

const emptyForm: TruckForm = {
  name: "", plate: "", model: "", capacity: "",
  ownership: "خاوەن", status: "بەردەست", notes: "",
}

export default function TrucksPage() {
  const { trucks, addTruck } = useStore()
  const available = trucks.filter((t) => t.status === "بەردەست").length
  const onTrip = trucks.filter((t) => t.status === "لە گەشتدا").length
  const inMaint = trucks.filter((t) => t.status === "لە چاککردنەوەدا").length
  const offline = trucks.filter((t) => t.status === "لە کاردا نییە").length

  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<TruckForm>(emptyForm)
  const [error, setError] = useState("")

  function openAdd() {
    setForm(emptyForm)
    setError("")
    setOpen(true)
  }

  function handleSave() {
    if (!form.name.trim()) { setError("ناوی بارهەڵگر پێویستە"); return }
    const cap = Number(form.capacity)
    if (!cap || cap <= 0) { setError("توانای بارهەڵگر پێویستە"); return }
    addTruck({
      name: form.name.trim(),
      plate: form.plate.trim(),
      model: form.model.trim(),
      capacity: cap,
      ownership: form.ownership,
      status: form.status,
      notes: form.notes.trim(),
    })
    setOpen(false)
  }

  return (
    <>
      <PageHeader
        title="بەڕێوەبردنی بارهەڵگرەکان"
        description="دۆخی بارهەڵگرەکان، توانا و مێژووی گەیاندن"
        action={
          <Button onClick={openAdd}>
            <Plus className="size-4" />
            بارهەڵگری نوێ
          </Button>
        }
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard label="بەردەست" value={`${available} بارهەڵگر`} icon={CheckCircle2} tone="positive" />
        <StatCard label="لە گەشتدا" value={`${onTrip} بارهەڵگر`} icon={Navigation} />
        <StatCard label="لە چاککردنەوەدا" value={`${inMaint} بارهەڵگر`} icon={Wrench} tone="warning" />
        <StatCard label="لە کاردا نییە" value={`${offline} بارهەڵگر`} icon={XCircle} tone="negative" />
      </div>

      <h3 className="mb-3 mt-6 text-sm font-bold text-foreground">تابلۆی دۆخ</h3>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {trucks.map((t) => (
          <Card key={t.id} className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
                <Truck className="size-5 text-foreground" />
              </div>
              <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusStyle[t.status]}`}>
                {t.status}
              </span>
            </div>
            <h4 className="mt-3 font-bold text-foreground">{t.name}</h4>
            <p className="text-xs text-muted-foreground">{t.model}</p>
            <div className="mt-2 text-xs text-muted-foreground">
              <p>توانا: {t.capacity} مەتر</p>
              {t.plate && <p dir="ltr" className="text-right">پلێت: {t.plate}</p>}
            </div>
          </Card>
        ))}
      </div>

      <Card className="mt-6 overflow-hidden p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">ناو</TableHead>
                <TableHead className="text-right">مۆدێل</TableHead>
                <TableHead className="text-right">پلێت</TableHead>
                <TableHead className="text-right">توانا</TableHead>
                <TableHead className="text-right">خاوەندارێتی</TableHead>
                <TableHead className="text-right">دۆخ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {trucks.map((t) => (
                <TableRow key={t.id}>
                  <TableCell className="font-medium">{t.name}</TableCell>
                  <TableCell className="text-muted-foreground">{t.model}</TableCell>
                  <TableCell dir="ltr" className="text-right text-muted-foreground">{t.plate || "ـ"}</TableCell>
                  <TableCell>{t.capacity} مەتر</TableCell>
                  <TableCell><Badge variant="secondary">{t.ownership}</Badge></TableCell>
                  <TableCell>
                    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusStyle[t.status]}`}>
                      {t.status}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md" dir="rtl">
          <DialogHeader>
            <DialogTitle>بارهەڵگری نوێ زیادبکە</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>ناو *</Label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="بارهەڵگر ٦..." />
              </div>
              <div className="space-y-1.5">
                <Label>توانا (مەتر) *</Label>
                <Input type="number" min="0" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: e.target.value })} dir="ltr" className="text-right" placeholder="١٤" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>مۆدێل</Label>
                <Input value={form.model} onChange={(e) => setForm({ ...form, model: e.target.value })} placeholder="مرسيدس ٢٠٢٤..." />
              </div>
              <div className="space-y-1.5">
                <Label>پلێت</Label>
                <Input value={form.plate} onChange={(e) => setForm({ ...form, plate: e.target.value })} placeholder="هـ ١٢٣٤٥" dir="ltr" className="text-right" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>خاوەندارێتی</Label>
                <Select value={form.ownership} onValueChange={(v) => setForm({ ...form, ownership: v as TruckType["ownership"] })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="خاوەن">خاوەن</SelectItem>
                    <SelectItem value="کرێ">کرێ</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>دۆخ</Label>
                <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v as TruckType["status"] })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {(["بەردەست","لە گەشتدا","لە چاککردنەوەدا","لە کاردا نییە"] as const).map((s) => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>تێبینی</Label>
              <Textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={2} />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              <X className="size-4" /> داخستن
            </Button>
            <Button onClick={handleSave}>پاشەکەوتکردن</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
