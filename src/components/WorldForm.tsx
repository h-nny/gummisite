import { useState } from 'react'
import { slugify } from '../utils/strings'
import { World } from '../hooks/useWorlds'

interface WorldFormProps {
  onCreate: (world: World) => void
}

export default function WorldForm({ onCreate }: WorldFormProps) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const world: World = {
      id: slugify(`${name}-${Date.now()}`),
      name: name.trim(),
      description: description.trim(),
      locations: [],
      createdAt: Date.now(),
    }
    onCreate(world)
    setName('')
    setDescription('')
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-[32px] border border-emerald-100 bg-white/90 p-5 shadow-sm"
    >
      <div className="mb-4">
        <p className="text-sm font-bold uppercase tracking-wide text-emerald-500">Create a world</p>
        <p className="text-xs text-emerald-900/70">A world groups your custom routes and locations.</p>
      </div>

      <label className="block text-sm text-emerald-900">
        World Name
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          className="mt-1 w-full rounded-2xl border border-emerald-200 bg-white px-3 py-2 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
          placeholder="My Adventure"
          required
        />
      </label>

      <label className="mt-3 block text-sm text-emerald-900">
        Description
        <textarea
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          rows={2}
          className="mt-1 w-full rounded-2xl border border-emerald-200 bg-white px-3 py-2 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
          placeholder="A collection of my favorite routes"
        />
      </label>

      <button
        type="submit"
        className="mt-4 w-full rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-semibold uppercase tracking-wide text-white shadow hover:bg-emerald-400"
      >
        Create World
      </button>
    </form>
  )
}
