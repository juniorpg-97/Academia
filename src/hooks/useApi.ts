import { useCallback, useEffect, useState } from 'react'

export function useApi<T>(request: () => Promise<T>) {
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<unknown>(null)
  const [loading, setLoading] = useState(true)

  const recargar = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      setData(await request())
    } catch (requestError) {
      setError(requestError)
      setData(null)
    } finally {
      setLoading(false)
    }
  }, [request])

  useEffect(() => {
    const timer = window.setTimeout(() => void recargar(), 0)
    return () => window.clearTimeout(timer)
  }, [recargar])

  return { data, error, loading, recargar }
}
