interface GridSize {
  rows: number
  cols: number
}

interface GridControlsProps {
  gridSize: GridSize
  onChange?: (gridSize: GridSize) => void
}

const clamp = (value: number, min: number, max: number): number => Math.min(max, Math.max(min, value))

export default function GridControls({ gridSize, onChange }: GridControlsProps) {
  const handleUpdate = (key: keyof GridSize, value: string) => {
    const parsed = clamp(Number(value) || 5, 2, 10)
    onChange?.({ ...gridSize, [key]: parsed })
  }

  return (
    <div className="rounded-3xl border border-emerald-100 bg-white/90 p-4 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-emerald-500">Grass size</p>
      <div className="mt-3 flex items-center gap-3">
        <label className="flex flex-1 flex-col text-sm text-emerald-900">
          Rows
          <input
            type="range"
            min="2"
            max="10"
            value={gridSize.rows}
            onChange={(event) => handleUpdate('rows', event.target.value)}
            className="mt-2"
          />
          <span className="text-xs text-emerald-700">{gridSize.rows} tiles tall</span>
        </label>
        <label className="flex flex-1 flex-col text-sm text-emerald-900">
          Columns
          <input
            type="range"
            min="2"
            max="10"
            value={gridSize.cols}
            onChange={(event) => handleUpdate('cols', event.target.value)}
            className="mt-2"
          />
          <span className="text-xs text-emerald-700">{gridSize.cols} tiles wide</span>
        </label>
      </div>
    </div>
  )
}
