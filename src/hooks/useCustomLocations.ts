import { useCallback, useEffect, useState } from 'react'
import { Location } from '../utils/locations'

const STORAGE_KEY = 'grass-encounters.customLocations'

const readStoredLocations = (): Location[] => {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export default function useCustomLocations(initial: Location[] = []) {
  const [customLocations, setCustomLocations] = useState<Location[]>(() => {
    const stored = readStoredLocations()
    return stored.length ? stored : initial
  })

  useEffect(() => {
    if (typeof window === 'undefined') return
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(customLocations))
  }, [customLocations])

  const addLocation = useCallback((location: Location) => {
    setCustomLocations((prev) => {
      const existingIndex = prev.findIndex((entry) => entry.id === location.id)
      if (existingIndex !== -1) {
        const next = [...prev]
        next[existingIndex] = location
        return next
      }
      return [...prev, location]
    })
  }, [])

  const removeLocation = useCallback((locationId: string) => {
    setCustomLocations((prev) => prev.filter((entry) => entry.id !== locationId))
  }, [])

  return {
    customLocations,
    addLocation,
    removeLocation,
  }
}
