"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Users, Building, BookOpen, GraduationCap } from "lucide-react"

export const Evolution = () => {
  return (
    <div className="rounded-lg">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <EvolutionItem count={500} title="Etudiants" icon={<Users className="w-10 h-10" />} delay={0} />
          <EvolutionItem count={12} title="Facultés" icon={<Building className="w-10 h-10" />} delay={0.1} />
          <EvolutionItem count={12} title="Départements" icon={<BookOpen className="w-10 h-10" />} delay={0.2} />
          <EvolutionItem count={12} title="Options" icon={<GraduationCap className="w-10 h-10" />} delay={0.3} />
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
    const duration = 2000 // 2 seconds for the count animation
    const interval = duration / count
    let timer: NodeJS.Timeout

    if (displayCount < count) {
      timer = setTimeout(() => {
        setDisplayCount((prev) => Math.min(prev + 1, count))
      }, interval)
    }

    return () => clearTimeout(timer)
  }, [displayCount, count])

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
        className="mb-4 text-primary-foreground"
      >
        {icon}
      </motion.div>
      <motion.h2
        className="text-4xl font-bold text-primary-foreground mb-2 flex items-baseline"
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
