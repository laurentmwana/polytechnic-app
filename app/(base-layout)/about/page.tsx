'use client'

import type React from 'react'

import { motion } from 'framer-motion'
import { Heading } from '@/components/shared/heading'
import Image from 'next/image'
import { Compass, Award, BookOpen, Users } from 'lucide-react'

export default function About() {
  return (
    <div className="container py-12">
      <Heading title="À propos" />

      <div className="relative mt-12">
        {/* Decorative elements */}
        <div className="absolute -z-10 top-0 right-0 w-48 md:w-72 h-48 md:h-72 bg-primary/5 dark:bg-accent/30 rounded-full blur-3xl" />
        <div className="absolute -z-10 bottom-0 left-0 w-64 md:w-96 h-64 md:h-96 bg-primary/5 dark:bg-accent/30 rounded-full blur-3xl" />

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="order-2 lg:order-1"
          >
            <div className="space-y-6 text-muted-foreground">
              <p className="leading-relaxed">
                Depuis sa création en 1955, la{' '}
                <span className="text-primary font-medium">
                  Faculté Polytechnique de l&#39;Université de Kinshasa
                </span>{' '}
                s&#39;impose comme un pilier de l&#39;enseignement supérieur en
                République Démocratique du Congo. Initialement rattachée à la
                Faculté des Sciences, elle est devenue une entité autonome en
                1960, avec pour vocation première de former des ingénieurs
                civils capables de répondre aux enjeux techniques, économiques
                et sociétaux du pays.
              </p>
              <p className="leading-relaxed">
                Forte d&#39;une longue tradition d&#39;excellence, la Faculté
                demeure aujourd&#39;hui la référence nationale en matière de
                formation d&#39;ingénieurs de haut niveau, engagés dans le
                développement durable et l&#39;innovation technologique.
              </p>
              <blockquote className="pl-4 border-l-4 border-primary/70 italic my-6 text-slate-600 dark:text-slate-400">
                &#34;Former les ingénieurs qui construiront l&#39;avenir de la
                République Démocratique du Congo.&#34;
              </blockquote>
              <p className="leading-relaxed">
                Notre mission est de fournir une formation rigoureuse, alliant
                théorie et pratique, afin de préparer les étudiants à relever
                les défis complexes de l&#39;ingénierie moderne. Nous
                encourageons également la recherche appliquée et la
                collaboration avec les industries locales et internationales.
              </p>
              <p className="leading-relaxed">
                En rejoignant la Faculté Polytechnique, vous intégrez une
                communauté dynamique, tournée vers l&#39;avenir et soucieuse de
                contribuer activement au progrès de la RDC.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-10">
              <ValueCard icon={<Compass />} title="Innovation" />
              <ValueCard icon={<Award />} title="Excellence" />
              <ValueCard icon={<BookOpen />} title="Savoir" />
              <ValueCard icon={<Users />} title="Communauté" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="order-1 lg:order-2"
          >
            <div className="relative">
              {/* Main image */}
              <div className="rounded-lg overflow-hidden shadow-xl dark:shadow-gray-900/30 border border-gray-200 dark:border-gray-800">
                <Image
                  src="/images/faculty-home.jpg"
                  width={800}
                  height={530}
                  alt="Faculté Polytechnique de l&#39;Université de Kinshasa"
                  className="object-cover w-full h-auto"
                  priority
                />
              </div>

              {/* Decorative pattern */}
              <div className="relative overflow-hidden">
                <div className="absolute bottom-0 right-0 translate-x-6 translate-y-6 w-64 h-64 -z-10">
                  <svg
                    width="100%"
                    height="100%"
                    viewBox="0 0 100 100"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-primary/20 dark:text-primary/10 pointer-events-none"
                  >
                    <pattern
                      id="smallGrid"
                      width="8"
                      height="8"
                      patternUnits="userSpaceOnUse"
                    >
                      <path
                        d="M 8 0 L 0 0 0 8"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="0.5"
                      />
                    </pattern>
                    <rect width="100" height="100" fill="url(#smallGrid)" />
                  </svg>
                </div>
              </div>

              {/* Year badge */}
              <div className="absolute -top-4 -left-4 bg-primary text-white rounded-full h-16 w-16 flex items-center justify-center shadow-lg">
                <div className="text-center">
                  <div className="text-xs font-medium">Depuis</div>
                  <div className="text-xl font-bold">1955</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

function ValueCard({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="flex flex-col items-center p-4 bg-white dark:bg-gray-800/50 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="text-primary-foreground mb-2">{icon}</div>
      <h3 className="font-medium text-gray-900 dark:text-gray-200">{title}</h3>
    </div>
  )
}
