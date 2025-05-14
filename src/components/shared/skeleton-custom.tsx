import { Skeleton } from "@/components/ui/skeleton"

interface SkeletonTableProps {
  rows?: number
  columns?: number
  hasHeader?: boolean
  hasActions?: boolean
  className?: string
}

export const SkeletonTable = ({
  rows = 5,
  columns = 4,
  hasHeader = true,
  hasActions = true,
  className,
}: SkeletonTableProps) => {
  return (
    <div className={`w-full space-y-4 ${className}`}>
      {/* Table */}
      <div className="w-full overflow-auto rounded-md border">
        <table className="w-full caption-bottom text-sm">
          {hasHeader && (
            <thead className="[&_tr]:border-b">
              <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                {Array.from({ length: columns }).map((_, index) => (
                  <th key={`header-${index}`} className="h-12 px-4 text-left align-middle font-medium">
                    <Skeleton className="h-4 w-24 md:w-32" />
                  </th>
                ))}
                {hasActions && (
                  <th className="h-12 w-[100px] px-4 text-left align-middle font-medium">
                    <Skeleton className="h-4 w-16" />
                  </th>
                )}
              </tr>
            </thead>
          )}
          <tbody className="[&_tr:last-child]:border-0">
            {Array.from({ length: rows }).map((_, rowIndex) => (
              <tr
                key={`row-${rowIndex}`}
                className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
              >
                {Array.from({ length: columns }).map((_, colIndex) => (
                  <td key={`cell-${rowIndex}-${colIndex}`} className="p-4 align-middle">
                    <Skeleton className={`h-4 ${colIndex === 0 ? "w-24 md:w-32" : "w-full max-w-[150px]"}`} />
                  </td>
                ))}
                {hasActions && (
                  <td className="p-4 align-middle">
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-8 w-8 rounded-md" />
                      <Skeleton className="h-8 w-8 rounded-md" />
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-2">
        <div className="flex-1 text-sm text-muted-foreground">
          <Skeleton className="h-4 w-40" />
        </div>
        <div className="flex items-center space-x-6 lg:space-x-8">
          <div className="flex items-center space-x-2">
            <Skeleton className="h-8 w-24" />
          </div>
          <div className="flex w-[100px] items-center justify-center text-sm font-medium">
            <Skeleton className="h-8 w-20" />
          </div>
          <div className="flex items-center space-x-2">
            <Skeleton className="h-8 w-8 rounded-md" />
            <Skeleton className="h-8 w-8 rounded-md" />
            <Skeleton className="h-8 w-8 rounded-md" />
            <Skeleton className="h-8 w-8 rounded-md" />
          </div>
        </div>
      </div>
    </div>
  )
}
