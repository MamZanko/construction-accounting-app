// ===== Mock data for the construction materials accounting system =====
// All amounts in IQD. Kurdish (Sorani) labels.

export type Material = {
  id: number
  name: string
  unit: string
  pricePerMeter: number
  notes: string
  priceHistory: { price: number; date: string }[]
}

export const materials: Material[] = [
  {
    id: 1,
    name: "خۆڵی زبڵ",
    unit: "بار",
    pricePerMeter: 12000,
    notes: "بۆ پڕکردنەوەی زەوی",
    priceHistory: [
      { price: 10000, date: "2025-01-01" },
      { price: 11000, date: "2025-06-01" },
      { price: 12000, date: "2026-01-01" },
    ],
  },
  {
    id: 2,
    name: "زبڵی گەورە",
    unit: "بار",
    pricePerMeter: 18000,
    notes: "",
    priceHistory: [
      { price: 16000, date: "2025-01-01" },
      { price: 18000, date: "2025-09-01" },
    ],
  },
  {
    id: 3,
    name: "بەرد",
    unit: "بار",
    pricePerMeter: 22000,
    notes: "بەردی شکێنراو",
    priceHistory: [{ price: 22000, date: "2025-03-01" }],
  },
  {
    id: 4,
    name: "خۆڵی سوور",
    unit: "بار",
    pricePerMeter: 9000,
    notes: "",
    priceHistory: [{ price: 9000, date: "2025-01-01" }],
  },
  {
    id: 5,
    name: "ڕیگ",
    unit: "بار",
    pricePerMeter: 15000,
    notes: "ڕیگی نووسراو",
    priceHistory: [{ price: 15000, date: "2025-02-01" }],
  },
  {
    id: 6,
    name: "خاشاکی بیناسازی",
    unit: "بار",
    pricePerMeter: 7000,
    notes: "",
    priceHistory: [{ price: 7000, date: "2025-01-01" }],
  },
]

export type Customer = {
  id: number
  name: string
  phone: string
  address: string
  company: string
  type: "هاووڵاتی" | "کۆمپانیا"
  balance: number
  notes: string
}

export const customers: Customer[] = [
  { id: 1, name: "ئاکۆ محەمەد", phone: "0750 123 4567", address: "هەولێر ـ گەڕەکی ئەندازیاران", company: "", type: "هاووڵاتی", balance: 1450000, notes: "کڕیاری کۆن" },
  { id: 2, name: "کۆمپانیای ڕۆژهەڵات", phone: "0770 987 6543", address: "سلێمانی ـ شەقامی سالم", company: "ڕۆژهەڵات بۆ بیناسازی", type: "کۆمپانیا", balance: 8200000, notes: "پرۆژەی گەورە" },
  { id: 3, name: "هێمن ئەحمەد", phone: "0751 222 3344", address: "هەولێر ـ کۆیە", company: "", type: "هاووڵاتی", balance: 0, notes: "" },
  { id: 4, name: "شیرکۆ عەلی", phone: "0750 555 6677", address: "دهۆک ـ ناوەندی شار", company: "", type: "هاووڵاتی", balance: 320000, notes: "" },
  { id: 5, name: "کۆمپانیای ئاوەدانی", phone: "0773 444 5566", address: "هەولێر ـ ١٠٠ مەتری", company: "ئاوەدانی بۆ پرۆژەکان", type: "کۆمپانیا", balance: 5600000, notes: "" },
  { id: 6, name: "دانا ڕەشید", phone: "0770 111 2233", address: "هەولێر ـ شادی", company: "", type: "هاووڵاتی", balance: 0, notes: "هەمیشە نەقد دەدات" },
  { id: 7, name: "ئاراس خالید", phone: "0751 888 9900", address: "سلێمانی ـ گردی سەرچنار", company: "", type: "هاووڵاتی", balance: 780000, notes: "" },
]

export type SaleLine = {
  material: string
  meters: number
  pricePerMeter: number
}

export type Sale = {
  id: number
  invoiceNo: string
  date: string
  customer: string
  paymentType: "نەقد" | "قەرز"
  lines: SaleLine[]
  discountType: "هیچ" | "مەتری" | "کۆ"
  discountValue: number
  paid: number
}

export function saleTotal(s: Sale): number {
  let subtotal = 0
  for (const l of s.lines) {
    const price = s.discountType === "مەتری" ? l.pricePerMeter - s.discountValue : l.pricePerMeter
    subtotal += l.meters * Math.max(price, 0)
  }
  if (s.discountType === "کۆ") subtotal -= s.discountValue
  return Math.max(subtotal, 0)
}

