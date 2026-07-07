"use client"

import { useState } from "react"
import { Plus, Mountain, Layers, Truck, X } from "lucide-react"
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
import { formatDate } from "@/lib/format"
import { useStore } from "@/lib/store"

export default function ExtractionPage() {
  const { extractions, processings, employees, addExtraction, addProcessing } = useStore()
  const totalLoads = extractions.reduce((a, e) => a + e.loads, 0)
  const todayDate = new Date().toISOString().slice(0, 10)
  const todayLoads = extractions.filter((e) => e.date === todayDate).reduce((a, e) => a + e.loads, 0)

  // Extraction dialog
  const [exOpen, setExOpen] = useState(false)
  const [exDriver, setExDriver] = useState<string | null>(null)
  const [exLoads, setExLoads] = useState("")
  const [exDate, setExDate] = useState(todayDate)
  const [exNotes, setExNotes] = useState("")
  const [exError, setExError] = useState("")

  // Processing dialog
  const [prOpen, setPrOpen] = useState(false)
  const [prDate, setPrDate] = useState(todayDate)
  const [prRaw, setPrRaw] = useState("")
  const [prError, setPrError] = useState("")

  const drivers = employees.filter((e) => e.role === "شۆفێر" && e.status === "چالاک")

  function openExtraction() {
    setExDriver(null)
    setExLoads("")
    setExDate(todayDate)
    setExNotes("")
    setExError("")
    setExOpen(true)
  }

  function handleSaveExtraction() {
    if (!exDriver) { setExError("شۆفێر هەڵبژێرە"); return }
    const loads = Number(exLoads)
    if (!loads || loads <= 0) { setExError("ژمارەی بار پێویستە"); return }
    addExtraction({ date: exDate, driver: exDriver, loads, notes: exNotes.trim() })
    setExOpen(false)
  }

  return (
    <>
      <PageHeader
        title="دەرهێنان و پرۆسێس"
        description="تۆمارکردنی بارەکانی دەرهێنان لە زەوی و پرۆسێسکردن بۆ کەرەستەی فرۆش"
        action={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => { setPrDate(todayDate); setPrRaw(""); setPrError(""); setPrOpen(true) }}>
              <Layers className="size-4" />
              پرۆسێسی نوێ
            </Button>
            <Button onClick={openExtraction}>
              <Plus className="size-4" />
              دەرهێنانی نوێ
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        <StatCard label="بارەکانی ئەمڕۆ" value={`${todayLoads} بار`} icon={Mountain} tone="warning" />
        <StatCard label="کۆی بارەکان" value={`${totalLoads} بار`} icon={Truck} />
        <StatCard label="ڕۆژانی پرۆسێس" value={`${processings.length} ڕۆژ`} icon={Layers} />
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        <Card className="overflow-hidden p-0">
          <div className="border-b border-border px-4 py-3">
            <h3 className="text-sm font-bold text-foreground">تۆماری دەرهێنانی ڕۆژانە</h3>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">بەروار</TableHead>
                  <TableHead className="text-right">شۆفێر</TableHead>
                  <TableHead className="text-right">ژمارەی بار</TableHead>
                  <TableHead className="text-right">تێبینی</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {extractions.map((e) => (
                  <TableRow key={e.id}>
                    <TableCell className="text-muted-foreground">{formatDate(e.date)}</TableCell>
                    <TableCell className="font-medium">{e.driver}</TableCell>
                    <TableCell><Badge variant="secondary">{e.loads} بار</Badge></TableCell>
                    <TableCell className="text-muted-foreground">{e.notes || "ـ"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>

        <Card className="overflow-hidden p-0">
          <div className="border-b border-border px-4 py-3">
            <h3 className="text-sm font-bold text-foreground">تۆماری پرۆسێسکردن</h3>
          </div>
          <div className="flex flex-col divide-y divide-border">
            {processings.map((p) => (
              <div key={p.id} className="p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">{formatDate(p.date)}</span>
                  <Badge variant="outline">{p.rawLoads} باری خاو</Badge>
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {p.produced.map((pr) => (
                    <span key={pr.material} className="rounded-md bg-muted px-2.5 py-1 text-xs text-foreground">
                      {pr.material}: <span className="font-bold">{pr.quantity} بار</span>
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Extraction Dialog */}
      <Dialog open={exOpen} onOpenChange={setExOpen}>
        <DialogContent className="max-w-md" dir="rtl">
          <DialogHeader>
            <DialogTitle>تۆماری دەرهێنانی نوێ</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>شۆفێر *</Label>
              <Select value={exDriver ?? ""} onValueChange={setExDriver}>
                <SelectTrigger><SelectValue placeholder="شۆفێر هەڵبژێرە..." /></SelectTrigger>
                <SelectContent>
                  {drivers.map((d) => (
                    <SelectItem key={d.id} value={d.name}>{d.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>ژمارەی بار *</Label>
                <Input type="number" min="1" value={exLoads} onChange={(e) => setExLoads(e.target.value)} dir="ltr" className="text-right" placeholder="٠" />
              </div>
              <div className="space-y-1.5">
                <Label>بەروار</Label>
                <Input type="date" value={exDate} onChange={(e) => setExDate(e.target.value)} dir="ltr" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>تێبینی</Label>
              <Textarea value={exNotes} onChange={(e) => setExNotes(e.target.value)} rows={2} />
            </div>
            {exError && <p className="text-sm text-destructive">{exError}</p>}
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setExOpen(false)}><X className="size-4" /> داخستن</Button>
            <Button onClick={handleSaveExtraction}>تۆمارکردن</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Processing Dialog */}
      <Dialog open={prOpen} onOpenChange={setPrOpen}>
        <DialogContent className="max-w-md" dir="rtl">
          <DialogHeader>
            <DialogTitle>تۆماری پرۆسێسی نوێ</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>بارەکانی خاو *</Label>
                <Input type="number" min="1" value={prRaw} onChange={(e) => setPrRaw(e.target.value)} dir="ltr" className="text-right" placeholder="٠" />
              </div>
              <div className="space-y-1.5">
                <Label>بەروار</Label>
                <Input type="date" value={prDate} onChange={(e) => setPrDate(e.target.value)} dir="ltr" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground">تۆمارکردن دەکرێت بۆ هەژماری بارەکانی خاو. بەرهەمەکانی دروستکراو لە پاش پرۆسێس زیادکراودەبن.</p>
            {prError && <p className="text-sm text-destructive">{prError}</p>}
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setPrOpen(false)}><X className="size-4" /> داخستن</Button>
            <Button onClick={() => {
              const raw = Number(prRaw)
              if (!raw || raw <= 0) { setPrError("بارەکانی خاو پێویستە"); return }
              addProcessing({ date: prDate, rawLoads: raw, produced: [] })
              setPrOpen(false)
            }}>تۆمارکردن</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
