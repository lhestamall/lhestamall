'use client'

import { useState } from 'react'
import { Plus, X } from 'lucide-react'

type ColorListEditorProps = {
  colors: string[]
  onChange: (colors: string[]) => void
}

const COLOR_PRESETS: Record<string, string[]> = {
  'Basics': ['Black', 'White', 'Gray', 'Navy', 'Beige'],
  'Neutrals': ['Black', 'White', 'Gray', 'Charcoal', 'Cream', 'Brown'],
  'Jewel': ['Red', 'Emerald', 'Sapphire', 'Gold', 'Burgundy'],
  'Pastels': ['Blush', 'Mint', 'Lavender', 'Sky Blue', 'Peach'],
  'Earth': ['Brown', 'Olive', 'Tan', 'Rust', 'Terracotta'],
}

export function ColorListEditor({ colors, onChange }: ColorListEditorProps) {
  const [newColor, setNewColor] = useState('')

  const addColor = () => {
    const trimmed = newColor.trim()
    if (trimmed && !colors.includes(trimmed)) {
      onChange([...colors, trimmed])
      setNewColor('')
    }
  }

  const removeColor = (c: string) => {
    onChange(colors.filter((x) => x !== c))
  }

  const applyPreset = (preset: string[]) => {
    const combined = [...new Set([...colors, ...preset])]
    onChange(combined)
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">Colors</label>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {colors.length} color{colors.length !== 1 ? 's' : ''}
        </span>
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-400">
        Add color names or use a preset (e.g. Red, Navy, #hex).
      </p>

      {/* Color presets */}
      <div className="flex flex-wrap gap-2">
        <span className="text-xs font-medium text-gray-600 dark:text-gray-400 sr-only">Presets:</span>
        {Object.entries(COLOR_PRESETS).map(([name, preset]) => (
          <button
            key={name}
            type="button"
            onClick={() => applyPreset(preset)}
            className="px-3 py-1 text-xs font-medium rounded-lg border border-gray-200 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-900 transition-colors"
          >
            {name}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        {colors.map((c) => (
          <span
            key={c}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-sm"
          >
            {c}
            <button type="button" onClick={() => removeColor(c)} className="p-0.5 hover:bg-red-100 dark:hover:bg-red-900/30 rounded">
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
        <div className="flex gap-2">
          <input
            type="text"
            value={newColor}
            onChange={(e) => setNewColor(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addColor())}
            placeholder="Add color"
            className="h-9 w-32 rounded-lg border border-gray-200 dark:border-zinc-800 bg-white dark:bg-black px-3 text-sm focus:ring-1 focus:ring-black dark:focus:ring-white outline-none"
          />
          <button type="button" onClick={addColor} className="h-9 px-3 rounded-lg border border-gray-200 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-900 flex items-center gap-1 text-sm font-medium">
            <Plus className="w-4 h-4" /> Add
          </button>
        </div>
      </div>
    </div>
  )
}
