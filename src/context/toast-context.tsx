'use client'

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react'

type ToastType = 'success' | 'error' | 'info'

interface Toast {
    id: string
    message: string
    type: ToastType
}

interface ToastContextType {
    toast: (message: string, type?: ToastType) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([])

    const toast = useCallback((message: string, type: ToastType = 'success') => {
        const id = Math.random().toString(36).substr(2, 9)
        setToasts(prev => [...prev, { id, message, type }])
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id))
        }, 3500)
    }, [])

    const removeToast = (id: string) => {
        setToasts(prev => prev.filter(t => t.id !== id))
    }

    return (
        <ToastContext.Provider value={{ toast }}>
            {children}
            <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
                {toasts.map((t) => (
                    <div
                        key={t.id}
                        className={`
                            pointer-events-auto min-w-[300px]
                            flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl 
                            animate-in slide-in-from-right-10 fade-in duration-300
                            border
                            ${t.type === 'success' ? 'bg-black text-white dark:bg-white dark:text-black border-black dark:border-white' :
                                t.type === 'error' ? 'bg-red-600 text-white border-red-700' :
                                    'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white border-gray-200 dark:border-zinc-800'}
                        `}
                    >
                        {t.type === 'success' && <CheckCircle className="w-5 h-5 shrink-0" />}
                        {t.type === 'error' && <XCircle className="w-5 h-5 shrink-0" />}
                        {t.type === 'info' && <AlertCircle className="w-5 h-5 shrink-0" />}

                        <span className="text-sm font-bold tracking-tight flex-1">{t.message}</span>

                        <button
                            onClick={() => removeToast(t.id)}
                            className="p-1 hover:opacity-50 transition-opacity shrink-0"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    )
}

export function useToast() {
    const context = useContext(ToastContext)
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider')
    }
    return context
}
