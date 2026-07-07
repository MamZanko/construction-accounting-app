/**
 * Performance utilities for efficient data handling
 */

export function paginateData<T>(data: T[], page: number, pageSize: number = 25): T[] {
  return data.slice((page - 1) * pageSize, page * pageSize)
}

export function memoizeAsync<T extends any[], R>(
  fn: (...args: T) => Promise<R>,
  keyGenerator?: (...args: T) => string,
): (...args: T) => Promise<R> {
  const cache = new Map<string, Promise<R>>()

  return async (...args: T) => {
    const key = keyGenerator ? keyGenerator(...args) : JSON.stringify(args)

    if (cache.has(key)) {
      return cache.get(key)!
    }

    const result = fn(...args)
    cache.set(key, result)

    // Clear cache after 5 minutes
    setTimeout(() => cache.delete(key), 5 * 60 * 1000)

    return result
  }
}

/**
 * Batch updates to reduce re-renders
 */
export function batched<T extends (...args: any[]) => void>(fn: T, delay = 16): T {
  let timeoutId: NodeJS.Timeout | null = null
  let args: Parameters<T> | null = null

  return ((...newArgs: Parameters<T>) => {
    args = newArgs
    if (timeoutId) return

    timeoutId = setTimeout(() => {
      if (args) fn(...args)
      timeoutId = null
      args = null
    }, delay)
  }) as T
}

/**
 * Deduplicate API calls within a time window
 */
export function deduped<T extends any[], R>(
  fn: (...args: T) => Promise<R>,
  wait = 300,
): (...args: T) => Promise<R> {
  let lastArgs: T | null = null
  let lastPromise: Promise<R> | null = null
  let timeoutId: NodeJS.Timeout | null = null

  return async (...args: T) => {
    lastArgs = args

    if (lastPromise) {
      return lastPromise
    }

    lastPromise = fn(...args)

    if (timeoutId) clearTimeout(timeoutId)

    timeoutId = setTimeout(() => {
      if (JSON.stringify(lastArgs) !== JSON.stringify(args)) {
        lastPromise = null
      }
    }, wait)

    return lastPromise
  }
}
