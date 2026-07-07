"use client"

/**
 * In-memory reactive store using React state lifted through a context provider.
 * This lets all dialogs add/edit records and have tables re-render immediately.
 */
import React, { createContext, useContext, useState, useCallback } from "react"
import type {
  Material,
  Customer,
  Sale,
  Truck,
  Employee,
  Extraction,
  Payment,
  Expense,
  FuelLog,
  Maintenance,
  Owner,
  Processing,
} from "./data"
import {
  materials as initMaterials,
  customers as initCustomers,
  sales as initSales,
  trucks as initTrucks,
  employees as initEmployees,
  extractions as initExtractions,
  payments as initPayments,
  expenses as initExpenses,
  fuelLogs as initFuelLogs,
  maintenances as initMaintenances,
  owners as initOwners,
  processings as initProcessings,
  companyInfo,
} from "./data"

type StoreState = {
  materials: Material[]
  customers: Customer[]
  sales: Sale[]
  trucks: Truck[]
  employees: Employee[]
  extractions: Extraction[]
  payments: Payment[]
  expenses: Expense[]
  fuelLogs: FuelLog[]
  maintenances: Maintenance[]
  owners: Owner[]
  processings: Processing[]
  companyInfo: typeof companyInfo
}

type StoreActions = {
  addMaterial: (m: Omit<Material, "id">) => void
  updateMaterial: (m: Material) => void
  addCustomer: (c: Omit<Customer, "id">) => void
  updateCustomer: (c: Customer) => void
  addSale: (s: Omit<Sale, "id">) => void
  addTruck: (t: Omit<Truck, "id">) => void
  updateTruck: (t: Truck) => void
  addEmployee: (e: Omit<Employee, "id">) => void
  updateEmployee: (e: Employee) => void
  addExtraction: (e: Omit<Extraction, "id">) => void
  addPayment: (p: Omit<Payment, "id">) => void
  addExpense: (e: Omit<Expense, "id">) => void
  addFuelLog: (f: Omit<FuelLog, "id">) => void
  addMaintenance: (m: Omit<Maintenance, "id">) => void
  addOwner: (o: Omit<Owner, "id">) => void
  addProcessing: (p: Omit<Processing, "id">) => void
}

const StoreContext = createContext<(StoreState & StoreActions) | null>(null)

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [materials, setMaterials] = useState<Material[]>(initMaterials)
  const [customers, setCustomers] = useState<Customer[]>(initCustomers)
  const [sales, setSales] = useState<Sale[]>(initSales)
  const [trucks, setTrucks] = useState<Truck[]>(initTrucks)
  const [employees, setEmployees] = useState<Employee[]>(initEmployees)
  const [extractions, setExtractions] = useState<Extraction[]>(initExtractions)
  const [payments, setPayments] = useState<Payment[]>(initPayments)
  const [expenses, setExpenses] = useState<Expense[]>(initExpenses)
  const [fuelLogs, setFuelLogs] = useState<FuelLog[]>(initFuelLogs)
  const [maintenances, setMaintenances] = useState<Maintenance[]>(initMaintenances)
  const [owners, setOwners] = useState<Owner[]>(initOwners)
  const [processings, setProcessings] = useState<Processing[]>(initProcessings)

  const nextId = (arr: { id: number }[]) =>
    arr.length > 0 ? Math.max(...arr.map((x) => x.id)) + 1 : 1

  const addMaterial = useCallback((m: Omit<Material, "id">) =>
    setMaterials((prev) => [...prev, { ...m, id: nextId(prev) }]), [])
  const updateMaterial = useCallback((m: Material) =>
    setMaterials((prev) => prev.map((x) => (x.id === m.id ? m : x))), [])

  const addCustomer = useCallback((c: Omit<Customer, "id">) =>
    setCustomers((prev) => [...prev, { ...c, id: nextId(prev) }]), [])
  const updateCustomer = useCallback((c: Customer) =>
    setCustomers((prev) => prev.map((x) => (x.id === c.id ? c : x))), [])

  const addSale = useCallback((s: Omit<Sale, "id">) =>
    setSales((prev) => [{ ...s, id: nextId(prev) }, ...prev]), [])

  const addTruck = useCallback((t: Omit<Truck, "id">) =>
    setTrucks((prev) => [...prev, { ...t, id: nextId(prev) }]), [])
  const updateTruck = useCallback((t: Truck) =>
    setTrucks((prev) => prev.map((x) => (x.id === t.id ? t : x))), [])

  const addEmployee = useCallback((e: Omit<Employee, "id">) =>
    setEmployees((prev) => [...prev, { ...e, id: nextId(prev) }]), [])
  const updateEmployee = useCallback((e: Employee) =>
    setEmployees((prev) => prev.map((x) => (x.id === e.id ? e : x))), [])

  const addExtraction = useCallback((e: Omit<Extraction, "id">) =>
    setExtractions((prev) => [{ ...e, id: nextId(prev) }, ...prev]), [])

  const addPayment = useCallback((p: Omit<Payment, "id">) => {
    setPayments((prev) => [{ ...p, id: nextId(prev) }, ...prev])
    // Reduce customer balance
    setCustomers((prev) =>
      prev.map((c) => (c.name === p.customer ? { ...c, balance: Math.max(0, c.balance - p.amount) } : c)),
    )
  }, [])

  const addExpense = useCallback((e: Omit<Expense, "id">) =>
    setExpenses((prev) => [{ ...e, id: nextId(prev) }, ...prev]), [])

  const addFuelLog = useCallback((f: Omit<FuelLog, "id">) =>
    setFuelLogs((prev) => [{ ...f, id: nextId(prev) }, ...prev]), [])

  const addMaintenance = useCallback((m: Omit<Maintenance, "id">) =>
    setMaintenances((prev) => [{ ...m, id: nextId(prev) }, ...prev]), [])

  const addOwner = useCallback((o: Omit<Owner, "id">) =>
    setOwners((prev) => [...prev, { ...o, id: nextId(prev) }]), [])

  const addProcessing = useCallback((p: Omit<Processing, "id">) =>
    setProcessings((prev) => [{ ...p, id: nextId(prev) }, ...prev]), [])

  return (
    <StoreContext.Provider
      value={{
        materials, customers, sales, trucks, employees, extractions,
        payments, expenses, fuelLogs, maintenances, owners, processings,
        companyInfo,
        addMaterial, updateMaterial, addCustomer, updateCustomer,
        addSale, addTruck, updateTruck, addEmployee, updateEmployee,
        addExtraction, addPayment, addExpense, addFuelLog,
        addMaintenance, addOwner, addProcessing,
      }}
    >
      {children}
    </StoreContext.Provider>
  )
}

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error("useStore must be used inside StoreProvider")
  return ctx
}
