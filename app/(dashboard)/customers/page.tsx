"use client"

import { useState } from "react"
import Link from "next/link"
import { Plus, Users, Wallet, Phone, ArrowUpRight, X } from "lucide-react"
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
import { formatIQD } from "@/lib/format"
import { useStore } from "@/lib/store"

type CustomerForm = {
  name: string
  phone: string
  address: string
  company: string
  type: "هاووڵاتی" | "کۆمپانیا"
  notes: string
}

const emptyForm: CustomerForm = {
  name: "", phone: "", address: "", company: "", type: "هاووڵاتی", notes: "",
}

export default function CustomersPage() {
  const { customers, addCustomer } = useStore()
  const totalDebt = customers.reduce((a, c) => a + c.balance, 0)
  const indebted = customers.filter((c) => c.balance > 0).length

  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<CustomerForm>(emptyForm)
  const [error, setError] = useState("")

  function openAdd() {
    setForm(emptyForm)
    setError("")
    setOpen(true)
  }

  function handleSave() {
    if (!form.name.trim()) { setError("ناوی کڕیار پێویستە"); return }
    addCustomer({
      name: form.name.trim(),
      phone: form.phone.trim(),
      address: form.address.trim(),
      company: form.company.trim(),
      type: form.type,
      balance: 0,
      notes: form.notes.trim(),
    })
    setOpen(false)
  }

  return (
    <>
      <PageHeader
        title="بەڕێوەبردنی کڕیاران"
        description="پرۆفایل، مێژووی مامەڵە و قەرزی کڕیاران"
        action={
          <Button onClick={openAdd}>
            <Plus className="size-4" />
            کڕیاری نوێ
          </Button>
        }
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        <StatCard label="کۆی کڕیاران" value={`${customers.length} کڕیار`} icon={Users} />
        <StatCard label="کڕیاری قەرزدار" value={`${indebted} کڕیار`} icon={Phone} tone="warning" />
        <StatCard label="کۆی قەرز" value={formatIQD(totalDebt)} icon={Wallet} tone="negative" />
      </div>

      <Card className="mt-4 overflow-hidden p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">ناو</TableHead>
                <TableHead className="text-right">مۆبایل</TableHead>
                <TableHead className="text-right">جۆر</TableHead>
                <TableHead className="text-right">ناونیشان</TableHead>
                <TableHead className="text-right">باڵانس</TableHead>
                <TableHead className="text-right"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="font-medium">{c.name}</TableCell>
                  <TableCell dir="ltr" className="text-right text-muted-foreground">{c.phone}</TableCell>
                  <TableCell>
                    <Badge variant={c.type === "کۆمپانیا" ? "default" : "secondary"}>{c.type}</Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{c.address}</TableCell>
                  <TableCell className={c.balance > 0 ? "font-bold text-destructive" : "font-medium text-chart-2"}>
                    {c.balance > 0 ? formatIQD(c.balance) : "بێ قەرز"}
                  </TableCell>
                  <TableCell>
                    <Link
                      href={`/customers/${c.id}`}
                      className="flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                    >
                      پرۆفایل <ArrowUpRight className="size-3.5" />
                    </Link>
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
            <DialogTitle>کڕیاری نوێ زیادبکە</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>ناوی کڕیار *</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="ناوی کڕیار..." />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>مۆبایل</Label>
                <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="07xx xxx xxxx" dir="ltr" className="text-right" />
              </div>
              <div className="space-y-1.5">
                <Label>جۆر</Label>
                <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v as "هاووڵاتی" | "کۆمپانیا" })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="هاووڵاتی">هاووڵاتی</SelectItem>
                    <SelectItem value="کۆمپانیا">کۆمپانیا</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>ناونیشان</Label>
              <Input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="شار ـ گەڕەک..." />
            </div>
            {form.type === "کۆمپانیا" && (
              <div className="space-y-1.5">
                <Label>ناوی کۆمپانیا</Label>
                <Input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} placeholder="ناوی کۆمپانیا..." />
              </div>
            )}
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
