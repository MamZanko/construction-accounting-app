"use client"

import { useState } from "react"
import Link from "next/link"
import { Plus, ShoppingCart, TrendingUp, Banknote, Clock, X, Trash2 } from "lucide-react"
import { PageHeader, StatCard } from "@/components/ui-helpers"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { SaleLine } from "@/lib/data"
import { saleTotal } from "@/lib/data"
import { formatIQD, formatDate } from "@/lib/format"
import { useStore } from "@/lib/store"

const emptyLine = (): SaleLine => ({ material: "", meters: 0, pricePerMeter: 0 })

export default function SalesPage() {
  const { sales, customers, materials, addSale } = useStore()
  const total = sales.reduce((a, s) => a + saleTotal(s), 0)
  const cash = sales.filter((s) => s.paymentType === "نەقد").reduce((a, s) => a + saleTotal(s), 0)
  const debt = total - cash

  const [open, setOpen] = useState(false)
  const [customer, setCustomer] = useState("")
  const [paymentType, setPaymentType] = useState<"نەقد" | "قەرز">("نەقد")
  const [discountType, setDiscountType] = useState<"هیچ" | "مەتری" | "کۆ">("هیچ")
  const [discountValue, setDiscountValue] = useState("0")
  const [paid, setPaid] = useState("0")
  const [lines, setLines] = useState<SaleLine[]>([emptyLine()])
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))
  const [error, setError] = useState("")

  function openAdd() {
    setCustomer("")
    setPaymentType("نەقد")
    setDiscountType("هیچ")
    setDiscountValue("0")
    setPaid("0")
    setLines([emptyLine()])
    setDate(new Date().toISOString().slice(0, 10))
    setError("")
    setOpen(true)
  }

  function addLine() { setLines((prev) => [...prev, emptyLine()]) }
  function removeLine(i: number) { setLines((prev) => prev.filter((_, idx) => idx !== i)) }
  function updateLine(i: number, field: keyof SaleLine, val: string) {
    setLines((prev) =>
      prev.map((l, idx) =>
        idx === i
          ? {
              ...l,
              [field]:
                field === "material" ? val : Number(val),
              pricePerMeter:
                field === "material"
                  ? (materials.find((m) => m.name === val)?.pricePerMeter ?? l.pricePerMeter)
                  : field === "pricePerMeter"
                  ? Number(val)
                  : l.pricePerMeter,
            }
          : l,
      ),
    )
  }

  const previewSale = {
    id: 0, invoiceNo: "---", date, customer,
    paymentType, lines, discountType,
    discountValue: Number(discountValue),
    paid: Number(paid),
  }
  const previewTotal = saleTotal(previewSale)

  function handleSave() {
    if (!customer) { setError("کڕیار هەڵبژێرە"); return }
    if (lines.some((l) => !l.material || l.meters <= 0)) {
      setError("هەموو ڕیزەکان پڕبکەوە (کەرەستە و مەتر)"); return
    }
    const nextNo = `INV-${1000 + sales.length + 1}`
    addSale({
      invoiceNo: nextNo,
      date,
      customer,
      paymentType,
      lines,
      discountType,
      discountValue: Number(discountValue),
      paid: Number(paid),
    })
    setOpen(false)
  }

  return (
    <>
      <PageHeader
        title="بەڕێوەبردنی فرۆش"
        description="پسوڵەکانی فرۆش، نەقد و قەرز، داشکاندن و مێژوو"
        action={
          <Button onClick={openAdd}>
            <Plus className="size-4" />
            پسوڵەی نوێ
          </Button>
        }
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard label="کۆی فرۆش" value={formatIQD(total)} icon={TrendingUp} tone="positive" />
        <StatCard label="فرۆشی نەقد" value={formatIQD(cash)} icon={Banknote} />
        <StatCard label="فرۆشی قەرز" value={formatIQD(debt)} icon={Clock} tone="warning" />
        <StatCard label="ژمارەی پسوڵە" value={`${sales.length} پسوڵە`} icon={ShoppingCart} />
      </div>

      <Card className="mt-4 overflow-hidden p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">ژمارەی پسوڵە</TableHead>
                <TableHead className="text-right">بەروار</TableHead>
                <TableHead className="text-right">کڕیار</TableHead>
                <TableHead className="text-right">کەرەستە</TableHead>
                <TableHead className="text-right">جۆری پارەدان</TableHead>
                <TableHead className="text-right">کۆی گشتی</TableHead>
                <TableHead className="text-right">دراو</TableHead>
                <TableHead className="text-right">ماوە</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sales.map((s) => {
                const t = saleTotal(s)
                const remaining = t - s.paid
                return (
                  <TableRow key={s.id} className="cursor-pointer">
                    <TableCell className="font-medium">
                      <Link href="/documents" className="text-primary hover:underline">
                        {s.invoiceNo}
                      </Link>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{formatDate(s.date)}</TableCell>
                    <TableCell>{s.customer}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {s.lines.map((l) => l.material).join("، ")}
                    </TableCell>
                    <TableCell>
                      <Badge variant={s.paymentType === "نەقد" ? "secondary" : "outline"}>{s.paymentType}</Badge>
                    </TableCell>
                    <TableCell className="font-bold">{formatIQD(t)}</TableCell>
                    <TableCell className="text-muted-foreground">{formatIQD(s.paid)}</TableCell>
                    <TableCell className={remaining > 0 ? "font-medium text-destructive" : "text-muted-foreground"}>
                      {formatIQD(remaining)}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl" dir="rtl">
          <DialogHeader>
            <DialogTitle>پسوڵەی فرۆشتنی نوێ</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>کڕیار *</Label>
                <Select value={customer} onValueChange={setCustomer}>
                  <SelectTrigger><SelectValue placeholder="کڕیار هەڵبژێرە..." /></SelectTrigger>
                  <SelectContent>
                    {customers.map((c) => (
                      <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>بەروار *</Label>
                <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} dir="ltr" />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>ڕیزەکانی کەرەستە *</Label>
                <Button type="button" variant="outline" size="sm" onClick={addLine}>
                  <Plus className="size-4" /> ڕیز زیادبکە
                </Button>
              </div>
              {lines.map((l, i) => (
                <div key={i} className="grid grid-cols-[1fr_80px_90px_32px] gap-2 items-end">
                  <div className="space-y-1">
                    {i === 0 && <Label className="text-xs">کەرەستە</Label>}
                    <Select value={l.material} onValueChange={(v) => updateLine(i, "material", v)}>
                      <SelectTrigger><SelectValue placeholder="کەرەستە..." /></SelectTrigger>
                      <SelectContent>
                        {materials.map((m) => (
                          <SelectItem key={m.id} value={m.name}>{m.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    {i === 0 && <Label className="text-xs">مەتر</Label>}
                    <Input
                      type="number" min="0"
                      value={l.meters || ""}
                      onChange={(e) => updateLine(i, "meters", e.target.value)}
                      placeholder="٠" dir="ltr" className="text-right"
                    />
                  </div>
                  <div className="space-y-1">
                    {i === 0 && <Label className="text-xs">نرخ/مەتر</Label>}
                    <Input
                      type="number" min="0"
                      value={l.pricePerMeter || ""}
                      onChange={(e) => updateLine(i, "pricePerMeter", e.target.value)}
                      placeholder="٠" dir="ltr" className="text-right"
                    />
                  </div>
                  <Button
                    type="button" variant="ghost" size="icon"
                    className="shrink-0 text-destructive hover:text-destructive"
                    disabled={lines.length === 1}
                    onClick={() => removeLine(i)}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>جۆری پارەدان</Label>
                <Select value={paymentType} onValueChange={(v) => setPaymentType(v as "نەقد" | "قەرز")}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="نەقد">نەقد</SelectItem>
                    <SelectItem value="قەرز">قەرز</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>بڕی دراو (د.ع)</Label>
                <Input type="number" min="0" value={paid} onChange={(e) => setPaid(e.target.value)} dir="ltr" className="text-right" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>جۆری داشکاندن</Label>
                <Select value={discountType} onValueChange={(v) => setDiscountType(v as "هیچ" | "مەتری" | "کۆ")}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="هیچ">بێ داشکاندن</SelectItem>
                    <SelectItem value="مەتری">بەپێی مەتر</SelectItem>
                    <SelectItem value="کۆ">کۆی گشتی</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {discountType !== "هیچ" && (
                <div className="space-y-1.5">
                  <Label>بڕی داشکاندن (د.ع)</Label>
                  <Input type="number" min="0" value={discountValue} onChange={(e) => setDiscountValue(e.target.value)} dir="ltr" className="text-right" />
                </div>
              )}
            </div>

            <div className="rounded-lg bg-muted p-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">کۆی گشتی</span>
                <span className="font-bold text-foreground">{formatIQD(previewTotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">دراوە</span>
                <span className="text-chart-2">{formatIQD(Number(paid))}</span>
              </div>
              <div className="flex justify-between border-t border-border pt-1 mt-1">
                <span className="text-muted-foreground">ماوە</span>
                <span className={previewTotal - Number(paid) > 0 ? "font-bold text-destructive" : "text-chart-2"}>
                  {formatIQD(Math.max(0, previewTotal - Number(paid)))}
                </span>
              </div>
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
