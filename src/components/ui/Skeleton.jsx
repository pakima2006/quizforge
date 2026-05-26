export function Skeleton({ className = '', ...props }) {
  return (
    <div
      className={`bg-forge-muted/30 rounded-lg shimmer-bg ${className}`}
      {...props}
    />
  )
}

export function QuizCardSkeleton() {
  return (
    <div className="card p-5 space-y-4">
      <div className="flex items-start justify-between">
        <Skeleton className="h-5 w-3/5" />
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>
      <Skeleton className="h-3.5 w-4/5" />
      <Skeleton className="h-3 w-2/5" />
      <div className="flex gap-2 pt-1">
        <Skeleton className="h-8 w-20 rounded-lg" />
        <Skeleton className="h-8 w-20 rounded-lg" />
      </div>
    </div>
  )
}
