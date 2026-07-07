// Format Iraqi Dinar with comma separators
export function formatIQD(amount: number): string {
  const rounded = Math.round(amount)
  return rounded.toLocaleString("en-US") + " د.ع"
}

// Format number with arabic-friendly grouping
export function formatNum(n: number): string {
  return n.toLocaleString("en-US")
}

// Format date (Gregorian, simple)
export function formatDate(iso: string): string {
  const d = new Date(iso)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  return `${y}/${m}/${day}`
}
