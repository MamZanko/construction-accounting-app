import {
  LayoutDashboard,
  Package,
  Users,
  Mountain,
  ShoppingCart,
  Truck,
  HardHat,
  PieChart,
  HandCoins,
  Receipt,
  Fuel,
  Wrench,
  Wallet,
  FileBarChart,
  Printer,
  Settings,
  type LucideIcon,
} from "lucide-react"

export type NavItem = {
  href: string
  label: string
  icon: LucideIcon
  group: string
}

export const navItems: NavItem[] = [
  { href: "/", label: "داشبۆرد", icon: LayoutDashboard, group: "سەرەکی" },

  { href: "/sales", label: "فرۆشتن", icon: ShoppingCart, group: "بازرگانی" },
  { href: "/customers", label: "کڕیارەکان", icon: Users, group: "بازرگانی" },
  { href: "/materials", label: "کەرەستەکان", icon: Package, group: "بازرگانی" },
  { href: "/payments", label: "پارەدان و قەرز", icon: HandCoins, group: "بازرگانی" },

  { href: "/extraction", label: "دەرهێنان و پرۆسێس", icon: Mountain, group: "بەرهەمهێنان" },
  { href: "/trucks", label: "بارهەڵگرەکان", icon: Truck, group: "بەرهەمهێنان" },
  { href: "/employees", label: "کارمەند و شۆفێر", icon: HardHat, group: "بەرهەمهێنان" },
  { href: "/fuel", label: "سووتەمەنی", icon: Fuel, group: "بەرهەمهێنان" },
  { href: "/maintenance", label: "چاککردنەوە", icon: Wrench, group: "بەرهەمهێنان" },

  { href: "/expenses", label: "خەرجییەکان", icon: Receipt, group: "دارایی" },
  { href: "/owners", label: "خاوەنەکان", icon: PieChart, group: "دارایی" },
  { href: "/salaries", label: "مووچە", icon: Wallet, group: "دارایی" },
  { href: "/reports", label: "ڕاپۆرتەکان", icon: FileBarChart, group: "دارایی" },

  { href: "/documents", label: "بەڵگەنامەکان", icon: Printer, group: "سیستەم" },
  { href: "/settings", label: "ڕێکخستنەکان", icon: Settings, group: "سیستەم" },
]

export const navGroups = ["سەرەکی", "بازرگانی", "بەرهەمهێنان", "دارایی", "سیستەم"]
