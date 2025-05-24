'use client'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  GraduationCap,
  Calendar,
  DollarSign,
  Eye,
  Option as OptionIcon,
} from 'lucide-react'
import { AcademicFees, LaboratoryFees } from '#/model'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { webRoute } from '@/lib/route'

export const LaboratoryFeesCollection = ({
  laborFees,
}: {
  laborFees: LaboratoryFees[]
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {laborFees.map((fees) => (
        <Card
          key={fees.id}
          className="hover:shadow-lg transition-shadow cursor-pointer"
        >
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">
                {fees.level.programme.alias}
              </CardTitle>
              <Badge
                variant={
                  fees.level.programme.programme_group === 'nouveau système'
                    ? 'default'
                    : 'secondary'
                }
              >
                {fees.level.programme.programme_group}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <GraduationCap className="h-4 w-4 text-muted-foreground" />
              <span>{fees.level.programme.name}</span>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <OptionIcon className="h-4 w-4 text-muted-foreground" />
              <span>{fees.level.option.alias}</span>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>
                {fees.year.start} - {fees.year.end}
              </span>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <span className="font-semibold">{fees.amount}</span>
            </div>

            <div className="pt-2">
              <p className="text-xs text-muted-foreground line-clamp-2">
                {fees.level.option.name}
              </p>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" size="sm" asChild>
              <Link href={webRoute('laboratory-fees.show', { id: fees.id })}>
                <Eye size={15} />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

export const AcademicFeesCollection = ({
  laborFees,
}: {
  laborFees: AcademicFees[]
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {laborFees.map((fees) => (
        <Card
          key={fees.id}
          className="hover:shadow-lg transition-shadow cursor-pointer"
        >
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">
                {fees.level.programme.alias}
              </CardTitle>
              <Badge
                variant={
                  fees.level.programme.programme_group === 'nouveau système'
                    ? 'default'
                    : 'secondary'
                }
              >
                {fees.level.programme.programme_group}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <GraduationCap className="h-4 w-4 text-muted-foreground" />
              <span>{fees.level.programme.name}</span>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>
                {fees.year.start} - {fees.year.end}
              </span>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <span className="font-semibold">{fees.amount}</span>
            </div>

            <div className="pt-2">
              <p className="text-xs text-muted-foreground line-clamp-2">
                {fees.level.option.name}
              </p>
            </div>
          </CardContent>

          <CardFooter>
            <Button variant="outline" size="sm" asChild>
              <Link href={webRoute('academic-fees.show', { id: fees.id })}>
                <Eye size={15} />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
