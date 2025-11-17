import { useMemo, useState, useEffect } from 'react'
import { defaultEncounterTable, EncounterEntry } from '../data/pokemon'
import { buildLocation, Location } from '../utils/locations'
import PokemonAutocomplete from './PokemonAutocomplete'

interface CustomLocationFormProps {
  onCreate?: (location: Location) => void
  initialLocation?: Location | null
}

const blankEncounter = (): EncounterEntry => ({ pokemonId: '', rate: 0 })

export default function CustomLocationForm({ onCreate, initialLocation }: CustomLocationFormProps) {
  const [name, setName] = useState('Sunlit Clearing')
  const [region, setRegion] = useState('Custom')
  const [description, setDescription] = useState('A peaceful patch of shimmering grass.')
  const [encounters, setEncounters] = useState<EncounterEntry[]>(defaultEncounterTable)

  useEffect(() => {
    if (initialLocation) {
      setName(initialLocation.name)
      setRegion(initialLocation.region)
      setDescription(initialLocation.description)
      setEncounters(initialLocation.encounters)
    }
  }, [initialLocation])

  const totalRate = useMemo(
    () => encounters.reduce((sum, entry) => sum + (Number(entry.rate) || 0), 0),
    [encounters]
  )

  const handleEncounterChange = (index: number, field: keyof EncounterEntry, value: string) => {
    setEncounters((prev) => {
      const next = [...prev]
      next[index] = {
        ...next[index],
        [field]: field === 'rate' ? Number(value) : value,
      }
      return next
    })
  }

  const handleAddEncounter = () => {
    setEncounters((prev) => [...prev, blankEncounter()])
  }

  const handleRemoveEncounter = (index: number) => {
    setEncounters((prev) => prev.filter((_, idx) => idx !== index))
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const location = buildLocation({ 
      name, 
      region, 
      description, 
      encounters,
      id: initialLocation?.id
    })
    onCreate?.(location)
    if (!initialLocation) {
      setName('Route 1')
      setRegion('Custom')
      setDescription('Another hidden patch of grass.')
      setEncounters(defaultEncounterTable)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4"
    >

      <label className="block text-sm text-emerald-900">
        Name
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          className="mt-1 w-full rounded-2xl border border-emerald-200 bg-white px-3 py-2 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
          placeholder="Glittering Meadow"
          required
        />
      </label>

      <label className="block text-sm text-emerald-900">
        Region
        <input
          value={region}
          onChange={(event) => setRegion(event.target.value)}
          className="mt-1 w-full rounded-2xl border border-emerald-200 bg-white px-3 py-2 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
          placeholder="Unova"
        />
      </label>

      <label className="block text-sm text-emerald-900">
        Description
        <textarea
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          rows={2}
          className="mt-1 w-full rounded-2xl border border-emerald-200 bg-white px-3 py-2 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
        />
      </label>

      <div className="space-y-3">
        <div className="flex items-end justify-between">
          <p className="text-sm font-semibold text-emerald-900">Encounter table</p>
          <button
            type="button"
            onClick={handleAddEncounter}
            className="text-xs font-semibold uppercase tracking-wide text-emerald-600 hover:text-emerald-500"
          >
            + Add slot
          </button>
        </div>
        {encounters.map((entry, index) => (
          <div key={index} className="flex gap-2">
            <div className="flex-1">
              <PokemonAutocomplete
                value={entry.pokemonId}
                onChange={(pokemonId) => handleEncounterChange(index, 'pokemonId', pokemonId)}
                required
              />
            </div>
            <input
              type="number"
              min="1"
              max="100"
              value={entry.rate}
              onChange={(event) => handleEncounterChange(index, 'rate', event.target.value)}
              className="w-24 rounded-2xl border border-emerald-200 bg-white px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
              required
            />
            <button
              type="button"
              onClick={() => handleRemoveEncounter(index)}
              className="rounded-2xl border border-rose-100 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-rose-500 hover:border-rose-200"
            >
              Remove
            </button>
          </div>
        ))}
        <p className="text-xs text-emerald-900/70">Total rate: {totalRate}%</p>
      </div>

      <button
        type="submit"
        className="w-full rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-semibold uppercase tracking-wide text-white shadow hover:bg-emerald-400"
      >
        Save location
      </button>
    </form>
  )
}
