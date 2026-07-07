"use client"

import { useState } from "react"
import { PageHeader, StatCard } from "@/components/ui-helpers"
import { Card } from "@/components/ui/card"
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
import { formatIQD } from "@/lib/format"
import { Plus, PieChart as PieIcon, TrendingUp, Wallet, X } from "lucide-react"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"
import { useStore } from "@/lib/store"

const COLORS = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)"]

export default function OwnersPage() {
  const { owners, addOwner } = useStore()
  const totalInvested = owners.reduce((s, o) => s + o.invested, 0)
  const totalWithdrawn = owners.reduce((s, o) => s + o.withdrawn, 0)
  const netCapital = totalInvested - totalWithdrawn

  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [percentage, setPercentage] = useState("")
  const [invested, setInvested] = useState("")
  const [notes, setNotes] = useState("")
  const [error, setError] = useState("")

  // Ensure percentages still add up display-only
  const totalPct = owners.reduce((s, o) => s + o.percentage, 0)

  function openAdd() {
    setName("")
    setPercentage("")
    setInvested("")
    setNotes("")
    setError("")
    setOpen(true)
  }

  function handleSave() {
    if (!name.trim()) { setError("ناوی خاوەن پێویستە"); return }
    const pct = Number(percentage)
    if (!pct || pct <= 0 || pct > 100) { setError("ڕێژەی بەشداری پێویستە (١ ـ ١٠٠)"); return }
    if (totalPct + pct > 100) { setError(`کۆی ڕێژەکان ١٠٠% تێپەڕدەبێت (ئێستا ${totalPct}%)`); return }
    addOwner({
      name: name.trim(),
      percentage: pct,
      invested: Number(invested) || 0,
      withdrawn: 0,
      notes: notes.trim(),
    })
    setOpen(false)
  }

  return (
    <>
      <PageHeader
        title="خاوەنەکان و سەرمایە"
        description="بەشداری خاوەنەکان، سەرمایەی دانراو و ڕاکێشراو"
        action={
          <Button onClick={openAdd}>
            <Plus className="size-4" />
            خاوەن نوێ
          </Button>
        }
      />

      <div className="mb-5 grid grid-cols-2 gap-4 lg:grid-cols-3">
        <StatCard label="کۆی سەرمایەی دانراو" value={formatIQD(totalInvested)} icon={TrendingUp} tone="positive" />
        <StatCard label="کۆی ڕاکێشراو" value={formatIQD(totalWithdrawn)} icon={Wallet} tone="warning" />
        <StatCard label="سەرمایەی پاک" value={formatIQD(netCapital)} icon={PieIcon} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="p-4 lg:col-span-1">
          <h3 className="mb-3 text-sm font-semibold text-foreground">ڕێژەی خاوەندارێتی</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={owners}
                  dataKey="percentage"
                  nameKey="name"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={2}
                >
                  {owners.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(v) => `${v}%`}
                  contentStyle={{
                    background: "var(--popover)",
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 space-y-1.5">
            {owners.map((o, i) => (
              <div key={o.id} className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2">
                  <span className="size-2.5 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                  {o.name}
                </span>
                <span className="font-semibold">{o.percentage}%</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="overflow-hidden p-0 lg:col-span-2">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">خاوەن</TableHead>
                <TableHead className="text-right">ڕێژە</TableHead>
                <TableHead className="text-right">سەرمایەی دانراو</TableHead>
                <TableHead className="text-right">ڕاکێشراو</TableHead>
                <TableHead className="text-right">پاک</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {owners.map((o) => (
                <TableRow key={o.id}>
                  <TableCell className="font-medium">
                    {o.name}
                    {o.notes && <p className="text-xs font-normal text-muted-foreground">{o.notes}</p>}
                  </TableCell>
                  <TableCell>{o.percentage}%</TableCell>
                  <TableCell className="text-chart-2">{formatIQD(o.invested)}</TableCell>
                  <TableCell className="text-destructive">{formatIQD(o.withdrawn)}</TableCell>
                  <TableCell className="font-semibold">{formatIQD(o.invested - o.withdrawn)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md" dir="rtl">
          <DialogHeader>
            <DialogTitle>خاوەنی نوێ زیادبکە</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>ناو *</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="ناوی خاوەن..." />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>ڕێژەی بەشداری (%) *</Label>
                <Input type="number" min="1" max="100" value={percentage} onChange={(e) => setPercentage(e.target.value)} dir="ltr" className="text-right" placeholder="٠" />
              </div>
              <div className="space-y-1.5">
                <Label>سەرمایەی دانراو (د.ع)</Label>
                <Input type="number" min="0" value={invested} onChange={(e) => setInvested(e.target.value)} dir="ltr" className="text-right" placeholder="٠" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground">ڕێژەی بەشداری ئێستا: {totalPct}% بەکارهاتووە</p>
            <div className="space-y-1.5">
              <Label>تێبینی</Label>
              <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}><X className="size-4" /> داخستن</Button>
            <Button onClick={handleSave}>پاشەکەوتکردن</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
