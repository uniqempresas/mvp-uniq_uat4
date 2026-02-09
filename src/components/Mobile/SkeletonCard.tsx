export default function SkeletonCard() {
    return (
        <div className="rounded-lg border border-slate-100 dark:border-slate-700 p-4 bg-white dark:bg-slate-800 animate-pulse">
            <div className="flex items-start gap-3">
                {/* Avatar/Icon placeholder */}
                <div className="w-12 h-12 bg-slate-200 dark:bg-slate-700 rounded-lg shrink-0" />

                <div className="flex-1 space-y-3">
                    {/* Title */}
                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />

                    {/* Subtitle */}
                    <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2" />

                    {/* Fields */}
                    <div className="space-y-2">
                        <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-2/3" />
                        <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/3" />
                    </div>
                </div>
            </div>
        </div>
    )
}
