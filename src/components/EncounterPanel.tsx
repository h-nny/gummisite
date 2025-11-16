import { EncounterResult } from '../utils/encounters'

interface EncounterPanelProps {
  encounter: (EncounterResult & { locationName?: string }) | null
}

export default function EncounterPanel({ encounter }: EncounterPanelProps) {
  if (!encounter) {
    return (
      <div className="rounded-3xl border border-emerald-100 bg-white/80 p-5 shadow-card">
        <p className="text-sm text-emerald-900/70">Tap a grass tile to look for Pokémon.</p>
      </div>
    )
  }

  if (encounter.status === 'miss') {
    return (
      <div className="rounded-3xl border border-amber-100 bg-amber-50/80 p-5 text-amber-900 shadow-card">
        <p className="text-lg font-semibold">No encounter.</p>
        <p className="text-sm">The grass rustled, but nothing appeared this time.</p>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-4 rounded-3xl border border-emerald-100 bg-white/90 p-5 shadow-card">
      <div className="relative flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-100">
        {encounter.spriteUrl && (
          <img
            src={encounter.spriteUrl}
            alt={encounter.pokemon?.name}
            className="h-20 w-20 object-contain drop-shadow-[0_12px_10px_rgba(0,0,0,0.35)]"
          />
        )}
        {encounter.isShiny && (
          <span className="absolute -top-2 -right-2 rounded-full bg-yellow-400 px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-amber-900 shadow">
            Shiny!
          </span>
        )}
      </div>
      <div>
        <p className="text-sm uppercase tracking-wide text-emerald-500">Encountered</p>
        <p className="text-2xl font-black text-emerald-900">{encounter.pokemon?.name}</p>
        <p className="text-sm text-emerald-800/80">{encounter.locationName}</p>
      </div>
    </div>
  )
}
