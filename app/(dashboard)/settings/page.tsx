"use client"

import { useState } from "react"
import { PageHeader } from "@/components/ui-helpers"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { expenseCategories } from "@/lib/data"
import { useStore } from "@/lib/store"
import { Building2, Database, Shield, Tag, Save, Download, CheckCircle2, X } from "lucide-react"

export default function SettingsPage() {
  const { companyInfo, updateCompanyInfo } = useStore()
  const [cname, setCname] = useState(companyInfo.name)
  const [caddr, setCaddr] = useState(companyInfo.address)
  const [cphone, setCphone] = useState(companyInfo.phone)
  const [saved, setSaved] = useState(false)

  const [cats, setCats] = useState<string[]>(expenseCategories)
  const [newCat, setNewCat] = useState("")

  function handleSave() {
    updateCompanyInfo({ name: cname, address: caddr, phone: cphone })
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  function addCat() {
    const v = newCat.trim()
    if (!v || cats.includes(v)) return
    setCats((prev) => [...prev, v])
    setNewCat("")
  }

  function removeCat(c: string) {
    setCats((prev) => prev.filter((x) => x !== c))
  }

  function handleExport() {
    const data = { companyName: cname, address: caddr, phone: cphone, expenseCategories: cats }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "qandil-settings.json"
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <>
      <PageHeader title="ڕێکخستنەکان" description="زانیاری کۆمپانیا، پۆلەکان و پاشەکەوتکردنی داتا" />

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="p-5">
          <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-foreground">
            <Building2 className="size-4 text-primary" />
            زانیاری کۆمپانیا
          </h3>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="cname">ناوی کۆمپانیا</Label>
              <Input id="cname" value={cname} onChange={(e) => setCname(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="caddr">ناونیشان</Label>
              <Input id="caddr" value={caddr} onChange={(e) => setCaddr(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="cphone">ژمارەی مۆبایل</Label>
              <Input id="cphone" value={cphone} onChange={(e) => setCphone(e.target.value)} dir="ltr" className="text-right" />
            </div>
            <div className="flex items-center gap-2">
              <Button onClick={handleSave}>
                <Save className="size-4" />
                پاشەکەوتکردن
              </Button>
              {saved && (
                <span className="flex items-center gap-1 text-sm text-chart-2">
                  <CheckCircle2 className="size-4" /> پاشەکەوتکرا
                </span>
              )}
            </div>
          </div>
        </Card>

        <div className="flex flex-col gap-4">
          <Card className="p-5">
            <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-foreground">
              <Tag className="size-4 text-primary" />
              پۆلەکانی خەرجی
            </h3>
            <div className="mb-3 flex flex-wrap gap-2">
              {cats.map((c) => (
                <span key={c} className="flex items-center gap-1 rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground">
                  {c}
                  <button
                    type="button"
                    onClick={() => removeCat(c)}
                    aria-label={`سڕینەوەی ${c}`}
                    className="ml-0.5 rounded-full p-0.5 hover:bg-destructive/20 hover:text-destructive transition-colors"
                  >
                    <X className="size-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={newCat}
                onChange={(e) => setNewCat(e.target.value)}
                placeholder="پۆلی نوێ..."
                onKeyDown={(e) => { if (e.key === "Enter") addCat() }}
              />
              <Button variant="outline" onClick={addCat}>زیادکردن</Button>
            </div>
          </Card>

          <Card className="p-5">
            <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-foreground">
              <Database className="size-4 text-primary" />
              داتا و پاشەکەوت
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-lg border border-border px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-foreground">ئەکسپۆرتی داتا (JSON)</p>
                  <p className="text-xs text-muted-foreground">داگرتنی ڕێکخستنەکان وەک فایل</p>
                </div>
                <Button variant="outline" size="sm" onClick={handleExport}>
                  <Download className="size-4" />
                  داگرتن
                </Button>
              </div>
              <Separator />
              <div className="flex items-center gap-3 rounded-lg bg-muted/50 px-4 py-3 text-muted-foreground">
                <Shield className="size-4" />
                <p className="text-xs">هەموو داتاکان لەناو ئامێرەکەت پارێزراون و ئۆفلاین کاردەکەن.</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </>
  )
}
