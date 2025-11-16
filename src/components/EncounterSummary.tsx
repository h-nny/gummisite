import { createEncounterSummary } from '../utils/encounters'
import { EncounterEntry } from '../data/pokemon'

interface EncounterSummaryProps {
  encounters?: EncounterEntry[]
}

export default function EncounterSummary({ encounters = [] }: EncounterSummaryProps) {
  const summary = createEncounterSummary(encounters)

  if (!summary.length) {
    return (
      <p className="text-sm text-emerald-900/70">No encounter data yet. Add some Pokémon!</p>
    )
  }

  return (
    <ul className="space-y-2">
      {summary.map(({ pokemon, rate }, idx) => (
        <li
          key={pokemon?.id ?? idx}
          className="flex items-center justify-between rounded-2xl border border-emerald-100/80 bg-white/80 px-3 py-2"
        >
          <div className="flex items-center gap-3">
            {pokemon?.sprites?.regular && (
              <img
                src={pokemon.sprites.regular}
                alt={pokemon.name}
                className="h-8 w-8"
                loading="lazy"
              />
            )}
            <span className="font-medium text-emerald-900">{pokemon?.name ?? 'Unknown'}</span>
          </div>
          <span className="text-sm font-semibold text-emerald-700">{rate.toFixed(1)}%</span>
        </li>
      ))}
    </ul>
  )
}
