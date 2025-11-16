import { defaultEncounterTable, getPokemonById, EncounterEntry } from '../data/pokemon'
import { slugify } from './strings'

export interface Location {
  id: string
  name: string
  region: string
  description: string
  encounters: EncounterEntry[]
  isCustom: boolean
}

interface BuildLocationParams {
  id?: string
  name?: string
  region?: string
  description?: string
  encounters: EncounterEntry[]
}

export const sanitizeEncounters = (encounters: EncounterEntry[] = []): EncounterEntry[] => {
  const filtered = encounters
    .map((entry) => ({
      pokemonId: entry.pokemonId,
      rate: Number(entry.rate) || 0,
    }))
    .filter((entry) => Boolean(entry.pokemonId) && getPokemonById(entry.pokemonId))

  return filtered.length ? filtered : defaultEncounterTable
}

export const buildLocation = ({ id, name, region, description = '', encounters }: BuildLocationParams): Location => {
  const fallbackName = name?.trim() || 'Untitled Meadow'
  return {
    id: id || slugify(`${fallbackName}-${Date.now()}`),
    name: fallbackName,
    region: region?.trim() || 'Custom',
    description: description.trim() || 'A custom patch of grass.',
    encounters: sanitizeEncounters(encounters),
    isCustom: true,
  }
}
