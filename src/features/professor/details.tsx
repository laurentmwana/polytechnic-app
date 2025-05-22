import { Professor } from '#/model'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { BookOpen, Calendar, User } from 'lucide-react'

type ProfessorDetailsProps = { professor: Professor }

export const ProfessorDetails = ({ professor }: ProfessorDetailsProps) => {
  return (
    <Card className="mb-8">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-bold">
            {professor.firstname} {professor.name}
          </CardTitle>
          <Badge>{professor.department.name}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <div className="flex items-center text-muted-foreground">
              <User className="h-4 w-4 mr-2" />
              <span>Informations personnelles</span>
            </div>
            <div className="grid grid-cols-1 gap-2">
              <div className="font-medium">Genre : {professor.gender}</div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center text-muted-foreground">
              <Calendar className="h-4 w-4 mr-2" />
              <span>Informations système</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="font-medium">Créé le:</div>
              <div>{new Date(professor.created_at).toLocaleString()}</div>

              <div className="font-medium">Mis à jour le:</div>
              <div>{new Date(professor.updated_at).toLocaleString()}</div>
            </div>
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <div className="flex items-center text-muted-foreground">
            <BookOpen className="h-4 w-4 mr-2" />
            <span>Cours enseignés</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {professor.courses.map((course) => (
              <Card key={course.id} className="bg-muted/50">
                <CardContent className="p-4">
                  <h3 className="font-medium">{course.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {course.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
