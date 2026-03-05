export function ProductCardSkeleton() {
    return (
        <div className="group relative animate-pulse">
            <div className="relative aspect-square rounded-3xl overflow-hidden bg-gray-100 dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800" />
            <div className="space-y-4 px-2 mt-4">
                <div className="space-y-1">
                    <div className="flex items-center justify-between">
                        <div className="h-3 bg-gray-100 dark:bg-zinc-900 rounded w-20" />
                        <div className="h-3 bg-gray-100 dark:bg-zinc-900 rounded w-16" />
                    </div>
                    <div className="h-6 bg-gray-100 dark:bg-zinc-900 rounded w-3/4" />
                </div>
            </div>
        </div>
    )
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 sm:gap-10">
            {Array.from({ length: count }).map((_, i) => (
                <ProductCardSkeleton key={i} />
            ))}
        </div>
    )
}
