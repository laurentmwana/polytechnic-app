import { Option } from '#/model'
import { ConfirmationAction } from '@/components/ui/action-confirmation'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ago } from '@/lib/date-time'
import { webRoute } from '@/lib/route'
import { excerpt } from '@/lib/utils'
import { Eye, Pen } from 'lucide-react'
import Link from 'next/link'

type OptionTableProps = { options: Option[] }

export const OptionTable = ({ options }: OptionTableProps) => {
  const onDelete = (password: string) => {
    console.log(password)
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nom</TableHead>
          <TableHead>Alias</TableHead>
          <TableHead>Promotions</TableHead>
          <TableHead>Créer</TableHead>
          <TableHead className="lg:text-end">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {options.map((option) => {
          return (
            <TableRow key={option.id}>
              <TableCell>{excerpt(option.name)}</TableCell>
              <TableCell>{excerpt(option.alias)}</TableCell>
              <TableCell>
                <Badge variant="secondary">{option.levels.length}</Badge>
              </TableCell>
              <TableCell>
                <p className="text-sm text-muted-foreground">
                  {ago(option.created_at)}
                </p>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-4 lg:justify-end">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={webRoute('~option.edit', { id: option.id })}>
                      <Pen size={15} />
                    </Link>
                  </Button>

                  <Button variant="secondary" size="sm" asChild>
                    <Link href={webRoute('~option.show', { id: option.id })}>
                      <Eye size={15} />
                    </Link>
                  </Button>

                  <ConfirmationAction onInput={onDelete} />
                </div>
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}