export const sales: Sale[] = [
  { id: 1, invoiceNo: "INV-1001", date: "2026-06-08", customer: "ئاکۆ محەمەد", paymentType: "قەرز", lines: [{ material: "زبڵی گەورە", meters: 12, pricePerMeter: 18000 }], discountType: "هیچ", discountValue: 0, paid: 100000 },
  { id: 2, invoiceNo: "INV-1002", date: "2026-06-08", customer: "دانا ڕەشید", paymentType: "نەقد", lines: [{ material: "ڕیگ", meters: 10, pricePerMeter: 15000 }], discountType: "هیچ", discountValue: 0, paid: 150000 },
  { id: 3, invoiceNo: "INV-1003", date: "2026-06-08", customer: "کۆمپانیای ڕۆژهەڵات", paymentType: "قەرز", lines: [{ material: "بەرد", meters: 14, pricePerMeter: 22000 }, { material: "خۆڵی زبڵ", meters: 10, pricePerMeter: 12000 }], discountType: "کۆ", discountValue: 50000, paid: 0 },
  { id: 4, invoiceNo: "INV-1004", date: "2026-06-07", customer: "شیرکۆ عەلی", paymentType: "نەقد", lines: [{ material: "خۆڵی سوور", meters: 8, pricePerMeter: 9000 }], discountType: "هیچ", discountValue: 0, paid: 72000 },
  { id: 5, invoiceNo: "INV-1005", date: "2026-06-07", customer: "کۆمپانیای ئاوەدانی", paymentType: "قەرز", lines: [{ material: "زبڵی گەورە", meters: 14, pricePerMeter: 18000 }], discountType: "هیچ", discountValue: 0, paid: 0 },
  { id: 6, invoiceNo: "INV-1006", date: "2026-06-06", customer: "ئاراس خالید", paymentType: "قەرز", lines: [{ material: "خاشاکی بیناسازی", meters: 12, pricePerMeter: 7000 }], discountType: "مەتری", discountValue: 500, paid: 0 },
  { id: 7, invoiceNo: "INV-1007", date: "2026-06-06", customer: "ئاکۆ محەمەد", paymentType: "نەقد", lines: [{ material: "ڕیگ", meters: 14, pricePerMeter: 15000 }], discountType: "هیچ", discountValue: 0, paid: 210000 },
  { id: 8, invoiceNo: "INV-1008", date: "2026-06-05", customer: "هێمن ئەحمەد", paymentType: "نەقد", lines: [{ material: "بەرد", meters: 12, pricePerMeter: 22000 }], discountType: "هیچ", discountValue: 0, paid: 264000 },
]

export type Truck = {
  id: number
  name: string
  plate: string
  model: string
  capacity: number
  ownership: "خاوەن" | "کرێ"
  status: "بەردەست" | "لە گەشتدا" | "لە چاککردنەوەدا" | "لە کاردا نییە"
  notes: string
}

export const trucks: Truck[] = [
  { id: 1, name: "بارهەڵگر ١", plate: "هـ ٢٣٤٥٦", model: "مرسيدس ٢٠١٨", capacity: 14, ownership: "خاوەن", status: "بەردەست", notes: "" },
  { id: 2, name: "بارهەڵگر ٢", plate: "هـ ٧٨٩٠١", model: "ڤۆلڤۆ ٢٠٢٠", capacity: 16, ownership: "خاوەن", status: "لە گەشتدا", notes: "" },
  { id: 3, name: "بارهەڵگر ٣", plate: "", model: "سکانیا ٢٠١٧", capacity: 12, ownership: "خاوەن", status: "لە چاککردنەوەدا", notes: "گۆڕینی تایە" },
  { id: 4, name: "بارهەڵگر ٤", plate: "هـ ٤٤٥٥٦", model: "مان ٢٠١٩", capacity: 14, ownership: "خاوەن", status: "بەردەست", notes: "" },
  { id: 5, name: "بارهەڵگر ٥", plate: "هـ ١١٢٢٣", model: "ئیڤێکۆ ٢٠١٦", capacity: 10, ownership: "خاوەن", status: "لە کاردا نییە", notes: "پێویستی بە چاککردنەوەی گەورەیە" },
]

export type Employee = {
  id: number
  name: string
  role: "شۆفێر" | "کارمەندی ئۆفیس" | "مەکانیک" | "بەڕێوەبەر" | "ئەوانیتر"
  phone: string
  address: string
  hireDate: string
  status: "چالاک" | "ناچالاک"
  salaryType: "مانگانە" | "بەپێی بار"
  monthlySalary: number
  ratePerLoad: number
  notes: string
}

