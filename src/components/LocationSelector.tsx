import { Location } from '../utils/locations'

interface LocationSelectorProps {
  locations?: Location[]
  selectedLocation: Location | null
  onSelectLocation?: (location: Location | null) => void
  onRemoveLocation?: (locationId: string) => void
  onCreateNew?: () => void
  onEdit?: (location: Location) => void
}

export default function LocationSelector({
  locations = [],
  selectedLocation,
  onSelectLocation,
  onRemoveLocation,
  onCreateNew,
  onEdit,
}: LocationSelectorProps) {
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = event.target.value
    const nextLocation = locations.find((loc) => loc.id === selectedId) ?? null
    onSelectLocation?.(nextLocation)
  }

  return (
    <div className="rounded-[32px] border border-emerald-100 bg-white/90 p-5">
      <div className="mb-2 flex items-center justify-between">
        <p className="text-sm font-semibold uppercase tracking-wide text-emerald-500">Location</p>
        <button
          onClick={onCreateNew}
          className="text-xs font-semibold uppercase tracking-wide text-blue-600 hover:text-blue-700"
        >
          + New Location
        </button>
      </div>
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
            {location.name} · {location.region}
          </option>
        ))}
      </select>
      {selectedLocation && (
        <div className="mt-4 rounded-2xl border border-emerald-100 bg-emerald-50/70 px-4 py-3 text-sm text-emerald-900/80">
          <p className="font-semibold text-emerald-900">{selectedLocation.name}</p>
          <p>{selectedLocation.description}</p>
          {selectedLocation.isCustom && (
            <div className="mt-3 flex gap-3">
              <button
                type="button"
                onClick={() => onEdit?.(selectedLocation)}
                className="text-xs font-semibold uppercase tracking-wide text-blue-600 hover:text-blue-700"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => onRemoveLocation?.(selectedLocation.id)}
                className="text-xs font-semibold uppercase tracking-wide text-rose-600 hover:text-rose-500"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
