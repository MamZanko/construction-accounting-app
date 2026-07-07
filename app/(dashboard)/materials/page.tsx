"use client"

import { useState } from "react"
import { Plus, Package, Pencil, History, X } from "lucide-react"
import { PageHeader, StatCard } from "@/components/ui-helpers"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
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
import type { Material } from "@/lib/data"
import { formatIQD, formatDate } from "@/lib/format"
import { useStore } from "@/lib/store"

type MaterialForm = {
  name: string
  unit: string
  pricePerMeter: string
  notes: string
}

const emptyForm: MaterialForm = { name: "", unit: "بار", pricePerMeter: "", notes: "" }

export default function MaterialsPage() {
  const { materials, addMaterial, updateMaterial } = useStore()
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Material | null>(null)
  const [form, setForm] = useState<MaterialForm>(emptyForm)
  const [error, setError] = useState("")

  function openAdd() {
    setEditing(null)
    setForm(emptyForm)
    setError("")
    setOpen(true)
  }

  function openEdit(m: Material) {
    setEditing(m)
    setForm({ name: m.name, unit: m.unit, pricePerMeter: String(m.pricePerMeter), notes: m.notes })
    setError("")
    setOpen(true)
  }

  function handleSave() {
    if (!form.name.trim()) { setError("ناوی کەرەستە پێویستە"); return }
    const price = Number(form.pricePerMeter)
    if (!price || price <= 0) { setError("نرخ پێویستە و باش بێت"); return }

    if (editing) {
      updateMaterial({
        ...editing,
        name: form.name.trim(),
        unit: form.unit.trim() || "بار",
        pricePerMeter: price,
        notes: form.notes.trim(),
        priceHistory: editing.priceHistory[editing.priceHistory.length - 1]?.price !== price
          ? [...editing.priceHistory, { price, date: new Date().toISOString().slice(0, 10) }]
          : editing.priceHistory,
      })
    } else {
      addMaterial({
        name: form.name.trim(),
        unit: form.unit.trim() || "بار",
        pricePerMeter: price,
        notes: form.notes.trim(),
        priceHistory: [{ price, date: new Date().toISOString().slice(0, 10) }],
      })
    }
    setOpen(false)
  }

  return (
    <>
      <PageHeader
        title="بەڕێوەبردنی کەرەستەکان"
        description="نرخی مەتری، مێژووی نرخ و زانیاری کەرەستەکان"
        action={
          <Button onClick={openAdd}>
            <Plus className="size-4" />
            کەرەستەی نوێ
          </Button>
        }
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        <StatCard label="ژمارەی کەرەستەکان" value={`${materials.length} جۆر`} icon={Package} />
        <StatCard label="بەرزترین نرخ" value={formatIQD(Math.max(...materials.map((m) => m.pricePerMeter)))} icon={Package} tone="positive" />
        <StatCard label="نزمترین نرخ" value={formatIQD(Math.min(...materials.map((m) => m.pricePerMeter)))} icon={Package} />
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {materials.map((m) => (
          <Card key={m.id} className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-bold text-foreground">{m.name}</h3>
                <p className="text-xs text-muted-foreground">یەکە: {m.unit}</p>
              </div>
              <Button variant="ghost" size="icon" aria-label="دەستکاری" onClick={() => openEdit(m)}>
                <Pencil className="size-4" />
              </Button>
            </div>

            <div className="mt-3 rounded-lg bg-muted p-3">
              <p className="text-xs text-muted-foreground">نرخی هەر مەترێک</p>
              <p className="text-xl font-bold text-primary">{formatIQD(m.pricePerMeter)}</p>
            </div>

            <div className="mt-3">
              <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                <History className="size-3.5" /> مێژووی نرخ
              </div>
              <div className="flex flex-col gap-1.5">
                {m.priceHistory.map((p, i) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{formatDate(p.date)}</span>
                    <span className="font-medium">{formatIQD(p.price)}</span>
                    {i === m.priceHistory.length - 1 && <Badge variant="secondary">ئێستا</Badge>}
                  </div>
                ))}
              </div>
            </div>
            {m.notes && <p className="mt-3 text-xs text-muted-foreground">تێبینی: {m.notes}</p>}
          </Card>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md" dir="rtl">
          <DialogHeader>
            <DialogTitle>{editing ? `دەستکاری: ${editing.name}` : "کەرەستەی نوێ زیادبکە"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>ناوی کەرەستە *</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="ناوی کەرەستە..." />
            </div>
            <div className="space-y-1.5">
              <Label>یەکە</Label>
              <Input value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} placeholder="بار" />
            </div>
            <div className="space-y-1.5">
              <Label>نرخی هەر مەترێک (د.ع) *</Label>
              <Input
                type="number"
                min="0"
                value={form.pricePerMeter}
                onChange={(e) => setForm({ ...form, pricePerMeter: e.target.value })}
                placeholder="٠"
                dir="ltr"
                className="text-right"
              />
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