export const employees: Employee[] = [
  { id: 1, name: "کاروان ئیبراهیم", role: "شۆفێر", phone: "0750 333 1111", address: "هەولێر", hireDate: "2024-03-01", status: "چالاک", salaryType: "بەپێی بار", monthlySalary: 0, ratePerLoad: 8000, notes: "" },
  { id: 2, name: "هاوار سەعید", role: "شۆفێر", phone: "0770 444 2222", address: "هەولێر", hireDate: "2024-05-15", status: "چالاک", salaryType: "بەپێی بار", monthlySalary: 0, ratePerLoad: 8000, notes: "" },
  { id: 3, name: "ڕێبوار جەلال", role: "شۆفێر", phone: "0751 555 3333", address: "کۆیە", hireDate: "2025-01-10", status: "چالاک", salaryType: "بەپێی بار", monthlySalary: 0, ratePerLoad: 7500, notes: "" },
  { id: 4, name: "دیاری محمد", role: "بەڕێوەبەر", phone: "0750 666 4444", address: "هەولێر", hireDate: "2023-09-01", status: "چالاک", salaryType: "مانگانە", monthlySalary: 1500000, ratePerLoad: 0, notes: "" },
  { id: 5, name: "ئەژین کەمال", role: "کارمەندی ئۆفیس", phone: "0773 777 5555", address: "هەولێر", hireDate: "2024-11-20", status: "چالاک", salaryType: "مانگانە", monthlySalary: 900000, ratePerLoad: 0, notes: "" },
  { id: 6, name: "بەختیار عومەر", role: "مەکانیک", phone: "0770 888 6666", address: "هەولێر", hireDate: "2024-02-01", status: "چالاک", salaryType: "مانگانە", monthlySalary: 1100000, ratePerLoad: 0, notes: "" },
]

export type Extraction = {
  id: number
  date: string
  driver: string
  loads: number
  notes: string
}

export const extractions: Extraction[] = [
  { id: 1, date: "2026-06-08", driver: "کاروان ئیبراهیم", loads: 9, notes: "" },
  { id: 2, date: "2026-06-08", driver: "هاوار سەعید", loads: 7, notes: "" },
  { id: 3, date: "2026-06-08", driver: "ڕێبوار جەلال", loads: 8, notes: "" },
  { id: 4, date: "2026-06-07", driver: "کاروان ئیبراهیم", loads: 10, notes: "" },
  { id: 5, date: "2026-06-07", driver: "هاوار سەعید", loads: 6, notes: "کەشوهەوا خراپ" },
  { id: 6, date: "2026-06-06", driver: "ڕێبوار جەلال", loads: 9, notes: "" },
  { id: 7, date: "2026-06-06", driver: "کاروان ئیبراهیم", loads: 8, notes: "" },
]

export type Processing = {
  id: number
  date: string
  rawLoads: number
  produced: { material: string; quantity: number }[]
}

export const processings: Processing[] = [
  { id: 1, date: "2026-06-08", rawLoads: 20, produced: [{ material: "ڕیگ", quantity: 8 }, { material: "بەرد", quantity: 6 }, { material: "خۆڵی زبڵ", quantity: 6 }] },
  { id: 2, date: "2026-06-07", rawLoads: 16, produced: [{ material: "زبڵی گەورە", quantity: 7 }, { material: "خۆڵی سوور", quantity: 9 }] },
]

export type Owner = {
  id: number
  name: string
  percentage: number
  invested: number
  withdrawn: number
  notes: string
}

export const owners: Owner[] = [
  { id: 1, name: "ئەحمەد شوان", percentage: 40, invested: 120000000, withdrawn: 35000000, notes: "خاوەنی سەرەکی" },
  { id: 2, name: "کەریم نووری", percentage: 35, invested: 95000000, withdrawn: 28000000, notes: "" },
  { id: 3, name: "سامان فەرهاد", percentage: 25, invested: 70000000, withdrawn: 15000000, notes: "" },
]

export type Payment = {
  id: number
  date: string
  customer: string
  amount: number
  notes: string
}

export const payments: Payment[] = [
  { id: 1, date: "2026-06-08", customer: "ئاکۆ محەمەد", amount: 100000, notes: "" },
  { id: 2, date: "2026-06-07", customer: "کۆمپانیای ڕۆژهەڵات", amount: 2000000, notes: "بەشێک لە قەرز" },
  { id: 3, date: "2026-06-06", customer: "شیرکۆ عەلی", amount: 200000, notes: "" },
  { id: 4, date: "2026-06-05", customer: "ئاراس خالید", amount: 300000, notes: "" },
  { id: 5, date: "2026-06-04", customer: "کۆمپانیای ئاوەدانی", amount: 1500000, notes: "" },
]

export type Expense = {
  id: number
  date: string
  categories: string[]
  amount: number
  description: string
  notes: string
}

export const expenseCategories = [
  "سووتەمەنی",
  "چاککردنەوەی بارهەڵگر",
  "مووچەی شۆفێر",
  "مووچەی کارمەند",
  "پێداویستی ئۆفیس",
  "کارەبای حکومی",
  "مۆلیدە",
  "خۆراک و پێداویستی",
  "ئامێر",
  "هەمەجۆر",
]

