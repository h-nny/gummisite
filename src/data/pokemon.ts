const SPRITE_BASE = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon'

export interface PokemonSprites {
  regular: string
  shiny: string
}

export interface Pokemon {
  id: string
  name: string
  dexNumber: number
  generation: number
  sprites: PokemonSprites
}

// Try Gen 5 animated first, fallback to Gen 5 static if needed
const makeSprites = (dexNumber: number): PokemonSprites => ({
  regular: `${SPRITE_BASE}/versions/generation-v/black-white/animated/${dexNumber}.gif`,
  shiny: `${SPRITE_BASE}/versions/generation-v/black-white/animated/shiny/${dexNumber}.gif`,
})

export const pokemonList: Pokemon[] = [
  // Gen 1 (Kanto) - 1-151
  { id: 'bulbasaur', name: 'Bulbasaur', dexNumber: 1, generation: 1, sprites: makeSprites(1) },
  { id: 'charmander', name: 'Charmander', dexNumber: 4, generation: 1, sprites: makeSprites(4) },
  { id: 'squirtle', name: 'Squirtle', dexNumber: 7, generation: 1, sprites: makeSprites(7) },
  { id: 'pikachu', name: 'Pikachu', dexNumber: 25, generation: 1, sprites: makeSprites(25) },
  { id: 'rattata', name: 'Rattata', dexNumber: 19, generation: 1, sprites: makeSprites(19) },
  { id: 'pidgey', name: 'Pidgey', dexNumber: 16, generation: 1, sprites: makeSprites(16) },
  { id: 'eevee', name: 'Eevee', dexNumber: 133, generation: 1, sprites: makeSprites(133) },
  { id: 'meowth', name: 'Meowth', dexNumber: 52, generation: 1, sprites: makeSprites(52) },
  { id: 'psyduck', name: 'Psyduck', dexNumber: 54, generation: 1, sprites: makeSprites(54) },
  { id: 'magikarp', name: 'Magikarp', dexNumber: 129, generation: 1, sprites: makeSprites(129) },
  
  // Gen 2 (Johto) - 152-251
  { id: 'chikorita', name: 'Chikorita', dexNumber: 152, generation: 2, sprites: makeSprites(152) },
  { id: 'cyndaquil', name: 'Cyndaquil', dexNumber: 155, generation: 2, sprites: makeSprites(155) },
  { id: 'totodile', name: 'Totodile', dexNumber: 158, generation: 2, sprites: makeSprites(158) },
  { id: 'sentret', name: 'Sentret', dexNumber: 161, generation: 2, sprites: makeSprites(161) },
  { id: 'hoothoot', name: 'Hoothoot', dexNumber: 163, generation: 2, sprites: makeSprites(163) },
  { id: 'mareep', name: 'Mareep', dexNumber: 179, generation: 2, sprites: makeSprites(179) },
  { id: 'togepi', name: 'Togepi', dexNumber: 175, generation: 2, sprites: makeSprites(175) },
  { id: 'marill', name: 'Marill', dexNumber: 183, generation: 2, sprites: makeSprites(183) },
  
  // Gen 3 (Hoenn) - 252-386
  { id: 'treecko', name: 'Treecko', dexNumber: 252, generation: 3, sprites: makeSprites(252) },
  { id: 'torchic', name: 'Torchic', dexNumber: 255, generation: 3, sprites: makeSprites(255) },
  { id: 'mudkip', name: 'Mudkip', dexNumber: 258, generation: 3, sprites: makeSprites(258) },
  { id: 'poochyena', name: 'Poochyena', dexNumber: 261, generation: 3, sprites: makeSprites(261) },
  { id: 'zigzagoon', name: 'Zigzagoon', dexNumber: 263, generation: 3, sprites: makeSprites(263) },
  { id: 'wurmple', name: 'Wurmple', dexNumber: 265, generation: 3, sprites: makeSprites(265) },
  { id: 'ralts', name: 'Ralts', dexNumber: 280, generation: 3, sprites: makeSprites(280) },
  { id: 'skitty', name: 'Skitty', dexNumber: 300, generation: 3, sprites: makeSprites(300) },
  
  // Gen 4 (Sinnoh) - 387-493
  { id: 'turtwig', name: 'Turtwig', dexNumber: 387, generation: 4, sprites: makeSprites(387) },
  { id: 'chimchar', name: 'Chimchar', dexNumber: 390, generation: 4, sprites: makeSprites(390) },
  { id: 'piplup', name: 'Piplup', dexNumber: 393, generation: 4, sprites: makeSprites(393) },
  { id: 'starly', name: 'Starly', dexNumber: 396, generation: 4, sprites: makeSprites(396) },
  { id: 'bidoof', name: 'Bidoof', dexNumber: 399, generation: 4, sprites: makeSprites(399) },
  { id: 'shinx', name: 'Shinx', dexNumber: 403, generation: 4, sprites: makeSprites(403) },
  { id: 'pachirisu', name: 'Pachirisu', dexNumber: 417, generation: 4, sprites: makeSprites(417) },
  
  // Gen 5 (Unova) - 494-649
  { id: 'snivy', name: 'Snivy', dexNumber: 495, generation: 5, sprites: makeSprites(495) },
  { id: 'tepig', name: 'Tepig', dexNumber: 498, generation: 5, sprites: makeSprites(498) },
  { id: 'oshawott', name: 'Oshawott', dexNumber: 501, generation: 5, sprites: makeSprites(501) },
  { id: 'patrat', name: 'Patrat', dexNumber: 504, generation: 5, sprites: makeSprites(504) },
  { id: 'lillipup', name: 'Lillipup', dexNumber: 506, generation: 5, sprites: makeSprites(506) },
  { id: 'purrloin', name: 'Purrloin', dexNumber: 509, generation: 5, sprites: makeSprites(509) },
  { id: 'blitzle', name: 'Blitzle', dexNumber: 522, generation: 5, sprites: makeSprites(522) },
  { id: 'audino', name: 'Audino', dexNumber: 531, generation: 5, sprites: makeSprites(531) },
  { id: 'pidove', name: 'Pidove', dexNumber: 519, generation: 5, sprites: makeSprites(519) },
  { id: 'sewaddle', name: 'Sewaddle', dexNumber: 540, generation: 5, sprites: makeSprites(540) },
  { id: 'venipede', name: 'Venipede', dexNumber: 543, generation: 5, sprites: makeSprites(543) },
  { id: 'pansear', name: 'Pansear', dexNumber: 513, generation: 5, sprites: makeSprites(513) },
]

export const getPokemonById = (id: string): Pokemon | null => pokemonList.find((pokemon) => pokemon.id === id) || null

export interface EncounterEntry {
  pokemonId: string
  rate: number
}

export const defaultEncounterTable: EncounterEntry[] = pokemonList.slice(0, 5).map((pokemon, index) => ({
  pokemonId: pokemon.id,
  rate: [40, 30, 15, 10, 5][index] ?? 5,
}))
