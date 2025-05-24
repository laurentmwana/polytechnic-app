'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { SectionPageTitle } from '@/components/shared/section-page'

export const Presentation = () => {
  return (
    <div className="container my-12">
      <SectionPageTitle title="Présentation">
        Nous sommes un établissement engagé dans la formation de talents
        compétents, responsables et prêts à contribuer activement au
        développement de la société.
      </SectionPageTitle>

      <div className="relative overflow-hidden rounded-2xl shadow-md mb-12 border">
        <div className="grid md:grid-cols-2 gap-8 p-4 lg:p-8 md:p-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col justify-center"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-muted-foreground mb-6 leading-tight">
              Etudier à la Faculté Polytechnique de l&#39;Université de Kinshasa
            </h2>
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <p className="text-muted-foreground">
                La Faculté Polytechnique de l&lsquo;Université de Kinshasa est
                une référence en matière de formation d&#39;ingénieurs en
                République Démocratique du Congo. Grâce à un enseignement de
                qualité assuré par des professeurs expérimentés et un programme
                académique aligné sur les standards internationaux, notre
                faculté vous prépare à relever les défis technologiques et
                scientifiques de demain.
              </p>
              <p className="text-muted-foreground">
                En rejoignant notre institution, vous bénéficierez d&#39;un
                cadre d&#39;apprentissage dynamique, doté de laboratoires
                modernes et d&#39;une bibliothèque spécialisée pour enrichir vos
                connaissances et affiner vos compétences.
              </p>
              <p className="text-muted-foreground font-medium">
                Rejoignez-nous dès aujourd&#39;hui et bâtissons ensemble
                l&#39;avenir de l&#39;ingénierie en Afrique !
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative h-[300px] md:h-auto rounded-xl overflow-hidden shadow-xl dark:shadow-black/30"
          >
            <Image
              src="/images/banner-1.png"
              alt="Faculté Polytechnique de l'Université de Kinshasa"
              className="object-cover"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
            <div className="absolute inset-0 bg-primary/20 dark:bg-primary/30 backdrop-blur-[1px]"></div>
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-primary/80 to-transparent p-6">
              <p className="text-muted-foreground font-medium text-lg">
                Excellence académique et innovation technologique
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
