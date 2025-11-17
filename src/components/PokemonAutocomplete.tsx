import { useState, useRef, useEffect } from 'react'
import { pokemonList } from '../data/pokemon'

interface PokemonAutocompleteProps {
  value: string
  onChange: (pokemonId: string) => void
  required?: boolean
}

export default function PokemonAutocomplete({ value, onChange, required }: PokemonAutocompleteProps) {
  const [input, setInput] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(0)
  const wrapperRef = useRef<HTMLDivElement>(null)

  const selectedPokemon = pokemonList.find((p) => p.id === value)

  useEffect(() => {
    if (selectedPokemon) {
      setInput(selectedPokemon.name)
    }
  }, [selectedPokemon])

  const filteredPokemon = input.trim()
    ? pokemonList.filter((pokemon) =>
        pokemon.name.toLowerCase().includes(input.toLowerCase())
      )
    : pokemonList

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newInput = e.target.value
    setInput(newInput)
    setIsOpen(true)
    setHighlightedIndex(0)
    if (!newInput.trim()) {
      onChange('')
    }
  }

  const selectPokemon = (pokemonId: string) => {
    const pokemon = pokemonList.find((p) => p.id === pokemonId)
    if (pokemon) {
      setInput(pokemon.name)
      onChange(pokemonId)
      setIsOpen(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'Enter') {
        setIsOpen(true)
      }
      return
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setHighlightedIndex((prev) => (prev + 1) % filteredPokemon.length)
        break
      case 'ArrowUp':
        e.preventDefault()
        setHighlightedIndex((prev) => (prev - 1 + filteredPokemon.length) % filteredPokemon.length)
        break
      case 'Enter':
        e.preventDefault()
        if (filteredPokemon[highlightedIndex]) {
          selectPokemon(filteredPokemon[highlightedIndex].id)
        }
        break
      case 'Escape':
        setIsOpen(false)
        break
    }
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div ref={wrapperRef} className="relative">
      <input
        type="text"
        value={input}
        onChange={handleInputChange}
        onFocus={() => setIsOpen(true)}
        onKeyDown={handleKeyDown}
        placeholder="Type to search Pokémon..."
        required={required}
        className="w-full rounded-2xl border border-emerald-200 bg-white px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
      />
      {isOpen && filteredPokemon.length > 0 && (
        <div className="absolute z-10 mt-1 max-h-60 w-full overflow-y-auto rounded-2xl border border-emerald-200 bg-white shadow-lg">
          {filteredPokemon.map((pokemon, index) => (
            <button
              key={pokemon.id}
              type="button"
              onClick={() => selectPokemon(pokemon.id)}
              className={`w-full px-3 py-2 text-left text-sm transition ${
                index === highlightedIndex
                  ? 'bg-emerald-100 text-emerald-900'
                  : 'text-emerald-900 hover:bg-emerald-50'
              }`}
              onMouseEnter={() => setHighlightedIndex(index)}
            >
              {pokemon.name}
              <span className="ml-2 text-xs text-emerald-600">Gen {pokemon.generation}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