export const expenses: Expense[] = [
  { id: 1, date: "2026-06-08", categories: ["سووتەمەنی"], amount: 450000, description: "گازوایل بۆ بارهەڵگرەکان", notes: "" },
  { id: 2, date: "2026-06-07", categories: ["چاککردنەوەی بارهەڵگر"], amount: 320000, description: "گۆڕینی تایەی بارهەڵگر ٣", notes: "" },
  { id: 3, date: "2026-06-06", categories: ["کارەبای حکومی"], amount: 180000, description: "پسوڵەی کارەبا", notes: "" },
  { id: 4, date: "2026-06-05", categories: ["خۆراک و پێداویستی", "هەمەجۆر"], amount: 90000, description: "خۆراکی کرێکاران", notes: "" },
  { id: 5, date: "2026-06-04", categories: ["مۆلیدە"], amount: 250000, description: "گازوایلی مۆلیدە", notes: "" },
  { id: 6, date: "2026-06-03", categories: ["ئامێر"], amount: 1200000, description: "کڕینی پارچەی شکێنەر", notes: "" },
]

export type FuelLog = {
  id: number
  date: string
  liters: number
  cost: number
  notes: string
}

export const fuelLogs: FuelLog[] = [
  { id: 1, date: "2026-06-08", liters: 600, cost: 450000, notes: "" },
  { id: 2, date: "2026-06-06", liters: 550, cost: 412000, notes: "" },
  { id: 3, date: "2026-06-04", liters: 700, cost: 525000, notes: "گازوایلی مۆلیدە و بارهەڵگر" },
  { id: 4, date: "2026-06-02", liters: 500, cost: 375000, notes: "" },
]

export type Maintenance = {
  id: number
  truck: string
  type: "گۆڕینی زەیت" | "گۆڕینی تایە" | "چاککردنەوەی بزوێنەر" | "خزمەتی فڕین" | "ئەوانیتر"
  cost: number
  date: string
  nextDue: string
  mechanic: string
  description: string
}

export const maintenances: Maintenance[] = [
  { id: 1, truck: "بارهەڵگر ٣", type: "گۆڕینی تایە", cost: 320000, date: "2026-06-07", nextDue: "2026-12-07", mechanic: "وۆرکشۆپی هەولێر", description: "گۆڕینی ٤ تایە" },
  { id: 2, truck: "بارهەڵگر ١", type: "گۆڕینی زەیت", cost: 85000, date: "2026-05-20", nextDue: "2026-06-20", mechanic: "بەختیار عومەر", description: "زەیت و فلتەر" },
  { id: 3, truck: "بارهەڵگر ٢", type: "خزمەتی فڕین", cost: 140000, date: "2026-05-15", nextDue: "2026-06-15", mechanic: "بەختیار عومەر", description: "" },
  { id: 4, truck: "بارهەڵگر ٥", type: "چاککردنەوەی بزوێنەر", cost: 950000, date: "2026-04-10", nextDue: "", mechanic: "وۆرکشۆپی بەغداد", description: "چاککردنەوەی گەورەی بزوێنەر" },
]

// ===== Derived dashboard data =====
export const monthlySalesVsExpenses = [
  { month: "کانوونی ٢", sales: 42000000, expenses: 18000000 },
  { month: "شوبات", sales: 38000000, expenses: 16000000 },
  { month: "ئازار", sales: 51000000, expenses: 21000000 },
  { month: "نیسان", sales: 47000000, expenses: 19000000 },
  { month: "ئایار", sales: 55000000, expenses: 23000000 },
  { month: "حوزەیران", sales: 31000000, expenses: 12000000 },
]

export const topCustomers = [
  { name: "کۆمپانیای ڕۆژهەڵات", revenue: 38000000 },
  { name: "کۆمپانیای ئاوەدانی", revenue: 29000000 },
  { name: "ئاکۆ محەمەد", revenue: 14000000 },
  { name: "ئاراس خالید", revenue: 9000000 },
  { name: "شیرکۆ عەلی", revenue: 6000000 },
]

export const materialBreakdown = [
  { name: "ڕیگ", value: 32 },
  { name: "بەرد", value: 26 },
  { name: "زبڵی گەورە", value: 18 },
  { name: "خۆڵی زبڵ", value: 14 },
  { name: "خۆڵی سوور", value: 10 },
]

export const companyInfo = {
  name: "کۆمپانیای مەعمەل قەندیل بۆ کەرەستەی بیناسازی",
  address: "هەولێر ـ شەقامی ١٠٠ مەتری",
  phone: "0750 123 4567",
}
