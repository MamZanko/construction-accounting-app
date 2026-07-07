"use client"

import { useEffect } from "react"

export function usePerformanceMonitoring() {
  useEffect(() => {
    if (typeof window === "undefined" || !window.performance) return

    const navigationTiming = window.performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming

    if (navigationTiming) {
      const metrics = {
        ttfb: navigationTiming.responseStart - navigationTiming.fetchStart,
        fcp: performance.getEntriesByName("first-contentful-paint")[0]?.startTime || 0,
        lcp: 0,
        cls: 0,
      }

      // Report LCP
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        const lastEntry = entries[entries.length - 1]
        metrics.lcp = lastEntry.startTime
      })

      try {
        observer.observe({ entryTypes: ["largest-contentful-paint"] })
      } catch (e) {
        // LCP not supported
      }

      // Report CLS
      const clsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            metrics.cls += (entry as any).value
          }
        }
      })

      try {
        clsObserver.observe({ entryTypes: ["layout-shift"] })
      } catch (e) {
        // CLS not supported
      }

      return () => {
        observer.disconnect()
        clsObserver.disconnect()
      }
    }
  }, [])
}
