'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { SectionPageTitle } from '@/components/shared/section-page'
import { Evolution } from './evolution'

export const Presentation = () => {
  return (
    <div className="container my-12">
      <SectionPageTitle title="Présentation">
        Nous sommes un établissement engagé dans la formation de talents
        compétents, responsables et prêts à contribuer activement au
        développement de la société.
      </SectionPageTitle>

      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 to-slate-100 dark:from-primary/5 dark:to-slate-900 shadow-lg mb-12 border border-slate-200 dark:border-slate-800">
        <div className="absolute top-0 right-0 -z-10 w-full h-full opacity-10 dark:opacity-5">
          <svg
            className="w-full h-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <defs>
              <pattern
                id="grid"
                width="8"
                height="8"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 8 0 L 0 0 0 8"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="0.5"
                  className="text-primary/50 dark:text-primary/30"
                />
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#grid)" />
          </svg>
        </div>

        <div className="grid md:grid-cols-2 gap-8 p-4 lg:p-8 md:p-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col justify-center"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-primary dark:text-gray-300 mb-6 leading-tight">
              Etudier à la Faculté Polytechnique de l&#39;Université de Kinshasa
            </h2>
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <p className="text-slate-700 dark:text-slate-300">
                La Faculté Polytechnique de l&lsquo;Université de Kinshasa est
                une référence en matière de formation d&#39;ingénieurs en
                République Démocratique du Congo. Grâce à un enseignement de
                qualité assuré par des professeurs expérimentés et un programme
                académique aligné sur les standards internationaux, notre
                faculté vous prépare à relever les défis technologiques et
                scientifiques de demain.
              </p>
              <p className="text-slate-700 dark:text-slate-300">
                En rejoignant notre institution, vous bénéficierez d&#39;un
                cadre d&#39;apprentissage dynamique, doté de laboratoires
                modernes et d&#39;une bibliothèque spécialisée pour enrichir vos
                connaissances et affiner vos compétences.
              </p>
              <p className="text-slate-700 dark:text-slate-200 font-medium">
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
              <p className="text-white font-medium text-lg">
                Excellence académique et innovation technologique
              </p>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="p-4 md:p-8 m-4 md:m-6 border-4 border-double border-primary/30 dark:border-gray-600 rounded-xl bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-sm"
        >
          <Evolution />
        </motion.div>
      </div>
    </div>
  )
}
