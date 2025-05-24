'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Users, Building, BookOpen, GraduationCap } from 'lucide-react'
import { apiRoute } from '@/lib/route'

type EvaluatorModel = {
  departments: number
  options: number
  students: number
  professors: number
}

export const Evolution = () => {
  const [evaluator, setEvaluator] = useState<EvaluatorModel | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchEvaluator = async () => {
      try {
        const response = await fetch(apiRoute('eva.index'), {
          method: 'GET',
          headers: { Accept: 'application/json' },
        })
        if (!response.ok)
          throw new Error('Erreur lors de la récupération des statistiques')
        const data = await response.json()
        setEvaluator(data.data)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur inconnue')
      } finally {
        setIsLoading(false)
      }
    }
    fetchEvaluator()
  }, [])

  const stats = [
    {
      count: evaluator?.students || 0,
      title: 'Etudiants',
      icon: <Users className="w-10 h-10" />,
      delay: 0,
    },
    {
      count: evaluator?.professors || 0,
      title: 'Professeurs',
      icon: <Building className="w-10 h-10" />,
      delay: 0.1,
    },
    {
      count: evaluator?.departments || 0,
      title: 'Départements',
      icon: <BookOpen className="w-10 h-10" />,
      delay: 0.2,
    },
    {
      count: evaluator?.options || 0,
      title: 'Options',
      icon: <GraduationCap className="w-10 h-10" />,
      delay: 0.3,
    },
  ]

  if (error) {
    // Tu peux choisir de throw ou d'afficher une erreur dans l'UI
    // Ici, on affiche les stats avec des valeurs à 0 et un message d'erreur dans la console
    console.error(error)
  }

  return (
    <div className="rounded-lg">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((item, index) =>
            isLoading ? (
              <EvolutionItemSkeleton key={index} delay={item.delay} />
            ) : (
              <EvolutionItem
                key={index}
                count={item.count}
                title={item.title}
                icon={item.icon}
                delay={item.delay}
              />
            )
          )}
        </div>
      </motion.div>
    </div>
  )
}

export const EvolutionItem = ({
  count,
  title,
  icon,
  delay,
}: {
  title: string
  count: number
  icon: React.ReactNode
  delay: number
}) => {
  const [displayCount, setDisplayCount] = useState(0)

  useEffect(() => {
    // Improved animation with better performance
    const duration = 2000 // 2 seconds for the count animation
    const startTime = Date.now()
    const endTime = startTime + duration

    const updateCount = () => {
      const now = Date.now()
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)

      // Use easeOutQuad for smoother animation
      const easeOutProgress = 1 - (1 - progress) * (1 - progress)
      const currentCount = Math.floor(easeOutProgress * count)

      setDisplayCount(currentCount)

      if (now < endTime) {
        requestAnimationFrame(updateCount)
      } else {
        setDisplayCount(count)
      }
    }

    requestAnimationFrame(updateCount)

    return () => {}
  }, [count])

  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ scale: 1.05 }}
      className="p-6 border border-gray-400 dark:border-gray-600 rounded-lg text-center flex flex-col items-center justify-center"
    >
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: delay + 0.2 }}
        className="mb-4 text-slate-700 dark:text-slate-300"
      >
        {icon}
      </motion.div>
      <motion.h2
        className="text-4xl font-bold mb-2 flex items-baseline"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: delay + 0.3 }}
      >
        {displayCount}
        <motion.span
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: delay + 0.4 }}
          className="text-3xl ml-1"
        >
          +
        </motion.span>
      </motion.h2>
      <motion.p
        className="text-lg text-slate-700 dark:text-slate-300 font-medium"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: delay + 0.5 }}
      >
        {title}
      </motion.p>
    </motion.div>
  )
}

export const EvolutionItemSkeleton = ({ delay }: { delay: number }) => {
  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay }}
      className="p-6 border border-gray-400 dark:border-gray-600 rounded-lg text-center flex flex-col items-center justify-center"
    >
      <div className="mb-4 w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />

      <div className="flex items-baseline mb-2">
        <div className="h-8 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        <div className="h-6 w-4 bg-gray-200 dark:bg-gray-700 rounded ml-1 animate-pulse" />
      </div>
      <div className="h-5 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
    </motion.div>
  )
}
