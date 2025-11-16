import { getPokemonById, Pokemon, EncounterEntry } from '../data/pokemon'

interface NormalizedEntry extends EncounterEntry {
  cumulative: number
}

interface RollOptions {
  shinyChance?: number
}

export interface EncounterResult {
  status: 'hit' | 'miss'
  pokemon?: Pokemon
  isShiny?: boolean
  spriteUrl?: string
  rarity?: number
}

const clampRate = (rate: number): number => Math.max(0, Number(rate) || 0)

export const normalizeEncounterRates = (encounters: EncounterEntry[] = []): NormalizedEntry[] => {
  const total = encounters.reduce((sum, entry) => sum + clampRate(entry.rate), 0)
  if (!total) return []

  let running = 0
  return encounters
    .map((entry) => ({ ...entry, rate: clampRate(entry.rate) / total }))
    .map((entry) => {
      running += entry.rate
      return { ...entry, cumulative: running }
    })
}

export const rollEncounter = (encounters: EncounterEntry[] = [], options: RollOptions = {}): EncounterResult => {
  const table = normalizeEncounterRates(encounters)
  if (!table.length) return { status: 'miss' }

  const roll = Math.random()
  const selected = table.find((entry) => roll <= entry.cumulative) ?? table.at(-1)

  const shinyChance = options.shinyChance ?? 0.02
  const shinyRoll = Math.random()
  const isShiny = shinyRoll < shinyChance
  const pokemon = getPokemonById(selected?.pokemonId)

  if (!pokemon) return { status: 'miss' }

  // Calculate rarity: 1-3 exclamation marks based on encounter rate
  // Higher rate = 1, medium = 2, lower = 3
  const encounterRate = selected?.rate ?? 0
  let rarity = 1
  if (encounterRate < 0.15) rarity = 3 // < 15%
  else if (encounterRate < 0.30) rarity = 2 // 15-30%

  return {
    status: 'hit',
    pokemon,
    isShiny,
    spriteUrl: isShiny ? pokemon.sprites.shiny : pokemon.sprites.regular,
    rarity,
  }
}

export const createEncounterSummary = (encounters: EncounterEntry[] = []) => {
  return normalizeEncounterRates(encounters).map((entry) => {
    const pokemon = getPokemonById(entry.pokemonId)
    return {
      pokemon,
      rate: Math.round(entry.rate * 1000) / 10,
    }
  })
}
