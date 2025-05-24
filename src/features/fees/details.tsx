'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  GraduationCap,
  Calendar,
  DollarSign,
  BookOpen,
  Hash,
} from 'lucide-react'
import { AcademicFees, LaboratoryFees } from '#/model'

interface LaboratoryFeesDetailsProps {
  fees: LaboratoryFees | AcademicFees
}

export function FeesDetails({ fees }: LaboratoryFeesDetailsProps) {
  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-2">
          <Badge
            variant={
              fees.level.programme.programme_group === 'nouveau système'
                ? 'default'
                : 'secondary'
            }
            className="text-sm"
          >
            {fees.level.programme.programme_group}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Informations du Programme */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5" />
              Programmes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Nom du Programme
                </label>
                <p className="text-lg font-semibold">
                  {fees.level.programme.name}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Alias
                </label>
                <p className="text-lg font-semibold">
                  {fees.level.programme.alias}
                </p>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground">
                ID Programme
              </label>
              <p className="flex items-center gap-2">
                <Hash className="h-4 w-4" />
                {fees.level.programme.id}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Groupe de Programme
              </label>
              <p className="capitalize">
                {fees.level.programme.programme_group}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Informations de l'Année */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Année Académique
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Début
                </label>
                <p className="text-lg font-semibold">{fees.year.start}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Fin
                </label>
                <p className="text-lg font-semibold">{fees.year.end}</p>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground">
                ID Année
              </label>
              <p className="flex items-center gap-2">
                <Hash className="h-4 w-4" />
                {fees.year.id}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Période
              </label>
              <p className="text-lg">
                {fees.year.start} - {fees.year.end}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Informations Financières */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Informations Financières
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Montant
              </label>
              <p className="text-3xl font-bold text-green-600">{fees.amount}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground">
                ID Frais
              </label>
              <p className="flex items-center gap-2">
                <Hash className="h-4 w-4" />
                {fees.id}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Informations de l'Option */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Option d&#39;Études
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                ID Option
              </label>
              <p className="flex items-center gap-2">
                <Hash className="h-4 w-4" />
                {fees.level.option.id}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Description
              </label>
              <p className="text-sm leading-relaxed">
                {fees.level.option.name}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground">
                ID Niveau
              </label>
              <p className="flex items-center gap-2">
                <Hash className="h-4 w-4" />
                {fees.level.id}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
