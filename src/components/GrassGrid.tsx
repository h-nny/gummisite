import { useEffect, useMemo, useState } from 'react'
import { Location } from '../utils/locations'
import { EncounterResult } from '../utils/encounters'

const GRASS_TILE_URL = '/grass-tile.png'
const EXCLAMATION_DELAY = 400
const CLEAR_DELAY = 2500

interface TileState extends EncounterResult {
  id: string
  showExclamation?: boolean
}

interface GrassGridProps {
  rows?: number
  cols?: number
  location: Location | null
  onEncounter: (index: number) => EncounterResult | null
}

const createBlankTiles = (count: number): (TileState | null)[] => Array.from({ length: count }, () => null)

export default function GrassGrid({ rows = 5, cols = 5, location, onEncounter }: GrassGridProps) {
  const totalTiles = useMemo(() => rows * cols, [rows, cols])
  const [tileStates, setTileStates] = useState<(TileState | null)[]>(() => createBlankTiles(totalTiles))

  useEffect(() => {
    setTileStates(createBlankTiles(totalTiles))
  }, [totalTiles, location?.id])

  const handleTileClick = (index: number) => {
    if (!location || typeof onEncounter !== 'function') return
    const result = onEncounter(index)
    if (!result) return

    const encounterId = `${Date.now()}-${index}`

    if (result.status === 'hit') {
      // Show exclamation first
      setTileStates((prev) => {
        const next = [...prev]
        next[index] = { id: encounterId, ...result, showExclamation: true }
        return next
      })

      // Then show the full result after delay
      setTimeout(() => {
        setTileStates((prev) => {
          if (prev[index]?.id !== encounterId) return prev
          const next = [...prev]
          next[index] = { id: encounterId, ...result, showExclamation: false }
          return next
        })
      }, EXCLAMATION_DELAY)
    } else {
      // Show miss immediately
      setTileStates((prev) => {
        const next = [...prev]
        next[index] = { id: encounterId, ...result }
        return next
      })
    }

    setTimeout(() => {
      setTileStates((prev) => {
        if (prev[index]?.id !== encounterId) return prev
        const next = [...prev]
        next[index] = null
        return next
      })
    }, CLEAR_DELAY)
  }

  return (
    <div className="w-full">
      <div
        className="grid gap-2 justify-center"
        style={{
          gridTemplateColumns: `repeat(${cols}, minmax(0, 88px))`,
        }}
      >
        {Array.from({ length: totalTiles }).map((_, idx) => {
          const state = tileStates[idx]
          return (
            <button
              key={idx}
              type="button"
              aria-label="Search grass"
              onClick={() => handleTileClick(idx)}
              className="relative flex h-20 w-20 items-center justify-center overflow-hidden rounded-xl border-0 transition hover:-translate-y-0.5"
              style={{
                backgroundImage: `url(${GRASS_TILE_URL})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                imageRendering: 'pixelated',
              }}
            >
              {state?.showExclamation && state.rarity && (
                <div className="relative z-10 animate-shake">
                  <div className="relative rounded-full bg-red-600 px-3 py-2 shadow-lg">
                    <span className="text-xl font-black text-white">
                      {'!'.repeat(state.rarity)}
                    </span>
                    <div className="absolute -bottom-1 left-1/2 h-0 w-0 -translate-x-1/2 border-l-[6px] border-r-[6px] border-t-[6px] border-l-transparent border-r-transparent border-t-red-600" />
                  </div>
                </div>
              )}
              {state?.status === 'miss' && (
                <div className="relative z-10">
                  <div className="relative rounded-full bg-white px-3 py-2 shadow-lg">
                    <span className="text-sm font-black uppercase text-gray-800">
                      Miss
                    </span>
                    <div className="absolute -bottom-1 left-1/2 h-0 w-0 -translate-x-1/2 border-l-[6px] border-r-[6px] border-t-[6px] border-l-transparent border-r-transparent border-t-white" />
                  </div>
                </div>
              )}
            </button>
          )
        })}
      </div>
      {!location && (
        <p className="mt-4 text-center text-sm text-emerald-900/70">
          Choose a location to start exploring the grass.
        </p>
      )}
    </div>
  )
}
