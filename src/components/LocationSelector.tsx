import { Location } from '../utils/locations'

interface LocationSelectorProps {
  locations?: Location[]
  selectedLocation: Location | null
  onSelectLocation?: (location: Location | null) => void
  onRemoveLocation?: (locationId: string) => void
}

export default function LocationSelector({
  locations = [],
  selectedLocation,
  onSelectLocation,
  onRemoveLocation,
}: LocationSelectorProps) {
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = event.target.value
    const nextLocation = locations.find((loc) => loc.id === selectedId) ?? null
    onSelectLocation?.(nextLocation)
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-semibold uppercase tracking-wide text-emerald-900">
        Location
      </label>
      <select
        className="w-full rounded-2xl border border-emerald-200 bg-white px-4 py-3 text-emerald-900 shadow-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-200"
        value={selectedLocation?.id ?? ''}
        onChange={handleChange}
      >
        <option value="" disabled>
          Pick a route or forest
        </option>
        {locations.map((location) => (
          <option key={location.id} value={location.id}>
            {location.isCustom ? '⭐ ' : ''}
            {location.name} · {location.region}
          </option>
        ))}
      </select>
      {selectedLocation && (
        <div className="rounded-2xl border border-emerald-100 bg-emerald-50/70 px-4 py-3 text-sm text-emerald-900/80">
          <p className="font-semibold text-emerald-900">{selectedLocation.name}</p>
          <p>{selectedLocation.description}</p>
          {selectedLocation.isCustom && (
            <button
              type="button"
              onClick={() => onRemoveLocation?.(selectedLocation.id)}
              className="mt-3 text-xs font-semibold uppercase tracking-wide text-rose-600 hover:text-rose-500"
            >
              Remove custom location
            </button>
          )}
        </div>
      )}
    </div>
  )
}
