import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Eye } from 'lucide-react'
import { webRoute } from '@/lib/route'
import type { Professor } from '#/model'

type ProfessorCollectionProps = { professors: Professor[] }

export function ProfessorCollection({ professors }: ProfessorCollectionProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {professors.map((professor) => (
        <Card key={professor.id} className="flex flex-col h-full">
          <CardHeader>
            <div className="grid grid-cols-1 gap-4">
              <Badge>{professor.department.name}</Badge>

              <CardTitle className="text-xl">
                {professor.firstname} {professor.name}
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="flex-grow">
            <div className="space-y-3">
              <div className="text-sm text-muted-foreground">
                <span>Genre: {professor.gender}</span>
              </div>
              <div className="text-sm text-muted-foreground">
                <span>Cours: {professor.courses.length}</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="pt-2">
            <Link
              href={webRoute('professor.show', { id: professor.id })}
              className="w-full"
            >
              <Button variant="outline" size="sm" className="w-full">
                <Eye className="h-4 w-4 mr-2" />
                Voir les détails
              </Button>
            </Link>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
