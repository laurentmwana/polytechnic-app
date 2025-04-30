'use client'

import type React from 'react'

import { useState } from 'react'
import { SectionPageTitle } from '@/components/shared/section-page'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Eye, Flag, Heart, Target } from 'lucide-react'

type AdnItemProps = {
  title: string
  content: string
  fullContent: string
  icon: React.ReactNode
}

export const YourAdn = () => {
  return (
    <div className="container my-12">
      <SectionPageTitle title="Notre ADN">
Innovation, rigueur et engagement : ces valeurs nous animent au quotidien. Notre ADN repose sur l’excellence académique et l’ouverture sur le monde.
      </SectionPageTitle>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <AdnItem
          title="Vision"
          content="Devenir la meilleure faculté de formation des ingénieurs de haut niveau (et de recherche) en République Démocratique du Congo et en Afrique au service du développement économique et social des populations congolaises, tout en restant ouvert et solidaire avec le reste du monde."
          fullContent="Devenir la meilleure faculté de formation des ingénieurs de haut niveau (et de recherche) en République Démocratique du Congo et en Afrique au service du développement économique et social des populations congolaises, tout en restant ouvert et solidaire avec le reste du monde. Notre vision s'étend à créer un environnement d'apprentissage innovant qui prépare les étudiants aux défis technologiques du futur."
          icon={<Eye className="h-8 w-8 text-primary animate-pulse" />}
        />
        <AdnItem
          title="Mission"
          content="Conformément à sa vision, la Faculté Polytechnique a pour mission de : Former des Ingénieurs civils (Master Ingénieur Civil) de haut niveau, scientifiquement et technologiquement qualifiés, adaptés au contexte congolais et international."
          fullContent="Conformément à sa vision, la Faculté Polytechnique a pour mission de : Former des Ingénieurs civils (Master Ingénieur Civil) de haut niveau, scientifiquement et technologiquement qualifiés, adaptés au contexte congolais et international, conscients de leurs responsabilités vis-à-vis de leurs peuples et capables de les servir avec dévouement. Nous nous engageons à fournir une éducation de qualité qui combine théorie et pratique pour préparer les étudiants à résoudre les problèmes complexes du monde réel."
          icon={<Flag className="h-8 w-8 text-primary animate-bounce" />}
        />
        <AdnItem
          title="Valeurs"
          content="Les valeurs qui guideront les comportements des différents membres de la Faculté Polytechnique dans la réalisation de sa vision sont les suivantes : La poursuite de l'excellence et de la qualité dans toutes les activités de la Faculté."
          fullContent="Les valeurs qui guideront les comportements des différents membres de la Faculté Polytechnique dans la réalisation de sa vision sont les suivantes : La poursuite de l'excellence et de la qualité dans toutes les activités de la Faculté. L'intégrité, l'éthique et la transparence dans toutes nos actions. Le respect de la diversité et l'inclusion. L'innovation et la créativité dans notre approche pédagogique. La responsabilité sociale et environnementale."
          icon={<Heart className="h-8 w-8 text-primary animate-ping" />}
        />
        <AdnItem
          title="Objectifs"
          content="Faire acquérir aux étudiants les connaissances et méthodes d'investigation les plus avancées dans toutes les disciplines de la science et la technique et de les faire participer au développement des connaissances."
          fullContent="Faire acquérir aux étudiants les connaissances et méthodes d'investigation les plus avancées dans toutes les disciplines de la science et la technique et de les faire participer au développement des connaissances et à la création de nouvelles méthodes d'investigation adaptées aux réalités et aux exigences nationales et internationales. Développer des partenariats stratégiques avec l'industrie pour assurer que notre curriculum reste pertinent. Encourager la recherche appliquée qui répond aux défis locaux et globaux."
          icon={<Target className="h-8 w-8 text-primary animate-spin-slow" />}
        />
      </div>
    </div>
  )
}

const AdnItem = ({ title, content, fullContent, icon }: AdnItemProps) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Card className="h-full flex flex-col transition-all duration-300 hover:shadow-lg">
        <CardHeader className="flex flex-row items-center gap-4">
          <div className="rounded-full bg-primary/10 p-3 transition-transform duration-300 hover:scale-110">
            {icon}
          </div>
          <CardTitle className="text-xl">{title}</CardTitle>
        </CardHeader>
        <CardContent className="flex-grow">
          <p className="text-muted-foreground line-clamp-4">{content}</p>
        </CardContent>
        <CardFooter>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => setIsOpen(true)}
            className="w-full mt-2"
          >
            Lire la suite
          </Button>
        </CardFooter>
      </Card>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {icon}
              <span>{title}</span>
            </DialogTitle>
            <DialogDescription>{fullContent}</DialogDescription>
          </DialogHeader>

          <DialogClose
            className="absolute right-4 top-4 rounded-full p-2 h-auto"
            onClick={() => setIsOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  )
}
