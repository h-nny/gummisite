import { useCallback, useEffect, useState } from 'react'
import { Location } from '../utils/locations'

export interface World {
  id: string
  name: string
  description: string
  locations: Location[]
  createdAt: number
}

const STORAGE_KEY = 'grass-encounters.worlds'

const readStoredWorlds = (): World[] => {
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

export default function useWorlds(initial: World[] = []) {
  const [worlds, setWorlds] = useState<World[]>(() => {
    const stored = readStoredWorlds()
    return stored.length ? stored : initial
  })

  useEffect(() => {
    if (typeof window === 'undefined') return
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(worlds))
  }, [worlds])

  const addWorld = useCallback((world: World) => {
    setWorlds((prev) => {
      const existingIndex = prev.findIndex((entry) => entry.id === world.id)
      if (existingIndex !== -1) {
        const next = [...prev]
        next[existingIndex] = world
        return next
      }
      return [...prev, world]
    })
  }, [])

  const removeWorld = useCallback((worldId: string) => {
    setWorlds((prev) => prev.filter((entry) => entry.id !== worldId))
  }, [])

  const updateWorldLocations = useCallback((worldId: string, locations: Location[]) => {
    setWorlds((prev) =>
      prev.map((world) =>
        world.id === worldId ? { ...world, locations } : world
      )
    )
  }, [])

  return {
    worlds,
    addWorld,
    removeWorld,
    updateWorldLocations,
  }
}
