'use client'

import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { Book } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import Link from 'next/link'
import { webRoute } from '@/lib/route'

function SimpleBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-white to-blue-50/40 dark:from-blue-950/10 dark:via-transparent dark:to-blue-900/10"></div>

      {/* Animated circles */}
      <div className="absolute inset-0">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-blue-500/5 dark:bg-blue-400/5"
            style={{
              width: `${100 + i * 50}px`,
              height: `${100 + i * 50}px`,
              top: `${10 + i * 15}%`,
              left: `${10 + i * 15}%`,
            }}
            initial={{ scale: 0.8, opacity: 0.3 }}
            animate={{
              scale: [0.8, 1.2, 0.8],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 8 + i * 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: 'easeInOut',
              delay: i * 0.5,
            }}
          />
        ))}

        {/* Additional circles from right side */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i + 5}
            className="absolute rounded-full bg-blue-500/5 dark:bg-blue-400/5"
            style={{
              width: `${120 + i * 40}px`,
              height: `${120 + i * 40}px`,
              bottom: `${20 + i * 15}%`,
              right: `${10 + i * 15}%`,
            }}
            initial={{ scale: 0.9, opacity: 0.3 }}
            animate={{
              scale: [0.9, 1.1, 0.9],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 7 + i * 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: 'easeInOut',
              delay: i * 0.7,
            }}
          />
        ))}
      </div>

      {/* Subtle grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20 dark:bg-[linear-gradient(to_right,#333_1px,transparent_1px),linear-gradient(to_bottom,#333_1px,transparent_1px)]"></div>
    </div>
  )
}

function SimpleBackgroundSkeleton() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-white to-blue-50/40 dark:from-blue-950/10 dark:via-transparent dark:to-blue-900/10"></div>
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20 dark:bg-[linear-gradient(to_right,#333_1px,transparent_1px),linear-gradient(to_bottom,#333_1px,transparent_1px)]"></div>
    </div>
  )
}

export const WelcomeHero = () => {
  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <SimpleBackground />
      </div>

      <div className="relative z-10 container mx-auto max-w-4xl px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-6 inline-flex items-center rounded-full bg-accent px-4 py-2 text-sm font-medium text-accent-foreground"
        >
          <Book className="mr-2 h-5 w-5" />
          <span>Université de Kinshasa</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="max-w-4xl"
        >
          <h1 className="mb-6 text-4xl leading-tight font-bold tracking-tight text-slate-900 sm:text-5xl md:text-6xl dark:text-gray-200">
            Faculté de polytechnique
          </h1>

          <p className="mb-8 max-w-2xl text-lg text-slate-700 md:text-xl dark:text-gray-300">
            La Faculté Polytechnique de l&#39;Université de Kinshasa (UNIKIN)
            est un pôle d&#39;excellence en ingénierie et en technologie,
            formant depuis des décennies les leaders de demain dans les domaines
            scientifiques et industriels...
          </p>

          <div className="flex flex-col gap-4 sm:flex-row">
            <Button
              className="rounded-md bg-primary px-8 py-6 text-lg font-medium text-white hover:bg-primary/80"
              asChild
            >
              <Link href={webRoute('news.index')}>En savoir plus</Link>
            </Button>

            <Button
              variant="outline"
              className="rounded-md px-8 py-6 text-lg font-medium "
              asChild
            >
              <Link href={webRoute('news.index')}>Voir les communiqués</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export const WelcomeHeroSkeleton = () => {
  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <SimpleBackgroundSkeleton />
      </div>

      <div className="relative z-10 container mx-auto max-w-4xl px-4 md:px-6">
        <div className="mb-6 inline-flex items-center rounded-full bg-accent/20 px-4 py-2">
          <Skeleton className="mr-2 h-5 w-5 rounded-full" />
          <Skeleton className="h-4 w-40" />
        </div>

        <div className="max-w-4xl">
          <Skeleton className="mb-6 h-12 w-full sm:h-14 md:h-16 max-w-2xl" />
          <Skeleton className="mb-4 h-6 w-full max-w-2xl" />
          <Skeleton className="mb-4 h-6 w-5/6 max-w-2xl" />
          <Skeleton className="mb-8 h-6 w-4/6 max-w-2xl" />

          <div className="flex flex-col gap-4 sm:flex-row">
            <Skeleton className="h-14 w-full sm:w-40 rounded-md" />
            <Skeleton className="h-14 w-full sm:w-40 rounded-md" />
          </div>
        </div>
      </div>
    </div>
  )
}
