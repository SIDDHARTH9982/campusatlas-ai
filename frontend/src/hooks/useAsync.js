import { useState, useCallback } from 'react'
import toast from 'react-hot-toast'

export const useAsync = (asyncFn, options = {}) => {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)

  const execute = useCallback(async (...args) => {
    setLoading(true)
    setError(null)
    try {
      const result = await asyncFn(...args)
      setData(result)
      if (options.successMessage) toast.success(options.successMessage)
      return result
    } catch (err) {
      const msg = err?.message || 'Something went wrong'
      setError(msg)
      if (options.errorMessage !== false) toast.error(options.errorMessage || msg)
      throw err
    } finally {
      setLoading(false)
    }
  }, [asyncFn])

  return { loading, data, error, execute }
}
