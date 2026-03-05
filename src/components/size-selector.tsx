'use client'

import { useState } from 'react'
import { Plus, X } from 'lucide-react'

type SizeSelectorProps = {
    sizes: string[]
    onChange: (sizes: string[]) => void
}

export function SizeSelector({ sizes, onChange }: SizeSelectorProps) {
    const [newSize, setNewSize] = useState('')
    const [showInput, setShowInput] = useState(false)

    const addSize = () => {
        const trimmedSize = newSize.trim()
        if (trimmedSize && !sizes.includes(trimmedSize)) {
            onChange([...sizes, trimmedSize])
            setNewSize('')
            setShowInput(false)
        }
    }

    const removeSize = (sizeToRemove: string) => {
        onChange(sizes.filter(s => s !== sizeToRemove))
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            addSize()
        }
    }

    // Quick size presets: shirt, shoe (US/UK), generic, dimensions
    const presets: Record<string, string[]> = {
        'Shirt': ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
        'Shoe (US)': ['6', '7', '8', '9', '10', '11', '12'],
        'Shoe (UK)': ['5', '6', '7', '8', '9', '10', '11'],
        'Generic': ['Small', 'Medium', 'Large'],
        'One Size': ['One Size'],
        'Dimensions': ['30×40 cm', '40×60 cm', '50×70 cm', '60×90 cm'],
    }

    const applyPreset = (preset: string[]) => {
        onChange(preset)
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Sizes</label>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                    {sizes.length} size{sizes.length !== 1 ? 's' : ''}
                </span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
                Choose a preset (shirt, shoe US/UK, generic, dimensions) or add custom values.
            </p>

            {/* Quick Presets */}
            <div className="space-y-2">
                <p className="text-xs font-medium text-gray-600 dark:text-gray-400">Quick presets:</p>
                <div className="flex flex-wrap gap-2">
                    {Object.entries(presets).map(([name, preset]) => (
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
            </div>

            {/* Current Sizes */}
            {sizes.length > 0 && (
                <div className="flex flex-wrap gap-2 p-4 rounded-xl bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800">
                    {sizes.map((size) => (
                        <div
                            key={size}
                            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white dark:bg-black border border-gray-200 dark:border-zinc-800"
                        >
                            <span className="text-sm font-bold">{size}</span>
                            <button
                                type="button"
                                onClick={() => removeSize(size)}
                                className="p-0.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                            >
                                <X className="w-3 h-3 text-red-600" />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Add Custom Size */}
            {showInput ? (
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={newSize}
                        onChange={(e) => setNewSize(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="e.g. M, 10, 30×40 cm, One Size"
                        className="flex-1 h-10 px-4 rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-black text-sm focus:ring-1 focus:ring-black dark:focus:ring-white outline-none"
                        autoFocus
                    />
                    <button
                        type="button"
                        onClick={addSize}
                        className="px-4 h-10 rounded-xl bg-black dark:bg-white text-white dark:text-black text-sm font-bold hover:opacity-90 transition-opacity"
                    >
                        Add
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            setShowInput(false)
                            setNewSize('')
                        }}
                        className="px-4 h-10 rounded-xl border border-gray-200 dark:border-zinc-800 text-sm font-bold hover:bg-gray-50 dark:hover:bg-zinc-900 transition-colors"
                    >
                        Cancel
                    </button>
                </div>
            ) : (
                <button
                    type="button"
                    onClick={() => setShowInput(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-dashed border-gray-300 dark:border-zinc-700 hover:border-black dark:hover:border-white transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    <span className="text-sm font-bold">Add Custom Size</span>
                </button>
            )}

            {sizes.length === 0 && (
                <p className="text-xs text-gray-500 dark:text-gray-400 italic">
                    No sizes added yet. Use quick presets or add custom sizes.
                </p>
            )}
        </div>
    )
}
