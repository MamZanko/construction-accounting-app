"use client"

import { useState } from "react"
import { Plus, HardHat, Users, UserCheck, X } from "lucide-react"
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
import type { Employee } from "@/lib/data"
import { formatIQD, formatDate } from "@/lib/format"
import { useStore } from "@/lib/store"

type EmployeeForm = {
  name: string
  role: Employee["role"]
  phone: string
  address: string
  hireDate: string
  status: Employee["status"]
  salaryType: Employee["salaryType"]
  monthlySalary: string
  ratePerLoad: string
  notes: string
}

const emptyForm: EmployeeForm = {
  name: "", role: "شۆفێر", phone: "", address: "",
  hireDate: new Date().toISOString().slice(0, 10),
  status: "چالاک", salaryType: "مانگانە",
  monthlySalary: "", ratePerLoad: "", notes: "",
}

export default function EmployeesPage() {
  const { employees, extractions, addEmployee } = useStore()
  const active = employees.filter((e) => e.status === "چالاک").length
  const drivers = employees.filter((e) => e.role === "شۆفێر").length

  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<EmployeeForm>(emptyForm)
  const [error, setError] = useState("")

  function openAdd() {
    setForm({ ...emptyForm, hireDate: new Date().toISOString().slice(0, 10) })
    setError("")
    setOpen(true)
  }

  function handleSave() {
    if (!form.name.trim()) { setError("ناوی کارمەند پێویستە"); return }
    const isPerLoad = form.salaryType === "بەپێی بار"
    const monthly = isPerLoad ? 0 : Number(form.monthlySalary)
    const rate = isPerLoad ? Number(form.ratePerLoad) : 0
    if (!isPerLoad && monthly <= 0) { setError("مووچەی مانگانە پێویستە"); return }
    if (isPerLoad && rate <= 0) { setError("نرخی بار پێویستە"); return }
    addEmployee({
      name: form.name.trim(),
      role: form.role,
      phone: form.phone.trim(),
      address: form.address.trim(),
      hireDate: form.hireDate,
      status: form.status,
      salaryType: form.salaryType,
      monthlySalary: monthly,
      ratePerLoad: rate,
      notes: form.notes.trim(),
    })
    setOpen(false)
  }

  function driverEarnings(name: string, rate: number) {
    const loads = extractions.filter((e) => e.driver === name).reduce((a, e) => a + e.loads, 0)
    return { loads, pay: loads * rate }
  }

  return (
    <>
      <PageHeader
        title="کارمەند و شۆفێرەکان"
        description="زانیاری کارمەندان، جۆری مووچە و حیسابی شۆفێر بەپێی بار"
        action={
          <Button onClick={openAdd}>
            <Plus className="size-4" />
            کارمەندی نوێ
          </Button>
        }
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        <StatCard label="کۆی کارمەندان" value={`${employees.length} کەس`} icon={Users} />
        <StatCard label="کارمەندی چالاک" value={`${active} کەس`} icon={UserCheck} tone="positive" />
        <StatCard label="شۆفێرەکان" value={`${drivers} شۆفێر`} icon={HardHat} />
      </div>

      <Card className="mt-4 overflow-hidden p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">ناو</TableHead>
                <TableHead className="text-right">پۆست</TableHead>
                <TableHead className="text-right">مۆبایل</TableHead>
                <TableHead className="text-right">بەرواری دامەزراندن</TableHead>
                <TableHead className="text-right">جۆری مووچە</TableHead>
                <TableHead className="text-right">مووچە / حیساب</TableHead>
                <TableHead className="text-right">دۆخ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {employees.map((e) => {
                const isDriver = e.salaryType === "بەپێی بار"
                const earn = isDriver ? driverEarnings(e.name, e.ratePerLoad) : null
                return (
                  <TableRow key={e.id}>
                    <TableCell className="font-medium">{e.name}</TableCell>
                    <TableCell><Badge variant="secondary">{e.role}</Badge></TableCell>
                    <TableCell dir="ltr" className="text-right text-muted-foreground">{e.phone}</TableCell>
                    <TableCell className="text-muted-foreground">{formatDate(e.hireDate)}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {isDriver ? `${formatIQD(e.ratePerLoad)} / بار` : "مانگانە"}
                    </TableCell>
                    <TableCell className="font-bold">
                      {isDriver ? (
                        <span>
                          {formatIQD(earn!.pay)}{" "}
                          <span className="text-xs font-normal text-muted-foreground">({earn!.loads} بار)</span>
                        </span>
                      ) : (
                        formatIQD(e.monthlySalary)
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant={e.status === "چالاک" ? "default" : "outline"}>{e.status}</Badge>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md" dir="rtl">
          <DialogHeader>
            <DialogTitle>کارمەندی نوێ زیادبکە</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>ناو *</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="ناوی کارمەند..." />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>پۆست</Label>
                <Select value={form.role} onValueChange={(v) => setForm({ ...form, role: v as Employee["role"] })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {(["شۆفێر","کارمەندی ئۆفیس","مەکانیک","بەڕێوەبەر","ئەوانیتر"] as const).map((r) => (
                      <SelectItem key={r} value={r}>{r}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>دۆخ</Label>
                <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v as Employee["status"] })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="چالاک">چالاک</SelectItem>
                    <SelectItem value="ناچالاک">ناچالاک</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>مۆبایل</Label>
                <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="07xx..." dir="ltr" className="text-right" />
              </div>
              <div className="space-y-1.5">
                <Label>بەرواری دامەزراندن</Label>
                <Input type="date" value={form.hireDate} onChange={(e) => setForm({ ...form, hireDate: e.target.value })} dir="ltr" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>جۆری مووچە</Label>
              <Select value={form.salaryType} onValueChange={(v) => setForm({ ...form, salaryType: v as Employee["salaryType"] })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="مانگانە">مانگانە</SelectItem>
                  <SelectItem value="بەپێی بار">بەپێی بار</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {form.salaryType === "مانگانە" ? (
              <div className="space-y-1.5">
                <Label>مووچەی مانگانە (د.ع) *</Label>
                <Input type="number" min="0" value={form.monthlySalary} onChange={(e) => setForm({ ...form, monthlySalary: e.target.value })} dir="ltr" className="text-right" placeholder="٠" />
              </div>
            ) : (
              <div className="space-y-1.5">
                <Label>نرخی هەر بارێک (د.ع) *</Label>
                <Input type="number" min="0" value={form.ratePerLoad} onChange={(e) => setForm({ ...form, ratePerLoad: e.target.value })} dir="ltr" className="text-right" placeholder="٠" />
              </div>
            )}
            <div className="space-y-1.5">
              <Label>ناونیشان</Label>
              <Input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="شار..." />
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
