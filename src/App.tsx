import { useMemo, useState } from 'react'
import './App.css'
import GrassGrid from './components/GrassGrid'
import LocationSelector from './components/LocationSelector'
import EncounterSummary from './components/EncounterSummary'
import CustomLocationForm from './components/CustomLocationForm'
import GridControls from './components/GridControls'
import WorldForm from './components/WorldForm'
import locationsData from './data/locations.json'
import { rollEncounter, EncounterResult } from './utils/encounters'
import useCustomLocations from './hooks/useCustomLocations'
import useWorlds from './hooks/useWorlds'
import { Location } from './utils/locations'

interface GridSize {
  rows: number
  cols: number
}

const GRID_DEFAULT: GridSize = { rows: 5, cols: 5 }
const EXCLAMATION_DELAY = 400
const BASE_LOCATIONS: Location[] = (Array.isArray(locationsData) ? locationsData : []).map((location) => ({
  ...location,
  isCustom: false,
}))

function App() {
  const [gridSize, setGridSize] = useState<GridSize>(GRID_DEFAULT)
  const [selectedLocationId, setSelectedLocationId] = useState<string>(BASE_LOCATIONS[0]?.id ?? '')
  const { customLocations, addLocation, removeLocation } = useCustomLocations([])
  const { worlds, addWorld, removeWorld, updateWorldLocations } = useWorlds([])
  const [selectedWorldId, setSelectedWorldId] = useState<string | null>(null)
  const [lastEncounter, setLastEncounter] = useState<(EncounterResult & { locationName?: string }) | null>(null)
  const [sidePanelOpen, setSidePanelOpen] = useState(false)
  const [shinyChance, setShinyChance] = useState(2)
  const [encounterChance, setEncounterChance] = useState(50)
  const [showWorldModal, setShowWorldModal] = useState(false)
  const [showLocationModal, setShowLocationModal] = useState(false)
  const [editingLocation, setEditingLocation] = useState<Location | null>(null)

  const allLocations = useMemo(() => {
    if (selectedWorldId) {
      const world = worlds.find((w) => w.id === selectedWorldId)
      return world ? world.locations : []
    }
    return [...BASE_LOCATIONS, ...customLocations]
  }, [selectedWorldId, worlds, customLocations])

  const activeLocation = useMemo(() => {
    return (
      allLocations.find((location) => location.id === selectedLocationId) ||
      allLocations[0] ||
      null
    )
  }, [allLocations, selectedLocationId])

  const handleTileEncounter = (): EncounterResult | null => {
    if (!activeLocation) return null
    const missRoll = Math.random()
    const missThreshold = 1 - (encounterChance / 100)
    if (missRoll < missThreshold) {
      const missResult: EncounterResult = { status: 'miss' }
      setLastEncounter(missResult)
      return missResult
    }
    const encounter = rollEncounter(activeLocation.encounters, { shinyChance: shinyChance / 100 })
    const payload = {
      ...encounter,
      locationName: activeLocation.name,
    }
    
    // Delay showing encounter overlay to allow exclamation to display first
    if (encounter.status === 'hit') {
      setTimeout(() => {
        setLastEncounter(payload)
      }, EXCLAMATION_DELAY)
    } else {
      setLastEncounter(payload)
    }
    
    return payload
  }

  const handleLocationCreate = (location: Location) => {
    if (editingLocation) {
      // Update existing location
      if (selectedWorldId) {
        const world = worlds.find((w) => w.id === selectedWorldId)
        if (world) {
          updateWorldLocations(
            selectedWorldId,
            world.locations.map((loc) => (loc.id === editingLocation.id ? location : loc))
          )
        }
      } else {
        removeLocation(editingLocation.id)
        addLocation(location)
      }
      setEditingLocation(null)
    } else {
      // Create new location
      if (selectedWorldId) {
        const world = worlds.find((w) => w.id === selectedWorldId)
        if (world) {
          updateWorldLocations(selectedWorldId, [...world.locations, location])
        }
      } else {
        addLocation(location)
      }
    }
    setSelectedLocationId(location.id)
    setShowLocationModal(false)
  }

  const handleRemoveLocation = (locationId: string) => {
    if (selectedWorldId) {
      const world = worlds.find((w) => w.id === selectedWorldId)
      if (world) {
        updateWorldLocations(
          selectedWorldId,
          world.locations.filter((loc) => loc.id !== locationId)
        )
      }
    } else {
      removeLocation(locationId)
    }
    if (selectedLocationId === locationId) {
      setSelectedLocationId(BASE_LOCATIONS[0]?.id ?? '')
    }
  }

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center overflow-hidden">
      {/* Location Dropdown - Top Left */}
      <div className="absolute top-4 left-4 z-20">
        <select
          className="rounded-2xl border border-emerald-200 bg-white/95 px-4 py-2 text-sm text-emerald-900 shadow-lg outline-none backdrop-blur-sm transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
          value={selectedLocationId}
          onChange={(e) => setSelectedLocationId(e.target.value)}
        >
          {allLocations.map((location) => (
            <option key={location.id} value={location.id}>
              {location.name}
            </option>
          ))}
        </select>
      </div>

      {/* Settings Button */}
      <button
        onClick={() => setSidePanelOpen(!sidePanelOpen)}
        className="absolute top-4 right-4 z-20 rounded-full bg-white/95 p-3 shadow-lg backdrop-blur-sm transition hover:bg-white hover:scale-110"
        aria-label="Toggle settings"
      >
        <svg className="h-6 w-6 text-emerald-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </button>

      {/* Side Panel */}
      <div
        className={`fixed top-0 right-0 z-40 h-full w-full max-w-md transform overflow-y-auto bg-white shadow-2xl transition-transform duration-300 ease-in-out ${
          sidePanelOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-6">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-black text-emerald-900">Settings</h2>
            <button
              onClick={() => setSidePanelOpen(false)}
              className="rounded-full p-2 hover:bg-emerald-50"
              aria-label="Close panel"
            >
              <svg className="h-6 w-6 text-emerald-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-6">
            <div className="rounded-[32px] border border-emerald-100 bg-white/90 p-5">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-sm font-semibold uppercase tracking-wide text-emerald-500">Active World</p>
                <button
                  onClick={() => setShowWorldModal(true)}
                  className="text-xs font-semibold uppercase tracking-wide text-emerald-600 hover:text-emerald-700"
                >
                  + New World
                </button>
              </div>
              <select
                className="w-full rounded-2xl border border-emerald-200 bg-white px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                value={selectedWorldId ?? ''}
                onChange={(e) => setSelectedWorldId(e.target.value || null)}
              >
                <option value="">Default (Base + Custom)</option>
                {worlds.map((world) => (
                  <option key={world.id} value={world.id}>
                    {world.name} ({world.locations.length} routes)
                  </option>
                ))}
              </select>
              {selectedWorldId && worlds.find((w) => w.id === selectedWorldId) && (
                <div className="mt-4">
                  <div className="rounded-2xl border border-emerald-100 bg-emerald-50/70 px-4 py-3 text-sm">
                    <p className="font-semibold text-emerald-900">
                      {worlds.find((w) => w.id === selectedWorldId)?.name}
                    </p>
                    <p className="text-emerald-900/70">
                      {worlds.find((w) => w.id === selectedWorldId)?.description}
                    </p>
                    <button
                      onClick={() => {
                        removeWorld(selectedWorldId)
                        setSelectedWorldId(null)
                      }}
                      className="mt-3 text-xs font-semibold uppercase tracking-wide text-rose-600 hover:text-rose-500"
                    >
                      Delete World
                    </button>
                  </div>
                </div>
              )}
            </div>

            <LocationSelector
              locations={allLocations}
              selectedLocation={activeLocation}
              onSelectLocation={(location) => setSelectedLocationId(location?.id ?? '')}
              onRemoveLocation={handleRemoveLocation}
              onCreateNew={() => {
                setEditingLocation(null)
                setShowLocationModal(true)
              }}
              onEdit={(location) => {
                setEditingLocation(location)
                setShowLocationModal(true)
              }}
            />

            <GridControls gridSize={gridSize} onChange={setGridSize} />

            <div className="rounded-[32px] border border-emerald-100 bg-white/90 p-5">
              <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-emerald-500">Encounter Chance</p>
              <div className="space-y-2">
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  value={encounterChance}
                  onChange={(e) => setEncounterChance(Number(e.target.value))}
                  className="w-full"
                />
                <div className="flex items-center justify-between text-sm">
                  <span className="text-emerald-900">{encounterChance}%</span>
                  <span className="text-emerald-700">{100 - encounterChance}% miss</span>
                </div>
              </div>
            </div>

            <div className="rounded-[32px] border border-emerald-100 bg-white/90 p-5">
              <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-emerald-500">Shiny Chance</p>
              <div className="space-y-2">
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="0.1"
                  value={shinyChance}
                  onChange={(e) => setShinyChance(Number(e.target.value))}
                  className="w-full"
                />
                <div className="flex items-center justify-between text-sm">
                  <span className="text-emerald-900">{shinyChance.toFixed(1)}%</span>
                  <span className="text-emerald-700">1 in {Math.round(100 / shinyChance)}</span>
                </div>
              </div>
            </div>

            <div className="rounded-[32px] border border-emerald-100 bg-emerald-50/50 p-5">
              <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-emerald-500">
                Encounter chances
              </p>
              <EncounterSummary encounters={activeLocation?.encounters ?? []} />
            </div>
          </div>
        </div>
      </div>

      {/* Backdrop */}
      {sidePanelOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm"
          onClick={() => setSidePanelOpen(false)}
        />
      )}

      {/* World Modal */}
      {showWorldModal && (
        <>
          <div
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowWorldModal(false)}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="relative w-full max-w-lg rounded-[32px] bg-white p-8 shadow-2xl">
              <button
                onClick={() => setShowWorldModal(false)}
                className="absolute top-5 right-5 rounded-full p-2 hover:bg-emerald-50"
                aria-label="Close modal"
              >
                <svg className="h-5 w-5 text-emerald-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <h3 className="mb-6 text-2xl font-black text-emerald-900">Create New World</h3>
              <p className="mb-6 text-sm text-emerald-700">A world groups your custom routes and locations.</p>
              <WorldForm
                onCreate={(world) => {
                  addWorld(world)
                  setShowWorldModal(false)
                }}
              />
            </div>
          </div>
        </>
      )}

      {/* Location Modal */}
      {showLocationModal && (
        <>
          <div
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            onClick={() => {
              setShowLocationModal(false)
              setEditingLocation(null)
            }}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-[32px] bg-white p-8 shadow-2xl">
              <button
                onClick={() => {
                  setShowLocationModal(false)
                  setEditingLocation(null)
                }}
                className="absolute top-5 right-5 rounded-full p-2 hover:bg-emerald-50"
                aria-label="Close modal"
              >
                <svg className="h-5 w-5 text-emerald-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <h3 className="mb-6 text-2xl font-black text-emerald-900">
                {editingLocation ? 'Edit Location' : 'Create New Location'}
              </h3>
              <p className="mb-6 text-sm text-emerald-700">Pick Pokémon and encounter rates to build your {editingLocation ? 'location' : 'own hotspot'}.</p>
              <CustomLocationForm onCreate={handleLocationCreate} initialLocation={editingLocation} />
            </div>
          </div>
        </>
      )}

      <GrassGrid
        rows={gridSize.rows}
        cols={gridSize.cols}
        location={activeLocation}
        onEncounter={handleTileEncounter}
      />

      {/* Encounter Overlay */}
      {lastEncounter?.status === 'hit' && lastEncounter.spriteUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md">
          <button
            onClick={() => setLastEncounter(null)}
            className="absolute top-4 left-4 rounded-full bg-white/95 p-3 shadow-lg backdrop-blur-sm transition hover:bg-white hover:scale-110"
            aria-label="Close encounter"
          >
            <svg className="h-6 w-6 text-emerald-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div className="relative animate-pop">
            <img
              src={lastEncounter.spriteUrl}
              alt={lastEncounter.pokemon?.name}
              className="h-96 w-96 object-contain drop-shadow-[0_20px_35px_rgba(0,0,0,0.8)] image-rendering-pixelated"
              style={{ imageRendering: 'pixelated' }}
            />
            {lastEncounter.isShiny && (
              <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-1xl font-black uppercase tracking-wider text-yellow-300 drop-shadow-[0_2px_8px_rgba(234,179,8,0.8)]">
                shiny!
              </span>
            )}
            <p className="absolute -bottom-12 left-1/2 -translate-x-1/2 whitespace-nowrap text-4xl font-black text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]">
              {lastEncounter.pokemon?.name}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
