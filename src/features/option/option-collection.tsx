import Link from 'next/link'
import { GraduationCap, ArrowRight } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { webRoute } from '@/lib/route'
import { Option } from '#/model'
import { excerpt } from '@/lib/utils'

interface OptionCollectionProps {
  option: Option
}

export function OptionCollection({ option }: OptionCollectionProps) {
  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="truncate">{excerpt(option.name, 30)}</span>
          <Badge variant="outline">{option.levels.length}</Badge>
        </CardTitle>
        <CardDescription className="line-clamp-2">
          {option.description || 'Aucune description disponible'}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="space-y-2">
          <h3 className="text-sm font-medium flex items-center gap-2">
            <GraduationCap className="h-4 w-4 text-primary" />
            Promotions disponibles
          </h3>
          <ul className="space-y-1">
            {option.levels.slice(0, 3).map((level) => (
              <li key={level.id} className="text-sm flex items-center gap-2">
                <Badge
                  variant="secondary"
                  className="h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                >
                  {level.id}
                </Badge>
                <span className="truncate">{level.programme.name}</span>
                <Badge variant="outline" className="ml-auto text-xs">
                  {level.programme.alias}
                </Badge>
              </li>
            ))}
            {option.levels.length > 3 && (
              <li className="text-sm text-muted-foreground">
                +{option.levels.length - 3} autres promotions
              </li>
            )}
            {option.levels.length === 0 && (
              <li className="text-sm text-muted-foreground">
                Aucune promotion disponible
              </li>
            )}
          </ul>
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        <Button asChild variant="outline" className="w-full">
          <Link href={webRoute('option.show', { id: option.id })}>
            Voir les détails
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
