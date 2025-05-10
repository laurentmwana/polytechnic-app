import { Department } from '#/model'
import { SkeletonTable } from '@/components/shared/skeleton-custom'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

type DataResulProps = {
  departments: Department[]
  isLoading: boolean
}

export const DataResul = ({
  departments,
  isLoading,
}: DataResulProps) => {
  if (isLoading) {
    return <SkeletonTable rows={6} />
  }

  console.log(departments)

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nom</TableHead>
          <TableHead>Filières (options)</TableHead>
          <TableHead>Créer</TableHead>
          <TableHead className="lg:text-end">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {departments.map((department) => {
          return (
            <TableRow key={department.id}>
              <TableCell>{department.name}</TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}
